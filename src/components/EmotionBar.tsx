import { useEffect, useState } from 'react';
import { Heart, Brain, Zap, Flame, Sparkles, LucideIcon } from 'lucide-react';

interface EmotionBarProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export const EmotionBar = ({ label, value, icon: Icon, color, delay = 0 }: EmotionBarProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glass card container */}
      <div
        className="relative bg-card/30 backdrop-blur-xl border border-border/50 rounded-2xl p-6 transition-all duration-500 hover:bg-card/50 hover:border-primary/30"
        style={{
          boxShadow: isHovered 
            ? `0 8px 32px ${color}30, inset 0 1px 0 rgba(255,255,255,0.1)` 
            : `0 4px 16px ${color}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
      >
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 100% 0%, ${color}15, transparent 50%)`,
          }}
        />

        <div className="relative z-10 space-y-4">
          {/* Header with icon and label */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Icon container with glow */}
              <div
                className="relative p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: `${color}20`,
                  boxShadow: `0 0 20px ${color}30`,
                }}
              >
                <Icon
                  className="w-6 h-6 transition-all duration-300 group-hover:rotate-12"
                  style={{ color }}
                />
                
                {/* Pulsing ring */}
                <div
                  className="absolute inset-0 rounded-xl animate-pulse-slow"
                  style={{
                    border: `2px solid ${color}`,
                    opacity: 0.3,
                  }}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">{label}</h3>
                <p className="text-xs text-muted-foreground">Emotional intensity</p>
              </div>
            </div>

            {/* Percentage display */}
            <div className="text-right">
              <div
                className="text-3xl font-bold transition-all duration-300 group-hover:scale-110"
                style={{ color }}
              >
                {Math.round(animatedValue)}%
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                {animatedValue > 75 ? 'Very High' : animatedValue > 50 ? 'High' : animatedValue > 25 ? 'Moderate' : 'Low'}
              </div>
            </div>
          </div>

          {/* Premium progress bar */}
          <div className="relative h-4 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm border border-border/30">
            {/* Background shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
            
            {/* Main progress bar */}
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${animatedValue}%`,
                background: `linear-gradient(90deg, ${color}, ${color}CC)`,
                boxShadow: `0 0 20px ${color}60, inset 0 1px 0 rgba(255,255,255,0.3)`,
              }}
            >
              {/* Inner glow */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `linear-gradient(180deg, rgba(255,255,255,0.3), transparent)`,
                }}
              />
              
              {/* Trailing particles */}
              <div
                className="absolute right-0 inset-y-0 w-8 blur-sm opacity-60"
                style={{
                  background: `radial-gradient(circle, ${color}, transparent)`,
                }}
              />
            </div>

            {/* Percentage markers */}
            {[25, 50, 75].map((marker) => (
              <div
                key={marker}
                className="absolute inset-y-0 w-px bg-border/20"
                style={{ left: `${marker}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add shimmer animation to global styles if not present
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;
if (!document.querySelector('[data-shimmer-animation]')) {
  style.setAttribute('data-shimmer-animation', 'true');
  document.head.appendChild(style);
}