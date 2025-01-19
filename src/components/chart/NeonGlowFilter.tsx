export const NeonGlowFilter = () => {
  return (
    <svg className="absolute">
      <defs>
        <filter id="neon-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};