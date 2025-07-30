import React from 'react';

function StatusIndicators({ status }) {
  const getStatusColor = (ragStatus) => {
    switch (ragStatus?.toLowerCase()) {
      case 'green':
        return 'bg-green-500';
      case 'amber':
      case 'yellow':
        return 'bg-yellow-500';
      case 'red':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusTextColor = (ragStatus) => {
    switch (ragStatus?.toLowerCase()) {
      case 'green':
        return 'text-green-800';
      case 'amber':
      case 'yellow':
        return 'text-yellow-800';
      case 'red':
        return 'text-red-800';
      default:
        return 'text-gray-800';
    }
  };

  // Handle both array format (from dummy_project.json) and object format (from other projects)
  const statusItems = Array.isArray(status) 
    ? status 
    : [
        { description: 'Overall', ragStatus: status?.overall },
        { description: 'Resources', ragStatus: status?.resources },
        { description: 'Scope', ragStatus: status?.scope },
        { description: 'Risk/Issues', ragStatus: status?.riskIssues },
        { description: 'Spend', ragStatus: status?.spend },
        { description: 'Business Readiness', ragStatus: status?.businessReadiness },
        { description: 'Benefits', ragStatus: status?.benefits }
      ].filter(item => item.ragStatus);

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {statusItems.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            {item.description}:
          </span>
          <div className="flex items-center space-x-1">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(item.ragStatus)}`}></div>
            <span className={`text-sm font-semibold ${getStatusTextColor(item.ragStatus)}`}>
              {item.ragStatus?.charAt(0).toUpperCase() + item.ragStatus?.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatusIndicators;