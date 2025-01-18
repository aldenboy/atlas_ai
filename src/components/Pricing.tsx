import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for individuals and small projects",
    features: ["1,000 messages per month", "Basic AI capabilities", "Email support", "API access"],
  },
  {
    name: "Professional",
    price: "$99",
    description: "Ideal for growing businesses",
    features: ["10,000 messages per month", "Advanced AI capabilities", "Priority support", "Custom integrations"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with specific needs",
    features: ["Unlimited messages", "Full AI suite", "24/7 dedicated support", "Custom development"],
  },
];

export const Pricing = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="text-4xl font-bold mt-4">{plan.price}</div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};