export const API_CONFIG = {
  apiKey: process.env.REACT_APP_OPENROUTER_API_KEY,
  model: process.env.REACT_APP_LLM_MODEL || 'openai/gpt-4.1-nano',
  apiUrl: process.env.REACT_APP_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions',
};

// Validate required environment variables
const validateConfig = () => {
  if (!API_CONFIG.apiKey) {
    console.error('REACT_APP_OPENROUTER_API_KEY is not set in environment variables');
  }
};

validateConfig(); 