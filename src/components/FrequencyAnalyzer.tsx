import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { audioRecorder } from '../utils/audioRecorder';

const FrequencyAnalyzer: React.FC = () => {
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

      const dataArray = audioRecorder.getFrequencyData();
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.fillStyle = darkMode ? '#0f172a' : '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Draw frequency bars
      const barWidth = (width / dataArray.length) * 2.5;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * height;

        // Gradient from red to blue
        const hue = (i / dataArray.length) * 240; // 0 = red, 240 = blue
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }

      // Draw grid
      ctx.strokeStyle = darkMode ? '#475569' : '#cbd5e1';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([3, 3]);

      // Vertical grid
      for (let i = 0; i <= 4; i++) {
        const xPos = (i / 4) * width;
        ctx.beginPath();
        ctx.moveTo(xPos, 0);
        ctx.lineTo(xPos, height);
        ctx.stroke();
      }

      // Horizontal grid
      for (let i = 1; i <= 3; i++) {
        const yPos = (i / 4) * height;
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(width, yPos);
        ctx.stroke();
      }
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`glass-effect rounded-2xl p-6 ${darkMode ? 'bg-slate-900/40 border-slate-700/50' : 'glass-effect-light'}`}
    >
      <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Frequency Spectrum</h2>

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
              Start recording to see spectrum
            </p>
          </div>
        )}
      </div>

      {/* Frequency Labels */}
      <div className={`mt-4 flex justify-between text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        <span>Low Freq</span>
        <span>Mid Freq</span>
        <span>High Freq</span>
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-200'}`}
      >
        <p className={`text-xs ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
          📊 The spectrum analyzer shows your voice's frequency components across the audible range.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default FrequencyAnalyzer;
