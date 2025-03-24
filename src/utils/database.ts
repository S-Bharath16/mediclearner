
// Local storage keys
const HISTORY_STORAGE_KEY = 'prediction_history';

// Type for prediction history items
export type PredictionHistoryItem = {
  id: number;
  prediction_type: string;
  input_data: any;
  result: any;
  created_at: string;
};

// Initialize the database with sample data if empty
export const initDatabase = async () => {
  try {
    const existingData = localStorage.getItem(HISTORY_STORAGE_KEY);
    
    if (!existingData) {
      // Initialize with empty array
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([]));
    }
    
    console.log("Client-side database initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing client-side database:", error);
    return false;
  }
};

// Get the next ID for a new prediction
const getNextId = (): number => {
  try {
    const existingData = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!existingData) return 1;
    
    const predictions = JSON.parse(existingData) as PredictionHistoryItem[];
    if (predictions.length === 0) return 1;
    
    // Find the highest ID and increment by 1
    const maxId = Math.max(...predictions.map(item => item.id));
    return maxId + 1;
  } catch (error) {
    console.error("Error generating ID:", error);
    return Date.now(); // Fallback to timestamp-based ID
  }
};

// Save a prediction to history
export const savePrediction = async (
  predictionType: string,
  inputData: any,
  result: any
) => {
  try {
    const id = getNextId();
    const newPrediction: PredictionHistoryItem = {
      id,
      prediction_type: predictionType,
      input_data: inputData,
      result,
      created_at: new Date().toISOString()
    };
    
    const existingData = localStorage.getItem(HISTORY_STORAGE_KEY);
    const predictions = existingData ? JSON.parse(existingData) : [];
    
    // Add new prediction to the beginning of the array
    predictions.unshift(newPrediction);
    
    // Save back to localStorage
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(predictions));
    
    console.log(`Prediction saved with ID: ${id}`);
    return id;
  } catch (error) {
    console.error("Error saving prediction:", error);
    return null;
  }
};

// Get all prediction history
export const getAllPredictions = async () => {
  try {
    const existingData = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!existingData) return [];
    
    const predictions = JSON.parse(existingData) as PredictionHistoryItem[];
    return predictions;
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return [];
  }
};

// Get prediction history by type
export const getPredictionsByType = async (predictionType: string) => {
  try {
    const allPredictions = await getAllPredictions();
    return allPredictions.filter(p => p.prediction_type === predictionType);
  } catch (error) {
    console.error(`Error fetching ${predictionType} predictions:`, error);
    return [];
  }
};

// Delete a prediction by ID
export const deletePrediction = async (id: number) => {
  try {
    const existingData = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!existingData) return false;
    
    const predictions = JSON.parse(existingData) as PredictionHistoryItem[];
    const filteredPredictions = predictions.filter(p => p.id !== id);
    
    // Save filtered predictions back to localStorage
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filteredPredictions));
    
    console.log(`Prediction with ID ${id} deleted`);
    return true;
  } catch (error) {
    console.error(`Error deleting prediction ${id}:`, error);
    return false;
  }
};

// For chat messages storage
const CHAT_STORAGE_KEY = 'chat_history';

export type ChatMessage = {
  id: number;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
};

// Initialize chat history
export const initChatHistory = async () => {
  try {
    const existingData = localStorage.getItem(CHAT_STORAGE_KEY);
    
    if (!existingData) {
      // Initialize with welcome message
      const welcomeMessage: ChatMessage = {
        id: 1,
        sender: 'bot',
        content: "Hello! I'm your medical assistant. How can I help you today?",
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify([welcomeMessage]));
    }
    
    return true;
  } catch (error) {
    console.error("Error initializing chat history:", error);
    return false;
  }
};

// Get all chat messages
export const getAllChatMessages = async () => {
  try {
    const existingData = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!existingData) return [];
    
    return JSON.parse(existingData) as ChatMessage[];
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return [];
  }
};

// Save a chat message
export const saveChatMessage = async (message: Omit<ChatMessage, 'id'>) => {
  try {
    const existingData = localStorage.getItem(CHAT_STORAGE_KEY);
    const messages = existingData ? JSON.parse(existingData) as ChatMessage[] : [];
    
    // Get next ID
    const nextId = messages.length > 0 
      ? Math.max(...messages.map(m => m.id)) + 1 
      : 1;
    
    const newMessage: ChatMessage = {
      ...message,
      id: nextId
    };
    
    // Add new message
    messages.push(newMessage);
    
    // Save back to localStorage
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    
    return nextId;
  } catch (error) {
    console.error("Error saving chat message:", error);
    return null;
  }
};

// Clear chat history
export const clearChatHistory = async () => {
  try {
    // Initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: 1,
      sender: 'bot',
      content: "Hello! I'm your medical assistant. How can I help you today?",
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify([welcomeMessage]));
    return true;
  } catch (error) {
    console.error("Error clearing chat history:", error);
    return false;
  }
};
