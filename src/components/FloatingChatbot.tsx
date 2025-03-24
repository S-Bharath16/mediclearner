import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Azure Bot Service Direct Line secret key
const DIRECT_LINE_SECRET = "GK8mZvlYM34KVsYdn3xDHk5H45dVaXjrSoBOlzSQvYKQBDu3asWAJQQJ99BCAC5T7U2AArohAAABAZBS3sKP";

// Fallback responses for when the API fails
const FALLBACK_RESPONSES = [
  "I'm sorry, I'm having trouble connecting to my knowledge base. How can I help you with basic information?",
  "I apologize for the inconvenience. My connection to the server is temporarily unavailable. Is there something general I can assist with?",
  "It seems I'm having some technical difficulties. While I work to resolve this, I can still help with general questions.",
  "I'm currently experiencing connectivity issues. Let me assist you with what I know locally.",
  "Sorry about that! My cloud connection is down. I can still provide general assistance while we wait for it to be restored."
];

// Common medical FAQs for offline fallback
const MEDICAL_FAQS = {
  "headache": "For headaches, you might try: rest in a quiet, dark room, staying hydrated, over-the-counter pain relievers (following package instructions), and applying a cool compress. See a doctor if your headache is severe, sudden, or accompanied by other symptoms.",
  "fever": "For fevers, make sure to stay hydrated, rest, and take acetaminophen or ibuprofen as directed. Contact a healthcare provider if a fever is higher than 103°F, lasts more than three days, or is accompanied by severe symptoms.",
  "cold": "For colds, get plenty of rest, stay hydrated, use over-the-counter cold medications as directed, and consider using a humidifier. See a doctor if symptoms last more than 10 days or are unusually severe.",
  "flu": "For flu symptoms, rest, stay hydrated, and take acetaminophen or ibuprofen for fever and aches. Contact a healthcare provider if you experience difficulty breathing, persistent chest pain, or cannot keep liquids down.",
  "appointment": "You can schedule an appointment through our patient portal or by calling our office during business hours. Please have your insurance information available when you call.",
  "hours": "Our standard office hours are Monday through Friday, 8:00 AM to 5:00 PM. We offer limited weekend hours at select locations."
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isError?: boolean;
}

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [directLineToken, setDirectLineToken] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Detect screen size for responsive UI
  const [isMobile, setIsMobile] = useState(false);
  
  // Handle window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on first load
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize Direct Line connection
  useEffect(() => {
    if (isOpen && !directLineToken && !isOfflineMode) {
      initializeDirectLine();
    }

    // Poll for messages when conversation is active
    let intervalId: NodeJS.Timeout;
    if (isOpen && conversationId && !isOfflineMode) {
      intervalId = setInterval(fetchMessages, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOpen, conversationId, isOfflineMode]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeDirectLine = async () => {
    try {
      setIsLoading(true);
      setConnectionError(false);
      
      // Get Direct Line token
      const response = await fetch('https://directline.botframework.com/v3/directline/tokens/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DIRECT_LINE_SECRET}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setDirectLineToken(data.token);
      
      // Start a new conversation
      const convResponse = await fetch('https://directline.botframework.com/v3/directline/conversations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!convResponse.ok) {
        throw new Error(`HTTP error! Status: ${convResponse.status}`);
      }
      
      const convData = await convResponse.json();
      setConversationId(convData.conversationId);
      
      // Add welcome message
      setMessages([
        {
          id: 'welcome',
          text: 'Hello! How can I assist you today?',
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      
      setIsLoading(false);
      setRetryCount(0);
    } catch (error) {
      console.error('Failed to initialize Direct Line:', error);
      setConnectionError(true);
      setIsLoading(false);
      
      // Switch to offline mode after multiple retries
      if (retryCount >= 2) {
        switchToOfflineMode();
      } else {
        setRetryCount(prev => prev + 1);
      }
    }
  };

  const fetchMessages = async () => {
    if (!directLineToken || !conversationId || isOfflineMode) return;
    
    try {
      const response = await fetch(`https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities`, {
        headers: {
          'Authorization': `Bearer ${directLineToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process incoming messages
      if (data.activities && data.activities.length > 0) {
        const botMessages = data.activities
          .filter((activity: any) => 
            activity.from.id !== 'user' && 
            activity.type === 'message' &&
            !messages.some((m) => m.id === activity.id)
          )
          .map((activity: any) => ({
            id: activity.id,
            text: activity.text,
            sender: 'bot' as const,
            timestamp: new Date(activity.timestamp)
          }));
          
        if (botMessages.length > 0) {
          setMessages(prev => [...prev, ...botMessages]);
          setConnectionError(false);
          setRetryCount(0);
        }
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setConnectionError(true);
      
      // Switch to offline mode after multiple retries
      if (retryCount >= 2) {
        switchToOfflineMode();
      } else {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchToOfflineMode = () => {
    setIsOfflineMode(true);
    setIsLoading(false);
    
    // Add offline notification
    setMessages(prev => [
      ...prev, 
      {
        id: `system-${Date.now()}`,
        text: "I'm currently operating in offline mode due to connection issues. I can still help with common questions using my local knowledge.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      }
    ]);
  };

  const handleRetryConnection = () => {
    setIsOfflineMode(false);
    setRetryCount(0);
    initializeDirectLine();
  };

  const getFallbackResponse = (query: string) => {
    // Check if query contains any keywords from our FAQs
    const lowercaseQuery = query.toLowerCase();
    
    for (const [keyword, response] of Object.entries(MEDICAL_FAQS)) {
      if (lowercaseQuery.includes(keyword)) {
        return response;
      }
    }
    
    // If no keyword matches, return a random fallback response
    const randomIndex = Math.floor(Math.random() * FALLBACK_RESPONSES.length);
    return FALLBACK_RESPONSES[randomIndex];
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    if (isOfflineMode) {
      // Handle offline mode with predetermined answers
      setTimeout(() => {
        const fallbackResponse: Message = {
          id: `offline-${Date.now()}`,
          text: getFallbackResponse(userMessage.text),
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, fallbackResponse]);
        setIsLoading(false);
      }, 1000); // Simulate response delay
      
      return;
    }
    
    try {
      // Send message to bot
      const response = await fetch(`https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${directLineToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'message',
          from: {
            id: 'user'
          },
          text: userMessage.text
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Bot response will be fetched by the polling mechanism
    } catch (error) {
      console.error('Failed to send message:', error);
      setConnectionError(true);
      
      // Provide fallback response if API call fails
      const fallbackResponse: Message = {
        id: `fallback-${Date.now()}`,
        text: getFallbackResponse(userMessage.text),
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
      
      // Switch to offline mode after multiple failures
      if (retryCount >= 2) {
        switchToOfflineMode();
      } else {
        setRetryCount(prev => prev + 1);
      }
      
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const renderMessages = () => {
    return messages.map((message, index) => (
      <div 
        key={message.id || index}
        className={`mb-4 ${
          message.sender === 'user' ? 'ml-auto' : 'mr-auto'
        }`}
      >
        <div
          className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
            message.sender === 'user'
              ? 'bg-primary text-primary-foreground ml-auto'
              : message.isError
                ? 'bg-amber-50 border border-amber-200 text-amber-800'
                : 'bg-muted text-muted-foreground'
          }`}
        >
          {message.isError && (
            <div className="flex items-center gap-2 mb-1 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs font-medium">Offline Response</span>
            </div>
          )}
          {message.text}
        </div>
        <div 
          className={`text-xs text-muted-foreground mt-1 ${
            message.sender === 'user' ? 'text-right' : 'text-left'
          }`}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    ));
  };

  const renderChatContent = () => (
    <>
      {(connectionError && !isOfflineMode) && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>Connection error. Unable to reach the server.</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetryConnection}
              className="ml-2"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {isOfflineMode && (
        <Alert variant="default" className="m-4 bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="flex justify-between items-center">
            <span>Running in offline mode with limited responses.</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetryConnection}
              className="ml-2 border-amber-300 text-amber-800"
            >
              Try Reconnect
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Start a conversation
          </div>
        ) : (
          <>
            {renderMessages()}
            {isLoading && (
              <div className="flex justify-center my-4">
                <div className="animate-pulse text-muted-foreground">
                  Bot is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={sendMessage} 
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Powered by {isOfflineMode ? "Offline Mode" : "Azure Bot Service"}
        </p>
      </div>
    </>
  );

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
          <DrawerContent className="h-[80vh] flex flex-col">
            <DrawerHeader className="border-b">
              <DrawerTitle>MediAssist AI {isOfflineMode && "(Offline Mode)"}</DrawerTitle>
            </DrawerHeader>
            
            <div className="flex-1 overflow-hidden flex flex-col">
              {renderChatContent()}
            </div>
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
        <SheetContent side="left" className="w-[400px] sm:w-[540px] p-0 flex flex-col">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center">
              MediAssist AI {isOfflineMode && "(Offline Mode)"}
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col">
            {renderChatContent()}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FloatingChatbot;