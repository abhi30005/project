import { motion } from 'framer-motion';

const COLOR_MAP = {
  danger: {
    text: '#ef4444',
    bg: '#ef4444',
    label: 'text-red-400',
    labelBg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  warning: {
    text: '#f59e0b',
    bg: '#f59e0b',
    label: 'text-amber-400',
    labelBg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  safe: {
    text: '#10b981',
    bg: '#10b981',
    label: 'text-emerald-400',
    labelBg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  info: {
    text: '#00d4ff',
    bg: '#00d4ff',
    label: 'text-cyan-400',
    labelBg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
};

const getColorScheme = (label) => {
  const lower = label?.toLowerCase() || '';

  if (lower.includes('suicide') || lower.includes('suicidal'))
    return COLOR_MAP.danger;

  if (lower.includes('depression') || lower.includes('depressed'))
    return COLOR_MAP.warning;

  if (
    lower.includes('non') ||
    lower.includes('not') ||
    lower.includes('normal')
  )
    return COLOR_MAP.safe;

  return COLOR_MAP.info;
};

const ModelResultPanel = ({
  modelLabel,
  modelSubtitle,
  prediction,
  delay,
}) => {
  const scheme = getColorScheme(prediction?.label);
  const confidence = prediction?.confidence || 0;

  return (
    <div
      className={`rounded-xl ${scheme.labelBg} ${scheme.border} border p-5 space-y-3 transition-all duration-300 hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
          {modelLabel}
        </span>

        <span className="text-[10px] text-white/30 font-mono">
          {modelSubtitle}
        </span>
      </div>

      <p
        className="text-lg font-display font-bold"
        style={{ color: scheme.text }}
      >
        {prediction?.label || 'N/A'}
      </p>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40">Confidence</span>

          <span
            className="text-xs font-bold"
            style={{ color: scheme.text }}
          >
            {confidence.toFixed(1)}%
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{
              duration: 1.2,
              ease: 'easeOut',
              delay,
            }}
            className="h-full rounded-full"
            style={{ backgroundColor: scheme.bg }}
          />
        </div>
      </div>
    </div>
  );
};

const PredictionCard = ({ result }) => {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="glass-card p-6 sm:p-8"
    >
      {/* Model Results Only */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ModelResultPanel
          modelLabel="Model 1"
          modelSubtitle="DistilRoBERTa"
          prediction={result.model1Prediction}
          delay={0.3}
        />

        <ModelResultPanel
          modelLabel="Model 2"
          modelSubtitle="ELECTRA"
          prediction={result.model2Prediction}
          delay={0.5}
        />
      </div>
    </motion.div>
  );
};

export default PredictionCard;