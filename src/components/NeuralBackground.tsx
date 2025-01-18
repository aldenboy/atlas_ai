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
import { useIsMobile } from "@/hooks/use-mobile";

export const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size with proper device pixel ratio
    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;
      
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      
      // Scale the context to ensure correct drawing operations
      ctx.scale(dpr, dpr);
      
      // Set CSS size
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
    };
    
    setSize();
    window.addEventListener("resize", setSize);

    // Mouse position tracking with proper scaling
    const mouse: MousePosition = { x: 0, y: 0 };
    const updateMousePosition = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      mouse.x = (e.clientX - rect.left) * scaleX;
      mouse.y = (e.clientY - rect.top) * scaleY;
    };
    
    canvas.addEventListener("mousemove", updateMousePosition);
    canvas.addEventListener("mouseleave", () => {
      mouse.x = 0;
      mouse.y = 0;
    });

    // Initialize nodes with adjusted parameters for better mobile display
    const numNodes = isMobile ? 100 : 200;
    const connectionRadius = isMobile ? 100 : 150;
    const mouseRadius = isMobile ? 100 : 150;
    
    // Calculate center and radius based on screen size
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const minDimension = Math.min(window.innerWidth, window.innerHeight);
    const faceRadius = minDimension * (isMobile ? 0.25 : 0.35);

    const nodes: Node[] = [
      ...generateFaceOutlineNodes(centerX, centerY, faceRadius, numNodes),
      ...generateEyeNodes(centerX, centerY, faceRadius),
      ...generateMouthNodes(centerX, centerY, faceRadius),
      ...generateRandomNodes(centerX, centerY, faceRadius, numNodes)
    ];

    // Animation loop with proper clearing
    const animate = () => {
      ctx.fillStyle = "rgba(26, 31, 44, 0.2)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

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
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ touchAction: 'none' }}
    />
  );
};