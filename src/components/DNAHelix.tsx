import { useMemo } from 'react';

interface DNAHelixProps {
  emotions: {
    empathy: number;
    curiosity: number;
    chaos: number;
    confidence: number;
    creativity: number;
  };
}

export const DNAHelix = ({ emotions }: DNAHelixProps) => {
  // Calculate dominant emotion and color
  const dominantColor = useMemo(() => {
    const emotionColors = {
      empathy: { h: 340, s: 100, l: 60 },
      curiosity: { h: 210, s: 100, l: 55 },
      chaos: { h: 270, s: 100, l: 60 },
      confidence: { h: 25, s: 100, l: 55 },
      creativity: { h: 160, s: 100, l: 50 },
    };

    // Mix colors based on emotion weights
    let totalH = 0, totalS = 0, totalL = 0, totalWeight = 0;
    
    Object.entries(emotions).forEach(([emotion, value]) => {
      const color = emotionColors[emotion as keyof typeof emotionColors];
      if (color && typeof value === 'number') {
        totalH += color.h * value;
        totalS += color.s * value;
        totalL += color.l * value;
        totalWeight += value;
      }
    });

    // Fallback to default if no valid emotions
    if (totalWeight === 0) {
      return { h: 193, s: 100, l: 50 };
    }

    return {
      h: Math.round(totalH / totalWeight),
      s: Math.round(totalS / totalWeight),
      l: Math.round(totalL / totalWeight),
    };
  }, [emotions]);

  const helixColor = `hsl(${dominantColor.h}, ${dominantColor.s}%, ${dominantColor.l}%)`;
  const glowColor = `hsl(${dominantColor.h}, ${dominantColor.s}%, ${dominantColor.l}%, 0.3)`;

  return (
    <div className="relative w-64 h-96 mx-auto">
      <svg
        viewBox="0 0 200 400"
        className="w-full h-full animate-spin-slow"
        style={{
          filter: `drop-shadow(0 0 20px ${glowColor}) drop-shadow(0 0 40px ${glowColor})`,
        }}
      >
        <defs>
          <linearGradient id="helixGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={helixColor} stopOpacity="1" />
            <stop offset="50%" stopColor={helixColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor={helixColor} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Left strand */}
        <path
          d="M 60 0 Q 30 50, 60 100 T 60 200 T 60 300 T 60 400"
          fill="none"
          stroke="url(#helixGradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Right strand */}
        <path
          d="M 140 0 Q 170 50, 140 100 T 140 200 T 140 300 T 140 400"
          fill="none"
          stroke="url(#helixGradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Connecting bars */}
        {[0, 50, 100, 150, 200, 250, 300, 350].map((y, i) => {
          const offset = i % 2 === 0 ? 0 : 100;
          return (
            <g key={y}>
              <line
                x1={60 + (i % 2 === 0 ? 0 : 0)}
                y1={y + offset}
                x2={140 - (i % 2 === 0 ? 0 : 0)}
                y2={y + offset}
                stroke={helixColor}
                strokeWidth="2"
                opacity="0.6"
              />
              <circle
                cx={60 + (i % 2 === 0 ? 0 : 0)}
                cy={y + offset}
                r="6"
                fill={helixColor}
                className="animate-pulse-slow"
              />
              <circle
                cx={140 - (i % 2 === 0 ? 0 : 0)}
                cy={y + offset}
                r="6"
                fill={helixColor}
                className="animate-pulse-slow"
              />
            </g>
          );
        })}
      </svg>

      {/* Floating particles around helix */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-float"
            style={{
              background: helixColor,
              boxShadow: `0 0 10px ${glowColor}`,
              left: `${20 + (i % 4) * 20}%`,
              top: `${10 + (i % 5) * 20}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};