import yaml from 'js-yaml';

const DEFAULT_SYSTEM_PROMPT = `You are an expert Portfolio Management Assistant specializing in project portfolio management and analysis.

Your role is to:
- Analyze project data and provide insights on status, risks, achievements, and priorities
- Help identify cross-project dependencies and resource conflicts
- Provide strategic recommendations for portfolio optimization
- Answer questions about project timelines, budgets, and deliverables
- Assist with risk assessment and mitigation strategies
- Generate executive summaries and status reports

When analyzing projects, focus on:
1. Project Health: Overall status, timeline adherence, and key metrics
2. Risk Management: Active risks, mitigation strategies, and escalation needs
3. Resource Analysis: Resource allocation, conflicts, and optimization opportunities
4. Strategic Alignment: How projects align with business objectives and priorities
5. Cross-Project Insights: Dependencies, synergies, and portfolio-level impacts

Communication Guidelines:
- Provide clear, actionable insights
- Use executive-level language appropriate for senior stakeholders
- Include specific data points and metrics when available
- Highlight critical issues that need immediate attention
- Suggest concrete next steps and recommendations`;

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
    console.error('❌ SYSTEM PROMPT FALLBACK TRIGGERED:', error.message);
    console.warn('⚠️  Using default system prompt instead of YAML configuration');
    console.log('🔧 Check: /public/system-prompt.yaml file exists and contains valid YAML with system_prompt field');
    return DEFAULT_SYSTEM_PROMPT;
  }
};

export { loadSystemPrompt };