import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Sign Up",
    description: "Create your account in seconds and get immediate access to our AI platform.",
  },
  {
    number: "02",
    title: "Choose Your Use Case",
    description: "Select from our wide range of AI capabilities tailored to your needs.",
  },
  {
    number: "03",
    title: "Start Interacting",
    description: "Begin chatting with our AI and experience its powerful capabilities firsthand.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <Card key={step.number} className="border-none shadow-lg relative overflow-hidden">
              <div className="absolute -top-4 -left-4 text-8xl font-bold text-gray-100 select-none">
                {step.number}
              </div>
              <CardHeader className="relative z-10">
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription>{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};