import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { audioRecorder } from './utils/audioRecorder';
import { useAppStore } from './store/appStore';
import { getVocalRange, getVoiceQualityFeedback } from './utils/audioProcessor';
import Header from './components/Header';
import PitchMeter from './components/PitchMeter';
import AnalyticsPanel from './components/AnalyticsPanel';
import WaveformVisualizer from './components/WaveformVisualizer';
import FrequencyAnalyzer from './components/FrequencyAnalyzer';
import PitchHistoryChart from './components/PitchHistoryChart';
import ControlPanel from './components/ControlPanel';
import VoiceQualityFeedback from './components/VoiceQualityFeedback';

import './App.css';

function App() {
  const {
    isRecording,
    setRecording,
    setCurrentAnalysis,
    addToHistory,
    updateStats,
    currentAnalysis,
    analysisHistory,
    darkMode,
  } = useAppStore();

  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vocalRange, setVocalRange] = useState<string>('');
  const [voiceFeedback, setVoiceFeedback] = useState<string[]>([]);

  useEffect(() => {
    const initAudio = async () => {
      try {
        await audioRecorder.initialize();
        setInitialized(true);
      } catch (err) {
        setError('Microphone access denied or not available. Please check your permissions.');
        console.error(err);
      }
    };

    initAudio();

    return () => {
      if (isRecording) {
        audioRecorder.stopRecording();
      }
    };
  }, []);

  useEffect(() => {
    if (!isRecording || !initialized) return;

    const analysisInterval = setInterval(() => {
      if (audioRecorder.getAnalyser()) {
        const dataArray = audioRecorder.getWaveformData();
        const floatArray = new Float32Array(dataArray.length);
        for (let i = 0; i < dataArray.length; i++) {
          floatArray[i] = (dataArray[i] - 128) / 128;
        }

        const { analyzeAudio } = require('./utils/audioProcessor');
        const analysis = analyzeAudio(floatArray, audioRecorder.getAudioContext()!.sampleRate);

        setCurrentAnalysis(analysis);
        const range = getVocalRange(analysis.pitch.frequency);
        setVocalRange(range);

        const feedback = getVoiceQualityFeedback(
          analysis.pitch.confidence,
          analysis.volume,
          analysis.frequencyBand
        );
        setVoiceFeedback(feedback);

        // Add to history every 100ms
        if (analysisHistory.length === 0 || Date.now() - analysisHistory[analysisHistory.length - 1].timestamp.getTime() > 100) {
          addToHistory({
            timestamp: new Date(),
            frequency: analysis.pitch.frequency,
            confidence: analysis.pitch.confidence,
            volume: analysis.volume,
            note: analysis.pitch.note,
            vocalRange: range,
          });
        }
      }
    }, 50);

    return () => {
      clearInterval(analysisInterval);
    };
  }, [isRecording, initialized, analysisHistory, addToHistory, setCurrentAnalysis]);

  const handleStartRecording = async () => {
    try {
      setError(null);
      setRecording(true);
      audioRecorder.startRecording((analysis) => {
        setCurrentAnalysis(analysis);
      });
    } catch (err) {
      setError('Failed to start recording');
      console.error(err);
    }
  };

  const handleStopRecording = () => {
    setRecording(false);
    audioRecorder.stopRecording();
    updateStats();
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
      {/* Animated background elements */}
      <motion.div
        className={`fixed inset-0 opacity-10 ${darkMode ? 'bg-blue-500' : 'bg-blue-200'}`}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundSize: '400% 400%',
        }}
      />

      <div className="relative z-10">
        <Header />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mx-4 mb-4 p-4 rounded-lg ${darkMode ? 'bg-red-900/20 border border-red-500/50' : 'bg-red-100 border border-red-400'}`}
          >
            <p className={darkMode ? 'text-red-200' : 'text-red-800'}>{error}</p>
          </motion.div>
        )}

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Pitch Meter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <PitchMeter analysis={currentAnalysis} vocalRange={vocalRange} />
            </motion.div>

            {/* Analytics Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AnalyticsPanel analysis={currentAnalysis} />
            </motion.div>
          </div>

          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <ControlPanel
              isRecording={isRecording}
              onStart={handleStartRecording}
              onStop={handleStopRecording}
              initialized={initialized}
            />
          </motion.div>

          {/* Voice Quality Feedback */}
          {voiceFeedback.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <VoiceQualityFeedback feedback={voiceFeedback} />
            </motion.div>
          )}

          {/* Visualizers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <WaveformVisualizer />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <FrequencyAnalyzer />
            </motion.div>
          </div>

          {/* Pitch History Chart */}
          {analysisHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <PitchHistoryChart history={analysisHistory} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
