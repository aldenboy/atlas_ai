import { Brain, Cpu, Lock, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Advanced Language Understanding",
    description: "Our AI comprehends context and nuance in natural language with remarkable accuracy.",
    icon: Brain,
  },
  {
    title: "Lightning Fast Responses",
    description: "Get instant responses powered by state-of-the-art infrastructure.",
    icon: Zap,
  },
  {
    title: "Enterprise-Grade Security",
    description: "Your data is protected with industry-leading security measures.",
    icon: Lock,
  },
  {
    title: "Cutting-Edge Technology",
    description: "Built on the latest developments in machine learning and AI.",
    icon: Cpu,
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};