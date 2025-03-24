import React, { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import { Bot, Send, AlertCircle } from "lucide-react";

// Mock medical knowledge base
const medicalKnowledge = {
  symptoms: {
    headache: "Headaches can be caused by stress, dehydration, eyestrain, or more serious conditions. For persistent or severe headaches, please consult a healthcare provider.",
    fever: "Fever is often a sign that your body is fighting an infection. If temperature exceeds 103°F (39.4°C) or persists for more than 3 days, seek medical attention.",
    cough: "Coughs may be due to viral infections, allergies, or respiratory conditions. If a cough persists for more than 2 weeks or is accompanied by shortness of breath, consult a doctor.",
    fatigue: "Fatigue can result from poor sleep, stress, or underlying medical conditions. If severe or persistent, consult your healthcare provider.",
    pain: "Pain can indicate various issues depending on location and intensity. For severe, persistent, or worsening pain, please see a healthcare professional."
  },
  conditions: {
    diabetes: "Diabetes is a condition affecting how your body processes blood glucose. It requires proper management through diet, exercise, and sometimes medication.",
    hypertension: "High blood pressure can lead to serious health problems if untreated. Management includes diet, exercise, stress reduction, and medication if prescribed.",
    asthma: "Asthma is a respiratory condition characterized by airway inflammation. Treatment typically involves avoiding triggers and using prescribed medications.",
    arthritis: "Arthritis causes joint inflammation and pain. Treatment may include physical therapy, medication, and in some cases surgery."
  },
  lifestyle: {
    exercise: "Regular physical activity helps maintain health and prevent various conditions. Aim for at least 150 minutes of moderate activity weekly.",
    nutrition: "A balanced diet rich in fruits, vegetables, whole grains, and lean proteins supports overall health. Limit processed foods, sugars, and saturated fats.",
    sleep: "Quality sleep is essential for health. Adults typically need 7-9 hours per night. Consistent sleep schedules help improve sleep quality.",
    stress: "Chronic stress can impact physical and mental health. Stress management techniques include meditation, exercise, and adequate rest."
  }
};

// Pre-defined questions for quick access
const suggestedQuestions = [
  "What causes headaches?",
  "How can I manage stress?",
  "What are symptoms of diabetes?",
  "How much exercise do I need?",
  "What should I eat for better health?",
  "When should I see a doctor for a fever?",
  "How can I improve my sleep?"
];

// Advanced mock AI response generator
const generateAIResponse = (query) => {
  const lowercaseQuery = query.toLowerCase();
  let response = "";
  
  // Check for greetings
  if (lowercaseQuery.match(/\b(hi|hello|hey|greetings)\b/)) {
    return "Hello! I'm MediAssist AI. How can I help with your health questions today?";
  }
  
  // Check for symptoms in the query
  for (const symptom in medicalKnowledge.symptoms) {
    if (lowercaseQuery.includes(symptom)) {
      response += medicalKnowledge.symptoms[symptom] + " ";
    }
  }
  
  // Check for conditions in the query
  for (const condition in medicalKnowledge.conditions) {
    if (lowercaseQuery.includes(condition)) {
      response += medicalKnowledge.conditions[condition] + " ";
    }
  }
  
  // Check for lifestyle topics
  for (const topic in medicalKnowledge.lifestyle) {
    if (lowercaseQuery.includes(topic)) {
      response += medicalKnowledge.lifestyle[topic] + " ";
    }
  }
  
  // Handle general medical inquiries
  if (lowercaseQuery.includes("medicine") || lowercaseQuery.includes("medical") || lowercaseQuery.includes("health")) {
    response += "I can provide general information about various health topics, symptoms, and conditions. What specific area are you interested in? ";
  }
  
  // Add a disclaimer if we provided medical information
  if (response) {
    response += "Remember, this is general information and not a substitute for professional medical advice.";
    return response;
  }
  
  // Default response if no specific topics were matched
  return "I don't have specific information about that. Could you ask about a particular symptom, condition, or health topic? Remember that I can provide general information only, not medical advice.";
};

const ChatbotService = () => {
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "Hello! I'm MediAssist AI. I can answer your medical questions and provide general health information. You can type your question or click one of the suggested questions below." 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (text = input) => {
    if (text.trim() === "") return;

    const userMessage = { sender: "user", text: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Simulate AI thinking with a short delay
    setIsLoading(true);
    setTimeout(() => {
      const aiResponse = generateAIResponse(text);
      const botMessage = { sender: "bot", text: aiResponse };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 800);
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
    handleSendMessage(question);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block mb-4 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
            AI Health Assistant
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            MediAssist AI
          </h1>
          <p className="text-gray-500">
            Get instant general medical information and guidance
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="flex items-center p-4 border-b">
            <Bot className="mr-2 text-blue-600" />
            <h2 className="font-medium">MediAssist AI</h2>
          </div>

          <div className="h-[450px] overflow-y-auto p-4 flex flex-col">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 max-w-[80%] p-3 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-100 text-blue-800 self-end rounded-br-none"
                    : "bg-gray-100 text-gray-800 self-start rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="self-start bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none mb-3">
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions Section */}
          <div className="p-3 border-t border-b bg-gray-50">
            <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center p-4">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Ask about symptoms, conditions, or general health..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
              disabled={isLoading}
            />
            <button
              className={`ml-2 p-2 rounded-lg transition-colors ${
                isLoading 
                  ? "bg-gray-400 cursor-not-allowed text-white" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              onClick={() => handleSendMessage()}
              disabled={isLoading}
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 text-sm border border-yellow-200">
          <div className="flex items-start">
            <AlertCircle className="mr-2 mt-0.5 text-yellow-600" size={16} />
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">Medical Disclaimer</h3>
              <p className="text-yellow-700">
                This AI assistant provides general medical information only and is not a substitute for professional 
                medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified 
                health provider with any questions you have regarding a medical condition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatbotService;