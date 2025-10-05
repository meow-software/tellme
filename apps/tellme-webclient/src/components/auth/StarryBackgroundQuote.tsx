"use client";

import React, { useEffect, useState } from "react";

interface StarryBackgroundQuoteProps {
  title: string;
  description: string;
  className?: string;
}

interface Star {
  left: string;
  top: string;
  delay: string;
}

const StarryBackgroundQuote: React.FC<StarryBackgroundQuoteProps> = ({
  title,
  description,
  className = "",
}) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className={`flex-1 relative bg-slate-900 overflow-hidden ${className}`}>
      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900" />

      {/* Stars */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-80 animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Large Moon */}
      <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-30 blur-sm" />
      <div className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 opacity-50" />

      {/* Mountain Silhouettes */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 300" className="w-full h-auto">
          <path
            d="M0,300 L0,200 L100,150 L200,180 L300,120 L400,160 L500,100 L600,140 L700,80 L800,120 L900,90 L1000,130 L1100,110 L1200,150 L1200,300 Z"
            fill="rgba(0,0,0,0.6)"
          />
          <path
            d="M0,300 L0,220 L150,180 L250,200 L350,160 L450,190 L550,140 L650,170 L750,130 L850,160 L950,140 L1050,170 L1150,150 L1200,180 L1200,300 Z"
            fill="rgba(0,0,0,0.4)"
          />
          <path
            d="M0,300 L0,240 L200,210 L300,230 L400,200 L500,220 L600,190 L700,210 L800,180 L900,200 L1000,190 L1100,210 L1200,200 L1200,300 Z"
            fill="rgba(0,0,0,0.2)"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8 z-10">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            {title}
          </h2>
          <p className="text-slate-100 text-lg leading-relaxed drop-shadow-md">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StarryBackgroundQuote;