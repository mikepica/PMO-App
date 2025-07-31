import React from 'react';

function StatusIndicators({ status }) {
  const getStatusColor = (ragStatus) => {
    switch (ragStatus?.toLowerCase()) {
      case 'green':
        return 'bg-green-600';
      case 'amber':
      case 'yellow':
        return 'bg-amber-600';
      case 'red':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
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
    <div className="flex justify-between items-center mb-4 w-full">
      {statusItems.map((item, index) => (
        <div
          key={index}
          className={`flex-1 mx-1 px-3 py-2 rounded-full text-white font-semibold text-lg text-center ${getStatusColor(item.ragStatus)}`}
        >
          {item.description}
        </div>
      ))}
    </div>
  );
}

export default StatusIndicators;