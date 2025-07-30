import React from 'react';

function ProjectTable({ title, columns, data, className = "" }) {
  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-500 italic">No data available</p>
      </div>
    );
  }

  // Define column-specific styles based on column names
  const getColumnClass = (column) => {
    const baseClass = "px-3 py-4 text-sm text-gray-900 break-words";
    
    switch (column) {
      case 'RAG':
        return `${baseClass} w-16 text-center`;
      case 'Score':
        return `${baseClass} w-16 text-center`;
      case 'Owner':
        return `${baseClass} w-24`;
      case 'Objective':
        return `${baseClass} w-1/4 min-w-0`;
      case 'Business Value':
        return `${baseClass} w-2/5 min-w-0`;
      case 'Comment':
        return `${baseClass} w-1/3 min-w-0`;
      case 'Escalation Point and Ask':
        return `${baseClass} w-1/5 min-w-0`;
      case 'Highlighted Risks and Issues':
        return `${baseClass} w-2/5 min-w-0`;
      case 'Mitigation':
        return `${baseClass} w-1/3 min-w-0`;
      default:
        return `${baseClass} min-w-0`;
    }
  };

  const getHeaderClass = (column) => {
    const baseClass = "px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider break-words";
    
    switch (column) {
      case 'RAG':
      case 'Score':
        return `${baseClass} w-16 text-center`;
      case 'Owner':
        return `${baseClass} w-24`;
      default:
        return `${baseClass} min-w-0`;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={getHeaderClass(column)}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => {
                  const cellKey = column.toLowerCase().replace(/[^a-z0-9]/g, '');
                  let cellValue = row[cellKey] || row[column] || '';
                  
                  // Handle special cases
                  if (column === 'RAG' && cellValue) {
                    const ragColor = cellValue.toLowerCase() === 'green' ? 'text-green-600' :
                                   cellValue.toLowerCase() === 'amber' ? 'text-yellow-600' :
                                   cellValue.toLowerCase() === 'red' ? 'text-red-600' : 'text-gray-600';
                    cellValue = (
                      <span className={`font-semibold ${ragColor}`}>
                        {cellValue}
                      </span>
                    );
                  } else if (column === 'Score' && cellValue) {
                    const scoreColor = cellValue >= 8 ? 'text-red-600' :
                                     cellValue >= 5 ? 'text-yellow-600' : 'text-green-600';
                    cellValue = (
                      <span className={`font-semibold ${scoreColor}`}>
                        {cellValue}
                      </span>
                    );
                  }

                  return (
                    <td key={colIndex} className={getColumnClass(column)}>
                      {cellValue || '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProjectTable;