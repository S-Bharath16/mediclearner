
import { useState } from "react";
import Layout from "../components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, Bot, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useChatbot } from "@/hooks/use-chatbot";

const ChatbotService = () => {
  const { messages, isLoading, sendMessage } = useChatbot();
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    await sendMessage(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block mb-4 px-3 py-1 bg-medical-50 text-medical-600 rounded-full text-sm font-medium">
            AI Assistant
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Medical Chatbot Service
          </h1>
          <p className="text-muted-foreground">
            Get instant medical guidance and answers to your health questions
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="flex items-center p-4 border-b">
            <Bot className="mr-2 text-medical-600" />
            <h2 className="font-medium">MediAssist AI</h2>
          </div>
          
          <div className="p-4 h-[400px] overflow-y-auto flex flex-col space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-medical-50 text-medical-800"
                      : "bg-gray-100"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-gray-100">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Textarea
                placeholder="Type your message here..."
                className="resize-none"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="shrink-0"
              >
                <SendHorizontal className="h-5 w-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Powered by Azure AI services. This is a demonstration of medical assistant chatbot.
            </p>
          </div>
        </div>
        
        <div className="bg-medical-50 rounded-lg p-4 text-sm">
          <h3 className="font-medium mb-2">Important Note</h3>
          <p>
            This chatbot provides general information and is not a substitute for professional medical advice. 
            Always consult with a healthcare provider for medical concerns.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ChatbotService;
