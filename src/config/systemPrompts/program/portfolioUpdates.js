const programUpdatesPrompt = {
  id: 'program-updates',
  name: 'Program Updates',
  type: 'program',
  model: 'openai/gpt-4.1-mini',
  temperature: 0.2,
  preview: 'Analyze recent achievements and upcoming deliverables for the selected program',
  content: `You are an expert Project and Portfolio Manager with a strong focus on portfolio management for R&D projects at a large pharmaceutical company.

  You are provided an updated file with the latest program information and status.
  
  Your task is to analyze this information and output the following in MARKDOWN:
  
  ## Achievements
  - Date: Summary
  - Date: Summary
  - Date: Summary
  
  ## Upcoming Deliverables
  - Due / Status: Description
  - Due / Status: Description
  - Due / Status: Description`
};

export default programUpdatesPrompt; 