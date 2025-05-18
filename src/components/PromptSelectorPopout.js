import React, { useState } from 'react';
import { programs } from '../data/programs';

function PromptSelectorPopout({ prompt, onClose, onSubmit }) {
  const [selectedPrograms, setSelectedPrograms] = useState(programs.projects.map(p => p.projectId));
  const [showPortfolio, setShowPortfolio] = useState(true);

  const handleSelectAll = () => {
    setSelectedPrograms(programs.projects.map(p => p.projectId));
    setShowPortfolio(true);
  };

  const handleDeselectAll = () => {
    setSelectedPrograms([]);
    setShowPortfolio(false);
  };

  const handleProgramToggle = (programId) => {
    if (programId === 'PORTFOLIO') {
      setShowPortfolio(prev => !prev);
      return;
    }
    setSelectedPrograms(prev => 
      prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      prompt,
      selectedPrograms,
      showPortfolio
    });
    onClose();
  };

  return (
    <div className="absolute right-0 bottom-full mb-2 w-80 bg-white border rounded shadow-lg z-50 p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-gray-700">{prompt.name}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg">×</button>
      </div>
      
      <div className="mb-4 p-2 bg-gray-50 rounded text-sm text-gray-600">
        {prompt.preview}
      </div>

      <div className="flex space-x-2 mb-2">
        <button
          onClick={handleSelectAll}
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
        >
          Select All
        </button>
        <button
          onClick={handleDeselectAll}
          className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
        >
          Deselect All
        </button>
      </div>

      <div className="max-h-60 overflow-y-auto space-y-1 mb-4">
        {/* Portfolio Option */}
        <label className="flex items-center space-x-2 p-1 rounded hover:bg-gray-50 cursor-pointer border-b pb-2 mb-2">
          <input
            type="checkbox"
            checked={showPortfolio}
            onChange={() => handleProgramToggle('PORTFOLIO')}
            className="form-checkbox h-4 w-4 text-blue-500"
          />
          <span className="flex-1 text-sm font-semibold">Portfolio Overview</span>
        </label>

        {programs.projects.map(project => (
          <label key={project.projectId} className="flex items-center space-x-2 p-1 rounded hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPrograms.includes(project.projectId)}
              onChange={() => handleProgramToggle(project.projectId)}
              className="form-checkbox h-4 w-4 text-blue-500"
            />
            <span className="flex-1 text-sm">{project.name}</span>
            <span className="text-xs text-gray-400">{project.projectId}</span>
          </label>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedPrograms.length === 0 && !showPortfolio}
        className={`w-full py-2 rounded text-white ${
          selectedPrograms.length === 0 && !showPortfolio
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        Submit
      </button>
    </div>
  );
}

export default PromptSelectorPopout; 