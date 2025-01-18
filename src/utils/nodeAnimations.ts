import { Node, MousePosition } from "@/types/neural";

export const updateNodePosition = (
  node: Node,
  mouse: MousePosition,
  mouseRadius: number,
  canvas: HTMLCanvasElement
) => {
  const dx = mouse.x - node.x;
  const dy = mouse.y - node.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < mouseRadius) {
    const force = (mouseRadius - distance) / mouseRadius;
    // Create a stronger swirling effect around the cursor
    const angle = Math.atan2(dy, dx);
    node.vx += Math.cos(angle + Math.PI / 2) * force * 2.0; // Increased force multiplier
    node.vy += Math.sin(angle + Math.PI / 2) * force * 2.0;
    // Add stronger attraction/repulsion based on distance
    const repelForce = distance < mouseRadius / 2 ? -1 : 1;
    node.vx += (dx / distance) * force * repelForce * 1.5;
    node.vy += (dy / distance) * force * repelForce * 1.5;
  }

  // Update position with enhanced dynamics
  node.x += node.vx;
  node.y += node.vy;

  // Improved boundary checks with elastic bounce
  if (node.x < 0 || node.x > canvas.width) {
    node.vx *= -0.9;
    node.x = Math.max(0, Math.min(canvas.width, node.x));
  }
  if (node.y < 0 || node.y > canvas.height) {
    node.vy *= -0.9;
    node.y = Math.max(0, Math.min(canvas.height, node.y));
  }

  // Adjusted friction for more responsive movement
  node.vx *= 0.92;
  node.vy *= 0.92;
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
        // Enhanced line opacity and thickness based on distance
        const opacity = Math.pow(1 - distance / connectionRadius, 2);
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(otherNode.x, otherNode.y);
        ctx.strokeStyle = `rgba(155, 135, 245, ${opacity})`;
        ctx.lineWidth = opacity * 2.5; // Increased line thickness
        ctx.stroke();
      }
    });
  });
};

export const drawNodes = (ctx: CanvasRenderingContext2D, nodes: Node[]) => {
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    // Enhanced glow effect
    const gradient = ctx.createRadialGradient(
      node.x, node.y, 0,
      node.x, node.y, node.radius * 3
    );
    gradient.addColorStop(0, '#9b87f5');
    gradient.addColorStop(0.6, 'rgba(155, 135, 245, 0.3)');
    gradient.addColorStop(1, 'rgba(155, 135, 245, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();
  });
};