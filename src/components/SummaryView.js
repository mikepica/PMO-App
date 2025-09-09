import React, { useState } from 'react';
import MonthSelector from './MonthSelector';
import { getProjects } from '../data/index';

function SummaryView({ selectedMonth, availableMonths, onMonthChange }) {
  // Hover state for tooltip
  const [hoveredCell, setHoveredCell] = useState(null);
  // Get the overall RAG status for a project
  const getOverallStatus = (project) => {
    if (Array.isArray(project.status)) {
      // Handle array format (like dummy_project.json)
      const overallItem = project.status.find(item => 
        item.description === "Overall Status" || item.description === "Overall"
      );
      return overallItem ? overallItem.ragStatus : 'Unknown';
    } else if (project.status && project.status.overall) {
      // Handle object format (like PRJ-001.json)
      return project.status.overall;
    }
    return 'Unknown';
  };

  // Get status color based on RAG status
  const getStatusColor = (ragStatus) => {
    switch (ragStatus?.toLowerCase()) {
      case 'green':
        return 'bg-green-500 text-white';
      case 'amber':
      case 'yellow':
        return 'bg-amber-500 text-white';
      case 'red':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  // Get status text for display
  const getStatusText = (ragStatus) => {
    switch (ragStatus?.toLowerCase()) {
      case 'green':
        return 'G';
      case 'amber':
      case 'yellow':
        return 'A';
      case 'red':
        return 'R';
      default:
        return '?';
    }
  };

  // Get all projects for the current month
  const currentProjects = getProjects(selectedMonth);

  // Get high risk count for a project in a specific month
  const getHighRiskCount = (project) => {
    if (!project.risks || !Array.isArray(project.risks)) {
      return 0;
    }
    return project.risks.filter(risk => risk.rating >= 16).length;
  };

  // Check if a project has any high risks across all months
  const hasHighRisks = (projectId) => {
    for (const month of availableMonths) {
      const projectsForMonth = getProjects(month);
      const project = projectsForMonth.find(p => p.projectId === projectId);
      if (project && getHighRiskCount(project) > 0) {
        return true;
      }
    }
    return false;
  };

  // Get projects that have high risks in any month
  const highRiskProjects = currentProjects.filter(project => hasHighRisks(project.projectId));

  // Get high issue count for a project in a specific month
  const getHighIssueCount = (project) => {
    if (!project.issues || !Array.isArray(project.issues)) {
      return 0;
    }
    return project.issues.filter(issue => issue.score >= 6).length;
  };

  // Check if a project has any high issues across all months
  const hasHighIssues = (projectId) => {
    for (const month of availableMonths) {
      const projectsForMonth = getProjects(month);
      const project = projectsForMonth.find(p => p.projectId === projectId);
      if (project && getHighIssueCount(project) > 0) {
        return true;
      }
    }
    return false;
  };

  // Get projects that have high issues in any month
  const highIssueProjects = currentProjects.filter(project => hasHighIssues(project.projectId));

  // Get high risks for a specific project and month (for tooltip)
  const getHighRisks = (projectId, month) => {
    const projectsForMonth = getProjects(month);
    const project = projectsForMonth.find(p => p.projectId === projectId);
    if (!project || !project.risks || !Array.isArray(project.risks)) {
      return [];
    }
    return project.risks.filter(risk => risk.rating >= 16);
  };

  // Get high issues for a specific project and month (for tooltip)
  const getHighIssues = (projectId, month) => {
    const projectsForMonth = getProjects(month);
    const project = projectsForMonth.find(p => p.projectId === projectId);
    if (!project || !project.issues || !Array.isArray(project.issues)) {
      return [];
    }
    return project.issues.filter(issue => issue.score >= 6);
  };

  // Handle mouse events for tooltip
  const handleCellMouseEnter = (projectId, month, event, type = 'risk') => {
    setHoveredCell({ projectId, month, x: event.clientX, y: event.clientY, type });
  };

  const handleCellMouseLeave = () => {
    setHoveredCell(null);
  };

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Program Summary
            </h1>
            <p className="text-gray-600">
              Overall status view across all projects
            </p>
          </div>
          <div className="text-right">
            {availableMonths && onMonthChange && (
              <MonthSelector
                availableMonths={availableMonths}
                selectedMonth={selectedMonth}
                onMonthChange={onMonthChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Overall Program Status Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Overall Program Status</h2>
        
        <div className="w-full">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-1/2 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Project
                </th>
                {availableMonths.map((month) => {
                  const formatMonthDisplay = (monthStr) => {
                    try {
                      const [year, monthNum] = monthStr.split('-');
                      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                      return date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      });
                    } catch {
                      return monthStr;
                    }
                  };

                  return (
                    <th key={month} className={`px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b ${availableMonths.length === 3 ? 'w-1/6' : 'flex-1'}`}>
                      {formatMonthDisplay(month)}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProjects.map((project) => (
                <tr key={project.projectId} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r truncate">
                    <div className="truncate" title={project.name}>
                      {project.name}
                    </div>
                  </td>
                  {availableMonths.map((month) => {
                    const projectsForMonth = getProjects(month);
                    const projectInMonth = projectsForMonth.find(p => p.projectId === project.projectId);
                    const overallStatus = projectInMonth ? getOverallStatus(projectInMonth) : 'Unknown';
                    
                    return (
                      <td key={month} className="px-4 py-4 text-center">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded text-sm font-bold ${getStatusColor(overallStatus)}`}>
                          {getStatusText(overallStatus)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
          <span className="font-medium">Legend:</span>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Green (G)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span>Amber (A)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Red (R)</span>
          </div>
        </div>
      </div>

      {/* High Risk Count Table */}
      {highRiskProjects.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">High Risk Count (Score ≥16)</h2>
          
          <div className="w-full">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-1/2 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Project
                  </th>
                  {availableMonths.map((month) => {
                    const formatMonthDisplay = (monthStr) => {
                      try {
                        const [year, monthNum] = monthStr.split('-');
                        const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                        return date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        });
                      } catch {
                        return monthStr;
                      }
                    };

                    return (
                      <th key={month} className={`px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b ${availableMonths.length === 3 ? 'w-1/6' : 'flex-1'}`}>
                        {formatMonthDisplay(month)}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {highRiskProjects.map((project) => (
                  <tr key={project.projectId} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r truncate">
                      <div className="truncate" title={project.name}>
                        {project.name}
                      </div>
                    </td>
                    {availableMonths.map((month) => {
                      const projectsForMonth = getProjects(month);
                      const projectInMonth = projectsForMonth.find(p => p.projectId === project.projectId);
                      const highRiskCount = projectInMonth ? getHighRiskCount(projectInMonth) : 0;
                      
                      // Color coding based on count
                      const getCountColor = (count) => {
                        if (count === 0) return 'text-gray-500';
                        if (count === 1) return 'text-orange-600 font-semibold';
                        if (count === 2) return 'text-red-600 font-bold';
                        return 'text-red-800 font-bold bg-red-100 px-2 py-1 rounded';
                      };
                      
                      return (
                        <td 
                          key={month} 
                          className="px-4 py-4 text-center relative"
                          onMouseEnter={(e) => handleCellMouseEnter(project.projectId, month, e)}
                          onMouseLeave={handleCellMouseLeave}
                        >
                          <span className={getCountColor(highRiskCount)}>
                            {highRiskCount}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Note */}
          <div className="mt-4 text-sm text-gray-600">
            <span className="font-medium">Note:</span> Shows count of risks with severity score ≥16. Only projects with high risks are displayed.
          </div>
        </div>
      )}

      {/* High Issue Count Table */}
      {highIssueProjects.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">High Issue Count (Score ≥6)</h2>
          
          <div className="w-full">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-1/2 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Project
                  </th>
                  {availableMonths.map((month) => {
                    const formatMonthDisplay = (monthStr) => {
                      try {
                        const [year, monthNum] = monthStr.split('-');
                        const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                        return date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        });
                      } catch {
                        return monthStr;
                      }
                    };

                    return (
                      <th key={month} className={`px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b ${availableMonths.length === 3 ? 'w-1/6' : 'flex-1'}`}>
                        {formatMonthDisplay(month)}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {highIssueProjects.map((project) => (
                  <tr key={project.projectId} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r truncate">
                      <div className="truncate" title={project.name}>
                        {project.name}
                      </div>
                    </td>
                    {availableMonths.map((month) => {
                      const projectsForMonth = getProjects(month);
                      const projectInMonth = projectsForMonth.find(p => p.projectId === project.projectId);
                      const highIssueCount = projectInMonth ? getHighIssueCount(projectInMonth) : 0;
                      
                      // Color coding based on count
                      const getCountColor = (count) => {
                        if (count === 0) return 'text-gray-500';
                        if (count === 1) return 'text-orange-600 font-semibold';
                        if (count === 2) return 'text-red-600 font-bold';
                        return 'text-red-800 font-bold bg-red-100 px-2 py-1 rounded';
                      };
                      
                      return (
                        <td 
                          key={month} 
                          className="px-4 py-4 text-center relative"
                          onMouseEnter={(e) => handleCellMouseEnter(project.projectId, month, e, 'issue')}
                          onMouseLeave={handleCellMouseLeave}
                        >
                          <span className={getCountColor(highIssueCount)}>
                            {highIssueCount}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Note */}
          <div className="mt-4 text-sm text-gray-600">
            <span className="font-medium">Note:</span> Shows count of issues with severity score ≥6. Only projects with high issues are displayed.
          </div>
        </div>
      )}

      {/* Tooltip */}
      {hoveredCell && (
        <div 
          className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-4xl"
          style={{
            left: Math.min(hoveredCell.x + 10, window.innerWidth - 600),
            top: Math.max(hoveredCell.y - 10, 10),
            maxHeight: '400px',
            overflow: 'auto'
          }}
        >
          {(() => {
            const isIssue = hoveredCell.type === 'issue';
            const items = isIssue 
              ? getHighIssues(hoveredCell.projectId, hoveredCell.month)
              : getHighRisks(hoveredCell.projectId, hoveredCell.month);
            const project = getProjects(hoveredCell.month).find(p => p.projectId === hoveredCell.projectId);
            const projectName = project ? project.name : hoveredCell.projectId;
            
            const formatMonthDisplay = (monthStr) => {
              try {
                const [year, monthNum] = monthStr.split('-');
                const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                return date.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                });
              } catch {
                return monthStr;
              }
            };

            return (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-2">
                  {isIssue ? 'High Issue Items' : 'High Risk Items'} - {projectName} ({formatMonthDisplay(hoveredCell.month)})
                </h3>
                
                {items.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    {isIssue ? 'No high issues (≥6) for this period' : 'No high risks (≥16) for this period'}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">Description</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-700 uppercase tracking-wider">
                            {isIssue ? 'Score' : 'Rating'}
                          </th>
                          {!isIssue && (
                            <th className="px-3 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">Owner(s)</th>
                          )}
                          <th className="px-3 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">Mitigation</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">Escalation</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item, index) => (
                          <tr key={item.id || index} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-900 max-w-xs">
                              <div className="line-clamp-3" title={item.description}>
                                {item.description}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {isIssue ? item.score : item.rating}
                              </span>
                            </td>
                            {!isIssue && (
                              <td className="px-3 py-2 text-gray-900 max-w-xs">
                                {item.owner || 'N/A'}
                              </td>
                            )}
                            <td className="px-3 py-2 text-gray-900 max-w-xs">
                              <div className="line-clamp-2" title={item.mitigation}>
                                {item.mitigation || 'N/A'}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-gray-900 max-w-xs">
                              <div className="line-clamp-2" title={item.escalation}>
                                {item.escalation || 'N/A'}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default SummaryView;