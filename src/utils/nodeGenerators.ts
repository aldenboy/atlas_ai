import { Node } from "@/types/neural";

const PHI = (1 + Math.sqrt(5)) / 2;

export const generateFaceOutlineNodes = (
  centerX: number,
  centerY: number,
  faceRadius: number,
  numNodes: number
): Node[] => {
  const nodes: Node[] = [];
  const sphereRadius = Math.min(window.innerWidth, window.innerHeight) * 0.4;
  
  for (let i = 0; i < numNodes * 0.4; i++) {
    const phi = Math.acos(-1 + (2 * i) / numNodes);
    const theta = Math.sqrt(numNodes * Math.PI) * phi;
    
    const x = centerX + sphereRadius * Math.cos(theta) * Math.sin(phi);
    const y = centerY + sphereRadius * Math.sin(theta) * Math.sin(phi);
    
    nodes.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      radius: Math.random() * 2 + 1,
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
  const sphereRadius = Math.min(window.innerWidth, window.innerHeight) * 0.4;
  
  for (let i = 0; i < numNodes; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = sphereRadius * Math.sqrt(Math.random());
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle) * 0.5; // Flatten vertically for perspective
    
    nodes.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 1,
    });
  }
  return nodes;
};

// Remove unused functions
export const generateEyeNodes = (): Node[] => [];
export const generateMouthNodes = (): Node[] => [];