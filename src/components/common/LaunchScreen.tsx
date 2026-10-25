import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LaunchScreenProps {
  onFinish?: () => void;
  forceShow?: boolean;
}

export const LaunchScreen: React.FC<LaunchScreenProps> = ({ onFinish, forceShow = false }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!visible && !forceShow) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.04 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white select-none"
      >
        <div className="relative flex flex-col items-center">
          {/* Animated SVG ScalperLab Emblem */}
          <div className="relative w-24 h-24 mb-6">
            {/* Ambient emerald backlight */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.8, 1.2, 1], opacity: [0, 0.4, 0.25] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute inset-0 rounded-full bg-emerald-500 blur-2xl"
            />

            <svg
              viewBox="0 0 100 100"
              className="relative w-full h-full text-emerald-400 stroke-current drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Outer hexagon/circle precision lens */}
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="2"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                stroke="#10B981"
                strokeWidth="3.5"
                strokeDasharray="264"
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* ScalperLab Precision Pitch & Data Curve */}
              <motion.path
                d="M 28 65 L 42 50 L 56 60 L 74 34"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeDasharray="90"
                initial={{ strokeDashoffset: 90 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
              />

              {/* Glowing focal target dot */}
              <motion.circle
                cx="74"
                cy="34"
                r="5.5"
                fill="#10B981"
                stroke="#FFFFFF"
                strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.95 }}
              />

              {/* Crosshair accents */}
              <motion.line
                x1="50"
                y1="18"
                x2="50"
                y2="26"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              />
              <motion.line
                x1="50"
                y1="74"
                x2="50"
                y2="82"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              />
            </svg>
          </div>

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-white font-sans">
                SCALPER<span className="text-emerald-400">LAB</span>
              </span>
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.8 }}
              className="text-[11px] font-medium tracking-widest uppercase text-slate-400 mt-1 font-mono"
            >
              Quantitative Football Intelligence
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
