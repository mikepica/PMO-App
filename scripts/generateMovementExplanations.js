#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const yargs = require('yargs');
const chalk = require('chalk');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const config = require('./config/analysisPrompts');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
});

// CLI arguments
const argv = yargs(process.argv.slice(2))
  .option('month', {
    alias: 'm',
    type: 'string',
    description: 'Target month to generate explanations for (format: YYYY-MM)'
  })
  .option('project', {
    alias: 'p',
    type: 'string',
    description: 'Specific project ID to process'
  })
  .option('dry-run', {
    alias: 'd',
    type: 'boolean',
    description: 'Preview changes without writing to files',
    default: false
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Verbose logging',
    default: false
  })
  .help()
  .argv;

// Paths
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const METADATA_FILE = path.join(DATA_DIR, 'metadata.json');

// Helper functions
function log(message, color = 'white') {
  console.log(chalk[color](message));
}

function verbose(message) {
  if (argv.verbose) {
    log(`[VERBOSE] ${message}`, 'gray');
  }
}

function getAvailableMonths() {
  const metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
  return metadata.availableMonths || [];
}

function getProjectData(month, projectId) {
  const filePath = path.join(DATA_DIR, month, `${projectId}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return null;
}

function getProjectsInMonth(month) {
  const monthDir = path.join(DATA_DIR, month);
  if (!fs.existsSync(monthDir)) return [];

  return fs.readdirSync(monthDir)
    .filter(file => file.endsWith('.json'))
    .map(file => path.basename(file, '.json'));
}

function getOverallStatus(project) {
  if (Array.isArray(project.status)) {
    const overallItem = project.status.find(item =>
      item.description === "Overall Status" || item.description === "Overall"
    );
    return overallItem ? overallItem.ragStatus : 'Unknown';
  } else if (project.status && project.status.overall) {
    return project.status.overall;
  }
  return 'Unknown';
}

function getHighRisks(project) {
  if (!project.risks || !Array.isArray(project.risks)) return [];
  return project.risks.filter(risk => risk.rating >= 16);
}

function getHighIssues(project) {
  if (!project.issues || !Array.isArray(project.issues)) return [];
  return project.issues.filter(issue => issue.rating >= 6);
}

function getMovementDirection(current, previous, type = 'status') {
  if (type === 'status') {
    const statusRank = (status) => {
      switch (status?.toLowerCase()) {
        case 'blue': return 4;
        case 'green': return 3;
        case 'amber':
        case 'yellow': return 2;
        case 'red': return 1;
        default: return 0;
      }
    };

    const currentRank = statusRank(current);
    const previousRank = statusRank(previous);

    if (currentRank > previousRank) return 'improved';
    if (currentRank < previousRank) return 'declined';
    return 'unchanged';
  } else {
    if (current > previous) return 'increased';
    if (current < previous) return 'decreased';
    return 'unchanged';
  }
}

async function generateExplanation(prompt) {
  try {
    verbose('Calling OpenAI API...');
    const response = await openai.chat.completions.create({
      model: config.apiSettings.model,
      temperature: config.apiSettings.temperature,
      max_tokens: config.apiSettings.max_tokens,
      messages: [
        { role: 'system', content: config.baseContext.trim() },
        { role: 'user', content: prompt }
      ]
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error(chalk.red(`OpenAI API Error: ${error.message}`));
    return null;
  }
}

async function analyzeProjectMovement(currentProject, previousProject, currentMonth, previousMonth) {
  const analysis = {
    projectId: currentProject.projectId,
    projectName: currentProject.name,
    analysisDate: new Date().toISOString(),
    currentMonth,
    previousMonth,
    movements: {}
  };

  // Status movement analysis
  const currentStatus = getOverallStatus(currentProject);
  const previousStatus = getOverallStatus(previousProject);
  const statusMovement = getMovementDirection(currentStatus, previousStatus, 'status');

  if (statusMovement !== 'unchanged' || config.analysisSettings.generateForNoChange) {
    verbose(`Analyzing status movement: ${previousStatus} → ${currentStatus}`);

    const prompt = config.statusMovementPrompt
      .replace('{currentProject}', JSON.stringify(currentProject, null, 2))
      .replace('{previousProject}', JSON.stringify(previousProject, null, 2))
      .replace('{movementDirection}', statusMovement)
      .replace('{currentStatus}', currentStatus)
      .replace('{previousStatus}', previousStatus);

    const explanation = await generateExplanation(prompt);
    if (explanation) {
      analysis.movements.status = {
        direction: statusMovement,
        from: previousStatus,
        to: currentStatus,
        explanation
      };
    }
  }

  // Risk movement analysis
  const currentHighRisks = getHighRisks(currentProject);
  const previousHighRisks = getHighRisks(previousProject);
  const riskMovement = getMovementDirection(currentHighRisks.length, previousHighRisks.length, 'count');

  if (riskMovement !== 'unchanged' || config.analysisSettings.generateForNoChange) {
    verbose(`Analyzing risk movement: ${previousHighRisks.length} → ${currentHighRisks.length}`);

    const prompt = config.riskMovementPrompt
      .replace('{currentHighRisks}', JSON.stringify(currentHighRisks, null, 2))
      .replace('{previousHighRisks}', JSON.stringify(previousHighRisks, null, 2))
      .replace('{movementDirection}', riskMovement)
      .replace('{currentCount}', currentHighRisks.length)
      .replace('{previousCount}', previousHighRisks.length);

    const explanation = await generateExplanation(prompt);
    if (explanation) {
      analysis.movements.risk = {
        direction: riskMovement,
        from: previousHighRisks.length,
        to: currentHighRisks.length,
        explanation
      };
    }
  }

  // Issue movement analysis
  const currentHighIssues = getHighIssues(currentProject);
  const previousHighIssues = getHighIssues(previousProject);
  const issueMovement = getMovementDirection(currentHighIssues.length, previousHighIssues.length, 'count');

  if (issueMovement !== 'unchanged' || config.analysisSettings.generateForNoChange) {
    verbose(`Analyzing issue movement: ${previousHighIssues.length} → ${currentHighIssues.length}`);

    const prompt = config.issueMovementPrompt
      .replace('{currentHighIssues}', JSON.stringify(currentHighIssues, null, 2))
      .replace('{previousHighIssues}', JSON.stringify(previousHighIssues, null, 2))
      .replace('{movementDirection}', issueMovement)
      .replace('{currentCount}', currentHighIssues.length)
      .replace('{previousCount}', previousHighIssues.length);

    const explanation = await generateExplanation(prompt);
    if (explanation) {
      analysis.movements.issue = {
        direction: issueMovement,
        from: previousHighIssues.length,
        to: currentHighIssues.length,
        explanation
      };
    }
  }

  return analysis;
}

async function processMonth(targetMonth) {
  const availableMonths = getAvailableMonths().sort();
  const targetIndex = availableMonths.indexOf(targetMonth);

  if (targetIndex === -1) {
    log(`Month ${targetMonth} not found in available months`, 'red');
    return;
  }

  if (targetIndex === 0) {
    log(`${targetMonth} is the first month - no previous month for comparison`, 'yellow');
    return;
  }

  const previousMonth = availableMonths[targetIndex - 1];
  log(`Processing ${targetMonth} (comparing with ${previousMonth})`, 'blue');

  const projectIds = getProjectsInMonth(targetMonth);
  const specificProject = argv.project;

  const projectsToProcess = specificProject
    ? projectIds.filter(id => id === specificProject)
    : projectIds;

  if (projectsToProcess.length === 0) {
    log('No projects found to process', 'yellow');
    return;
  }

  log(`Found ${projectsToProcess.length} project(s) to analyze`, 'green');

  for (const projectId of projectsToProcess) {
    log(`\nAnalyzing ${projectId}...`, 'cyan');

    const currentProject = getProjectData(targetMonth, projectId);
    const previousProject = getProjectData(previousMonth, projectId);

    if (!currentProject) {
      log(`  ⚠️  Current project data not found`, 'yellow');
      continue;
    }

    if (!previousProject) {
      log(`  ⚠️  Previous project data not found`, 'yellow');
      continue;
    }

    const analysis = await analyzeProjectMovement(currentProject, previousProject, targetMonth, previousMonth);

    if (Object.keys(analysis.movements).length === 0) {
      log(`  ℹ️  No significant movements detected`, 'gray');
      continue;
    }

    // Add movement analysis to current project data
    const updatedProject = {
      ...currentProject,
      movementAnalysis: analysis
    };

    if (argv.dryRun) {
      log(`  [DRY RUN] Would update ${projectId} with:`, 'yellow');
      console.log(JSON.stringify(analysis.movements, null, 2));
    } else {
      const filePath = path.join(DATA_DIR, targetMonth, `${projectId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(updatedProject, null, 2));
      log(`  ✅ Updated ${projectId}`, 'green');

      // Log generated explanations
      Object.entries(analysis.movements).forEach(([type, movement]) => {
        log(`    ${type.toUpperCase()}: ${movement.explanation}`, 'white');
      });
    }
  }
}

async function main() {
  log('🔍 PMO Movement Explanation Generator', 'blue');
  log('=====================================', 'blue');

  // Validate API key
  if (!process.env.REACT_APP_OPENAI_API_KEY) {
    log('❌ REACT_APP_OPENAI_API_KEY not found in environment', 'red');
    process.exit(1);
  }

  const availableMonths = getAvailableMonths();
  if (availableMonths.length === 0) {
    log('❌ No months available in metadata', 'red');
    process.exit(1);
  }

  verbose(`Available months: ${availableMonths.join(', ')}`);

  if (argv.month) {
    await processMonth(argv.month);
  } else {
    // Process the latest month by default
    const latestMonth = availableMonths[availableMonths.length - 1];
    log(`No month specified, processing latest: ${latestMonth}`, 'yellow');
    await processMonth(latestMonth);
  }

  log('\n✨ Generation complete!', 'green');
}

// Run the script
main().catch(error => {
  console.error(chalk.red('Fatal error:', error.message));
  process.exit(1);
});