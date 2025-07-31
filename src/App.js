import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { programs, getProgram, getAvailableMonths, getCurrentMonth, getProjectsForMonths } from './data/index';
import { API_CONFIG, getModelConfig } from './config/api';
import { loadSystemPrompt } from './config/systemPrompt';
import ReactMarkdown from 'react-markdown';
import ProjectTabs from './components/ProjectTabs';
import ProjectDetailView from './components/ProjectDetailView';
import AIContextSelector from './components/AIContextSelector';
import ChatThreadManager from './components/ChatThreadManager';
import Modal from './components/Modal';
import { 
  initializeDefaultThread, 
  getThreadsArray, 
  getCurrentThread, 
  createThread, 
  deleteThread, 
  setCurrentThread,
  updateThreadMessages,
  updateThreadContext,
  updateThreadName 
} from './utils/threadStorage';

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

function ProjectView({ selectedMonth, onMonthChange }) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const availableMonths = getAvailableMonths();
  const selectedProject = getProgram(projectId, selectedMonth);
  
  // Redirect to first project if invalid projectId
  useEffect(() => {
    if (!selectedProject && programs.projects.length > 0) {
      navigate(`/project/${programs.projects[0].projectId}`);
    }
  }, [selectedProject, navigate]);

  if (!selectedProject) {
    return null;
  }

  return (
    <ProjectDetailView
      project={selectedProject}
      selectedMonth={selectedMonth}
      availableMonths={availableMonths}
      onMonthChange={onMonthChange}
    />
  );
}

