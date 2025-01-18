import { Node } from "@/types/neural";

const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio

export const generateFaceOutlineNodes = (
  centerX: number,
  centerY: number,
  faceRadius: number,
  numNodes: number
): Node[] => {
  const nodes: Node[] = [];
  const turns = 5; // Number of spiral turns
  
  for (let i = 0; i < numNodes * 0.4; i++) {
    const theta = i * (2 * Math.PI) / (numNodes * 0.4);
    const radius = faceRadius * Math.pow(PHI, -theta / (2 * Math.PI));
    const x = centerX + radius * Math.cos(theta);
    const y = centerY + radius * Math.sin(theta);
    
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
      const theta = i * (2 * Math.PI) / 15;
      const radius = 15 * Math.pow(PHI, -theta / (2 * Math.PI));
      const x = centerX + side * eyeOffset + radius * Math.cos(theta);
      const y = eyeY + radius * Math.sin(theta);
      nodes.push({
        x,
        y,
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
  const mouthWidth = faceRadius * 0.5;
  const mouthY = centerY + faceRadius * 0.3;
  
  for (let i = 0; i < 20; i++) {
    const t = i / 19;
    const theta = t * Math.PI;
    const radius = 25 * Math.pow(PHI, -theta / Math.PI);
    const x = centerX + radius * Math.cos(theta);
    const y = mouthY + radius * Math.sin(theta);
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
    const theta = i * (2 * Math.PI) / (numNodes * 0.3);
    const radius = faceRadius * Math.pow(PHI, -theta / (2 * Math.PI)) * Math.random();
    const x = centerX + radius * Math.cos(theta);
    const y = centerY + radius * Math.sin(theta);
    nodes.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 1.5,
    });
  }
  return nodes;
};