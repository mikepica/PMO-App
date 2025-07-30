import React, { useState, useEffect } from 'react';
import { programs } from './data/index';
import { API_CONFIG, getModelConfig } from './config/api';
import { loadSystemPrompt } from './config/systemPrompt';
import ReactMarkdown from 'react-markdown';
import ProjectTabs from './components/ProjectTabs';
import ProjectDetailView from './components/ProjectDetailView';
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
  const [selectedTab, setSelectedTab] = useState(programs.projects[0]?.projectId || '');
  const [contextProjects, setContextProjects] = useState(programs.projects.map(p => p.projectId));
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [modalContent, setModalContent] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [modalTitle, setModalTitle] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');

  // Load system prompt on component mount
  useEffect(() => {
    loadSystemPrompt().then(prompt => {
      setSystemPrompt(prompt);
    });
  }, []);

  const handleTabSelect = (projectId) => {
    setSelectedTab(projectId);
  };

  const handleContextToggle = (projectId) => {
    setContextProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || contextProjects.length === 0) return;

    // Add user message to chat thread
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get context projects data
      const contextData = contextProjects.map(projectId => 
        programs.projects.find(p => p.projectId === projectId)
      ).filter(Boolean);

      // Build conversation messages including history
      const conversationMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        {
          role: 'user',
          content: `Project Context: ${JSON.stringify(contextData)}\n\nUser Query: ${currentInput}`
        }
      ];

      const response = await fetch(API_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Program Management Assistant'
        },
        body: JSON.stringify({
          model: getModelConfig('gpt-4', 0.4).model,
          temperature: getModelConfig('gpt-4', 0.4).temperature,
          messages: conversationMessages
        })
      });

      const data = await response.json();
      const assistantMessage = {
        id: Date.now() + 1,
        text: data.choices[0].message.content,
        sender: 'assistant'
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Error processing request. Please try again.',
        sender: 'assistant'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  const selectedProject = programs.projects.find(p => p.projectId === selectedTab);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-8 py-4">
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
        </div>
        {/* Project Tabs */}
        <div className="px-4 md:px-8 pb-2 border-b border-gray-200 overflow-hidden">
          <ProjectTabs
            projects={programs.projects}
            selectedTab={selectedTab}
            onTabSelect={handleTabSelect}
            contextProjects={contextProjects}
            onContextToggle={handleContextToggle}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left side - Project Detail View */}
        <div className={`transition-all duration-300 ${showChat ? 'w-2/3' : 'w-full'} p-4 overflow-y-auto bg-gray-50`}>
          <ProjectDetailView project={selectedProject} />
        </div>

        {/* Right side - Chat interface */}
        {showChat && (
          <div className="w-1/3 bg-white p-4 flex flex-col h-full min-h-0 transition-all duration-300">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Assistant</h3>
              <div className="text-sm text-gray-600">
                Context: {contextProjects.length} projects selected
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {messages.length === 0 && (
                <div className="text-gray-500 text-sm italic p-4 text-center">
                  Start a conversation about your projects...
                </div>
              )}
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`mb-3 p-3 rounded-lg max-w-[85%] ${
                    message.sender === 'user'
                      ? 'bg-blue-100 ml-auto text-right'
                      : 'bg-gray-100'
                  }`}
                >
                  {message.sender === 'assistant' ? (
                    <div className="markdown-content text-sm">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-sm">{message.text}</div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="bg-gray-100 p-3 rounded-lg max-w-[85%] animate-pulse">
                  <div className="text-sm text-gray-500">Thinking...</div>
                </div>
              )}
            </div>
            <div className="border-t pt-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask about your projects..."
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  className={`px-4 py-3 rounded-lg text-white font-medium ${
                    isLoading || !inputMessage.trim() || contextProjects.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } transition-colors`}
                  disabled={isLoading || !inputMessage.trim() || contextProjects.length === 0}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
              {contextProjects.length === 0 && (
                <div className="text-xs text-amber-600 mt-2">
                  Select projects using the checkboxes in the tabs above to enable chat.
                </div>
              )}
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