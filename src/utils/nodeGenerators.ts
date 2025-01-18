import { Node } from "@/types/neural";

export const generateFaceOutlineNodes = (
  centerX: number,
  centerY: number,
  faceRadius: number,
  numNodes: number
): Node[] => {
  const nodes: Node[] = [];
  for (let i = 0; i < numNodes * 0.4; i++) {
    const angle = (i / (numNodes * 0.4)) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * faceRadius * 1.2;
    const y = centerY + Math.sin(angle) * faceRadius * 1.4;
    
    nodes.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      radius: Math.random() * 2 + 1.5,
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
  
  [-1, 1].forEach(side => {
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 15;
      nodes.push({
        x: centerX + side * eyeOffset + Math.cos(angle) * r,
        y: eyeY + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 2 + 2,
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
  const mouthWidth = faceRadius * 0.6;
  const mouthY = centerY + faceRadius * 0.2;
  
  for (let i = 0; i < 20; i++) {
    const t = i / 19;
    const x = centerX + (t - 0.5) * mouthWidth;
    const y = mouthY + Math.sin(t * Math.PI) * 20;
    nodes.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      radius: Math.random() * 2 + 1.5,
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
    const radius = Math.random() * faceRadius * 1.5;
    nodes.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 1,
    });
  }
  return nodes;
};