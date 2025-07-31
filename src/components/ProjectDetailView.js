import React from 'react';
import StatusIndicators from './StatusIndicators';
import ProjectTable from './ProjectTable';
import MonthSelector from './MonthSelector';

function ProjectDetailView({ project, selectedMonth, availableMonths, onMonthChange }) {
  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">Select a project to view details</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not specified';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
    } catch {
      return dateStr;
    }
  };

  // Prepare scorecard deliverables data for table
  const scorecardData = project.scorecardDeliverables?.map(deliverable => ({
    objective: deliverable.description,
    businessvalue: deliverable.businessValue,
    rag: deliverable.ragStatus,
    comment: deliverable.comments || `${deliverable.percentComplete}% complete`
  })) || [];

  // Prepare risks data for table
  const risksData = project.risks?.map(risk => ({
    escalationpointandask: risk.escalationAction || 'None',
    highlightedrisksandissues: risk.description,
    score: risk.rating,
    owner: risk.owner,
    mitigation: risk.mitigation
  })) || [];

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {project.name}
            </h1>
            <p className="text-gray-600 mb-4">
              {project.purpose || project.projectGoal}
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

        {/* Timeline and Key Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
          <div>
            <span className="font-semibold">Timeline: </span>
            {formatDate(project.timeline?.start)} - {formatDate(project.timeline?.end)}
          </div>
          <div>
            <span className="font-semibold">Sponsor: </span>
            {project.owner?.sponsor || 'Not specified'}
          </div>
          <div>
            <span className="font-semibold">Project Manager: </span>
            {project.owner?.programlead || project.owner?.programManager || 'Not specified'}
          </div>
        </div>

        {/* Business Leads */}
        {project.owner?.businessLeads && (
          <div className="mb-4 text-sm">
            <span className="font-semibold">Business Lead(s): </span>
            {Array.isArray(project.owner.businessLeads) 
              ? project.owner.businessLeads.join(', ')
              : project.owner.businessLeads}
          </div>
        )}

        {/* Status Indicators */}
        <StatusIndicators status={project.status} />
      </div>

      {/* Priority Scorecard */}
      {scorecardData.length > 0 && (
        <ProjectTable
          title="Priority Scorecard Objective"
          columns={['Objective', 'Business Value', 'RAG', 'Comment']}
          data={scorecardData}
        />
      )}

      {/* Key Achievements */}
      {project.achievements && project.achievements.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Achievements</h3>
          <ul className="space-y-2">
            {project.achievements.map((achievement, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-gray-700">
                  {achievement.summary || achievement}
                  {achievement.workstream && (
                    <span className="text-gray-500 text-sm ml-2">
                      ({achievement.workstream})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Priorities / Next Steps */}
      {project.keyNextSteps && project.keyNextSteps.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Priorities</h3>
          <ul className="space-y-2">
            {project.keyNextSteps.map((step, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-gray-700">
                  {step.description || step}
                  {step.workstream && (
                    <span className="text-gray-500 text-sm ml-2">
                      ({step.workstream})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risk, Issue & Escalations */}
      {risksData.length > 0 && (
        <ProjectTable
          title="Risk, Issue & Escalations"
          columns={['Escalation Point and Ask', 'Highlighted Risks and Issues', 'Score', 'Owner', 'Mitigation']}
          data={risksData}
        />
      )}
    </div>
  );
}

export default ProjectDetailView;