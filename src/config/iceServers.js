// ICE servers configuration for WebRTC
// These are public STUN/TURN servers that help with NAT traversal
export const iceServers = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: 'stun:stun1.l.google.com:19302'
    },
    {
      urls: 'stun:stun2.l.google.com:19302'
    },
    {
      urls: 'stun:stun3.l.google.com:19302'
    },
    {
      urls: 'stun:stun4.l.google.com:19302'
    },
    // Free TURN server from Twilio (consider using your own in production)
    {
      urls: 'turn:global.turn.twilio.com:3478?transport=udp',
      username: 'f4b4035eaa76f4a55de5f4351567653ee4ff6fa97b50b6b334fcc1be9c27212d',
      credential: 'W1UqMP8mVCNmNmMgv+TAhuwpvIJiQiVfMZcUSYJWrFQ='
    },
    {
      urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
      username: 'f4b4035eaa76f4a55de5f4351567653ee4ff6fa97b50b6b334fcc1be9c27212d',
      credential: 'W1UqMP8mVCNmNmMgv+TAhuwpvIJiQiVfMZcUSYJWrFQ='
    }
  ]
}; 