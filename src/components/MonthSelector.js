import React from 'react';

function MonthSelector({ availableMonths, selectedMonth, onMonthChange, className = "" }) {
  const formatMonthDisplay = (monthStr) => {
    try {
      const [year, month] = monthStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
    } catch {
      return monthStr;
    }
  };

  return (
    <div className={`inline-block ${className}`}>
      <select
        value={selectedMonth}
        onChange={(e) => onMonthChange(e.target.value)}
        className="text-sm font-semibold bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
      >
        {availableMonths.map((month) => (
          <option key={month} value={month}>
            Report For: {formatMonthDisplay(month)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default MonthSelector;