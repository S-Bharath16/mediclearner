
import { useState, useRef, useEffect } from "react";
import { MessageCircle } from "lucide-react";
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

// Microsoft Bot Framework secret key
const BOT_SECRET = "GK8mZvlYM34KVsYdn3xDHk5H45dVaXjrSoBOlzSQvYKQBDu3asWAJQQJ99BCAC5T7U2AArohAAABAZBS3sKP";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
            
            <div className="flex-1 h-[calc(80vh-8rem)] overflow-hidden">
              <iframe 
                ref={iframeRef}
                src={`https://webchat.botframework.com/embed/MediPredictBot?s=${BOT_SECRET}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="MediPredict Bot"
              />
            </div>
            
            <DrawerFooter>
              <p className="text-xs text-muted-foreground">
                Powered by Microsoft Bot Framework
              </p>
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
              MediAssist AI
            </SheetTitle>
          </SheetHeader>
          
          <div className="h-[calc(100vh-12rem)] overflow-hidden">
            <iframe 
              ref={iframeRef}
              src={`https://webchat.botframework.com/embed/MediPredictBot?s=${BOT_SECRET}`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="MediPredict Bot"
            />
          </div>
          
          <div className="p-4 border-t">
            <p className="text-xs text-muted-foreground">
              Powered by Microsoft Bot Framework
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FloatingChatbot;
