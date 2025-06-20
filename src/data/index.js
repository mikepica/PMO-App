// Import metadata
import metadata from './metadata.json' with { type: 'json' };

// Import all individual project files
import prj001 from './PRJ-001.json' with { type: 'json' };
import prj002 from './PRJ-002.json' with { type: 'json' };
import prj003 from './PRJ-003.json' with { type: 'json' };
import prj004 from './PRJ-004.json' with { type: 'json' };
import prj005 from './PRJ-005.json' with { type: 'json' };
import prj006 from './PRJ-006.json' with { type: 'json' };
import prj007 from './PRJ-007.json' with { type: 'json' };
import prj008 from './PRJ-008.json' with { type: 'json' };
import prj009 from './PRJ-009.json' with { type: 'json' };
import prj010 from './PRJ-010.json' with { type: 'json' };

// Create projects array
const projects = [
  prj001,
  prj002,
  prj003,
  prj004,
  prj005,
  prj006,
  prj007,
  prj008,
  prj009,
  prj010
];

// Main programs object that maintains compatibility with original structure
export const programs = {
  meta: metadata,
  projects: projects
};

// Helper functions for accessing individual programs
export const getProgram = (projectId) => {
  return projects.find(project => project.projectId === projectId);
};

export const getAllPrograms = () => {
  return programs;
};

export const getMetadata = () => {
  return metadata;
};

export const getProjects = () => {
  return projects;
};

// Default export for backward compatibility
export default programs;