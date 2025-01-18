import { useEffect, useRef } from "react";

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
    let mouse = { x: 0, y: 0 };
    canvas.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    // Neural network nodes
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }[] = [];
    const numNodes = 100;
    const connectionRadius = 200; // Maximum distance for node connections
    const mouseRadius = 150; // Radius of mouse influence

    // Initialize nodes in a spherical pattern
    for (let i = 0; i < numNodes; i++) {
      const angle = (i / numNodes) * Math.PI * 2;
      const radius = Math.random() * 200 + 100; // Vary the radius for a more natural look
      nodes.push({
        x: canvas.width / 2 + Math.cos(angle) * radius,
        y: canvas.height / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    // Animation
    const animate = () => {
      ctx.fillStyle = "#1A1F2C"; // Dark Purple background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Mouse interaction
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
          const force = (mouseRadius - distance) / mouseRadius;
          node.vx -= (dx / distance) * force * 0.2;
          node.vy -= (dy / distance) * force * 0.2;
        }

        // Update position with boundaries
        node.x += node.vx;
        node.y += node.vy;

        // Keep nodes within canvas bounds with smooth transition
        if (node.x < 0 || node.x > canvas.width) {
          node.vx *= -0.5;
          node.x = Math.max(0, Math.min(canvas.width, node.x));
        }
        if (node.y < 0 || node.y > canvas.height) {
          node.vy *= -0.5;
          node.y = Math.max(0, Math.min(canvas.height, node.y));
        }

        // Apply friction
        node.vx *= 0.99;
        node.vy *= 0.99;

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i === j) return;
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionRadius) {
            const opacity = (1 - distance / connectionRadius) * 0.5;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.strokeStyle = `rgba(155, 135, 245, ${opacity})`; // Purple lines
            ctx.lineWidth = opacity;
            ctx.stroke();
          }
        });

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#9b87f5"; // Primary Purple
        ctx.fill();
      });

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
