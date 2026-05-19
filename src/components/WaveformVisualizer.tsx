import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { audioRecorder } from '../utils/audioRecorder';

const WaveformVisualizer: React.FC = () => {
  const { darkMode, isRecording } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const analyser = audioRecorder.getAnalyser();
      if (!analyser) {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      const dataArray = audioRecorder.getWaveformData();
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.fillStyle = darkMode ? '#0f172a' : '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Draw waveform
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      const sliceWidth = width / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Draw center line
      ctx.strokeStyle = darkMode ? '#475569' : '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    if (isRecording) {
      animationFrameRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, darkMode]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`glass-effect rounded-2xl p-6 ${darkMode ? 'bg-slate-900/40 border-slate-700/50' : 'glass-effect-light'}`}
    >
      <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Waveform</h2>

      <div className={`relative rounded-lg overflow-hidden ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          className="w-full block"
        />

        {!isRecording && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Start recording to see waveform
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className={`mt-4 flex items-center gap-4 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-500" />
          <span>Audio Waveform</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-slate-500 opacity-50" style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, transparent 40%, currentColor 40%, currentColor 60%, transparent 60%, transparent 100%)' }} />
          <span>Center Line</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WaveformVisualizer;
