import React from 'react';

function ProjectTabs({ projects, selectedTab, onTabSelect, contextProjects, onContextToggle }) {
  return (
    <div className="flex flex-wrap gap-2 items-end">
      {projects.map((project) => (
        <div
          key={project.projectId}
          className={`flex items-center space-x-2 px-3 py-2 rounded-t-lg border-b-2 cursor-pointer transition-colors min-w-0 max-w-xs ${
            selectedTab === project.projectId
              ? 'bg-white border-blue-500 text-blue-600'
              : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => onTabSelect(project.projectId)}
        >
          <input
            type="checkbox"
            checked={contextProjects.includes(project.projectId)}
            onChange={(e) => {
              e.stopPropagation();
              onContextToggle(project.projectId);
            }}
            className="form-checkbox h-4 w-4 text-blue-500 rounded flex-shrink-0"
          />
          <span className="text-sm font-medium break-words leading-tight min-w-0">
            {project.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ProjectTabs;