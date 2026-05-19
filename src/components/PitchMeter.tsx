import React from 'react';
import { motion } from 'framer-motion';
import { AudioAnalysis } from '../utils/audioProcessor';
import { useAppStore } from '../store/appStore';

interface PitchMeterProps {
  analysis: AudioAnalysis | null;
  vocalRange: string;
}

const PitchMeter: React.FC<PitchMeterProps> = ({ analysis, vocalRange }) => {
  const { darkMode } = useAppStore();
  const frequency = analysis?.pitch.frequency || 0;
  const confidence = analysis?.pitch.confidence || 0;
  const note = analysis?.pitch.note || '—';
  const octave = analysis?.pitch.octave || 0;

  // Calculate rotation angle for the meter (0-360 degrees for 50-2000 Hz)
  const minHz = 50;
  const maxHz = 2000;
  const range = maxHz - minHz;
  const normalizedFreq = Math.max(0, Math.min(frequency - minHz, range));
  const angle = (normalizedFreq / range) * 270 - 135; // 270 degree range, centered

  return (
    <div className={`glass-effect rounded-2xl p-8 backdrop-blur-lg ${darkMode ? 'bg-slate-900/40 border-slate-700/50' : 'glass-effect-light'}`}>
      <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Real-Time Pitch Meter</h2>

      <div className="flex flex-col items-center justify-center mb-8">
        {/* Circular Meter */}
        <motion.div
          className="relative w-64 h-64 mb-8"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="95"
              fill="none"
              stroke={darkMode ? '#1e293b' : '#e2e8f0'}
              strokeWidth="2"
            />

            {/* Gradient arc for frequency range */}
            <defs>
              <linearGradient id="freqGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="33%" stopColor="#f59e0b" />
                <stop offset="66%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            {/* Arc background */}
            <path
              d="M 100 20 A 80 80 0 0 1 170 150"
              fill="none"
              stroke={darkMode ? '#334155' : '#cbd5e1'}
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Filled arc based on frequency */}
            <path
              d="M 100 20 A 80 80 0 0 1 170 150"
              fill="none"
              stroke="url(#freqGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(angle + 135) * 1.39} 350`}
              opacity={confidence / 100}
            />

            {/* Center circle */}
            <circle cx="100" cy="100" r="50" fill={darkMode ? '#0f172a' : '#ffffff'} />
            <circle
              cx="100"
              cy="100"
              r="48"
              fill="none"
              stroke={darkMode ? '#334155' : '#cbd5e1'}
              strokeWidth="1"
            />

            {/* Needle */}
            <motion.g
              animate={{ rotate: angle }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              style={{ transformOrigin: '100px 100px' }}
            >
              <line x1="100" y1="100" x2="100" y2="35" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
              <circle cx="100" cy="100" r="5" fill="#3b82f6" />
            </motion.g>

            {/* Frequency markers */}
            {[50, 100, 200, 500, 1000, 2000].map((freq, i) => {
              const markerAngle = ((freq - minHz) / (maxHz - minHz)) * 270 - 135;
              const rad = (markerAngle * Math.PI) / 180;
              const x = 100 + 70 * Math.cos(rad);
              const y = 100 + 70 * Math.sin(rad);
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dy="0.3em"
                  className="text-xs"
                  fill={darkMode ? '#94a3b8' : '#64748b'}
                  fontWeight="500"
                >
                  {freq}
                </text>
              );
            })}
          </svg>

          {/* Center display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              key={frequency}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className={`text-4xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {frequency.toFixed(1)}
              </div>
              <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Hz</div>
              <div className={`mt-2 text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                {note}{octave}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 w-full mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-center p-4 rounded-lg ${darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-slate-50 border border-slate-200'}`}
          >
            <div className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Confidence</div>
            <motion.div
              key={confidence}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`text-2xl font-bold mt-1 ${confidence > 70 ? 'text-green-400' : confidence > 40 ? 'text-yellow-400' : 'text-red-400'}`}
            >
              {confidence.toFixed(0)}%
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-center p-4 rounded-lg ${darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-slate-50 border border-slate-200'}`}
          >
            <div className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Octave</div>
            <div className={`text-2xl font-bold mt-1 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{octave}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-center p-4 rounded-lg ${darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-slate-50 border border-slate-200'}`}
          >
            <div className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Range</div>
            <motion.div
              key={vocalRange}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`text-xl font-bold mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
            >
              {vocalRange || '—'}
            </motion.div>
          </motion.div>
        </div>

        {/* Frequency Info */}
        <div className={`text-center text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <p>Vocal Range: {vocalRange || 'Waiting for input...'}</p>
          <p>Confidence Level: {confidence > 70 ? '✓ Stable' : confidence > 40 ? '⚠ Variable' : '✗ Unstable'}</p>
        </div>
      </div>

      {/* Frequency Range Indicator */}
      <div className={`mt-6 p-3 rounded-lg ${darkMode ? 'bg-slate-800/30' : 'bg-slate-100'}`}>
        <div className={`text-xs font-medium mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Frequency Range</div>
        <div className="relative h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-full overflow-hidden">
          <motion.div
            className="absolute h-full w-1 bg-white rounded-full shadow-lg"
            style={{
              left: `${((frequency - minHz) / (maxHz - minHz)) * 100}%`,
            }}
            animate={{ boxShadow: ['0 0 10px rgba(255,255,255,0.5)', '0 0 20px rgba(255,255,255,1)', '0 0 10px rgba(255,255,255,0.5)'] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <div className="flex justify-between text-xs mt-2">
          <span className={darkMode ? 'text-slate-500' : 'text-slate-500'}>50 Hz</span>
          <span className={darkMode ? 'text-slate-500' : 'text-slate-500'}>2000 Hz</span>
        </div>
      </div>
    </div>
  );
};

export default PitchMeter;
