import React from "react";

export const FibonacciBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <svg
        className="absolute w-full h-full animate-wave"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Fibonacci spiral approximation using curved paths */}
        <path
          d="M50,50 Q60,50 65,45 T70,35 T65,25 T55,20 T40,25 T35,35 T40,45 T50,50"
          className="stroke-primary/30 fill-none"
          strokeWidth="0.3"
        />
        <path
          d="M45,55 Q55,55 60,50 T65,40 T60,30 T50,25 T35,30 T30,40 T35,50 T45,55"
          className="stroke-primary/30 fill-none"
          strokeWidth="0.3"
        />
        <path
          d="M40,60 Q50,60 55,55 T60,45 T55,35 T45,30 T30,35 T25,45 T30,55 T40,60"
          className="stroke-primary/30 fill-none"
          strokeWidth="0.3"
        />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
    </div>
  );
};