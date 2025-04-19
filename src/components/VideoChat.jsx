import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Peer from 'simple-peer';
import { iceServers } from '../config/iceServers';
import { API_URL } from '../config/environment';
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
  const [callState, setCallState] = useState("idle"); // idle, calling, connected, ended
  const [connectionError, setConnectionError] = useState(false);
  const [userId, setUserId] = useState(null);
  const [peerId, setPeerId] = useState(null);

  const myVideo = useRef();
  const partnerVideo = useRef();
  const connectionRef = useRef();
  const pollingIntervalRef = useRef();

  // Register user and get signals
  useEffect(() => {
    // Register user
    const registerUser = async () => {
      try {
        const response = await fetch(`${API_URL}/rtc`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'register'
          })
        });
        
        const data = await response.json();
        if (data.userId) {
          console.log('Registered with ID:', data.userId);
          setUserId(data.userId);
        } else {
          console.error('Failed to register user');
          setConnectionError(true);
        }
      } catch (error) {
        console.error('Error registering user:', error);
        setConnectionError(true);
      }
    };

    registerUser();

    // Request camera and microphone
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
      
    // Clean up
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      // Notify server that we're leaving
      if (userId) {
        leaveRoom();
      }
    };
  }, []);

  // Setup signal polling when userId is set
  useEffect(() => {
    if (!userId) return;

    // Setup interval to poll for signals
    const pollSignals = async () => {
      try {
        const response = await fetch(`${API_URL}/rtc`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'get-signals',
            userId
          })
        });
        
        const data = await response.json();
        if (data.signals && data.signals.length > 0) {
          // Process each signal
          data.signals.forEach(signal => {
            handleIncomingSignal(signal);
          });
        }
      } catch (error) {
        console.error('Error polling signals:', error);
      }
    };

    // Start polling
    pollingIntervalRef.current = setInterval(pollSignals, 1000);

    // Check room status
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/rtc`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'check-status',
            userId
          })
        });
        
        const data = await response.json();
        if (data.matched && data.peerId && !peerId) {
          // We've been matched with someone
          setPeerId(data.peerId);
          
          // If we're the initiator, start the call
          if (data.initiator) {
            initiateCall(data.peerId);
          }
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    };

    // Check status every 2 seconds
    const statusInterval = setInterval(checkStatus, 2000);

    // Clean up
    return () => {
      clearInterval(pollingIntervalRef.current);
      clearInterval(statusInterval);
    };
  }, [userId, peerId]);

  // Handle incoming signals
  const handleIncomingSignal = (signalData) => {
    if (signalData.type === 'leave') {
      // The other user left
      setCallEnded(true);
      setCallState('ended');
      
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
      
      // Reset the call state after a delay
      setTimeout(() => {
        setCallAccepted(false);
        setReceivingCall(false);
        setCallEnded(false);
        setCallState('idle');
        setPeerId(null);
      }, 2000);
      
      return;
    }
    
    // Handle WebRTC signal
    if (signalData.signal) {
      if (!callAccepted && !receivingCall) {
        // We're receiving a call
        setReceivingCall(true);
        setCaller(signalData.from);
        setOtherUser(signalData.from);
        setCallerSignal(signalData.signal);
      } else if (!callAccepted && receivingCall) {
        // Ongoing call negotiation
        setCallerSignal(signalData.signal);
      } else if (callAccepted) {
        // Call is already accepted, pass signal to peer
        if (connectionRef.current) {
          connectionRef.current.signal(signalData.signal);
        }
      }
    }
  };

  // Send a signal to another user
  const sendSignal = async (targetId, signal) => {
    if (!userId || !targetId) return;

    try {
      await fetch(`${API_URL}/rtc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'signal',
          userId,
          targetId,
          signal
        })
      });
    } catch (error) {
      console.error('Error sending signal:', error);
    }
  };

  // Join the waiting room
  const startRandomChat = async () => {
    if (!userId) {
      console.error('No user ID');
      return;
    }

    setCallState('calling');

    try {
      const response = await fetch(`${API_URL}/rtc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'join-waiting',
          userId
        })
      });
      
      const data = await response.json();
      if (data.matched && data.peerId) {
        // We've been matched with someone
        setPeerId(data.peerId);
        initiateCall(data.peerId);
      } else {
        console.log('Added to waiting list, waiting for match...');
      }
    } catch (error) {
      console.error('Error joining waiting room:', error);
      setConnectionError(true);
    }
  };

  // Initiate a call to another user
  const initiateCall = (targetId) => {
    setCallState('calling');
    
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
      config: iceServers
    });

    peer.on('signal', (data) => {
      sendSignal(targetId, data);
    });

    peer.on('stream', (partnerStream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = partnerStream;
      }
    });

    peer.on('error', (err) => {
      console.error('Peer connection error:', err);
      setConnectionError(true);
      endCall();
    });

    connectionRef.current = peer;
  };

  // Answer an incoming call
  const answerCall = () => {
    setCallAccepted(true);
    setCallState('connected');
    setReceivingCall(false);
    
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
      config: iceServers
    });

    peer.on('signal', (data) => {
      sendSignal(caller, data);
    });

    peer.on('stream', (partnerStream) => {
      partnerVideo.current.srcObject = partnerStream;
    });

    peer.on('error', (err) => {
      console.error('Peer connection error:', err);
      setConnectionError(true);
      endCall();
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  // End a call
  const endCall = () => {
    setCallEnded(true);
    setCallState('ended');
    
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    
    // Notify server we're leaving
    leaveRoom();
    
    // Reset the call state after a delay
    setTimeout(() => {
      setCallAccepted(false);
      setReceivingCall(false);
      setCallEnded(false);
      setCallState('idle');
      setPeerId(null);
    }, 2000);
  };

  // Notify server we're leaving the room
  const leaveRoom = async () => {
    if (!userId) return;

    try {
      await fetch(`${API_URL}/rtc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'leave-room',
          userId
        })
      });
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  // Retry connection
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
            <li>Connection issues with the server</li>
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
        <h1>Video Chat</h1>
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
              disabled={!userId}
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