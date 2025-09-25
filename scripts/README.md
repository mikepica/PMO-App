# Movement Explanation Generator

This script generates AI-powered explanations for project movement changes (status, risks, and issues) and stores them in your project JSON files for display in the PMO dashboard tooltips.

## Setup

1. **Install dependencies:**
   ```bash
   cd scripts
   npm install
   ```

2. **Environment setup:**
   Make sure your `.env` file in the parent directory contains:
   ```
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

## Usage

### Generate explanations for the latest month:
```bash
npm run generate-explanations
```

### Generate explanations for a specific month:
```bash
npm run generate-explanations -- --month 2025-07
```

### Generate explanations for a specific project:
```bash
npm run generate-explanations -- --project PRJ-001
```

### Combine options:
```bash
npm run generate-explanations -- --month 2025-07 --project PRJ-001
```

### Preview changes without writing files:
```bash
npm run generate-explanations -- --dry-run --verbose
```

### Enable verbose logging:
```bash
npm run generate-explanations -- --verbose
```

## Configuration

Edit the prompts and settings in `config/analysisPrompts.js`:

### Customize AI Analysis Prompts
- **`statusMovementPrompt`**: How AI analyzes status changes (Green/Amber/Red)
- **`riskMovementPrompt`**: How AI analyzes high risk count changes
- **`issueMovementPrompt`**: How AI analyzes high issue count changes

### API Settings
- **`model`**: OpenAI model to use (default: gpt-4-turbo-preview)
- **`temperature`**: Response randomness (0.3 = more focused)
- **`max_tokens`**: Maximum response length (150)

### Analysis Settings
- **`generateForNoChange`**: Generate explanations even when no movement occurred
- **`includeDetailedContext`**: Include full project data in AI analysis

## Output

The script adds a `movementAnalysis` object to each project JSON file:

```json
{
  "projectId": "PRJ-001",
  "name": "Project Name",
  "movementAnalysis": {
    "projectId": "PRJ-001",
    "projectName": "Project Name",
    "analysisDate": "2025-01-15T10:30:00.000Z",
    "currentMonth": "2025-07",
    "previousMonth": "2025-06",
    "movements": {
      "status": {
        "direction": "declined",
        "from": "Green",
        "to": "Amber",
        "explanation": "Status declined due to emerging regulatory concerns..."
      },
      "risk": {
        "direction": "increased",
        "from": 1,
        "to": 2,
        "explanation": "Risk count increased due to new regulatory compliance requirements..."
      }
    }
  }
}
```

## How It Works

1. **Compares consecutive months**: Analyzes changes between the current month and previous month
2. **Identifies movements**: Detects changes in status, risk counts, and issue counts
3. **AI analysis**: Sends project context to OpenAI for natural language explanations
4. **Updates JSON files**: Stores explanations directly in project files
5. **Dashboard integration**: Explanations appear as tooltips when hovering over movement arrows

## Troubleshooting

### No explanations generated
- Check that you have projects in both current and previous months
- Verify your OpenAI API key is valid
- Check that movements were actually detected (use `--verbose`)

### API errors
- Verify your OpenAI API key has sufficient credits
- Check network connectivity
- Try reducing `max_tokens` if hitting token limits

### File permission errors
- Ensure write permissions to the data directory
- Run with `--dry-run` to preview changes first