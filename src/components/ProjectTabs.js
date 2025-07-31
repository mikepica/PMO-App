import React from 'react';

function ProjectTabs({ projects, selectedTab, onTabSelect, contextProjects, onContextToggle }) {
  return (
    <div className="flex flex-nowrap gap-2 items-center justify-center min-w-max">
      {projects.map((project) => (
        <div
          key={project.projectId}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 min-w-0 max-w-48 ${
            selectedTab === project.projectId
              ? 'bg-blue-100 border-2 border-blue-500 text-blue-700 shadow-sm'
              : 'bg-gray-100 border-2 border-transparent text-gray-700 hover:bg-gray-200 hover:border-gray-300'
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
            className="form-checkbox h-3.5 w-3.5 text-blue-500 rounded flex-shrink-0"
            title="Include in AI context"
          />
          <span className="text-xs font-medium truncate leading-tight min-w-0">
            {project.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ProjectTabs;