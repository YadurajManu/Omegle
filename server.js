const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, replace with your specific domain
    methods: ["GET", "POST"]
  }
});

// Store active users
const activeUsers = {};
const waitingUsers = [];

app.get('/', (req, res) => {
  res.send('Omegle WebRTC Signaling Server is running');
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Add user to active users
  activeUsers[socket.id] = { id: socket.id };
  
  // Send the user their ID
  socket.emit("me", socket.id);
  
  // Send the list of all users (except themselves)
  socket.emit("allUsers", Object.keys(activeUsers).filter(id => id !== socket.id));
  
  // Find a random user to chat with
  socket.on("findRandomUser", (data) => {
    console.log(`User ${socket.id} is looking for a random chat`);
    
    // Check if there are any waiting users
    if (waitingUsers.length > 0) {
      // Get the first waiting user
      const targetUser = waitingUsers.shift();
      
      // Make sure the user is still connected
      if (activeUsers[targetUser]) {
        console.log(`Matching ${socket.id} with ${targetUser}`);
        
        // Inform both users about the match
        socket.emit("userMatched", {
          initiator: socket.id,
          targetUser: targetUser
        });
        
        io.to(targetUser).emit("userMatched", {
          initiator: socket.id,
          targetUser: targetUser
        });
      } else {
        // If the target user disconnected, add this user to waiting
        waitingUsers.push(socket.id);
      }
    } else {
      // No waiting users, add this user to waiting
      waitingUsers.push(socket.id);
    }
  });
  
  // Handle call initiation
  socket.on("callUser", (data) => {
    console.log(`${socket.id} is calling ${data.userToCall}`);
    io.to(data.userToCall).emit("callUser", { 
      signal: data.signalData, 
      from: data.from, 
      name: data.name 
    });
  });
  
  // Handle call acceptance
  socket.on("answerCall", (data) => {
    console.log(`${socket.id} answered call from ${data.to}`);
    io.to(data.to).emit("callAccepted", { 
      signal: data.signal,
      name: data.name 
    });
  });
  
  // Handle call ending
  socket.on("endCall", (data) => {
    console.log(`${socket.id} ended call with ${data.to}`);
    io.to(data.to).emit("callEnded");
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Remove from active users
    delete activeUsers[socket.id];
    
    // Remove from waiting list if they were waiting
    const waitingIndex = waitingUsers.indexOf(socket.id);
    if (waitingIndex !== -1) {
      waitingUsers.splice(waitingIndex, 1);
    }
    
    // Inform all users about the disconnection
    socket.broadcast.emit("userDisconnected", socket.id);
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
}); 