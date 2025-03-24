
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
}

// Azure direct link secret key
const AZURE_SECRET_KEY = "GK8mZvlYM34KVsYdn3xDHk5H45dVaXjrSoBOlzSQvYKQBDu3asWAJQQJ99BCAC5T7U2AArohAAABAZBS3sKP";

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      content: "Hello! I'm your medical assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (inputMessage: string) => {
    if (!inputMessage.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      sender: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // In a production environment, this would be replaced with an actual
      // Azure Direct Link API call using the AZURE_SECRET_KEY
      
      // Simulated response for demonstration
      setTimeout(() => {
        const botResponse: ChatMessage = {
          sender: "bot",
          content: "I understand your concern about medical conditions. Our prediction models can help assess various health risks. Would you like to try one of our prediction tools?",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
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

  return {
    messages,
    isLoading,
    sendMessage,
  };
}
