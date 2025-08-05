export const API_CONFIG = {
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  models: {
    'gpt-4.1-mini': 'gpt-4.1-mini',
    'gpt-4.1': 'gpt-4.1',
    'gpt-4.1-nano': 'gpt-4.1-nano',
    'extended-thinking': 'gpt-4.1', // You can change this to any model on your backend
  },
  defaultModel: 'gpt-4.1-nano',
  defaultTemperature: 0.7,
  apiUrl: 'https://api.openai.com/v1/chat/completions',
};

// Get model configuration
export const getModelConfig = (modelKey = 'gpt-4.1-nano', temperature = 0.7) => {
  return {
    ...API_CONFIG,
    model: API_CONFIG.models[modelKey] || API_CONFIG.defaultModel,
    temperature: temperature
  };
};

// Validate required environment variables
const validateConfig = () => {
  if (!API_CONFIG.apiKey) {
    console.error('REACT_APP_OPENAI_API_KEY is not set in environment variables');
  }
};

validateConfig(); 