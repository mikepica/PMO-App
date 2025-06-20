import React, { useState, useRef, useEffect } from 'react';
import { programs } from './data/index';
import { defaultPortfolioPrompt } from './config/systemPrompts';
import defaultProgramPrompt from './config/systemPrompts/program/defaultProgram';
import { API_CONFIG, getModelConfig } from './config/api';
import ReactMarkdown from 'react-markdown';
import SystemPromptSelector from './components/SystemPromptSelector';
import Modal from './components/Modal';

// Simple SVG icons for demonstration
const icons = {
  program: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" /><path d="M8 8h8M8 12h8M8 16h4" stroke="currentColor" /></svg>
  ),
  info: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" /><path d="M12 16v-4M12 8h.01" stroke="currentColor" /></svg>
  ),
  chat: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" /></svg>
  ),
};

function App() {
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [responses, setResponses] = useState({});
  const [latestQueryResponses, setLatestQueryResponses] = useState({});
  const [portfolioResponse, setPortfolioResponse] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showPortfolio, setShowPortfolio] = useState(true);
  const [showMoreExpanded, setShowMoreExpanded] = useState(false);
  const [hasUserSubmitted, setHasUserSubmitted] = useState(false);
  const dropdownRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [portfolioExpanded, setPortfolioExpanded] = useState(false);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleProgramToggle = (programId) => {
    if (programId === 'PORTFOLIO') {
      setShowPortfolio(prev => {
        if (!prev) setSelectedPrograms([]);
        return !prev;
      });
      return;
    }
    setSelectedPrograms(prev => {
      const newSelected = prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId];
      if (newSelected.length > 0) setShowPortfolio(false);
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    setSelectedPrograms(programs.projects.map(p => p.projectId));
    setShowPortfolio(false);
  };

  const handleDeselectAll = () => {
    setSelectedPrograms([]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || (!showPortfolio && selectedPrograms.length === 0)) return;

    // Set hasUserSubmitted to true on first submission
    setHasUserSubmitted(true);

    // Clear previous latest query responses
    setLatestQueryResponses({});

    // Add user message to chat thread
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        text: inputMessage,
        sender: 'user'
      }
    ]);

    setInputMessage('');

    setIsLoading(true);
    const newResponses = {};

    try {
      const promises = [];
      
      // Add portfolio promise if portfolio is selected
      if (showPortfolio) {
        promises.push(
          fetch(API_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${API_CONFIG.apiKey}`,
              'HTTP-Referer': window.location.origin,
              'X-Title': 'Program Management Assistant'
            },
            body: JSON.stringify({
              model: getModelConfig(defaultPortfolioPrompt.model, defaultPortfolioPrompt.temperature).model,
              temperature: getModelConfig(defaultPortfolioPrompt.model, defaultPortfolioPrompt.temperature).temperature,
              messages: [
                { role: 'system', content: defaultPortfolioPrompt.content },
                {
                  role: 'user',
                  content: `Portfolio Context: ${JSON.stringify(programs)}\n\nUser Query: ${inputMessage}`
                }
              ]
            })
          }).then(response => response.json())
            .then(data => ({ type: 'portfolio', content: data.choices[0].message.content }))
        );
      }

      // Add individual program promises
      selectedPrograms.forEach(programId => {
        const program = programs.projects.find(p => p.projectId === programId);
        promises.push(
          fetch(API_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${API_CONFIG.apiKey}`,
              'HTTP-Referer': window.location.origin,
              'X-Title': 'Program Management Assistant'
            },
            body: JSON.stringify({
              model: getModelConfig(defaultProgramPrompt.model, defaultProgramPrompt.temperature).model,
              temperature: getModelConfig(defaultProgramPrompt.model, defaultProgramPrompt.temperature).temperature,
              messages: [
                { role: 'system', content: defaultProgramPrompt.content },
                {
                  role: 'user',
                  content: `Program Context: ${JSON.stringify(program)}\n\nUser Query: ${inputMessage}`
                }
              ]
            })
          }).then(response => response.json())
            .then(data => ({ type: 'program', programId, content: data.choices[0].message.content }))
        );
      });

      const results = await Promise.all(promises);
      
      results.forEach(result => {
        if (result.type === 'portfolio') {
          setPortfolioResponse(result.content);
        } else {
          newResponses[result.programId] = result.content;
          // Add to latest query responses
          setLatestQueryResponses(prev => ({
            ...prev,
            [result.programId]: result.content
          }));
        }
      });
    } catch (error) {
      console.error('Error fetching responses:', error);
      selectedPrograms.forEach(programId => {
        newResponses[programId] = 'Error processing request. Please try again.';
      });
      if (showPortfolio) {
        setPortfolioResponse('Error processing portfolio request. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setResponses(prev => ({
        ...prev,
        ...newResponses
      }));
    }
  };

  // Handler for predefined prompt submissions
  const handlePredefinedPromptSubmit = async (data) => {
    setIsLoading(true);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        text: `Predefined Prompt: ${data.prompt.name}`,
        sender: 'user'
      }
    ]);

    // Clear previous latest query responses
    setLatestQueryResponses({});

    const newResponses = {};
    const newLatestQueryResponses = {};
    try {
      const promises = [];
      if (data.context === 'portfolio') {
        promises.push(
          fetch(API_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${API_CONFIG.apiKey}`,
              'HTTP-Referer': window.location.origin,
              'X-Title': 'Program Management Assistant'
            },
            body: JSON.stringify({
              model: getModelConfig(data.prompt.model, data.prompt.temperature).model,
              temperature: getModelConfig(data.prompt.model, data.prompt.temperature).temperature,
              messages: [
                { role: 'system', content: data.prompt.content },
                {
                  role: 'user',
                  content: `Portfolio Context: ${JSON.stringify(programs.projects)}\n\nUser Query: `
                }
              ]
            })
          }).then(response => response.json())
            .then(result => ({ type: 'portfolio', content: result.choices[0].message.content }))
        );
      } else if (data.context === 'program' && data.selectedPrograms) {
        // Multi-program support
        data.selectedPrograms.forEach(programId => {
          const program = programs.projects.find(p => p.projectId === programId);
          promises.push(
            fetch(API_CONFIG.apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Program Management Assistant'
              },
              body: JSON.stringify({
                model: getModelConfig(data.prompt.model, data.prompt.temperature).model,
                temperature: getModelConfig(data.prompt.model, data.prompt.temperature).temperature,
                messages: [
                  { role: 'system', content: data.prompt.content },
                  {
                    role: 'user',
                    content: `Program Context: ${JSON.stringify(program)}\n\nUser Query: `
                  }
                ]
              })
            }).then(response => response.json())
              .then(result => ({ type: 'program', programId, content: result.choices[0].message.content }))
          );
        });
      }
      const results = await Promise.all(promises);
      results.forEach(result => {
        if (result.type === 'portfolio') {
          setPortfolioResponse(result.content);
          // Portfolio is the only top section if present
          setLatestQueryResponses({});
        } else {
          newResponses[result.programId] = result.content;
          newLatestQueryResponses[result.programId] = result.content;
        }
      });
      // If portfolio, only show portfolio at top
      if (results.some(r => r.type === 'portfolio')) {
        setLatestQueryResponses({});
      } else {
        setLatestQueryResponses(newLatestQueryResponses);
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
      if (data.context === 'program' && data.selectedPrograms) {
        data.selectedPrograms.forEach(programId => {
          newResponses[programId] = 'Error processing request. Please try again.';
        });
      }
      if (data.context === 'portfolio') {
        setPortfolioResponse('Error processing portfolio request. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setResponses(prev => ({
        ...prev,
        ...newResponses
      }));
      setHasUserSubmitted(true);
    }
  };

  const filteredProjects = programs.projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Begin overflow logic ---
  const [isOverflowing, setIsOverflowing] = useState({});
  const contentRefs = useRef({});

  useEffect(() => {
    filteredProjects.forEach((proj) => {
      if (contentRefs.current[proj.projectId]) {
        const el = contentRefs.current[proj.projectId];
        setIsOverflowing(prev => ({
          ...prev,
          [proj.projectId]: el.scrollHeight > el.clientHeight
        }));
      }
    });
    // eslint-disable-next-line
  }, [responses, filteredProjects]);
  // --- End overflow logic ---

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b">
        <div className="flex items-center space-x-4">
          <img src="/ndp-logo.png" alt="NDP Logo" className="h-14 w-auto mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Non-Drug Portfolio Dashboard</h1>
        </div>
        <div className="flex space-x-6">
          <button
            className={`flex flex-col items-center focus:outline-none ${showChat ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            onClick={() => setShowChat((v) => !v)}
          >
            {icons.chat}
            <span className="text-xs mt-1">AI Chat</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left side - Program boxes */}
        <div className={`transition-all duration-300 ${showChat ? 'w-2/3' : 'w-full'} p-4 space-y-4 overflow-y-auto`}>
          {/* Portfolio Overview always at the top */}
          <div className="bg-white p-4 rounded-lg shadow mb-4 portfolio-overview">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold">Portfolio Overview</h3>
                <div className="text-sm text-gray-500">Combined Analysis</div>
              </div>
              {portfolioResponse && (
                <button
                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                  onClick={() => navigator.clipboard.writeText(portfolioResponse)}
                >
                  Copy
                </button>
              )}
            </div>
            {isLoading && showPortfolio ? (
              <div className="mt-2 p-2 bg-gray-50 rounded animate-pulse">
                Processing...
              </div>
            ) : portfolioResponse ? (
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <div className="markdown-content">
                  <ReactMarkdown>
                    {portfolioExpanded || portfolioResponse.length < 600
                      ? portfolioResponse
                      : portfolioResponse.slice(0, 600) + '...'}
                  </ReactMarkdown>
                </div>
                {portfolioResponse.length >= 600 && (
                  <button
                    className="mt-2 text-blue-600 underline text-sm"
                    onClick={() => setPortfolioExpanded(v => !v)}
                  >
                    {portfolioExpanded ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            ) : null}
          </div>
          {/* End Portfolio Overview always at the top */}

          {/* Program boxes grid, including expand/collapse logic */}
          <div className="grid grid-cols-2 gap-4">
            {/* If user hasn't submitted yet, show all boxes */}
            {!hasUserSubmitted ? (
              filteredProjects.map(project => (
                <div
                  key={project.projectId}
                  className="bg-white p-4 rounded-lg shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <div className="text-sm text-gray-500">{project.projectId}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-sm ${
                      project.status.overall === 'On-track' ? 'bg-green-100 text-green-800' :
                      project.status.overall === 'At-risk' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {project.status.overall}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{project.purpose}</div>
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Progress: {project.status.percentComplete}%</span>
                    <span>Phase: {project.status.phase}</span>
                  </div>
                  {isLoading && selectedPrograms.includes(project.projectId) ? (
                    <div className="mt-2 p-2 bg-gray-50 rounded animate-pulse">
                      Processing...
                    </div>
                  ) : responses[project.projectId] ? (
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <div
                        className="markdown-content max-h-40 overflow-hidden"
                        ref={el => (contentRefs.current[project.projectId] = el)}
                        style={{ position: 'relative' }}
                      >
                        <ReactMarkdown>{responses[project.projectId]}</ReactMarkdown>
                      </div>
                      {isOverflowing[project.projectId] && (
                        <button
                          className="mt-2 text-blue-600 underline text-sm"
                          onClick={() => {
                            setModalTitle(project.name);
                            setModalContent(responses[project.projectId]);
                            setModalOpen(true);
                          }}
                        >
                          Read More
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <>
                {/* Top section: boxes with responses from latest query */}
                {filteredProjects
                  .filter(project => latestQueryResponses[project.projectId])
                  .map(project => {
                    const response = latestQueryResponses[project.projectId];
                    return (
                      <div
                        key={project.projectId}
                        className="bg-white p-4 rounded-lg shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold">{project.name}</h3>
                            <div className="text-sm text-gray-500">{project.projectId}</div>
                          </div>
                          <div className={`px-2 py-1 rounded text-sm ${
                            project.status.overall === 'On-track' ? 'bg-green-100 text-green-800' :
                            project.status.overall === 'At-risk' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {project.status.overall}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{project.purpose}</div>
                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                          <span>Progress: {project.status.percentComplete}%</span>
                          <span>Phase: {project.status.phase}</span>
                        </div>
                        {isLoading && selectedPrograms.includes(project.projectId) ? (
                          <div className="mt-2 p-2 bg-gray-50 rounded animate-pulse">
                            Processing...
                          </div>
                        ) : response ? (
                          <div className="mt-2 p-2 bg-gray-50 rounded">
                            <div
                              className="markdown-content max-h-40 overflow-hidden"
                              ref={el => (contentRefs.current[project.projectId] = el)}
                              style={{ position: 'relative' }}
                            >
                              <ReactMarkdown>{response}</ReactMarkdown>
                            </div>
                            {isOverflowing[project.projectId] && (
                              <button
                                className="mt-2 text-blue-600 underline text-sm"
                                onClick={() => {
                                  setModalTitle(project.name);
                                  setModalContent(response);
                                  setModalOpen(true);
                                }}
                              >
                                Read More
                              </button>
                            )}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                {/* Dividing line */}
                <div className="col-span-2 border-t border-gray-200 my-4"></div>
                {/* Show More button */}
                <div className="col-span-2 flex justify-center mb-4">
                  <button
                    onClick={() => setShowMoreExpanded(!showMoreExpanded)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                  >
                    <span>{showMoreExpanded ? 'Show Less' : 'Show More'}</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${showMoreExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {/* Expand/collapse section: all other boxes */}
                {showMoreExpanded && filteredProjects
                  .filter(project => !latestQueryResponses[project.projectId])
                  .map(project => (
                    <div
                      key={project.projectId}
                      className="bg-white p-4 rounded-lg shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{project.name}</h3>
                          <div className="text-sm text-gray-500">{project.projectId}</div>
                        </div>
                        <div className={`px-2 py-1 rounded text-sm ${
                          project.status.overall === 'On-track' ? 'bg-green-100 text-green-800' :
                          project.status.overall === 'At-risk' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {project.status.overall}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{project.purpose}</div>
                      <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Progress: {project.status.percentComplete}%</span>
                        <span>Phase: {project.status.phase}</span>
                      </div>
                      {responses[project.projectId] && (
                        <div className="mt-2 p-2 bg-gray-50 rounded">
                          <div
                            className="markdown-content max-h-40 overflow-hidden"
                            ref={el => (contentRefs.current[project.projectId] = el)}
                            style={{ position: 'relative' }}
                          >
                            <ReactMarkdown>{responses[project.projectId]}</ReactMarkdown>
                          </div>
                          {isOverflowing[project.projectId] && (
                            <button
                              className="mt-2 text-blue-600 underline text-sm"
                              onClick={() => {
                                setModalTitle(project.name);
                                setModalContent(responses[project.projectId]);
                                setModalOpen(true);
                              }}
                            >
                              Read More
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>

        {/* Right side - Chat interface */}
        {showChat && (
          <div className="w-1/3 bg-white p-4 flex flex-col h-full min-h-0 transition-all duration-300">
            <div className="flex-1 min-h-0 overflow-y-auto">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`mb-2 p-2 rounded max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-blue-100 ml-auto'
                      : 'bg-gray-100'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {/* Button Row: Program Selection + Workflow Buttons */}
              <div className="flex flex-wrap gap-2 mb-2">
                <div className="relative">
                  <button
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    onClick={() => setDropdownOpen((open) => !open)}
                  >
                    Context Selection
                  </button>
                  {dropdownOpen && (
                    <div className="absolute left-0 bottom-full mb-2 w-80 bg-white border rounded shadow-lg z-50 p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">Context Selection</span>
                        <button onClick={() => setDropdownOpen(false)} className="text-gray-400 hover:text-gray-700 text-lg">×</button>
                      </div>
                      <div className="flex space-x-2 mb-2">
                        <button
                          onClick={handleSelectAll}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                        >
                          Select All
                        </button>
                        <button
                          onClick={handleDeselectAll}
                          className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                        >
                          Deselect All
                        </button>
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="flex-1 p-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-1">
                        {/* Portfolio Option */}
                        <label className="flex items-center space-x-2 p-1 rounded hover:bg-gray-50 cursor-pointer border-b pb-2 mb-2">
                          <input
                            type="checkbox"
                            checked={showPortfolio}
                            onChange={() => handleProgramToggle('PORTFOLIO')}
                            className="form-checkbox h-4 w-4 text-blue-500"
                            disabled={selectedPrograms.length > 0}
                          />
                          <span className="flex-1 text-sm font-semibold">Portfolio Overview</span>
                        </label>
                        {filteredProjects.map(project => (
                          <label key={project.projectId} className="flex items-center space-x-2 p-1 rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedPrograms.includes(project.projectId)}
                              onChange={() => handleProgramToggle(project.projectId)}
                              className="form-checkbox h-4 w-4 text-blue-500"
                              disabled={showPortfolio}
                            />
                            <span className="flex-1 text-sm">{project.name}</span>
                            <span className="text-xs text-gray-400">{project.projectId}</span>
                          </label>
                        ))}
                        {filteredProjects.length === 0 && (
                          <div className="text-xs text-gray-400 p-2">No projects found.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <SystemPromptSelector onPromptSubmit={handlePredefinedPromptSubmit} />
              </div>
              {/* Chat input row remains unchanged */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  className={`px-4 py-2 rounded text-white ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } transition-colors`}
                  disabled={isLoading || !inputMessage.trim() || (!showPortfolio && selectedPrograms.length === 0)}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        showCopy={true}
        copyContent={modalContent}
      >
        <div className="markdown-content">
          <ReactMarkdown>{modalContent}</ReactMarkdown>
        </div>
      </Modal>
    </div>
  );
}

export default App; 