// Import dependencies
const http = require('http');
const { Server } = require('socket.io');

// In-memory data store (resets on serverless function restart)
const activeUsers = {};
const waitingUsers = [];

module.exports = (req, res) => {
  // Basic health check
  if (req.url === '/api' || req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'Socket server running' }));
    return;
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Only initialize socket.io once
  if (!res.socket.server.io) {
    console.log('* Initializing Socket.io server');
    
    // Create socket.io instance
    const io = new Server(res.socket.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      },
      // Use only polling for compatibility with serverless
      transports: ['polling']
    });
    
    // Store the io server instance
    res.socket.server.io = io;
    
    // Set up connection handler
    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);
      
      // Add user to active users
      activeUsers[socket.id] = { id: socket.id };
      
      // Send the user their ID
      socket.emit('me', socket.id);
      
      // Send the list of all users (except themselves)
      socket.emit('allUsers', Object.keys(activeUsers).filter(id => id !== socket.id));
      
      // Find a random user to chat with
      socket.on('findRandomUser', () => {
        console.log(`User ${socket.id} is looking for a random chat`);
        
        // Check if there are any waiting users
        if (waitingUsers.length > 0) {
          // Get the first waiting user
          const targetUser = waitingUsers.shift();
          
          // Make sure the user is still connected
          if (activeUsers[targetUser]) {
            console.log(`Matching ${socket.id} with ${targetUser}`);
            
            // Inform both users about the match
            socket.emit('userMatched', {
              initiator: socket.id,
              targetUser: targetUser
            });
            
            io.to(targetUser).emit('userMatched', {
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
      socket.on('callUser', (data) => {
        console.log(`${socket.id} is calling ${data.userToCall}`);
        io.to(data.userToCall).emit('callUser', { 
          signal: data.signalData, 
          from: data.from, 
          name: data.name 
        });
      });
      
      // Handle call acceptance
      socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', { 
          signal: data.signal,
          name: data.name 
        });
      });
      
      // Handle call ending
      socket.on('endCall', (data) => {
        io.to(data.to).emit('callEnded');
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
        socket.broadcast.emit('userDisconnected', socket.id);
      });
    });
  }

  // Let Socket.io handle the request
  res.socket.server.io.engine.handleRequest(req, res);
};