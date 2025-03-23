
import { Activity, Heart, Brain } from "lucide-react";
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
      icon: Activity, // Using Activity icon as Lungs isn't available
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

    </Layout>
  );
};

export default Index;
