import { useEffect, useRef } from 'react';
import { WavRenderer } from '../utils/wav_renderer';

interface VoiceVisualizationProps {
  isActive: boolean;
  type: 'user' | 'assistant';
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export function VoiceVisualization({ 
  isActive, 
  type, 
  canvasRef 
}: VoiceVisualizationProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = canvasRef || internalCanvasRef;
  
  useEffect(() => {
    if (!activeRef.current) return;

    const canvas = activeRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!canvas.width || !canvas.height) {
      canvas.width = canvas.offsetWidth || 80;
      canvas.height = canvas.offsetHeight || 24;
    }

    // Only run animation if not using external canvas ref (WavRenderer case)
    if (!canvasRef) {
      let animationFrameId: number;
      const bars = 20;
      const barWidth = 2;
      const gap = 2;
      const maxHeight = 20;

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < bars; i++) {
          const height = isActive ? Math.random() * maxHeight : 2;
          const x = i * (barWidth + gap);
          const y = (canvas.height - height) / 2;

          ctx.fillStyle = type === 'user' ? '#7C3AED' : '#64748B';
          ctx.fillRect(x, y, barWidth, height);
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [isActive, type, canvasRef]);

  return (
    <canvas
      ref={activeRef}
      width={80}
      height={24}
      className="opacity-80"
    />
  );
} 