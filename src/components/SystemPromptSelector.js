import React, { useState } from 'react';
import {
  portfolioUpdatesPrompt,
  risksAndMitigationsPrompt,
  tradeOffsPrompt,
  trendsAndSurprisesPrompt
} from '../config/systemPrompts';
import PromptSelectorPopout from './PromptSelectorPopout';

const prompts = [
  portfolioUpdatesPrompt,
  risksAndMitigationsPrompt,
  tradeOffsPrompt,
  trendsAndSurprisesPrompt
];

function SystemPromptSelector({ onPromptSubmit }) {
  const [activePopout, setActivePopout] = useState(null);

  const handlePromptClick = (prompt) => {
    setActivePopout(prompt);
  };

  const handleClose = () => {
    setActivePopout(null);
  };

  const handleSubmit = (data) => {
    onPromptSubmit(data);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 relative">
      {prompts.map((prompt) => (
        <button
          key={prompt.id}
          onClick={() => handlePromptClick(prompt)}
          className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          {prompt.name}
        </button>
      ))}
      
      {activePopout && (
        <PromptSelectorPopout
          prompt={activePopout}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default SystemPromptSelector; 