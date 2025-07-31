// Import metadata
import metadata from './metadata.json' with { type: 'json' };

// Import all project files by month
import prj001_2025_05 from './2025-05/PRJ-001.json' with { type: 'json' };
import prj001_2025_06 from './2025-06/PRJ-001.json' with { type: 'json' };
import prj001_2025_07 from './2025-07/PRJ-001.json' with { type: 'json' };

import prj002_2025_05 from './2025-05/PRJ-002.json' with { type: 'json' };
import prj002_2025_06 from './2025-06/PRJ-002.json' with { type: 'json' };
import prj002_2025_07 from './2025-07/PRJ-002.json' with { type: 'json' };

import prj003_2025_05 from './2025-05/PRJ-003.json' with { type: 'json' };
import prj003_2025_06 from './2025-06/PRJ-003.json' with { type: 'json' };
import prj003_2025_07 from './2025-07/PRJ-003.json' with { type: 'json' };

import dummyProject_2025_05 from './2025-05/dummy_project.json' with { type: 'json' };
import dummyProject_2025_06 from './2025-06/dummy_project.json' with { type: 'json' };
import dummyProject_2025_07 from './2025-07/dummy_project.json' with { type: 'json' };

// Project data organized by month
const projectsByMonth = {
  '2025-05': [prj001_2025_05, prj002_2025_05, prj003_2025_05, dummyProject_2025_05],
  '2025-06': [prj001_2025_06, prj002_2025_06, prj003_2025_06, dummyProject_2025_06],
  '2025-07': [prj001_2025_07, prj002_2025_07, prj003_2025_07, dummyProject_2025_07]
};

// Current month projects (using the latest available month)
const currentMonth = metadata.currentMonth || '2025-07';
const projects = projectsByMonth[currentMonth] || [];

// Main programs object that maintains compatibility with original structure
export const programs = {
  meta: metadata,
  projects: projects
};

// Helper functions for accessing individual programs
export const getProgram = (projectId, month = null) => {
  if (month && projectsByMonth[month]) {
    return projectsByMonth[month].find(project => project.projectId === projectId);
  }
  return projects.find(project => project.projectId === projectId);
};

export const getAllPrograms = (month = null) => {
  if (month && projectsByMonth[month]) {
    return {
      meta: metadata,
      projects: projectsByMonth[month]
    };
  }
  return programs;
};

export const getMetadata = () => {
  return metadata;
};

export const getProjects = (month = null) => {
  if (month && projectsByMonth[month]) {
    return projectsByMonth[month];
  }
  return projects;
};

export const getAvailableMonths = () => {
  return metadata.availableMonths || [];
};

export const getCurrentMonth = () => {
  return metadata.currentMonth || metadata.availableMonths?.[metadata.availableMonths.length - 1];
};

export const getProjectsForMonths = (months = []) => {
  const result = {};
  months.forEach(month => {
    if (projectsByMonth[month]) {
      result[month] = projectsByMonth[month];
    }
  });
  return result;
};

// Default export for backward compatibility
export default programs;