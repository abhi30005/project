import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 bg-grid-pattern relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-radial-blue pointer-events-none" />
      <div className="absolute inset-0 bg-radial-purple pointer-events-none" />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(i) * 20, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
          className="absolute w-1 h-1 rounded-full bg-neon-blue"
          style={{ left: `${15 + i * 14}%`, top: `${20 + i * 10}%` }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center relative z-10"
      >
        {/* Glitching 404 */}
        <div className="relative mb-6">
          <motion.h1
            animate={{ opacity: [1, 0.4, 1, 0.6, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl sm:text-[10rem] font-display font-black gradient-text leading-none"
          >
            404
          </motion.h1>
          {/* Glitch shadows */}
          <motion.h1
            animate={{ x: [-2, 2, -1, 0], opacity: [0, 0.3, 0, 0.2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 text-8xl sm:text-[10rem] font-display font-black text-neon-blue/20 leading-none"
          >
            404
          </motion.h1>
          <motion.h1
            animate={{ x: [2, -2, 1, 0], opacity: [0, 0.2, 0, 0.3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 text-8xl sm:text-[10rem] font-display font-black text-neon-pink/20 leading-none"
          >
            404
          </motion.h1>
        </div>

        <h2 className="text-xl sm:text-2xl font-display font-bold text-white/80 mb-3">
          Page Not Found
        </h2>
        <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved to a different dimension.
        </p>

        <Link to="/dashboard" className="btn-neon inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