function Layout({ children, selectedMonth: initialSelectedMonth, onMonthChange: onMonthChangeFromApp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const availableMonths = getAvailableMonths();
  const currentMonth = getCurrentMonth();
  
  // Month-related state
  const [selectedMonth, setSelectedMonth] = useState(initialSelectedMonth || currentMonth);
  const [contextMonths, setContextMonths] = useState([initialSelectedMonth || currentMonth]);

  // Thread-related state
  const [threads, setThreads] = useState([]);
  const [currentThreadId, setCurrentThreadId] = useState(null);
  
  // Chat state
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

  // Sync with parent component
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    if (onMonthChangeFromApp) {
      onMonthChangeFromApp(month);
    }
    // Save month change to current thread
    if (currentThreadId) {
      updateThreadContext(currentThreadId, contextProjects, contextMonths, month);
    }
  };

  // Extract current projectId from URL
  const currentProjectId = location.pathname.split('/').pop();

  // Load system prompt on component mount
  useEffect(() => {
    loadSystemPrompt().then(prompt => {
      setSystemPrompt(prompt);
    });
  }, []);

  // Initialize threads on component mount
  useEffect(() => {
    const loadThreads = () => {
      const allThreads = getThreadsArray();
      setThreads(allThreads);
      
      const currentThread = getCurrentThread();
      if (currentThread) {
        setCurrentThreadId(currentThread.id);
        setMessages(currentThread.messages || []);
        setContextProjects(currentThread.contextProjects || programs.projects.map(p => p.projectId));
        setContextMonths(currentThread.contextMonths || [currentMonth]);
        if (currentThread.selectedMonth) {
          setSelectedMonth(currentThread.selectedMonth);
          if (onMonthChangeFromApp) {
            onMonthChangeFromApp(currentThread.selectedMonth);
          }
        }
      } else if (allThreads.length === 0) {
        // Create initial thread if none exist
        const newThread = initializeDefaultThread();
        if (newThread) {
          setCurrentThreadId(newThread.id);
          setThreads([newThread]);
        }
      }
    };
    
    loadThreads();
  }, [currentMonth, onMonthChangeFromApp]);

  const handleTabSelect = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleContextToggle = (projectId) => {
    const newContextProjects = contextProjects.includes(projectId)
      ? contextProjects.filter(id => id !== projectId)
      : [...contextProjects, projectId];
    
    setContextProjects(newContextProjects);
    
    // Save context change to current thread
    if (currentThreadId) {
      updateThreadContext(currentThreadId, newContextProjects, contextMonths, selectedMonth);
    }
  };

  // Thread management functions
  const handleNewThread = () => {
    const newThread = createThread();
    setThreads(getThreadsArray());
    setCurrentThreadId(newThread.id);
    setMessages([]);
    // Keep current context settings for new thread
    updateThreadContext(newThread.id, contextProjects, contextMonths, selectedMonth);
  };

  const handleThreadSelect = (threadId) => {
    if (threadId === currentThreadId) return;
    
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      setCurrentThread(threadId);
      setCurrentThreadId(threadId);
      setMessages(thread.messages || []);
      setContextProjects(thread.contextProjects || programs.projects.map(p => p.projectId));
      setContextMonths(thread.contextMonths || [currentMonth]);
      
      if (thread.selectedMonth) {
        setSelectedMonth(thread.selectedMonth);
        if (onMonthChangeFromApp) {
          onMonthChangeFromApp(thread.selectedMonth);
        }
      }
    }
  };

  const handleDeleteThread = (threadId) => {
    deleteThread(threadId);
    const updatedThreads = getThreadsArray();
    setThreads(updatedThreads);
    
    if (threadId === currentThreadId) {
      if (updatedThreads.length > 0) {
        // Switch to the most recent thread
        handleThreadSelect(updatedThreads[0].id);
      } else {
        // Create new thread if none left
        handleNewThread();
      }
    }
  };

  const handleContextMonthsChange = (newContextMonths) => {
    setContextMonths(newContextMonths);
    
    // Save context change to current thread
    if (currentThreadId) {
      updateThreadContext(currentThreadId, contextProjects, newContextMonths, selectedMonth);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || contextProjects.length === 0 || contextMonths.length === 0) return;

    // Add user message to chat thread
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user'
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    // Update thread name with first message if needed
    if (currentThreadId && messages.length === 0) {
      updateThreadName(currentThreadId, currentInput);
      setThreads(getThreadsArray()); // Refresh threads to show new name
    }

    try {
      // Get context projects data from selected months
      const monthlyProjects = getProjectsForMonths(contextMonths);
      const contextData = {};
      
      contextMonths.forEach(month => {
        if (monthlyProjects[month]) {
          contextData[month] = contextProjects.map(projectId => 
            monthlyProjects[month].find(p => p.projectId === projectId)
          ).filter(Boolean);
        }
      });

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
      
      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      
      // Save messages to current thread
      if (currentThreadId) {
        updateThreadMessages(currentThreadId, finalMessages);
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Error processing request. Please try again.',
        sender: 'assistant'
      };
      
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      
      // Save messages to current thread even on error
      if (currentThreadId) {
        updateThreadMessages(currentThreadId, finalMessages);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-8 py-4 gap-6">
          {/* Left: Logo and Title */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <img src="/ndp-logo.png" alt="NDP Logo" className="h-14 w-auto mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">NDP Dashboard</h1>
          </div>
          
          {/* Center: Project Navigation */}
          <div className="flex-1 flex justify-center min-w-0 overflow-hidden">
            <div className="max-w-4xl w-full overflow-x-auto px-2">
              <ProjectTabs
                projects={programs.projects}
                selectedTab={currentProjectId}
                onTabSelect={handleTabSelect}
                contextProjects={contextProjects}
                onContextToggle={handleContextToggle}
              />
            </div>
          </div>
          
          {/* Right: AI Chat Button */}
          <div className="flex space-x-6 flex-shrink-0">
            <button
              className={`flex flex-col items-center focus:outline-none ${showChat ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              onClick={() => setShowChat((v) => !v)}
            >
              {icons.chat}
              <span className="text-xs mt-1">AI Chat</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left side - Project Detail View */}
        <div className={`transition-all duration-300 ${showChat ? 'w-2/3' : 'w-full'} p-4 overflow-y-auto bg-gray-50`}>
          {React.cloneElement(children, { 
            selectedMonth, 
            onMonthChange: handleMonthChange 
          })}
        </div>

        {/* Right side - Chat interface */}
        {showChat && (
          <div className="w-1/3 bg-white p-4 flex flex-col h-full min-h-0 transition-all duration-300">
            <ChatThreadManager
              threads={threads}
              currentThreadId={currentThreadId}
              onNewThread={handleNewThread}
              onThreadSelect={handleThreadSelect}
              onDeleteThread={handleDeleteThread}
            />
            
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-3">
                Context: {contextProjects.length} projects selected
              </div>
              <AIContextSelector
                availableMonths={availableMonths}
                selectedMonths={contextMonths}
                onMonthsChange={handleContextMonthsChange}
                currentMonth={currentMonth}
              />
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

function App() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/project/${programs.projects[0]?.projectId || 'PRJ-001'}`} replace />} />
      <Route path="/project/:projectId" element={
        <Layout selectedMonth={selectedMonth} onMonthChange={setSelectedMonth}>
          <ProjectView selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
        </Layout>
      } />
    </Routes>
  );
}

export default App;