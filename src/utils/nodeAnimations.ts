import { Node, MousePosition } from "@/types/neural";

export const updateNodePosition = (
  node: Node,
  mouse: MousePosition,
  mouseRadius: number,
  canvas: HTMLCanvasElement
) => {
  // Mouse interaction
  const dx = mouse.x - node.x;
  const dy = mouse.y - node.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < mouseRadius) {
    const force = (mouseRadius - distance) / mouseRadius;
    node.vx -= (dx / distance) * force * 0.2;
    node.vy -= (dy / distance) * force * 0.2;
  }

  // Update position
  node.x += node.vx;
  node.y += node.vy;

  // Boundary checks
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
};

export const drawConnections = (
  ctx: CanvasRenderingContext2D,
  nodes: Node[],
  connectionRadius: number
) => {
  nodes.forEach((node, i) => {
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
  });
};

export const drawNodes = (ctx: CanvasRenderingContext2D, nodes: Node[]) => {
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#9b87f5";
    ctx.fill();
  });
};