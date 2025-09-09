import React from 'react';

function ProjectTabs({ projects, selectedTab, onTabSelect }) {
  return (
    <div className="flex w-full gap-1 items-center justify-center">
      {/* Summary Tab */}
      <div
        className={`flex items-center justify-center px-2 py-1.5 rounded-full cursor-pointer transition-all duration-200 flex-1 min-w-0 ${
          selectedTab === 'summary'
            ? 'bg-blue-100 border-2 border-blue-500 text-blue-700 shadow-sm'
            : 'bg-gray-100 border-2 border-transparent text-gray-700 hover:bg-gray-200 hover:border-gray-300'
        }`}
        onClick={() => onTabSelect('summary')}
      >
        <span className="text-xs font-medium truncate leading-tight text-center">
          Summary
        </span>
      </div>
      
      {/* Project Tabs */}
      {projects.map((project) => (
        <div
          key={project.projectId}
          className={`flex items-center justify-center px-2 py-1.5 rounded-full cursor-pointer transition-all duration-200 flex-1 min-w-0 ${
            selectedTab === project.projectId
              ? 'bg-blue-100 border-2 border-blue-500 text-blue-700 shadow-sm'
              : 'bg-gray-100 border-2 border-transparent text-gray-700 hover:bg-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onTabSelect(project.projectId)}
        >
          <span className="text-xs font-medium truncate leading-tight text-center" title={project.name}>
            {project.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ProjectTabs;