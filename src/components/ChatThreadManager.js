import React from 'react';
import ThreadSelector from './ThreadSelector';

function ChatThreadManager({ 
  threads, 
  currentThreadId, 
  onNewThread, 
  onThreadSelect, 
  onDeleteThread 
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">AI Assistant</h3>
      
      <div className="flex items-center space-x-2">
        <ThreadSelector
          threads={threads}
          currentThreadId={currentThreadId}
          onThreadSelect={onThreadSelect}
          onDeleteThread={onDeleteThread}
        />
        
        <button
          onClick={onNewThread}
          className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          title="Start a new conversation"
        >
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Thread
        </button>
      </div>
    </div>
  );
}

export default ChatThreadManager;