import { useEffect, useRef } from "react";
import { Node, MousePosition } from "@/types/neural";
import { 
  generateFaceOutlineNodes, 
  generateEyeNodes, 
  generateMouthNodes, 
  generateRandomNodes 
} from "@/utils/nodeGenerators";
import { 
  updateNodePosition, 
  drawConnections, 
  drawNodes 
} from "@/utils/nodeAnimations";

export const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    // Mouse position tracking
    const mouse: MousePosition = { x: 0, y: 0 };
    canvas.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    // Initialize nodes with adjusted parameters
    const numNodes = 250; // Increased number of nodes
    const connectionRadius = 180; // Increased connection radius
    const mouseRadius = 180; // Increased mouse interaction radius
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const faceRadius = Math.min(canvas.width, canvas.height) * 0.3; // Increased face size

    const nodes: Node[] = [
      ...generateFaceOutlineNodes(centerX, centerY, faceRadius, numNodes),
      ...generateEyeNodes(centerX, centerY, faceRadius),
      ...generateMouthNodes(centerX, centerY, faceRadius),
      ...generateRandomNodes(centerX, centerY, faceRadius, numNodes)
    ];

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(26, 31, 44, 0.2)"; // Increased opacity for better trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach(node => updateNodePosition(node, mouse, mouseRadius, canvas));
      drawConnections(ctx, nodes, connectionRadius);
      drawNodes(ctx, nodes);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};