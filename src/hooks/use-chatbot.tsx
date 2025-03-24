
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getAllChatMessages, 
  saveChatMessage, 
  clearChatHistory, 
  initChatHistory,
  ChatMessage
} from "@/utils/database";

// This hook is now primarily for accessing chat history from local storage
// The actual chat functionality is handled by the Microsoft Bot Framework
export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Load previous messages from database
  const loadMessages = async () => {
    try {
      // Initialize chat history storage if needed
      await initChatHistory();
      
      // Get all messages
      const chatMessages = await getAllChatMessages();
      setMessages(chatMessages);
      setIsInitialized(true);
    } catch (error) {
      console.error("Error loading chat messages:", error);
      // Fallback to default welcome message if storage fails
      setMessages([{
        id: 1,
        sender: "bot",
        content: "Hello! I'm your medical assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
      }]);
      setIsInitialized(true);
    }
  };

  // Load messages on component mount
  useEffect(() => {
    if (!isInitialized) {
      loadMessages();
    }
  }, [isInitialized]);

  // For compatibility with existing components that might use this hook
  const sendMessage = async (inputMessage: string) => {
    if (!inputMessage.trim()) return;
    
    // Add user message to chat history
    const userMessage: Omit<ChatMessage, 'id'> = {
      sender: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };
    
    const userId = await saveChatMessage(userMessage);
    if (userId) {
      setMessages((prev) => [...prev, {...userMessage, id: userId}]);
    }
  };

  // Clear chat history
  const clearHistory = async () => {
    try {
      const success = await clearChatHistory();
      
      if (success) {
        // Reload messages to get the welcome message
        await loadMessages();
        
        toast({
          title: "Success",
          description: "Chat history cleared",
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error clearing chat history:", error);
      toast({
        title: "Error",
        description: "Failed to clear chat history",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearHistory,
  };
}
