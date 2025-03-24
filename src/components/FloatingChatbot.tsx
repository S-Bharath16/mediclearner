
import { useState } from "react";
import { Bot, MessageCircle, X, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface ChatMessage {
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
}

// Azure direct link secret key
const AZURE_SECRET_KEY = "GK8mZvlYM34KVsYdn3xDHk5H45dVaXjrSoBOlzSQvYKQBDu3asWAJQQJ99BCAC5T7U2AArohAAABAZBS3sKP";

const FloatingChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      content: "Hello! I'm your medical assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      sender: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // In a real implementation, this would be a call to Azure services
      // using the AZURE_SECRET_KEY for authentication
      
      // Simulating API call to Azure services
      setTimeout(() => {
        const botResponse: ChatMessage = {
          sender: "bot",
          content: "I understand your concern. Based on your symptoms, I recommend scheduling an appointment with a specialist. Would you like more information?",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to chatbot service",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Different UI based on screen size
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // For mobile devices use a drawer (bottom sheet)
  if (isMobile) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button 
              variant="default" 
              size="icon" 
              className="h-12 w-12 rounded-full bg-medical-600 hover:bg-medical-700 shadow-lg"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="sr-only">Open chat</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[80vh]">
            <DrawerHeader>
              <DrawerTitle>MediAssist AI</DrawerTitle>
            </DrawerHeader>
            
            <div className="px-4 overflow-y-auto flex-1 h-[calc(80vh-8rem)]">
              <div className="space-y-4">
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
            </div>
            
            <DrawerFooter>
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
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  // For desktop use a side sheet
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="default" 
            size="icon" 
            className="h-12 w-12 rounded-full bg-medical-600 hover:bg-medical-700 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="sr-only">Open chat</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[400px] sm:w-[540px] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center">
              <Bot className="mr-2 text-medical-600" />
              MediAssist AI
            </SheetTitle>
          </SheetHeader>
          
          <div className="p-4 h-[calc(100vh-12rem)] overflow-y-auto">
            <div className="space-y-4">
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
              Powered by Azure AI services
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FloatingChatbot;
