import { motion } from 'framer-motion';

const DisclaimerBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 border border-amber-500/20 bg-amber-500/5 mb-6 rounded-xl flex items-start gap-3"
    >
      <div className="flex-shrink-0 mt-0.5">
        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-amber-400 mb-1">Important Disclaimer</h4>
        <p className="text-xs text-white/60 leading-relaxed">
          This AI system is designed for preliminary text analysis and research purposes only. It is <strong>not</strong> a diagnostic tool and should not be used as a replacement for professional psychological or medical evaluation. If you or someone you know is in immediate danger, please contact emergency services or a mental health professional immediately.
        </p>
      </div>
    </motion.div>
  );
};

export default DisclaimerBanner;