// ThreadStorage utility for managing chat threads in localStorage

const STORAGE_KEYS = {
  USER_ID: 'pmo_chat_user_id',
  THREADS: 'pmo_chat_threads',
  CURRENT_THREAD: 'pmo_chat_current_thread'
};

// Generate a simple UUID for user identification
const generateUserId = () => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Generate a thread ID
const generateThreadId = () => {
  return 'thread_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Get or create user ID
export const getUserId = () => {
  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }
  return userId;
};

// Get storage key for user's threads
const getUserThreadsKey = () => {
  const userId = getUserId();
  return `${STORAGE_KEYS.THREADS}_${userId}`;
};

// Get storage key for user's current thread
const getUserCurrentThreadKey = () => {
  const userId = getUserId();
  return `${STORAGE_KEYS.CURRENT_THREAD}_${userId}`;
};

// Create a new thread
export const createThread = (name = null) => {
  const threadId = generateThreadId();
  const now = Date.now();
  
  const thread = {
    id: threadId,
    name: name || `Thread ${getThreadCount() + 1}`,
    createdAt: now,
    lastUpdated: now,
    messages: [],
    contextProjects: [],
    contextMonths: [],
    selectedMonth: null
  };
  
  saveThread(thread);
  setCurrentThread(threadId);
  return thread;
};

// Save a thread to localStorage
export const saveThread = (thread) => {
  const threads = getAllThreads();
  const updatedThreads = {
    ...threads,
    [thread.id]: {
      ...thread,
      lastUpdated: Date.now()
    }
  };
  
  localStorage.setItem(getUserThreadsKey(), JSON.stringify(updatedThreads));
};

// Get all threads for current user
export const getAllThreads = () => {
  try {
    const threads = localStorage.getItem(getUserThreadsKey());
    return threads ? JSON.parse(threads) : {};
  } catch (error) {
    console.error('Error loading threads:', error);
    return {};
  }
};

// Get all threads as array, sorted by last updated
export const getThreadsArray = () => {
  const threads = getAllThreads();
  return Object.values(threads).sort((a, b) => b.lastUpdated - a.lastUpdated);
};

// Get a specific thread
export const getThread = (threadId) => {
  const threads = getAllThreads();
  return threads[threadId] || null;
};

// Delete a thread
export const deleteThread = (threadId) => {
  const threads = getAllThreads();
  delete threads[threadId];
  localStorage.setItem(getUserThreadsKey(), JSON.stringify(threads));
  
  // If deleting current thread, clear current thread
  if (getCurrentThreadId() === threadId) {
    clearCurrentThread();
  }
};

// Set current thread ID
export const setCurrentThread = (threadId) => {
  localStorage.setItem(getUserCurrentThreadKey(), threadId);
};

// Get current thread ID
export const getCurrentThreadId = () => {
  return localStorage.getItem(getUserCurrentThreadKey());
};

// Clear current thread
export const clearCurrentThread = () => {
  localStorage.removeItem(getUserCurrentThreadKey());
};

// Get current thread
export const getCurrentThread = () => {
  const threadId = getCurrentThreadId();
  return threadId ? getThread(threadId) : null;
};

// Update thread messages
export const updateThreadMessages = (threadId, messages) => {
  const thread = getThread(threadId);
  if (thread) {
    thread.messages = messages;
    saveThread(thread);
  }
};

// Update thread context
export const updateThreadContext = (threadId, contextProjects, contextMonths, selectedMonth) => {
  const thread = getThread(threadId);
  if (thread) {
    thread.contextProjects = contextProjects;
    thread.contextMonths = contextMonths;
    thread.selectedMonth = selectedMonth;
    saveThread(thread);
  }
};

// Get thread count
export const getThreadCount = () => {
  return Object.keys(getAllThreads()).length;
};

// Auto-generate thread name from first message
export const updateThreadName = (threadId, firstMessage = null) => {
  const thread = getThread(threadId);
  if (thread && firstMessage) {
    // Use first 30 characters of first message as name
    const preview = firstMessage.length > 30 
      ? firstMessage.substring(0, 30) + '...'
      : firstMessage;
    thread.name = preview;
    saveThread(thread);
  }
};

// Cleanup old threads (keep only last N threads)
export const cleanupOldThreads = (maxThreads = 50) => {
  const threadsArray = getThreadsArray();
  if (threadsArray.length <= maxThreads) return;
  
  // Delete old threads (keep most recent)
  const threadsToDelete = threadsArray.slice(maxThreads);
  threadsToDelete.forEach(thread => deleteThread(thread.id));
};

// Export storage size info
export const getStorageInfo = () => {
  const threads = getAllThreads();
  const threadCount = Object.keys(threads).length;
  const storageData = JSON.stringify(threads);
  const sizeKB = Math.round(new Blob([storageData]).size / 1024);
  
  return {
    threadCount,
    sizeKB,
    userId: getUserId()
  };
};

// Initialize default thread if none exists
export const initializeDefaultThread = () => {
  const currentThread = getCurrentThread();
  if (!currentThread && getThreadCount() === 0) {
    return createThread('New Conversation');
  }
  return currentThread;
};