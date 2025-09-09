import React, { useState, useRef, useEffect } from 'react';

function AIContextSelector({ availableMonths, selectedMonths, onMonthsChange, currentMonth, isLocked = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const formatMonthDisplay = (monthStr) => {
    try {
      const [year, month] = monthStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return monthStr;
    }
  };

  const handleMonthToggle = (month) => {
    if (isLocked) return;
    
    const newSelectedMonths = selectedMonths.includes(month)
      ? selectedMonths.filter(m => m !== month)
      : [...selectedMonths, month];
    onMonthsChange(newSelectedMonths);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getButtonText = () => {
    if (selectedMonths.length === 0) {
      return 'No months selected for AI context';
    } else if (selectedMonths.length === 1) {
      return `AI Context: ${formatMonthDisplay(selectedMonths[0])}`;
    } else {
      return `AI Context: ${selectedMonths.length} months selected`;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !isLocked && setIsOpen(!isOpen)}
        disabled={isLocked}
        className={`inline-flex justify-between items-center w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none ${
          isLocked 
            ? 'cursor-not-allowed opacity-60 bg-gray-50' 
            : 'hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
        title={isLocked ? 'Context is locked for this conversation. Create a new thread to change context.' : ''}
      >
        <span className="truncate">{getButtonText()}</span>
        {isLocked ? (
          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5a2 2 0 100-4 2 2 0 000 4zM3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
          </svg>
        ) : (
          <svg
            className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && !isLocked && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <div className="p-3">
            <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Select months to include in AI context
            </div>
            <div className="space-y-2">
              {availableMonths.map((month) => (
                <label
                  key={month}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedMonths.includes(month)}
                    onChange={() => handleMonthToggle(month)}
                    className="form-checkbox h-4 w-4 text-blue-500 rounded"
                  />
                  <span className={`text-sm ${month === currentMonth ? 'font-semibold' : ''}`}>
                    {formatMonthDisplay(month)}
                    {month === currentMonth && (
                      <span className="ml-1 text-xs text-blue-600">(current)</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                {selectedMonths.length} of {availableMonths.length} months selected
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIContextSelector;