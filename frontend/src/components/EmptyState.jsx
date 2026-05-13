import { motion } from 'framer-motion';

const EmptyState = ({ title = 'No data yet', description = 'Nothing to display at the moment.', icon, actionLabel, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative"
      >
        {icon || (
          <svg className="w-10 h-10 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
        {/* Decorative corner dots */}
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-neon-blue/30" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-neon-purple/30" />
      </motion.div>
      <h3 className="text-lg font-display font-semibold text-white/70 mb-2">{title}</h3>
      <p className="text-sm text-white/40 text-center max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 btn-neon text-sm px-6 py-2.5"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
