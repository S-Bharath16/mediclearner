
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getAllChatMessages, 
  saveChatMessage, 
  clearChatHistory, 
  initChatHistory,
  ChatMessage
} from "@/utils/database";

// Azure direct link secret key
const AZURE_SECRET_KEY = "GK8mZvlYM34KVsYdn3xDHk5H45dVaXjrSoBOlzSQvYKQBDu3asWAJQQJ99BCAC5T7U2AArohAAABAZBS3sKP";

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

  const sendMessage = async (inputMessage: string) => {
    if (!inputMessage.trim()) return;
    
    // Add user message to chat
    const userMessage: Omit<ChatMessage, 'id'> = {
      sender: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };
    
    const userId = await saveChatMessage(userMessage);
    if (userId) {
      setMessages((prev) => [...prev, {...userMessage, id: userId}]);
    }
    
    setIsLoading(true);

    try {
      // In a production environment, this would be replaced with an actual
      // Azure Direct Link API call using the AZURE_SECRET_KEY
      
      // Simulated response for demonstration
      setTimeout(async () => {
        const botResponse: Omit<ChatMessage, 'id'> = {
          sender: "bot",
          content: "I understand your concern about medical conditions. Our prediction models can help assess various health risks. Would you like to try one of our prediction tools?",
          timestamp: new Date().toISOString(),
        };
        
        const botId = await saveChatMessage(botResponse);
        if (botId) {
          setMessages((prev) => [...prev, {...botResponse, id: botId}]);
        }
        
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to Azure chatbot service",
        variant: "destructive",
      });
      setIsLoading(false);
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
