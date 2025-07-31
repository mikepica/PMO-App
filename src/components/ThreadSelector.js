import React, { useState, useRef, useEffect } from 'react';

function ThreadSelector({ threads, currentThreadId, onThreadSelect, onDeleteThread }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getCurrentThreadName = () => {
    const currentThread = threads.find(t => t.id === currentThreadId);
    return currentThread ? currentThread.name : 'Select Thread';
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleDeleteClick = (e, threadId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this thread?')) {
      onDeleteThread(threadId);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (threads.length === 0) {
    return null;
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-between items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-[150px]"
      >
        <span className="truncate mr-2">{getCurrentThreadName()}</span>
        <svg
          className={`h-4 w-4 transition-transform flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide px-2">
              Chat Threads ({threads.length})
            </div>
            <div className="space-y-1">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  className={`group flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 ${
                    thread.id === currentThreadId ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                  onClick={() => {
                    onThreadSelect(thread.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${
                      thread.id === currentThreadId ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {thread.name}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center space-x-2">
                      <span>{thread.messages.length} messages</span>
                      <span>•</span>
                      <span>{formatDate(thread.lastUpdated)}</span>
                    </div>
                  </div>
                  {thread.id !== currentThreadId && (
                    <button
                      onClick={(e) => handleDeleteClick(e, thread.id)}
                      className="ml-2 p-1 rounded hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete thread"
                    >
                      <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThreadSelector;