import React, { useState } from 'react';
import {
  portfolioUpdatesPrompt,
  portfolioRisksAndMitigationsPrompt,
  tradeOffsPrompt,
  // trendsAndSurprisesPrompt,
  programUpdatesPrompt,
  programRisksAndMitigationsPrompt
} from '../config/systemPrompts';
import { programs } from '../data/programs';

const PROMPT_MAP = [
  {
    portfolio: portfolioUpdatesPrompt,
    program: programUpdatesPrompt
  },
  {
    portfolio: portfolioRisksAndMitigationsPrompt,
    program: programRisksAndMitigationsPrompt
  },
  {
    portfolio: tradeOffsPrompt,
    program: null // portfolio-only
  }
  // {
  //   portfolio: trendsAndSurprisesPrompt,
  //   program: null // portfolio-only
  // }
];

function SystemPromptSelector({ onPromptSubmit }) {
  const [activePromptIdx, setActivePromptIdx] = useState(null);
  const [contextType, setContextType] = useState('portfolio');
  const [selectedPrograms, setSelectedPrograms] = useState([]);

  const handlePromptClick = (idx) => {
    setActivePromptIdx(idx);
    setContextType('portfolio');
    setSelectedPrograms([]);
  };

  const handleClose = () => {
    setActivePromptIdx(null);
    setContextType('portfolio');
    setSelectedPrograms([]);
  };

  const handleSubmit = () => {
    const promptObj = PROMPT_MAP[activePromptIdx];
    if (contextType === 'portfolio') {
      onPromptSubmit({ prompt: promptObj.portfolio, context: 'portfolio' });
    } else {
      selectedPrograms.forEach(programId => {
        onPromptSubmit({ prompt: promptObj.program, context: 'program', programId });
      });
    }
    handleClose();
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 relative">
      {/* Instructional text above pre-made prompts */}
      <div className="w-full mb-2 italic text-gray-600 text-xs">
        The below pre-made workflows will popuout a modal for program selection. General chat messages will use the Portfolio/Programs from Context Selection.
      </div>
      {PROMPT_MAP.map((promptObj, idx) => {
        const isPortfolioOnly = !promptObj.program;
        return (
          <button
            key={promptObj.portfolio.id}
            onClick={() => handlePromptClick(idx)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${isPortfolioOnly ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {promptObj.portfolio.name}
          </button>
        );
      })}
      {activePromptIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px]">
            <div className="mb-4 text-lg font-semibold">
              {PROMPT_MAP[activePromptIdx].portfolio.name}
            </div>
            {/* Preview text, updates live based on contextType */}
            <div className="mb-2 italic text-gray-600">
              {(() => {
                const promptObj = PROMPT_MAP[activePromptIdx];
                if (!promptObj.program) {
                  return promptObj.portfolio.preview;
                }
                return contextType === 'portfolio'
                  ? promptObj.portfolio.preview
                  : promptObj.program.preview;
              })()}
            </div>
            {/* Context selection */}
            <div className="mb-2">
              <label className="font-medium mr-4">
                <input
                  type="radio"
                  name="contextType"
                  value="portfolio"
                  checked={contextType === 'portfolio'}
                  onChange={() => setContextType('portfolio')}
                />{' '}
                Portfolio
              </label>
              <label className="font-medium">
                <input
                  type="radio"
                  name="contextType"
                  value="program"
                  checked={contextType === 'program'}
                  onChange={() => setContextType('program')}
                  disabled={!PROMPT_MAP[activePromptIdx].program}
                />{' '}
                Program(s)
              </label>
            </div>
            {/* Show program selection only if program is available and selected */}
            {PROMPT_MAP[activePromptIdx].program && contextType === 'program' && (
              <>
                <div className="flex gap-2 mb-2">
                  <button
                    className="px-2 py-1 rounded bg-blue-500 text-white text-xs hover:bg-blue-600"
                    onClick={() => setSelectedPrograms(programs.projects.map(p => p.projectId))}
                    type="button"
                  >
                    Select All
                  </button>
                  <button
                    className="px-2 py-1 rounded bg-gray-400 text-white text-xs hover:bg-gray-500"
                    onClick={() => setSelectedPrograms([])}
                    type="button"
                  >
                    Deselect All
                  </button>
                </div>
                <div className="mb-4 max-h-40 overflow-y-auto border rounded p-2">
                  {programs.projects.map(project => (
                    <label key={project.projectId} className="block mb-1">
                      <input
                        type="checkbox"
                        checked={selectedPrograms.includes(project.projectId)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedPrograms(prev => [...prev, project.projectId]);
                          } else {
                            setSelectedPrograms(prev => prev.filter(id => id !== project.projectId));
                          }
                        }}
                      />{' '}
                      {project.name} <span className="text-xs text-gray-400">({project.projectId})</span>
                    </label>
                  ))}
                </div>
              </>
            )}
            {/* If portfolio-only, show info message */}
            {!PROMPT_MAP[activePromptIdx].program && (
              <div className="mb-4 font-medium text-blue-700">This prompt is only available at the portfolio level.</div>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={handleClose} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
              <button
                onClick={handleSubmit}
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                disabled={PROMPT_MAP[activePromptIdx].program && contextType === 'program' && selectedPrograms.length === 0}
              >
                Run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SystemPromptSelector; 