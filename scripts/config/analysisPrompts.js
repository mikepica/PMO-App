// Configuration for AI analysis prompts
// Edit these prompts to customize how the AI analyzes project movements

module.exports = {
  // Base context that's added to all prompts
  baseContext: `
You are analyzing project management data to explain changes in project status, risks, and issues over time.
Provide clear, concise explanations that a project manager would find useful.
Focus on the most significant changes and their likely business impact.
`,

  // Prompt for analyzing overall status changes (Green/Amber/Red)
  statusMovementPrompt: `
Analyze the overall status change for this project between two time periods.

CURRENT PROJECT STATE:
{currentProject}

PREVIOUS PROJECT STATE:
{previousProject}

MOVEMENT: {movementDirection} (from {previousStatus} to {currentStatus})

Provide a brief explanation (1-2 sentences) for why the project status likely changed. Consider:
- Changes in schedule, scope, or overall health
- New risks or issues that emerged
- Resolved problems or improvements
- Key milestones or deliverables

Response format: A concise explanation without preamble.
`,

  // Prompt for analyzing risk count changes
  riskMovementPrompt: `
Analyze the change in high-risk items (≥16 score) for this project between two time periods.

CURRENT HIGH RISKS:
{currentHighRisks}

PREVIOUS HIGH RISKS:
{previousHighRisks}

MOVEMENT: {movementDirection} (from {previousCount} to {currentCount} high risks)

Provide a brief explanation (1-2 sentences) for why the high risk count changed. Consider:
- New risks that emerged or were identified
- Risks that were mitigated or resolved
- Changes in risk severity or likelihood
- External factors affecting risk profile

Response format: A concise explanation without preamble.
`,

  // Prompt for analyzing issue count changes
  issueMovementPrompt: `
Analyze the change in high-severity issues (≥6 rating) for this project between two time periods.

CURRENT HIGH ISSUES:
{currentHighIssues}

PREVIOUS HIGH ISSUES:
{previousHighIssues}

MOVEMENT: {movementDirection} (from {previousCount} to {currentCount} high issues)

Provide a brief explanation (1-2 sentences) for why the high issue count changed. Consider:
- New issues that arose or were escalated
- Issues that were resolved or closed
- Changes in issue severity or impact
- Process improvements or system fixes

Response format: A concise explanation without preamble.
`,

  // OpenAI API settings
  apiSettings: {
    model: 'gpt-4-turbo-preview',
    temperature: 0.3,
    max_tokens: 150
  },

  // Analysis settings
  analysisSettings: {
    // Minimum change threshold to generate explanations
    // Set to 0 to generate explanations for all movements
    minimumChangeThreshold: 0,

    // Include detailed project data in analysis
    includeDetailedContext: true,

    // Generate explanations for unchanged status (useful for "no change" tooltips)
    generateForNoChange: false
  }
};