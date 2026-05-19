import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';

const Header: React.FC = () => {
  const { darkMode, setDarkMode } = useAppStore();

  return (
    <header className={`${darkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-white/50 border-slate-200'} border-b backdrop-blur-md sticky top-0 z-50`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-gradient-to-br from-blue-400 to-indigo-500'} flex items-center justify-center text-white font-bold text-lg`}>
            🎤
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Voice Pitch Analyzer</h1>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Professional Vocal Analysis</p>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-slate-200 hover:bg-slate-300 text-blue-600'}`}
        >
          {darkMode ? '☀️' : '🌙'}
        </motion.button>
      </div>
    </header>
  );
};

export default Header;
