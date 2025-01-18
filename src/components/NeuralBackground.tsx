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
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    setSize();
    window.addEventListener("resize", setSize);

    // Mouse position tracking with proper canvas coordinates
    const mouse: MousePosition = { x: 0, y: 0 };
    const updateMousePosition = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    
    canvas.addEventListener("mousemove", updateMousePosition);
    canvas.addEventListener("mouseleave", () => {
      mouse.x = 0;
      mouse.y = 0;
    });

    // Initialize nodes with adjusted parameters
    const numNodes = 250;
    const connectionRadius = 180;
    const mouseRadius = 180;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const faceRadius = Math.min(canvas.width, canvas.height) * 0.3;

    const nodes: Node[] = [
      ...generateFaceOutlineNodes(centerX, centerY, faceRadius, numNodes),
      ...generateEyeNodes(centerX, centerY, faceRadius),
      ...generateMouthNodes(centerX, centerY, faceRadius),
      ...generateRandomNodes(centerX, centerY, faceRadius, numNodes)
    ];

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(26, 31, 44, 0.2)";
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
      canvas.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ width: '100%', height: '100%' }}
    />
  );
};