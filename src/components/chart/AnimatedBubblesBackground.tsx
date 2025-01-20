export const AnimatedBubblesBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute w-32 h-32 bg-primary/20 rounded-full -top-16 -left-16 animate-float blur-xl" />
      <div className="absolute w-40 h-40 bg-primary/15 rounded-full top-20 right-10 animate-float [animation-delay:1s] blur-xl" />
      <div className="absolute w-36 h-36 bg-primary/20 rounded-full bottom-10 left-10 animate-float [animation-delay:2s] blur-xl" />
      <div className="absolute w-48 h-48 bg-primary/15 rounded-full -bottom-20 -right-20 animate-float [animation-delay:3s] blur-xl" />
      <div className="absolute w-24 h-24 bg-primary/10 rounded-full top-1/3 left-1/4 animate-float [animation-delay:2.5s] blur-xl" />
      <div className="absolute w-28 h-28 bg-primary/25 rounded-full bottom-1/3 right-1/4 animate-float [animation-delay:1.5s] blur-xl" />
    </div>
  );
};