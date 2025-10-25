import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ParticleBackground } from '@/components/ParticleBackground';
import { DNAHelix } from '@/components/DNAHelix';
import { EmotionBar } from '@/components/EmotionBar';
import { ShareCard } from '@/components/ShareCard';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RotateCcw, Sparkles, Heart, Brain, Zap, Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisResult {
  empathy: number;
  curiosity: number;
  chaos: number;
  confidence: number;
  creativity: number;
  summary: string;
}

const Index = () => {
  const [step, setStep] = useState<'input' | 'analyzing' | 'results'>('input');
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast({
        title: 'Please enter some text',
        description: 'Type something to analyze your emotional DNA',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setStep('analyzing');

    try {
      const { data, error } = await supabase.functions.invoke('analyze-prompt', {
        body: { text: inputText },
      });

      console.log('Raw response:', data, error);

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Validate the data structure
      if (!data || typeof data.empathy !== 'number' || typeof data.curiosity !== 'number' ||
          typeof data.chaos !== 'number' || typeof data.confidence !== 'number' ||
          typeof data.creativity !== 'number' || !data.summary) {
        console.error('Invalid data structure:', data);
        throw new Error('Invalid response from AI');
      }

      console.log('Valid analysis:', data);
      setAnalysis(data);
      setTimeout(() => {
        setStep('results');
        setShowIntro(false);
      }, 2000);
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
      setStep('input');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('input');
    setInputText('');
    setAnalysis(null);
  };

  const getTopEmotion = () => {
    if (!analysis) return { name: '', value: 0 };
    const emotions = [
      { name: 'Empathy', value: analysis.empathy },
      { name: 'Curiosity', value: analysis.curiosity },
      { name: 'Chaos', value: analysis.chaos },
      { name: 'Confidence', value: analysis.confidence },
      { name: 'Creativity', value: analysis.creativity },
    ];
    return emotions.reduce((max, emotion) => (emotion.value > max.value ? emotion : max));
  };

  const getDominantColor = () => {
    if (!analysis) return '#00c8ff';
    const topEmotion = getTopEmotion().name;
    const colorMap: Record<string, string> = {
      Empathy: 'hsl(340, 100%, 60%)',
      Curiosity: 'hsl(210, 100%, 55%)',
      Chaos: 'hsl(270, 100%, 60%)',
      Confidence: 'hsl(25, 100%, 55%)',
      Creativity: 'hsl(160, 100%, 50%)',
    };
    return colorMap[topEmotion] || '#00c8ff';
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        {/* Intro animation */}
        {showIntro && step === 'input' && (
          <div className="text-center space-y-6 mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 text-6xl md:text-7xl font-bold mb-4">
              <span className="animate-float">🧬</span>
              <h1 className="gradient-text">Prompt DNA</h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Decode the Soul of Your Words
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Welcome to Prompt DNA — discover what your words say about you.
            </p>
          </div>
        )}

        {/* Input Step */}
        {step === 'input' && (
          <div className="w-full max-w-2xl space-y-6 animate-scale-in">
            <div className="relative">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type anything and decode your emotional DNA…"
                className="min-h-[200px] text-lg bg-card/50 backdrop-blur-sm border-2 border-primary/30 focus:border-primary rounded-2xl resize-none animate-glow transition-all duration-300"
                style={{
                  boxShadow: '0 0 30px hsl(var(--neon-blue) / 0.2)',
                }}
              />
              <Sparkles className="absolute top-4 right-4 w-6 h-6 text-primary/50 animate-pulse-slow" />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isLoading || !inputText.trim()}
              size="lg"
              className="w-full text-lg py-6 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-300 glow-blue font-semibold"
            >
              🔬 Analyze My Prompt
            </Button>
          </div>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="text-7xl animate-spin-slow">🧬</div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold gradient-text">Analyzing Your DNA...</h2>
              <p className="text-muted-foreground">Decoding emotional patterns</p>
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            </div>
          </div>
        )}

        {/* Results Step */}
        {step === 'results' && analysis && (
          <div className="w-full max-w-6xl space-y-12 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text">Your Emotional DNA</h2>
              <p className="text-muted-foreground">Here's what your words reveal about you</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* DNA Helix */}
              <div className="flex flex-col items-center space-y-6">
                <DNAHelix emotions={analysis} />
                <div className="text-center max-w-md">
                  <p className="text-lg leading-relaxed text-foreground/90 italic">
                    "{analysis.summary}"
                  </p>
                </div>
              </div>

              {/* Emotion Bars */}
              <div className="space-y-5">
                <EmotionBar
                  label="Empathy"
                  value={analysis.empathy}
                  icon={Heart}
                  color="hsl(340, 100%, 60%)"
                  delay={100}
                />
                <EmotionBar
                  label="Curiosity"
                  value={analysis.curiosity}
                  icon={Brain}
                  color="hsl(210, 100%, 55%)"
                  delay={200}
                />
                <EmotionBar
                  label="Chaos"
                  value={analysis.chaos}
                  icon={Zap}
                  color="hsl(270, 100%, 60%)"
                  delay={300}
                />
                <EmotionBar
                  label="Confidence"
                  value={analysis.confidence}
                  icon={Flame}
                  color="hsl(25, 100%, 55%)"
                  delay={400}
                />
                <EmotionBar
                  label="Creativity"
                  value={analysis.creativity}
                  icon={Sparkles}
                  color="hsl(160, 100%, 50%)"
                  delay={500}
                />
              </div>
            </div>

            {/* Share Card */}
            <div className="max-w-2xl mx-auto">
              <ShareCard
                text={inputText}
                topEmotion={getTopEmotion().name}
                summary={analysis.summary}
                dominantColor={getDominantColor()}
              />
            </div>

            {/* Reset Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleReset}
                size="lg"
                variant="outline"
                className="gap-2 border-2 border-primary/50 hover:bg-primary/10 rounded-xl px-8 py-6 text-lg transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5" />
                🔁 Decode Another Prompt
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Index;