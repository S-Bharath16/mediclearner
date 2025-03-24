
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { pool } from "@/utils/database";

interface ChatMessage {
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
}

// Azure direct link secret key
const AZURE_SECRET_KEY = "GK8mZvlYM34KVsYdn3xDHk5H45dVaXjrSoBOlzSQvYKQBDu3asWAJQQJ99BCAC5T7U2AArohAAABAZBS3sKP";

// Initialize the chat messages table
const initChatTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        sender VARCHAR(10) NOT NULL,
        content TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Chat messages table initialized");
    return true;
  } catch (error) {
    console.error("Error initializing chat table:", error);
    return false;
  }
};

// Initialize the table on first import
initChatTable();

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Load previous messages from database
  const loadMessages = async () => {
    try {
      const result = await pool.query(`
        SELECT * FROM chat_messages
        ORDER BY timestamp ASC
      `);
      
      if (result.rows.length === 0) {
        // If no messages exist, add the welcome message
        const welcomeMessage: ChatMessage = {
          sender: "bot",
          content: "Hello! I'm your medical assistant. How can I help you today?",
          timestamp: new Date(),
        };
        
        await saveMessageToDb(welcomeMessage);
        setMessages([welcomeMessage]);
      } else {
        // Convert database format to ChatMessage format
        const dbMessages = result.rows.map(row => ({
          sender: row.sender as "user" | "bot",
          content: row.content,
          timestamp: new Date(row.timestamp)
        }));
        
        setMessages(dbMessages);
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error("Error loading chat messages:", error);
      // Fallback to default welcome message if database fails
      setMessages([{
        sender: "bot",
        content: "Hello! I'm your medical assistant. How can I help you today?",
        timestamp: new Date(),
      }]);
      setIsInitialized(true);
    }
  };

  // Save message to database
  const saveMessageToDb = async (message: ChatMessage) => {
    try {
      await pool.query(`
        INSERT INTO chat_messages (sender, content, timestamp)
        VALUES ($1, $2, $3)
      `, [message.sender, message.content, message.timestamp]);
      return true;
    } catch (error) {
      console.error("Error saving message to database:", error);
      return false;
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
    const userMessage: ChatMessage = {
      sender: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    await saveMessageToDb(userMessage);
    setIsLoading(true);

    try {
      // In a production environment, this would be replaced with an actual
      // Azure Direct Link API call using the AZURE_SECRET_KEY
      
      // Simulated response for demonstration
      setTimeout(async () => {
        const botResponse: ChatMessage = {
          sender: "bot",
          content: "I understand your concern about medical conditions. Our prediction models can help assess various health risks. Would you like to try one of our prediction tools?",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, botResponse]);
        await saveMessageToDb(botResponse);
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
      await pool.query("DELETE FROM chat_messages");
      
      // Add welcome message back
      const welcomeMessage: ChatMessage = {
        sender: "bot",
        content: "Hello! I'm your medical assistant. How can I help you today?",
        timestamp: new Date(),
      };
      
      await saveMessageToDb(welcomeMessage);
      setMessages([welcomeMessage]);
      
      toast({
        title: "Success",
        description: "Chat history cleared",
      });
      
      return true;
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
