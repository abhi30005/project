import { motion } from 'framer-motion';

const COLOR_MAP = {
  danger: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: '#ef4444' },
  warning: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: '#f59e0b' },
  safe: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: '#10b981' },
};

const getLabelStyle = (label) => {
  const lower = label?.toLowerCase() || '';
  if (lower.includes('suicide') || lower.includes('suicidal')) return COLOR_MAP.danger;
  if (lower.includes('depression') || lower.includes('depressed')) return COLOR_MAP.warning;
  return COLOR_MAP.safe;
};

const HistoryCard = ({ prediction, index = 0 }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const m1Style = getLabelStyle(prediction.model1Prediction?.label);
  const m2Style = getLabelStyle(prediction.model2Prediction?.label);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ scale: 1.03, y: -6 }}
      className="glass-card p-5 space-y-4 cursor-default group"
    >
      {/* Header with text and date */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-white/80 line-clamp-2 leading-relaxed flex-1">
          &ldquo;{prediction.inputText}&rdquo;
        </p>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <svg className="w-3 h-3 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] text-white/30 whitespace-nowrap">
            {formatDate(prediction.createdAt)}
          </span>
        </div>
      </div>

      {/* Prediction Results */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-lg ${m1Style.bg} border ${m1Style.border} px-3 py-2.5 transition-all duration-300 group-hover:scale-[1.02]`}>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m1Style.dot }} />
            <span className="text-[10px] text-white/40 font-medium">Model 1</span>
          </div>
          <span className={`text-xs font-semibold ${m1Style.text}`}>
            {prediction.model1Prediction?.label || 'N/A'}
          </span>
          <span className="text-[10px] text-white/30 ml-1">
            ({prediction.model1Prediction?.confidence?.toFixed(1)}%)
          </span>
        </div>
        <div className={`rounded-lg ${m2Style.bg} border ${m2Style.border} px-3 py-2.5 transition-all duration-300 group-hover:scale-[1.02]`}>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m2Style.dot }} />
            <span className="text-[10px] text-white/40 font-medium">Model 2</span>
          </div>
          <span className={`text-xs font-semibold ${m2Style.text}`}>
            {prediction.model2Prediction?.label || 'N/A'}
          </span>
          <span className="text-[10px] text-white/30 ml-1">
            ({prediction.model2Prediction?.confidence?.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Admin Annotation */}
      {prediction.adminAnnotation ? (
        <div className="rounded-lg bg-purple-500/5 border border-purple-500/20 px-3 py-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <svg className="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] text-purple-400/60 font-medium">Expert Review</span>
          </div>
          <span className="text-xs text-purple-400 font-semibold">{prediction.adminAnnotation}</span>
        </div>
      ) : (
        <div className="rounded-lg bg-white/[0.02] border border-dashed border-white/10 px-3 py-2.5 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="text-[10px] text-white/25">Awaiting expert review</span>
        </div>
      )}
    </motion.div>
  );
};

export default HistoryCard;
