import { useEffect, useState } from "react";

interface Star {
  id: number;
  top: string;
  left: string;
  animationDelay: string;
}

interface Planet {
  id: number;
  top: string;
  left: string;
  width: string;
  height: string;
  background: string;
  animationDuration: string;
}

interface Comet {
  id: number;
  top: string;
  left: string;
  animationDelay: string;
}

export default function CosmicBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [comets, setComets] = useState<Comet[]>([]);

  useEffect(() => {
    // Generate more stunning stars for a richer sky
    const initialStars: Star[] = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
    }));

    // Generate 9 realistic planets with accurate colors and sizes
    const initialPlanets: Planet[] = [
      // Mercury (smallest, gray-brown)
      {
        id: 1,
        top: "12%",
        left: "88%",
        width: "24px",
        height: "24px",
        background: "radial-gradient(circle at 30% 30%, #8c7853, #5d4e37, #2c1810)",
        animationDuration: "20s",
      },
      // Venus (bright yellow-white)
      {
        id: 2,
        top: "25%",
        left: "15%",
        width: "32px",
        height: "32px",
        background: "radial-gradient(circle at 30% 30%, #ffd700, #ffb347, #ff8c00)",
        animationDuration: "35s",
      },
      // Earth (blue-green with clouds)
      {
        id: 3,
        top: "45%",
        left: "80%",
        width: "36px",
        height: "36px",
        background: "radial-gradient(circle at 30% 30%, #4169e1, #228b22, #0066cc, #1e90ff)",
        animationDuration: "45s",
      },
      // Mars (red planet)
      {
        id: 4,
        top: "65%",
        left: "20%",
        width: "28px",
        height: "28px",
        background: "radial-gradient(circle at 30% 30%, #cd5c5c, #a0522d, #8b0000)",
        animationDuration: "55s",
      },
      // Jupiter (gas giant, largest)
      {
        id: 5,
        top: "35%",
        left: "45%",
        width: "64px",
        height: "64px",
        background: "radial-gradient(circle at 30% 30%, #d2691e, #daa520, #b8860b, #8b4513)",
        animationDuration: "75s",
      },
      // Saturn (with ring effect)
      {
        id: 6,
        top: "80%",
        left: "70%",
        width: "56px",
        height: "56px",
        background: "radial-gradient(circle at 30% 30%, #faf0e6, #f4a460, #daa520)",
        animationDuration: "85s",
      },
      // Uranus (ice giant, blue-green)
      {
        id: 7,
        top: "8%",
        left: "40%",
        width: "44px",
        height: "44px",
        background: "radial-gradient(circle at 30% 30%, #4fd0e3, #00ced1, #008b8b)",
        animationDuration: "95s",
      },
      // Neptune (deep blue)
      {
        id: 8,
        top: "60%",
        left: "5%",
        width: "42px",
        height: "42px",
        background: "radial-gradient(circle at 30% 30%, #4169e1, #0000cd, #191970)",
        animationDuration: "105s",
      },
      // Pluto (small, distant)
      {
        id: 9,
        top: "88%",
        left: "92%",
        width: "20px",
        height: "20px",
        background: "radial-gradient(circle at 30% 30%, #deb887, #cd853f, #8b7355)",
        animationDuration: "120s",
      },
    ];

    // Generate more dramatic natural comets
    const initialComets: Comet[] = [
      {
        id: 1,
        top: "8%",
        left: "60%",
        animationDelay: "0s",
      },
      {
        id: 2,
        top: "30%",
        left: "2%",
        animationDelay: "4s",
      },
      {
        id: 3,
        top: "70%",
        left: "50%",
        animationDelay: "8s",
      },
      {
        id: 4,
        top: "90%",
        left: "15%",
        animationDelay: "12s",
      },
      {
        id: 5,
        top: "15%",
        left: "95%",
        animationDelay: "16s",
      },
      {
        id: 6,
        top: "5%",
        left: "20%",
        animationDelay: "20s",
      },
      {
        id: 7,
        top: "55%",
        left: "85%",
        animationDelay: "24s",
      },
      {
        id: 8,
        top: "75%",
        left: "35%",
        animationDelay: "28s",
      },
      {
        id: 9,
        top: "25%",
        left: "80%",
        animationDelay: "32s",
      },
      {
        id: 10,
        top: "85%",
        left: "60%",
        animationDelay: "36s",
      },
    ];

    setStars(initialStars);
    setPlanets(initialPlanets);
    setComets(initialComets);

    // Continuous generation of new stars and comets
    const cosmicInterval = setInterval(() => {
      // Add new star
      const newStar: Star = {
        id: Date.now() + Math.random() * 10000,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: "0s",
      };

      setStars(prevStars => {
        const updatedStars = [...prevStars, newStar];
        return updatedStars.slice(-200); // Keep max 200 stars
      });

      // Add new comet occasionally
      if (Math.random() < 0.3) {
        const newComet: Comet = {
          id: Date.now() + Math.random() * 1000,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: "0s",
        };

        setComets(prevComets => {
          const updatedComets = [...prevComets, newComet];
          return updatedComets.slice(-8); // Keep max 8 comets
        });

        // Cleanup comet after animation
        setTimeout(() => {
          setComets(prevComets => prevComets.filter(comet => comet.id !== newComet.id));
        }, 8000);
      }

      // Cleanup star after animation
      setTimeout(() => {
        setStars(prevStars => prevStars.filter(star => star.id !== newStar.id));
      }, 8000);
    }, 3000);

    return () => clearInterval(cosmicInterval);
  }, []);

  return (
    <div className="cosmic-bg">
      {/* Enhanced Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            animationDelay: star.animationDelay,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            background: `radial-gradient(circle, hsl(${Math.random() * 60 + 180}, 100%, 90%), transparent)`,
            boxShadow: `0 0 ${4 + Math.random() * 8}px hsl(${Math.random() * 60 + 180}, 100%, 70%)`,
          }}
        />
      ))}

      {/* 9 Realistic Planets */}
      {planets.map((planet) => (
        <div
          key={planet.id}
          className="planet animate-orbit"
          style={{
            top: planet.top,
            left: planet.left,
            width: planet.width,
            height: planet.height,
            background: planet.background,
            animationDuration: planet.animationDuration,
            boxShadow: `0 0 ${parseInt(planet.width) / 2}px rgba(255, 255, 255, 0.3), 
                       0 0 ${parseInt(planet.width)}px rgba(255, 255, 255, 0.1)`,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        />
      ))}

      {/* Dramatic Comets */}
      {comets.map((comet) => (
        <div
          key={comet.id}
          className="comet animate-comet"
          style={{
            top: comet.top,
            left: comet.left,
            animationDelay: comet.animationDelay,
          }}
        />
      ))}

      {/* Nebula Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-900/3 to-transparent animate-pulse" />
      <div className="absolute top-1/6 left-1/4 w-96 h-96 bg-gradient-radial from-yellow-500/5 via-purple-600/3 to-transparent rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/5 w-80 h-80 bg-gradient-radial from-cyan-400/4 via-blue-600/2 to-transparent rounded-full blur-2xl animate-glow" style={{ animationDelay: "3s" }} />
      <div className="absolute top-2/3 left-1/6 w-64 h-64 bg-gradient-radial from-pink-500/3 via-purple-500/2 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "5s" }} />

      {/* Cosmic Dust */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-200/5 via-transparent to-purple-300/5" />
      </div>
    </div>
  );
}
