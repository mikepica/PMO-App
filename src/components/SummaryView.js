import React, { useState, useRef, useEffect } from 'react';
import { getProjects, getAvailableMonths } from '../data/index';

function SummaryView({ selectedMonth }) {
  // Hover state for tooltip
  const [hoveredCell, setHoveredCell] = useState(null);
  const [tooltipDimensions, setTooltipDimensions] = useState({ width: 0, height: 0 });
  const tooltipRef = useRef(null);

  // Measure tooltip dimensions when it's rendered
  useEffect(() => {
    if (hoveredCell && tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      setTooltipDimensions({ width: rect.width, height: rect.height });
    }
  }, [hoveredCell]);

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
  
  // Get available months and filter to last 6 months
  const getLastSixMonths = () => {
    const allMonths = getAvailableMonths();
    // Sort months chronologically (oldest to newest)
    const sortedMonths = [...allMonths].sort();
    // Take the last 6 months (or all if fewer than 6)
    return sortedMonths.slice(-6);
  };

  const displayMonths = getLastSixMonths();
  
  // Get all unique projects across all months
  const getAllUniqueProjects = () => {
    const uniqueProjectsMap = new Map();
    
    for (const month of displayMonths) {
      const projectsForMonth = getProjects(month);
      projectsForMonth.forEach(project => {
        if (!uniqueProjectsMap.has(project.projectId)) {
          uniqueProjectsMap.set(project.projectId, project);
        }
      });
    }
    
    return Array.from(uniqueProjectsMap.values());
  };
  
  const allUniqueProjects = getAllUniqueProjects();

  // Get high risk count for a project in a specific month
  const getHighRiskCount = (project) => {
    if (!project.risks || !Array.isArray(project.risks)) {
      return 0;
    }
    return project.risks.filter(risk => risk.rating >= 16).length;
  };

  // Check if a project has any high risks across all months
  const hasHighRisks = (projectId) => {
    for (const month of displayMonths) {
      const projectsForMonth = getProjects(month);
      const project = projectsForMonth.find(p => p.projectId === projectId);
      if (project && getHighRiskCount(project) > 0) {
        return true;
      }
    }
    return false;
  };

  // Get projects that have high risks in any month
  const highRiskProjects = allUniqueProjects.filter(project => hasHighRisks(project.projectId));

  // Get high issue count for a project in a specific month
  const getHighIssueCount = (project) => {
    if (!project.issues || !Array.isArray(project.issues)) {
      return 0;
    }
    return project.issues.filter(issue => issue.rating >= 6).length;
  };

  // Check if a project has any high issues across all months
  const hasHighIssues = (projectId) => {
    for (const month of displayMonths) {
      const projectsForMonth = getProjects(month);
      const project = projectsForMonth.find(p => p.projectId === projectId);
      if (project && getHighIssueCount(project) > 0) {
        return true;
      }
    }
    return false;
  };

  // Get projects that have high issues in any month
  const highIssueProjects = allUniqueProjects.filter(project => hasHighIssues(project.projectId));

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
    return project.issues.filter(issue => issue.rating >= 6);
  };

  // Movement calculation helper functions
  const getStatusRank = (ragStatus) => {
    switch (ragStatus?.toLowerCase()) {
      case 'blue':
        return 4; // Highest/best
      case 'green':
        return 3;
      case 'amber':
      case 'yellow':
        return 2;
      case 'red':
        return 1; // Lowest/worst
      default:
        return 0; // Unknown
    }
  };

  const getStatusMovement = (currentStatus, previousStatus) => {
    const currentRank = getStatusRank(currentStatus);
    const previousRank = getStatusRank(previousStatus);

    if (currentRank > previousRank) {
      return { direction: 'up', symbol: '↑', color: 'text-green-600' };
    } else if (currentRank < previousRank) {
      return { direction: 'down', symbol: '↓', color: 'text-red-600' };
    } else {
      return { direction: 'same', symbol: '↔', color: 'text-gray-500' };
    }
  };

  const getCountMovement = (currentCount, previousCount) => {
    if (currentCount > previousCount) {
      return { direction: 'up', symbol: '↑', color: 'text-red-600' }; // More issues/risks = bad
    } else if (currentCount < previousCount) {
      return { direction: 'down', symbol: '↓', color: 'text-green-600' }; // Fewer issues/risks = good
    } else {
      return { direction: 'same', symbol: '↔', color: 'text-gray-500' };
    }
  };

  const getMovementForProject = (projectId, currentMonth, previousMonth, type = 'status') => {
    const currentProjects = getProjects(currentMonth);
    const previousProjects = getProjects(previousMonth);

    const currentProject = currentProjects.find(p => p.projectId === projectId);
    const previousProject = previousProjects.find(p => p.projectId === projectId);

    if (!currentProject || !previousProject) {
      return null; // No movement data available
    }

    if (type === 'status') {
      const currentStatus = getOverallStatus(currentProject);
      const previousStatus = getOverallStatus(previousProject);
      return getStatusMovement(currentStatus, previousStatus);
    } else if (type === 'risk') {
      const currentCount = getHighRiskCount(currentProject);
      const previousCount = getHighRiskCount(previousProject);
      return getCountMovement(currentCount, previousCount);
    } else if (type === 'issue') {
      const currentCount = getHighIssueCount(currentProject);
      const previousCount = getHighIssueCount(previousProject);
      return getCountMovement(currentCount, previousCount);
    }

    return null;
  };

  // Handle mouse events for tooltip
  const handleCellMouseEnter = (projectId, month, event, type = 'risk') => {
    const targetRect = event.currentTarget.getBoundingClientRect();
    setHoveredCell({ 
      projectId, 
      month, 
      x: event.clientX, 
      y: event.clientY,
      targetRect,
      type 
    });
  };

  // Calculate optimal tooltip position based on actual dimensions and cell position
  const calculateTooltipPosition = () => {
    if (!hoveredCell || !hoveredCell.targetRect) return { left: 0, top: 0 };
    
    // Use actual tooltip dimensions if available, otherwise use estimates for larger tooltips
    const tooltipWidth = tooltipDimensions.width || 800; // Fallback to larger estimate
    const tooltipHeight = tooltipDimensions.height || 500; // Fallback to larger estimate
    const margin = 15; // safe margin from edges
    const offset = 8; // small offset from cell
    
    const { targetRect } = hoveredCell;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Start with preferred position: to the right and slightly below the cell
    let left = targetRect.right + offset;
    let top = targetRect.top;
    
    // Check if tooltip goes off right edge
    if (left + tooltipWidth > viewportWidth - margin) {
      // Try left side of the cell
      left = targetRect.left - tooltipWidth - offset;
      
      // If still off-screen, position it within viewport but close to cell
      if (left < margin) {
        left = Math.min(margin, targetRect.left);
      }
    }
    
    // Check vertical position - keep it near the cell
    if (top + tooltipHeight > viewportHeight - margin) {
      // Position above the cell
      top = targetRect.bottom - tooltipHeight;
      
      // If still off-screen, position at bottom with margin
      if (top < margin) {
        top = viewportHeight - tooltipHeight - margin;
      }
    }
    
    // Final bounds check
    left = Math.min(Math.max(margin, left), viewportWidth - tooltipWidth - margin);
    top = Math.min(Math.max(margin, top), viewportHeight - tooltipHeight - margin);
    
    return { left, top };
  };

  const handleCellMouseLeave = () => {
    setHoveredCell(null);
  };

  return (
    <div className="space-y-6">
      {/* Overall Program Status Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Overall Program Status</h2>
        
        <div className="w-full">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-2/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Project
                </th>
                {displayMonths.map((month) => {
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
                    <th key={month} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      {formatMonthDisplay(month)}
                    </th>
                  );
                })}
                <th className="w-1/6 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  2-Month Movement
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProjects.map((project) => {
                // Calculate movement for most recent two months
                const currentMonth = displayMonths[displayMonths.length - 1];
                const previousMonth = displayMonths[displayMonths.length - 2];
                const movement = previousMonth ? getMovementForProject(project.projectId, currentMonth, previousMonth, 'status') : null;

                return (
                  <tr key={project.projectId} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r truncate">
                      <div className="truncate" title={project.name}>
                        {project.name}
                      </div>
                    </td>
                    {displayMonths.map((month) => {
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
                    <td className="px-4 py-4 text-center">
                      {movement ? (
                        <span
                          className={`text-lg font-bold ${movement.color} cursor-help`}
                          onMouseEnter={(e) => {
                            // Get project data from the current month where movement analysis is stored
                            const currentMonthProjects = getProjects(currentMonth);
                            const projectWithAnalysis = currentMonthProjects.find(p => p.projectId === project.projectId);
                            const explanation = projectWithAnalysis?.movementAnalysis?.movements?.status?.explanation;
                            if (explanation) {
                              handleCellMouseEnter(project.projectId, currentMonth, e, 'status-movement');
                            }
                          }}
                          onMouseLeave={handleCellMouseLeave}
                          title={(() => {
                            const currentMonthProjects = getProjects(currentMonth);
                            const projectWithAnalysis = currentMonthProjects.find(p => p.projectId === project.projectId);
                            return projectWithAnalysis?.movementAnalysis?.movements?.status?.explanation || `Status ${movement.direction === 'up' ? 'improved' : movement.direction === 'down' ? 'declined' : 'unchanged'} from previous month`;
                          })()}
                        >
                          {movement.symbol}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
                  <th className="w-2/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Project
                  </th>
                  {displayMonths.map((month) => {
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
                      <th key={month} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        {formatMonthDisplay(month)}
                      </th>
                    );
                  })}
                  <th className="w-1/6 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    2-Month Movement
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {highRiskProjects.map((project) => {
                  // Calculate movement for most recent two months
                  const currentMonth = displayMonths[displayMonths.length - 1];
                  const previousMonth = displayMonths[displayMonths.length - 2];
                  const movement = previousMonth ? getMovementForProject(project.projectId, currentMonth, previousMonth, 'risk') : null;

                  return (
                    <tr key={project.projectId} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r truncate">
                        <div className="truncate" title={project.name}>
                          {project.name}
                        </div>
                      </td>
                      {displayMonths.map((month) => {
                        const projectsForMonth = getProjects(month);
                        const projectInMonth = projectsForMonth.find(p => p.projectId === project.projectId);
                        const highRiskCount = projectInMonth ? getHighRiskCount(projectInMonth) : 0;


                        return (
                          <td
                            key={month}
                            className="px-4 py-4 text-center relative"
                            onMouseEnter={(e) => handleCellMouseEnter(project.projectId, month, e)}
                            onMouseLeave={handleCellMouseLeave}
                          >
                            <span className="text-black">
                              {highRiskCount}
                            </span>
                          </td>
                        );
                      })}
                      <td className="px-4 py-4 text-center">
                        {movement ? (
                          <span
                            className={`text-lg font-bold ${movement.color} cursor-help`}
                            onMouseEnter={(e) => {
                              // Get project data from the current month where movement analysis is stored
                              const currentMonthProjects = getProjects(currentMonth);
                              const projectWithAnalysis = currentMonthProjects.find(p => p.projectId === project.projectId);
                              const explanation = projectWithAnalysis?.movementAnalysis?.movements?.risk?.explanation;
                              if (explanation) {
                                handleCellMouseEnter(project.projectId, currentMonth, e, 'risk-movement');
                              }
                            }}
                            onMouseLeave={handleCellMouseLeave}
                            title={(() => {
                              const currentMonthProjects = getProjects(currentMonth);
                              const projectWithAnalysis = currentMonthProjects.find(p => p.projectId === project.projectId);
                              return projectWithAnalysis?.movementAnalysis?.movements?.risk?.explanation || `High risk count ${movement.direction === 'up' ? 'increased' : movement.direction === 'down' ? 'decreased' : 'unchanged'} from previous month`;
                            })()}
                          >
                            {movement.symbol}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
          <h2 className="text-lg font-semibold text-gray-800 mb-4">High Issue Count (Rating ≥6)</h2>

          <div className="w-full">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-2/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Project
                  </th>
                  {displayMonths.map((month) => {
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
                      <th key={month} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        {formatMonthDisplay(month)}
                      </th>
                    );
                  })}
                  <th className="w-1/6 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    2-Month Movement
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {highIssueProjects.map((project) => {
                  // Calculate movement for most recent two months
                  const currentMonth = displayMonths[displayMonths.length - 1];
                  const previousMonth = displayMonths[displayMonths.length - 2];
                  const movement = previousMonth ? getMovementForProject(project.projectId, currentMonth, previousMonth, 'issue') : null;

                  return (
                    <tr key={project.projectId} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r truncate">
                        <div className="truncate" title={project.name}>
                          {project.name}
                        </div>
                      </td>
                      {displayMonths.map((month) => {
                        const projectsForMonth = getProjects(month);
                        const projectInMonth = projectsForMonth.find(p => p.projectId === project.projectId);
                        const highIssueCount = projectInMonth ? getHighIssueCount(projectInMonth) : 0;


                        return (
                          <td
                            key={month}
                            className="px-4 py-4 text-center relative"
                            onMouseEnter={(e) => handleCellMouseEnter(project.projectId, month, e, 'issue')}
                            onMouseLeave={handleCellMouseLeave}
                          >
                            <span className="text-black">
                              {highIssueCount}
                            </span>
                          </td>
                        );
                      })}
                      <td className="px-4 py-4 text-center">
                        {movement ? (
                          <span
                            className={`text-lg font-bold ${movement.color} cursor-help`}
                            onMouseEnter={(e) => {
                              // Get project data from the current month where movement analysis is stored
                              const currentMonthProjects = getProjects(currentMonth);
                              const projectWithAnalysis = currentMonthProjects.find(p => p.projectId === project.projectId);
                              const explanation = projectWithAnalysis?.movementAnalysis?.movements?.issue?.explanation;
                              if (explanation) {
                                handleCellMouseEnter(project.projectId, currentMonth, e, 'issue-movement');
                              }
                            }}
                            onMouseLeave={handleCellMouseLeave}
                            title={(() => {
                              const currentMonthProjects = getProjects(currentMonth);
                              const projectWithAnalysis = currentMonthProjects.find(p => p.projectId === project.projectId);
                              return projectWithAnalysis?.movementAnalysis?.movements?.issue?.explanation || `High issue count ${movement.direction === 'up' ? 'increased' : movement.direction === 'down' ? 'decreased' : 'unchanged'} from previous month`;
                            })()}
                          >
                            {movement.symbol}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Note */}
          <div className="mt-4 text-sm text-gray-600">
            <span className="font-medium">Note:</span> Shows count of issues with severity rating ≥6. Only projects with high issues are displayed.
          </div>
        </div>
      )}

      {/* Tooltip */}
      {hoveredCell && (
        <div 
          ref={tooltipRef}
          className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-4xl"
          style={{
            ...calculateTooltipPosition()
          }}
        >
          {(() => {
            const isMovementTooltip = hoveredCell.type.includes('-movement');

            if (isMovementTooltip) {
              // Handle movement explanation tooltips
              const project = getProjects(hoveredCell.month).find(p => p.projectId === hoveredCell.projectId);
              const projectName = project ? project.name : hoveredCell.projectId;


              const movementType = hoveredCell.type.replace('-movement', '');
              const explanation = project?.movementAnalysis?.movements?.[movementType]?.explanation;
              const movement = project?.movementAnalysis?.movements?.[movementType];

              return (
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-2">
                    {movementType === 'status' ? 'Status' : movementType === 'risk' ? 'Risk' : 'Issue'} Movement Analysis - {projectName}
                  </h3>

                  {explanation ? (
                    <div className="space-y-3">
                      {movement && (
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Change: </span>
                          <span className="text-gray-600">
                            {movementType === 'status'
                              ? `${movement.from} → ${movement.to}`
                              : `${movement.from} → ${movement.to} ${movementType === 'risk' ? 'high risks' : 'high issues'}`
                            }
                          </span>
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Analysis: </span>
                        <span className="text-gray-800">{explanation}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                        Generated: {new Date(project?.movementAnalysis?.analysisDate).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No movement analysis available. Run the explanation generator script to add AI insights.
                    </p>
                  )}
                </div>
              );
            }

            // Handle existing risk/issue tooltips
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
                  <div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">Description</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-700 uppercase tracking-wider">
Rating
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
                            <td className="px-3 py-2 text-gray-900">
                              <div title={item.description}>
                                {item.description}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {item.rating}
                              </span>
                            </td>
                            {!isIssue && (
                              <td className="px-3 py-2 text-gray-900">
                                {item.owner || 'N/A'}
                              </td>
                            )}
                            <td className="px-3 py-2 text-gray-900">
                              <div title={item.mitigation}>
                                {item.mitigation || 'N/A'}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-gray-900">
                              <div title={item.escalation}>
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