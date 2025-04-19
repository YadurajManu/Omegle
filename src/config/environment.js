// Environment configuration
const ENV = {
  development: {
    SOCKET_URL: 'http://localhost:8000',
    API_URL: 'http://localhost:8000/api'
  },
  production: {
    SOCKET_URL: 'https://omegle-eosin.vercel.app/api',
    API_URL: 'https://omegle-eosin.vercel.app/api'
  }
};

// Determine current environment
const getEnvironment = () => {
  const isProduction = window.location.hostname === 'omegle-eosin.vercel.app' || 
                      import.meta.env?.MODE === 'production';
  return isProduction ? 'production' : 'development';
};

// Export environment variables
export const config = ENV[getEnvironment()];

// Export socket URL
export const SOCKET_URL = config.SOCKET_URL;

// Export API URL
export const API_URL = config.API_URL; 