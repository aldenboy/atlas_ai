import React from "react";

export const FibonacciBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <svg
        className="absolute w-full h-full animate-wave"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 Q25,45 50,50 T100,50"
          className="stroke-primary/20 fill-none"
          strokeWidth="0.2"
        />
        <path
          d="M0,55 Q25,50 50,55 T100,55"
          className="stroke-primary/15 fill-none"
          strokeWidth="0.2"
        />
        <path
          d="M0,60 Q25,55 50,60 T100,60"
          className="stroke-primary/10 fill-none"
          strokeWidth="0.2"
        />
        <path
          d="M0,65 Q25,60 50,65 T100,65"
          className="stroke-primary/5 fill-none"
          strokeWidth="0.2"
        />
        {/* Fibonacci spiral approximation using curved paths */}
        <path
          d="M50,50 Q60,50 65,45 T70,35 T65,25 T55,20 T40,25 T35,35 T40,45 T50,50"
          className="stroke-primary/10 fill-none"
          strokeWidth="0.1"
        />
        <path
          d="M45,55 Q55,55 60,50 T65,40 T60,30 T50,25 T35,30 T30,40 T35,50 T45,55"
          className="stroke-primary/10 fill-none"
          strokeWidth="0.1"
        />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
    </div>
  );
};