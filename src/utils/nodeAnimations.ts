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
    const angle = Math.atan2(dy, dx);
    node.vx += Math.cos(angle + Math.PI / 2) * force * 1.5;
    node.vy += Math.sin(angle + Math.PI / 2) * force * 1.5;
  }

  // Add slight circular motion
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const angleToCenter = Math.atan2(node.y - centerY, node.x - centerX);
  node.vx += Math.cos(angleToCenter + Math.PI / 2) * 0.05;
  node.vy += Math.sin(angleToCenter + Math.PI / 2) * 0.05;

  node.x += node.vx;
  node.y += node.vy;

  // Improved boundary checks with elastic bounce
  if (node.x < 0 || node.x > canvas.width) {
    node.vx *= -0.8;
    node.x = Math.max(0, Math.min(canvas.width, node.x));
  }
  if (node.y < 0 || node.y > canvas.height) {
    node.vy *= -0.8;
    node.y = Math.max(0, Math.min(canvas.height, node.y));
  }

  node.vx *= 0.95;
  node.vy *= 0.95;
};

export const drawConnections = (
  ctx: CanvasRenderingContext2D,
  nodes: Node[],
  connectionRadius: number
) => {
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.lineWidth = 1;
  
  nodes.forEach((node, i) => {
    nodes.slice(i + 1).forEach(otherNode => {
      const dx = otherNode.x - node.x;
      const dy = otherNode.y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionRadius) {
        const opacity = Math.pow(1 - distance / connectionRadius, 2) * 0.5;
        const gradient = ctx.createLinearGradient(
          node.x, node.y, 
          otherNode.x, otherNode.y
        );
        gradient.addColorStop(0, `rgba(56, 189, 248, ${opacity})`);
        gradient.addColorStop(1, `rgba(96, 165, 250, ${opacity})`);
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(otherNode.x, otherNode.y);
        ctx.stroke();
      }
    });
  });
};

export const drawNodes = (ctx: CanvasRenderingContext2D, nodes: Node[]) => {
  nodes.forEach(node => {
    const gradient = ctx.createRadialGradient(
      node.x, node.y, 0,
      node.x, node.y, node.radius * 2
    );
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.8)');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  });
};