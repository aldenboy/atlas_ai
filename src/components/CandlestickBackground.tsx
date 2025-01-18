import React, { useEffect, useRef } from 'react';

export const CandlestickBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Candlestick properties
    const candlesticks: {
      x: number;
      y: number;
      width: number;
      height: number;
      wickHeight: number;
      isUp: boolean;
      speed: number;
    }[] = [];

    // Initialize candlesticks
    const initCandlesticks = () => {
      candlesticks.length = 0;
      const count = Math.floor(canvas.width / 60); // Space candlesticks evenly
      
      for (let i = 0; i < count; i++) {
        candlesticks.push({
          x: i * 60,
          y: Math.random() * canvas.height,
          width: 20,
          height: 40 + Math.random() * 60,
          wickHeight: 60 + Math.random() * 80,
          isUp: Math.random() > 0.5,
          speed: 0.5 + Math.random() * 1.5
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      candlesticks.forEach(candle => {
        // Move candlestick up
        candle.y -= candle.speed;

        // Reset position when it goes off screen
        if (candle.y + candle.wickHeight < 0) {
          candle.y = canvas.height;
          candle.isUp = Math.random() > 0.5;
          candle.height = 40 + Math.random() * 60;
          candle.wickHeight = 60 + Math.random() * 80;
        }

        // Draw candlestick
        ctx.beginPath();
        ctx.strokeStyle = '#FFFFFF';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        
        // Draw wick
        ctx.moveTo(candle.x + candle.width / 2, candle.y);
        ctx.lineTo(candle.x + candle.width / 2, candle.y + candle.wickHeight);
        ctx.stroke();
        
        // Draw body
        ctx.fillRect(
          candle.x,
          candle.y + (candle.wickHeight - candle.height) / 2,
          candle.width,
          candle.height
        );
        ctx.strokeRect(
          candle.x,
          candle.y + (candle.wickHeight - candle.height) / 2,
          candle.width,
          candle.height
        );
      });

      requestAnimationFrame(animate);
    };

    initCandlesticks();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: 'black' }}
    />
  );
};