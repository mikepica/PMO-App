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

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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