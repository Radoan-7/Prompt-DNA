import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareCardProps {
  text: string;
  topEmotion: string;
  summary: string;
  dominantColor: string;
}

export const ShareCard = ({ text, topEmotion, summary, dominantColor }: ShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Prompt DNA',
          text: `"${text.slice(0, 100)}..." - ${summary}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          `"${text.slice(0, 100)}..." - ${summary}\n\n🧬 Discover your Prompt DNA at ${window.location.href}`
        );
        toast({
          title: 'Copied to clipboard!',
          description: 'Share your Prompt DNA result',
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div
        ref={cardRef}
        className="relative bg-card border border-border rounded-2xl p-8 overflow-hidden"
        style={{
          boxShadow: `0 0 40px ${dominantColor}40, inset 0 0 60px ${dominantColor}10`,
        }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${dominantColor}, transparent 70%)`,
          }}
        />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold gradient-text">🧬 Prompt DNA</h3>
            <p className="text-sm text-muted-foreground">#PromptDNA</p>
          </div>

          {/* Quote */}
          <blockquote className="border-l-4 pl-4 italic text-foreground/90" style={{ borderColor: dominantColor }}>
            "{text.length > 120 ? text.slice(0, 120) + '...' : text}"
          </blockquote>

          {/* Top emotion badge */}
          <div className="flex justify-center">
            <div
              className="px-6 py-3 rounded-full font-semibold text-white"
              style={{
                backgroundColor: dominantColor,
                boxShadow: `0 0 20px ${dominantColor}60`,
              }}
            >
              Dominated by: {topEmotion}
            </div>
          </div>

          {/* Summary */}
          <p className="text-center text-foreground/80 leading-relaxed">
            {summary}
          </p>

          {/* DNA symbol */}
          <div className="flex justify-center pt-4">
            <div className="text-6xl animate-pulse-slow" style={{ color: dominantColor }}>
              🧬
            </div>
          </div>
        </div>
      </div>

      {/* Share buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={handleShare}
          className="gap-2 bg-primary hover:bg-primary/90 glow-blue"
        >
          <Share2 className="w-4 h-4" />
          Share Result
        </Button>
      </div>
    </div>
  );
};