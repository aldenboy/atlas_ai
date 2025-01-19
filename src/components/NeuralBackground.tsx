import { useEffect, useRef } from "react";
import { Node, MousePosition } from "@/types/neural";
import { 
  generateFaceOutlineNodes, 
  generateRandomNodes 
} from "@/utils/nodeGenerators";
import { 
  updateNodePositions,
  drawScene
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

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;
      
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      
      ctx.scale(dpr, dpr);
      
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
    };
    
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

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

    const numNodes = isMobile ? 50 : 100;
    const connectionRadius = isMobile ? 150 : 200;
    const mouseRadius = isMobile ? 100 : 150;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.4;

    const nodes: Node[] = [
      ...generateFaceOutlineNodes(centerX, centerY, radius, numNodes),
      ...generateRandomNodes(centerX, centerY, radius, numNodes)
    ];

    let time = 0;
    const animate = () => {
      time += 0.002;
      
      updateNodePositions(nodes, time, mouse, mouseRadius, canvas);
      drawScene(ctx, nodes, connectionRadius);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      canvas.removeEventListener("mousemove", updateMousePosition);
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 bg-black"
      style={{ touchAction: 'none' }}
    />
  );
};