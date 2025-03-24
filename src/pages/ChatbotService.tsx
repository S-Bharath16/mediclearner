
import Layout from "../components/Layout";
import { Bot } from "lucide-react";

// Microsoft Bot Framework secret key
const BOT_SECRET = "GK8mZvlYM34KVsYdn3xDHk5H45dVaXjrSoBOlzSQvYKQBDu3asWAJQQJ99BCAC5T7U2AArohAAABAZBS3sKP";

const ChatbotService = () => {
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
          
          <div className="h-[550px] overflow-hidden">
            <iframe 
              src={`https://webchat.botframework.com/embed/MediPredictBot?s=${BOT_SECRET}`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="MediPredict Bot"
            />
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
