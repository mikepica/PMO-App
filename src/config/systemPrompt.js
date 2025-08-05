import yaml from 'js-yaml';

const loadSystemPrompt = async () => {
  try {
    console.log('🔄 Loading system prompt from /system-prompt.yaml...');
    
    const response = await fetch('/system-prompt.yaml');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const yamlText = await response.text();
    if (!yamlText || yamlText.trim() === '') {
      throw new Error('Empty YAML response');
    }
    
    const config = yaml.load(yamlText);
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid YAML structure');
    }
    
    const systemPrompt = config.system_prompt;
    if (!systemPrompt || typeof systemPrompt !== 'string' || systemPrompt.trim() === '') {
      throw new Error('system_prompt field is missing, null, or empty');
    }
    
    console.log('✅ System prompt loaded successfully from YAML');
    return systemPrompt.trim();
  } catch (error) {
    console.error('❌ FAILED TO LOAD SYSTEM PROMPT:', error.message);
    console.error('🔧 Please ensure /public/system-prompt.yaml exists and contains valid YAML with system_prompt field');
    throw new Error(`System prompt loading failed: ${error.message}`);
  }
};

export { loadSystemPrompt };