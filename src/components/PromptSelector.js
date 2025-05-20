import React from 'react';
import { usePrompt } from '../contexts/PromptContext';
import { useProgram } from '../contexts/ProgramContext';
import { usePortfolio } from '../contexts/PortfolioContext';
import { defaultPortfolioPrompt } from '../config/systemPrompts/portfolio/defaultPortfolio';
import { defaultProgramPrompt } from '../config/systemPrompts/program/defaultProgram';
import { portfolioUpdatesPrompt } from '../config/systemPrompts/portfolio/portfolioUpdates';
import { programUpdatesPrompt } from '../config/systemPrompts/program/portfolioUpdates';
import { portfolioRisksAndMitigationsPrompt } from '../config/systemPrompts/portfolio/risksAndMitigations';
import { programRisksAndMitigationsPrompt } from '../config/systemPrompts/program/risksAndMitigations';
import { tradeOffsPrompt } from '../config/systemPrompts/portfolio/tradeOffs';
import { trendsAndSurprisesPrompt } from '../config/systemPrompts/portfolio/trendsAndSurprises';

const PromptSelector = () => {
  const { setPrompt } = usePrompt();
  const { selectedProgram } = useProgram();
  const { selectedPortfolio } = usePortfolio();

  const isPortfolioView = !selectedProgram && selectedPortfolio;

  const portfolioPrompts = [
    defaultPortfolioPrompt,
    portfolioUpdatesPrompt,
    portfolioRisksAndMitigationsPrompt,
    tradeOffsPrompt,
    trendsAndSurprisesPrompt
  ];

  const programPrompts = [
    defaultProgramPrompt,
    programUpdatesPrompt,
    programRisksAndMitigationsPrompt
  ];

  const handlePromptChange = (prompt) => {
    setPrompt(prompt);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Analysis Type
      </label>
      <div className="grid grid-cols-1 gap-2">
        {isPortfolioView ? (
          // Portfolio View Prompts
          portfolioPrompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => handlePromptChange(prompt)}
              className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${prompt.type === 'portfolio' 
                  ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'}`}
            >
              <div className="font-medium">{prompt.name}</div>
              <div className="text-xs text-gray-500 mt-1">{prompt.preview}</div>
            </button>
          ))
        ) : (
          // Program View Prompts
          programPrompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => handlePromptChange(prompt)}
              className="w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors
                bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
            >
              <div className="font-medium">{prompt.name}</div>
              <div className="text-xs text-gray-500 mt-1">{prompt.preview}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default PromptSelector; 