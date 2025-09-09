import React, { useState } from 'react';

function ProjectSelector({ projects, selectedProjects, onProjectsChange, isLocked = false, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleProject = (projectId) => {
    if (isLocked) return;
    
    const newSelectedProjects = selectedProjects.includes(projectId)
      ? selectedProjects.filter(id => id !== projectId)
      : [...selectedProjects, projectId];
    
    onProjectsChange(newSelectedProjects);
  };

  const selectedCount = selectedProjects.length;
  const totalCount = projects.length;

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => !isLocked && setIsOpen(!isOpen)}
        disabled={isLocked}
        className={`text-sm font-semibold bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none ${
          isLocked 
            ? 'cursor-not-allowed opacity-60 bg-gray-50' 
            : 'focus:border-blue-500 cursor-pointer hover:bg-gray-50'
        } flex items-center space-x-1 min-w-32`}
        title={isLocked ? 'Context is locked for this conversation. Create a new thread to change context.' : ''}
      >
        <span>
          AI Context: {selectedCount}/{totalCount} projects
        </span>
        {isLocked ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5a2 2 0 100-4 2 2 0 000 4zM3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
          </svg>
        ) : (
          <svg 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && !isLocked && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-300 rounded shadow-lg z-20 max-h-64 overflow-y-auto">
            <div className="p-2">
              <div className="flex items-center justify-between mb-2 pb-2 border-b">
                <span className="text-xs font-medium text-gray-600">Select Projects for AI Context</span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => !isLocked && onProjectsChange(projects.map(p => p.projectId))}
                    className={`text-xs ${isLocked ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    All
                  </button>
                  <span className="text-xs text-gray-400">|</span>
                  <button
                    onClick={() => !isLocked && onProjectsChange([])}
                    className={`text-xs ${isLocked ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    None
                  </button>
                </div>
              </div>
              {projects.map((project) => (
                <label
                  key={project.projectId}
                  className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project.projectId)}
                    onChange={() => toggleProject(project.projectId)}
                    className="form-checkbox h-4 w-4 text-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700 flex-1 truncate">
                    {project.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProjectSelector;