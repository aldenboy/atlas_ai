import { useEffect, useRef } from "react";

export const FibonacciBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      
      ctx.scale(dpr, dpr);
      
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
    };
    
    setSize();
    window.addEventListener("resize", setSize);

    // Fibonacci spiral drawing function
    const drawFibonacciSpiral = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 4;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) / 8;
      
      let a = 0;
      let b = 1;
      let angle = 0;
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      
      // Animate based on time
      const progress = (Math.sin(time / 2000) + 1) / 2;
      
      for (let i = 0; i < 15; i++) {
        const radius = Math.sqrt(b) * scale * progress;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        ctx.lineTo(x, y);
        
        const temp = b;
        b = a + b;
        a = temp;
        angle += Math.PI / 2;
      }
      
      ctx.strokeStyle = "rgba(168, 85, 247, 0.4)"; // Purple color matching the theme
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    // Animation loop
    let animationFrameId: number;
    const animate = (time: number) => {
      drawFibonacciSpiral(time);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate(0);

    return () => {
      window.removeEventListener("resize", setSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ touchAction: 'none' }}
    />
  );
};