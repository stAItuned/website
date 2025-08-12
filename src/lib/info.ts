// Environment-aware configuration
const getBasePath = () => {
  // Check for environment variable first
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // Check if we're in browser and on dev subdomain
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'dev.staituned.com') {
      return 'https://dev.staituned.com';
    }
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:3000';
    }
  }
  
  // Default to production
  return 'https://staituned.com';
};

const isDev = () => {
  const basePath = getBasePath();
  return basePath.includes('dev.staituned.com') || basePath.includes('localhost');
};

export default {
    siteName: isDev() ? 'stAItuned (Dev)' : 'stAItuned',
    shortDescription: "stAI tuned for an Artificial Intelligence accessible to anyone! 🧠", 
    longDescription: "stAI tuned for an Artificial Intelligence accessible to anyone! 🧠", 
    logo: {
        relPath: "/assets/general/blue-bg-logo.png",
        width: 1920,
        height: 1124
    },
    logoPath: "/assets/general/logo.svg", // TODO: There should be an image with a fixed size
    basePath: getBasePath()
} as const
