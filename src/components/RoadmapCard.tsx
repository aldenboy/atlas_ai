import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

const roadmapItems = [
  {
    quarter: "Q1 2025",
    features: [
      { name: "Social Trading Integration", completed: false },
      { name: "Mobile App Beta Launch", completed: false },
      { name: "Advanced API Access", completed: false },
    ],
  },
  {
    quarter: "Q2 2025",
    features: [
      { name: "Cross-Chain Analytics", completed: false },
      { name: "DeFi Portfolio Tracking", completed: false },
      { name: "NFT Market Analysis", completed: false },
    ],
  },
  {
    quarter: "Q3 2025",
    features: [
      { name: "Institutional Trading Tools", completed: false },
      { name: "AI-Powered Trading Bots", completed: false },
      { name: "Advanced Risk Management", completed: false },
    ],
  },
  {
    quarter: "Q4 2025",
    features: [
      { name: "Decentralized Identity Integration", completed: false },
      { name: "Multi-Exchange Portfolio Management", completed: false },
      { name: "Predictive Market Analytics", completed: false },
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