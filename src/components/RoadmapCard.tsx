import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

const roadmapItems = [
  {
    quarter: "Q4 2024",
    features: [
      { name: "Multi-Exchange Integration", completed: false },
      { name: "Risk Management Dashboard", completed: false },
      { name: "Automated Trading Bots", completed: false },
    ],
  },
  {
    quarter: "Q1 2025",
    features: [
      { name: "Token Launch on Moonshot", completed: false },
      { name: "Social Trading Features", completed: false },
      { name: "Mobile App Beta", completed: false },
    ],
  },
  {
    quarter: "Q2 2025",
    features: [
      { name: "Advanced Portfolio Analytics", completed: false },
      { name: "Cross-Chain Integration", completed: false },
      { name: "Institutional API Access", completed: false },
    ],
  },
  {
    quarter: "Q3 2025",
    features: [
      { name: "Decentralized Identity Integration", completed: false },
      { name: "AI-Powered Trading Strategies", completed: false },
      { name: "Community Governance Launch", completed: false },
    ],
  },
];

export const RoadmapCard = () => {
  return (
    <Card className="p-6 rounded-xl bg-black/30 backdrop-blur-md border border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Project Roadmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {roadmapItems.map((quarter) => (
            <div key={quarter.quarter} className="space-y-3">
              <h3 className="text-lg font-semibold text-purple-300">{quarter.quarter}</h3>
              <ul className="space-y-2">
                {quarter.features.map((feature) => (
                  <li key={feature.name} className="flex items-center space-x-2">
                    {feature.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-purple-400" />
                    )}
                    <span className="text-gray-200">{feature.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};