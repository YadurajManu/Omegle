const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Create Express app
const app = express();

// Configure CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));

// Add headers for WebSocket connections
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Sample route to check if the API is running
app.get('/api', (req, res) => {
  res.json({ status: 'Omegle Signaling Server is running' });
});

// Create server for Socket.io
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  path: '/socket.io/'
});

// Store active users
const activeUsers = {};
const waitingUsers = [];

// Socket.io connection handler
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

// Handle serverless function for Vercel
if (req && res) {
  // For serverless environment
  const { Server } = require('socket.io');
  const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
  };

  // Store active users - use in-memory storage for simplicity in serverless env
  const activeUsers = {};
  const waitingUsers = [];

  module.exports = (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    
    // Handle preflight request
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    if (req.method === 'GET') {
      // Route for basic health check
      if (req.url === '/api' || req.url === '/api/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'Omegle Signaling Server is running' }));
        return;
      }
      
      // For Socket.io static files
      if (req.url.startsWith('/socket.io/')) {
        // This is where Socket.io polling happens
        if (!res.socket.server.io) {
          console.log('* Initializing Socket.io server');
          const io = new Server(res.socket.server, {
            cors: corsOptions,
            transports: ['polling'],
            path: '/socket.io/'
          });
          
          // Store the io instance on the server
          res.socket.server.io = io;
          
          // Socket.io connection logic
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
        }
      }
    }
    
    // If socket.io isn't being called directly, pass to socket.io handler
    if (res.socket.server.io) {
      res.socket.server.io.engine.handleRequest(req, res);
    } else {
      // Default response for other routes
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Socket.io server is ready');
    }
  };
} else {
  // For local development
  const PORT = process.env.PORT || 8000;
  server.listen(PORT, () => {
    console.log(`Signaling server running on port ${PORT}`);
  });
}

module.exports = app; 