
import { Activity, Heart, Lungs, Brain } from "lucide-react";
import Layout from "../components/Layout";
import ServiceCard from "../components/ServiceCard";

const Index = () => {
  const services = [
    {
      title: "Diabetes Prediction",
      description: "Predict the risk of diabetes based on medical indicators and lifestyle factors.",
      icon: Activity,
      path: "/diabetes",
    },
    {
      title: "Heart Disease Prediction",
      description: "Assess your heart health and detect potential risk of cardiovascular diseases.",
      icon: Heart,
      path: "/heart",
    },
    {
      title: "Lung Cancer Risk Assessment",
      description: "Evaluate the risk of lung cancer based on symptoms and patient history.",
      icon: Activity, // Changed from Lungs to Activity as Lungs isn't available
      path: "/lung",
    },
    {
      title: "Stroke Risk Analysis",
      description: "Analyze factors that may contribute to the risk of stroke.",
      icon: Brain,
      path: "/stroke",
    },
  ];

  return (
    <Layout>
      <section className="mb-16 animate-fade-in">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block mb-4 px-3 py-1 bg-medical-50 text-medical-600 rounded-full text-sm font-medium">
            AI-Powered Healthcare
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Medical Prediction Services
          </h1>
          <p className="text-xl text-muted-foreground">
            Advanced machine learning models for accurate health predictions and risk assessments.
          </p>
        </div>
      </section>

      <section className="mb-16 animate-slide-up">
        <h2 className="text-2xl font-semibold mb-8 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={service.path} style={{ animationDelay: `${index * 100}ms` }} className="animate-slide-up">
              <ServiceCard
                title={service.title}
                description={service.description}
                icon={service.icon}
                path={service.path}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="animate-slide-up">
        <div className="bg-gradient-to-r from-medical-50 to-blue-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Powered by Advanced AI
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our prediction services leverage Microsoft Azure and AWS machine learning 
            capabilities to provide accurate, reliable health assessments.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/1200px-Microsoft_Azure.svg.png" 
                alt="Microsoft Azure" 
                className="h-8 w-auto"
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png" 
                alt="AWS" 
                className="h-8 w-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
