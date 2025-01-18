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
    const numNodes = 150; // Increased number of nodes
    const connectionRadius = 200;
    const mouseRadius = 150;

    // Initialize nodes in a face-like pattern
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const faceRadius = Math.min(canvas.width, canvas.height) * 0.3;

    for (let i = 0; i < numNodes; i++) {
      const angle = (i / numNodes) * Math.PI * 2;
      // Create an oval shape for the face
      const x = centerX + Math.cos(angle) * faceRadius * 1.2;
      const y = centerY + Math.sin(angle) * faceRadius;
      
      nodes.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
      });
    }

    // Add some nodes for eyes
    const eyeOffset = faceRadius * 0.3;
    [-1, 1].forEach(side => {
      for (let i = 0; i < 10; i++) {
        nodes.push({
          x: centerX + side * eyeOffset + (Math.random() - 0.5) * 30,
          y: centerY - faceRadius * 0.1 + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 1,
        });
      }
    });

    // Animation
    const animate = () => {
      ctx.fillStyle = "rgba(26, 31, 44, 0.1)"; // Slightly transparent background
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
            ctx.strokeStyle = `rgba(155, 135, 245, ${opacity})`;
            ctx.lineWidth = opacity;
            ctx.stroke();
          }
        });

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#9b87f5";
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