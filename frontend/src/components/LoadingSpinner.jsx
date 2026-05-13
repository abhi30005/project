import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = 'Processing...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-5 py-16"
    >
      <div className="relative w-20 h-20">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-white/5" />
        {/* Spinning ring 1 */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 animate-spin" />
        {/* Spinning ring 2 (reverse) */}
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        {/* Center pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-3 h-3 rounded-full bg-cyan-400"
          />
        </div>
      </div>
      <div className="text-center">
        <p className="text-white/60 text-sm font-medium">{text}</p>
        <p className="text-white/25 text-xs mt-1">This may take a few seconds</p>
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;
