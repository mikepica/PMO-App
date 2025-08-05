export const API_CONFIG = {
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  models: {
    'gpt-4.1-mini': { model: 'gpt-4.1-mini', temperature: 0.7 },
    'gpt-4.1': { model: 'gpt-4.1', temperature: 0.7 },
    'gpt-4.1-nano': { model: 'gpt-4.1-nano', temperature: 0.7 },
    'gpt-4': { model: 'gpt-4.1', temperature: 0.4 }, // Current hardcoded model from App.js
    'extended-thinking': { model: 'gpt-4.1', temperature: 0.1 }, // Lower temp for more focused thinking
  },
  defaultModel: 'gpt-4.1-nano',
  defaultTemperature: 0.7,
  apiUrl: 'https://api.openai.com/v1/chat/completions',
};

// Get model configuration
export const getModelConfig = (modelKey = 'gpt-4.1-nano') => {
  const modelConfig = API_CONFIG.models[modelKey];
  if (!modelConfig) {
    // Fallback to default model
    const defaultModelConfig = API_CONFIG.models[API_CONFIG.defaultModel];
    return {
      ...API_CONFIG,
      model: defaultModelConfig.model,
      temperature: defaultModelConfig.temperature
    };
  }
  
  return {
    ...API_CONFIG,
    model: modelConfig.model,
    temperature: modelConfig.temperature
  };
};

// Validate required environment variables
const validateConfig = () => {
  if (!API_CONFIG.apiKey) {
    console.error('REACT_APP_OPENAI_API_KEY is not set in environment variables');
  }
};

validateConfig(); 