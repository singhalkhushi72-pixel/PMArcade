import React, { useEffect, useState } from 'react';

export const ParallaxStarfield: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-cyber-base">
      {/* Perspective Cyber Grid floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-96 opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 229, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 46, 147, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: `perspective(400px) rotateX(65deg) translateY(${mousePos.y * 0.5}px) translateX(${mousePos.x * 0.5}px)`,
          transformOrigin: 'bottom center',
        }}
      />

      {/* Floating Neon Cyber Particles */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * -1}px, ${mousePos.y * -1}px, 0)`
        }}
      >
        <div className="absolute top-[15%] left-[10%] w-2 h-2 rounded-full bg-cyber-pink shadow-neon-glow-pink animate-pulse" />
        <div className="absolute top-[35%] right-[12%] w-2.5 h-2.5 rounded-full bg-cyber-cyan shadow-neon-glow-cyan animate-pulse" />
        <div className="absolute top-[65%] left-[18%] w-2 h-2 rounded-full bg-cyber-lime shadow-neon-glow-lime animate-pulse" />
        <div className="absolute top-[80%] right-[25%] w-3 h-3 rounded-full bg-cyber-yellow shadow-brutal-yellow animate-pulse" />
        <div className="absolute top-[25%] left-[55%] w-1.5 h-1.5 rounded-full bg-cyber-orange animate-ping" />
        <div className="absolute top-[50%] right-[40%] w-2 h-2 rounded-full bg-cyber-pink animate-pulse" />
      </div>

      {/* Cyber City Skyline Silhouettes */}
      <div
        className="absolute bottom-0 inset-x-0 h-40 opacity-20 flex items-end justify-around"
        style={{
          transform: `translateX(${mousePos.x * 0.3}px)`
        }}
      >
        <div className="w-16 h-32 bg-cyber-card border-t-2 border-cyber-cyan" />
        <div className="w-24 h-48 bg-cyber-card border-t-2 border-cyber-pink" />
        <div className="w-20 h-28 bg-cyber-card border-t-2 border-cyber-purple" />
        <div className="w-28 h-56 bg-cyber-card border-t-2 border-cyber-lime" />
        <div className="w-16 h-36 bg-cyber-card border-t-2 border-cyber-cyan" />
        <div className="w-24 h-44 bg-cyber-card border-t-2 border-cyber-pink" />
      </div>
    </div>
  );
};
