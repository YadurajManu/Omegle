import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { iceServers } from '../config/iceServers';
import { SOCKET_URL } from '../config/environment';
import './VideoChat.css';

const VideoChat = () => {
  const navigate = useNavigate();
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [otherUser, setOtherUser] = useState("");
  const [users, setUsers] = useState([]);
  const [callState, setCallState] = useState("idle"); // idle, calling, connected, ended
  const [connectionError, setConnectionError] = useState(false);

  const myVideo = useRef();
  const partnerVideo = useRef();
  const connectionRef = useRef();
  const socketRef = useRef();

  useEffect(() => {
    // Connect to the signaling server using environment config
    socketRef.current = io(SOCKET_URL);
    
    // Request access to user's camera and microphone
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch(err => {
        console.error("Error accessing media devices:", err);
        setConnectionError(true);
      });

    // Listen for the user ID from the server
    socketRef.current.on("me", (id) => {
      console.log("My ID:", id);
    });

    // Listen for incoming calls
    socketRef.current.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setOtherUser(data.name);
      setCallerSignal(data.signal);
    });

    // Listen for available users
    socketRef.current.on("allUsers", (userList) => {
      setUsers(userList);
    });

    // Listen for call ended event
    socketRef.current.on("callEnded", () => {
      setCallEnded(true);
      setCallState("ended");
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
      
      // Reset the call state after a delay
      setTimeout(() => {
        setCallAccepted(false);
        setReceivingCall(false);
        setCallEnded(false);
        setCallState("idle");
      }, 2000);
    });

    // Listen for user disconnected event
    socketRef.current.on("userDisconnected", (userId) => {
      if (userId === caller) {
        setCallEnded(true);
        setCallState("ended");
        if (connectionRef.current) {
          connectionRef.current.destroy();
        }
        
        // Reset the call state after a delay
        setTimeout(() => {
          setCallAccepted(false);
          setReceivingCall(false);
          setCallEnded(false);
          setCallState("idle");
        }, 2000);
      }
    });

    // Handle connection errors
    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setConnectionError(true);
    });

    // Clean up on component unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
    };
  }, []);

  const callUser = (id) => {
    setCallState("calling");
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
      config: iceServers
    });

    peer.on("signal", (data) => {
      socketRef.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: socketRef.current.id,
        name: name
      });
    });

    peer.on("stream", (partnerStream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = partnerStream;
      }
    });

    peer.on("error", (err) => {
      console.error("Peer connection error:", err);
      setConnectionError(true);
      endCall();
    });

    socketRef.current.on("callAccepted", (data) => {
      setCallAccepted(true);
      setCallState("connected");
      setOtherUser(data.name);
      peer.signal(data.signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    setCallState("connected");
    setReceivingCall(false);
    
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
      config: iceServers
    });

    peer.on("signal", (data) => {
      socketRef.current.emit("answerCall", { 
        signal: data, 
        to: caller,
        name: name
      });
    });

    peer.on("stream", (partnerStream) => {
      partnerVideo.current.srcObject = partnerStream;
    });

    peer.on("error", (err) => {
      console.error("Peer connection error:", err);
      setConnectionError(true);
      endCall();
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const endCall = () => {
    setCallEnded(true);
    setCallState("ended");
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    
    // Inform the other user that the call has ended
    socketRef.current.emit("endCall", { to: caller });
    
    // Reset the call state after a delay
    setTimeout(() => {
      setCallAccepted(false);
      setReceivingCall(false);
      setCallEnded(false);
      setCallState("idle");
    }, 2000);
  };

  const startRandomChat = () => {
    // Request a random user to chat with
    socketRef.current.emit("findRandomUser", { from: socketRef.current.id });
    
    // Listen for the match
    socketRef.current.on("userMatched", (data) => {
      // If we are the initiator, call the other user
      if (data.initiator === socketRef.current.id) {
        callUser(data.targetUser);
      }
    });
  };

  const retryConnection = () => {
    setConnectionError(false);
    window.location.reload();
  };

  if (connectionError) {
    return (
      <div className="video-chat-container">
        <div className="connection-error">
          <h2>Connection Error</h2>
          <p>There was an error connecting to the video chat service. This could be due to:</p>
          <ul>
            <li>Camera or microphone access denied</li>
            <li>Connection issues with the signaling server</li>
            <li>WebRTC not supported in your browser</li>
          </ul>
          <button className="retry-button" onClick={retryConnection}>Retry Connection</button>
          <button className="back-button" onClick={() => navigate('/home')}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-chat-container">
      <div className="video-chat-header">
        <h1>Omegle Video Chat</h1>
        <button 
          className="back-button"
          onClick={() => navigate('/home')}
        >
          Back to Home
        </button>
      </div>

      <div className="video-controls">
        {callState === "idle" && (
          <div className="start-controls">
            <input 
              type="text" 
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button 
              className="start-chat-button"
              onClick={startRandomChat}
            >
              Start Random Chat
            </button>
          </div>
        )}

        {callState === "calling" && (
          <div className="calling-status">
            <p>Connecting to a random stranger...</p>
            <button 
              className="cancel-button"
              onClick={endCall}
            >
              Cancel
            </button>
          </div>
        )}

        {receivingCall && !callAccepted && (
          <div className="incoming-call">
            <h3>{otherUser || "Someone"} is calling you</h3>
            <div className="call-buttons">
              <button 
                className="accept-button"
                onClick={answerCall}
              >
                Accept
              </button>
              <button 
                className="decline-button"
                onClick={() => setReceivingCall(false)}
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {callState === "connected" && (
          <div className="active-call-controls">
            <h3>Connected with {otherUser || "Stranger"}</h3>
            <button 
              className="end-call-button"
              onClick={endCall}
            >
              End Call
            </button>
          </div>
        )}
      </div>

      <div className="video-grid">
        <div className="video-container local-video">
          <video 
            playsInline 
            muted 
            ref={myVideo} 
            autoPlay 
            className="video-element"
          />
          <div className="video-label">You</div>
        </div>
        
        {callAccepted && !callEnded && (
          <div className="video-container remote-video">
            <video 
              playsInline 
              ref={partnerVideo} 
              autoPlay 
              className="video-element"
            />
            <div className="video-label">{otherUser || "Stranger"}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoChat; 