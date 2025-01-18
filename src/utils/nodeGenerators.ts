import { Node } from "@/types/neural";

export const generateFaceOutlineNodes = (
  centerX: number,
  centerY: number,
  faceRadius: number,
  numNodes: number
): Node[] => {
  const nodes: Node[] = [];
  // Create skull outline with more angular shape
  for (let i = 0; i < numNodes * 0.4; i++) {
    const angle = (i / (numNodes * 0.4)) * Math.PI * 2;
    // Make top of skull more pronounced
    const radiusModifier = angle > Math.PI ? 1.2 : 1.4;
    const x = centerX + Math.cos(angle) * faceRadius * radiusModifier;
    const y = centerY + Math.sin(angle) * faceRadius * (angle > Math.PI ? 1.4 : 1.2);
    
    nodes.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      radius: Math.random() * 2 + 2, // Larger nodes for better visibility
    });
  }
  return nodes;
};

export const generateEyeNodes = (
  centerX: number,
  centerY: number,
  faceRadius: number
): Node[] => {
  const nodes: Node[] = [];
  const eyeOffset = faceRadius * 0.35;
  const eyeY = centerY - faceRadius * 0.1;
  
  // Create more angular, skull-like eye sockets
  [-1, 1].forEach(side => {
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const r = 20; // Larger eye sockets
      const x = centerX + side * eyeOffset + Math.cos(angle) * r;
      const y = eyeY + Math.sin(angle) * (r * 0.8); // Slightly oval shaped
      nodes.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 2 + 2.5, // Larger nodes for visibility
      });
    }
  });
  return nodes;
};

export const generateMouthNodes = (
  centerX: number,
  centerY: number,
  faceRadius: number
): Node[] => {
  const nodes: Node[] = [];
  const mouthWidth = faceRadius * 0.5;
  const mouthY = centerY + faceRadius * 0.3;
  
  // Create a more angular mouth shape resembling a skull
  for (let i = 0; i < 25; i++) {
    const t = i / 24;
    const x = centerX + (t - 0.5) * mouthWidth;
    // Create a more angular smile shape
    const y = mouthY + Math.abs(Math.sin(t * Math.PI)) * 25;
    nodes.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      radius: Math.random() * 2 + 2,
    });
  }
  return nodes;
};

export const generateRandomNodes = (
  centerX: number,
  centerY: number,
  faceRadius: number,
  numNodes: number
): Node[] => {
  const nodes: Node[] = [];
  for (let i = 0; i < numNodes * 0.3; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * faceRadius * 1.2;
    nodes.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 1.5,
    });
  }
  return nodes;
};