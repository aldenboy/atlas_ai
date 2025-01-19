import { Node, MousePosition } from "@/types/neural";

export const updateNodePositions = (
  nodes: Node[],
  time: number,
  mouse: MousePosition,
  mouseRadius: number,
  canvas: HTMLCanvasElement
) => {
  nodes.forEach((node, index) => {
    const angle = time + index * 0.1;
    node.x += Math.cos(angle) * 0.2;
    node.y += Math.sin(angle) * 0.2;
    
    updateNodePosition(node, mouse, mouseRadius, canvas);
  });
};

export const drawScene = (
  ctx: CanvasRenderingContext2D,
  nodes: Node[],
  connectionRadius: number
) => {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawConnections(ctx, nodes, connectionRadius);
  drawNodes(ctx, nodes);
};

export const updateNodePosition = (
  node: Node,
  mouse: MousePosition,
  mouseRadius: number,
  canvas: HTMLCanvasElement
) => {
  // Keep nodes within canvas bounds
  if (node.x < 0 || node.x > canvas.width) {
    node.x = Math.max(0, Math.min(canvas.width, node.x));
    node.vx *= -1;
  }
  if (node.y < 0 || node.y > canvas.height) {
    node.y = Math.max(0, Math.min(canvas.height, node.y));
    node.vy *= -1;
  }

  // Mouse interaction
  if (mouse.x && mouse.y) {
    const dx = mouse.x - node.x;
    const dy = mouse.y - node.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouseRadius) {
      const angle = Math.atan2(dy, dx);
      const force = (mouseRadius - distance) / mouseRadius;
      node.vx -= Math.cos(angle) * force * 0.5;
      node.vy -= Math.sin(angle) * force * 0.5;
    }
  }

  // Apply velocity with damping
  node.x += node.vx * 0.95;
  node.y += node.vy * 0.95;
};

export const drawConnections = (
  ctx: CanvasRenderingContext2D,
  nodes: Node[],
  radius: number
) => {
  nodes.forEach((nodeA) => {
    nodes.forEach((nodeB) => {
      const dx = nodeB.x - nodeA.x;
      const dy = nodeB.y - nodeA.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        const alpha = (1 - distance / radius) * 0.2;
        ctx.beginPath();
        ctx.moveTo(nodeA.x, nodeA.y);
        ctx.lineTo(nodeB.x, nodeB.y);
        ctx.strokeStyle = `rgba(147, 51, 234, ${alpha})`;
        ctx.stroke();
      }
    });
  });
};

export const drawNodes = (ctx: CanvasRenderingContext2D, nodes: Node[]) => {
  nodes.forEach((node) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(147, 51, 234, 0.5)";
    ctx.fill();
  });
};