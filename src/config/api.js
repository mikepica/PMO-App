export const API_CONFIG = {
  apiKey: process.env.REACT_APP_OPENROUTER_API_KEY,
  models: {
    '4.1-nano': 'openai/gpt-4.1-nano',
    '4.1': 'openai/gpt-4.1'
  },
  defaultModel: 'openai/gpt-4.1-nano',
  defaultTemperature: 0.7,
  apiUrl: process.env.REACT_APP_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions',
};

// Get model configuration
export const getModelConfig = (modelKey = '4.1-nano', temperature = 0.7) => {
  return {
    ...API_CONFIG,
    model: API_CONFIG.models[modelKey] || API_CONFIG.defaultModel,
    temperature: temperature
  };
};

// Validate required environment variables
const validateConfig = () => {
  if (!API_CONFIG.apiKey) {
    console.error('REACT_APP_OPENROUTER_API_KEY is not set in environment variables');
  }
};

validateConfig(); 