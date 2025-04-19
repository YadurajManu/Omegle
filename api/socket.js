// Simple signaling server for WebRTC that works in serverless environments
const { parse } = require('url');
const { stringify } = require('querystring');

// In-memory store for connections
// Note: This will reset on function cold starts
const rooms = new Map();
const users = new Map();

// Allowed origins for CORS
const allowedOrigins = ['https://yaduraj.me', 'https://omegle-eosin.vercel.app', 'http://localhost:3000'];

module.exports = async (req, res) => {
  // Get the origin from request headers
  const origin = req.headers.origin;
  
  // Set CORS headers - allow specific origins
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Allow all origins as fallback
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Parse the URL
  const { pathname, query } = parse(req.url, true);
  
  // Handle legacy Socket.io requests (to maintain compatibility with old clients)
  if (pathname.startsWith('/socket.io/')) {
    // For Socket.io polling requests
    const socketResponse = {
      type: 'error',
      message: 'Socket.io is no longer supported in this API. Please use the new HTTP-based API.'
    };
    
    if (query.sid) {
      // If there's a session ID, return empty data for polling
      res.setHeader('Content-Type', 'text/plain');
      res.end('');
    } else if (query.transport === 'polling') {
      // Initial handshake - return a mock handshake response
      res.setHeader('Content-Type', 'text/plain');
      res.end('0{"sid":"mock-session-id","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":5000}');
    } else {
      // For other Socket.io requests
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(socketResponse));
    }
    return;
  }
  
  // Handle health check
  if (pathname === '/api' || pathname === '/api/status') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      status: 'online',
      users: users.size,
      rooms: rooms.size
    }));
    return;
  }

  // Handle signaling endpoints
  if (pathname === '/api/rtc') {
    if (req.method === 'POST') {
      try {
        // Get request body
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const data = JSON.parse(Buffer.concat(chunks).toString());
        
        // Handle different signal types
        switch (data.type) {
          case 'register':
            // Generate a unique ID for this user
            const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            users.set(userId, { lastSeen: Date.now() });
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ userId }));
            break;
            
          case 'join-waiting':
            // Add user to waiting queue
            if (!data.userId) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing userId' }));
              return;
            }
            
            if (!users.has(data.userId)) {
              users.set(data.userId, { lastSeen: Date.now() });
            }
            
            // Check if there's another user waiting
            const waitingRoom = rooms.get('waiting') || [];
            
            if (waitingRoom.length > 0 && waitingRoom[0] !== data.userId) {
              // Get the other user
              const otherUserId = waitingRoom.shift();
              
              // Create a new room for these users
              const roomId = `room_${Date.now()}`;
              rooms.set(roomId, [otherUserId, data.userId]);
              
              // Update waiting room
              rooms.set('waiting', waitingRoom);
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                matched: true,
                roomId,
                initiator: true,
                peerId: otherUserId
              }));
              
              // Update user state
              users.get(data.userId).roomId = roomId;
              users.get(otherUserId).roomId = roomId;
            } else {
              // Add user to waiting room
              if (!waitingRoom.includes(data.userId)) {
                waitingRoom.push(data.userId);
              }
              
              rooms.set('waiting', waitingRoom);
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                matched: false,
                message: 'Added to waiting list'
              }));
            }
            break;
            
          case 'check-status':
            // User is checking if they've been matched
            if (!data.userId) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing userId' }));
              return;
            }
            
            const userInfo = users.get(data.userId);
            if (!userInfo) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'User not found' }));
              return;
            }
            
            // Update last seen
            userInfo.lastSeen = Date.now();
            
            // Check if user is in a room
            if (userInfo.roomId) {
              const roomParticipants = rooms.get(userInfo.roomId) || [];
              const peerId = roomParticipants.find(id => id !== data.userId);
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                matched: true,
                roomId: userInfo.roomId,
                peerId,
                initiator: roomParticipants[0] === data.userId
              }));
            } else {
              // Check if user is in waiting room
              const waitingRoom = rooms.get('waiting') || [];
              const isWaiting = waitingRoom.includes(data.userId);
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                matched: false,
                waiting: isWaiting
              }));
            }
            break;
            
          case 'signal':
            // Handle WebRTC signaling
            if (!data.userId || !data.targetId || !data.signal) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing required fields' }));
              return;
            }
            
            const targetUser = users.get(data.targetId);
            if (!targetUser) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Target user not found' }));
              return;
            }
            
            // Store signal for the target user
            if (!targetUser.signals) {
              targetUser.signals = [];
            }
            
            targetUser.signals.push({
              from: data.userId,
              signal: data.signal,
              timestamp: Date.now()
            });
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
            break;
            
          case 'get-signals':
            // Get signals for this user
            if (!data.userId) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing userId' }));
              return;
            }
            
            const user = users.get(data.userId);
            if (!user) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'User not found' }));
              return;
            }
            
            // Update last seen
            user.lastSeen = Date.now();
            
            // Get signals
            const signals = user.signals || [];
            
            // Clear signals after sending
            user.signals = [];
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ signals }));
            break;
            
          case 'leave-room':
            // User is leaving a room
            if (!data.userId) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing userId' }));
              return;
            }
            
            const leavingUser = users.get(data.userId);
            if (leavingUser && leavingUser.roomId) {
              const roomParticipants = rooms.get(leavingUser.roomId) || [];
              const otherUser = roomParticipants.find(id => id !== data.userId);
              
              // Notify other user
              if (otherUser) {
                const otherUserInfo = users.get(otherUser);
                if (otherUserInfo) {
                  if (!otherUserInfo.signals) {
                    otherUserInfo.signals = [];
                  }
                  
                  otherUserInfo.signals.push({
                    from: data.userId,
                    type: 'leave',
                    timestamp: Date.now()
                  });
                  
                  // Remove room reference for other user
                  delete otherUserInfo.roomId;
                }
              }
              
              // Remove room
              rooms.delete(leavingUser.roomId);
              
              // Remove room reference for this user
              delete leavingUser.roomId;
            }
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
            break;
            
          default:
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Unknown signal type' }));
        }
      } catch (error) {
        console.error('Error handling signal:', error);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    } else {
      res.statusCode = 405;
      res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
    return;
  }

  // Default response
  res.statusCode = 200;
  res.end('WebRTC Signaling Server');
};