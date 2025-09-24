import { useState, useEffect } from "react";

export function AnimatedLogo() {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center neon-border mx-auto mb-4 overflow-hidden">
      {/* Animated Background Stars */}
      <div className="absolute inset-0">
        <div className={`absolute w-1 h-1 bg-yellow-300 rounded-full animate-pulse ${isAnimating ? 'animate-ping' : ''}`} style={{top: '20%', left: '30%'}} />
        <div className={`absolute w-1 h-1 bg-white rounded-full animate-pulse delay-500 ${isAnimating ? 'animate-ping' : ''}`} style={{top: '60%', left: '70%'}} />
        <div className={`absolute w-0.5 h-0.5 bg-blue-200 rounded-full animate-pulse delay-1000 ${isAnimating ? 'animate-ping' : ''}`} style={{top: '40%', left: '20%'}} />
        <div className={`absolute w-0.5 h-0.5 bg-purple-200 rounded-full animate-pulse delay-1500 ${isAnimating ? 'animate-ping' : ''}`} style={{top: '80%', left: '50%'}} />
      </div>
      
      {/* Central Moon/Star Symbol */}
      <div className={`relative z-10 transition-all duration-2000 ${isAnimating ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
        <div className="text-2xl font-bold text-yellow-300 drop-shadow-lg">
          ✦
        </div>
      </div>
      
      {/* Rotating Outer Ring */}
      <div className={`absolute inset-2 border border-yellow-300/30 rounded-full ${isAnimating ? 'animate-spin' : ''}`} style={{animationDuration: '4s'}} />
      
      {/* Subtle Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-blue-400/10 rounded-lg" />
    </div>
  );
}