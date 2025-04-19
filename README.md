# Omegle-style WebRTC Video Chat

A real-time video chat application built with React, Firebase, and WebRTC. This application allows users to:

- Create an account and manage their profile
- Connect with random strangers through video chat
- Have secure and direct peer-to-peer communication

## Features

- **User Authentication**: Secure login and signup with Firebase Authentication
- **Profile Management**: Create and update user profiles stored in Firestore
- **Real-time Video Chat**: Connect with random users for video conversations
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React, React Router
- **Backend**: Firebase (Authentication, Firestore)
- **Real-time Communication**: WebRTC, Socket.io
- **Signaling Server**: Express.js

## Prerequisites

- Node.js (v14+)
- NPM or Yarn
- Firebase account

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd omegle-clone
```

### 2. Install dependencies

For the main React application:
```bash
npm install
```

For the signaling server:
```bash
cd server
npm install
```

### 3. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google Sign-In)
3. Create a Firestore database
4. Get your Firebase configuration from Project Settings > General > Your Apps > Firebase SDK snippet > Config
5. Update the `firebaseConfig` in `src/firebase.js` with your configuration

### 4. Start the Signaling Server

```bash
cd server
npm run dev
```

This will start the signaling server on port 8000.

### 5. Start the React Application

```bash
# In the root directory
npm start
```

This will start the React application on port 3000.

## How It Works

### WebRTC Implementation

The application uses WebRTC (Web Real-Time Communication) for direct peer-to-peer communication. Here's how it works:

1. **Signaling**: The signaling server (built with Socket.io) helps peers discover each other and exchange connection information.
2. **ICE Candidates**: Candidates for potential connection points are exchanged through the signaling server.
3. **Peer Connection**: Once connected, video and audio streams flow directly between peers without going through a server.

### Random Matching

Users are matched randomly through the following process:

1. User clicks "Start Random Chat"
2. The request is sent to the signaling server
3. If another user is waiting, they are matched immediately
4. If no user is waiting, the user is added to a waiting list
5. When a new user joins, they are matched with the first user in the waiting list

## Future Enhancements

- Text chat alongside video
- Ability to share screen
- Filters and effects for video
- Room-based chat for group conversations
- Mobile app using React Native

## License

MIT
