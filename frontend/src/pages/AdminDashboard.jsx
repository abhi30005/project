import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getAllPredictions, addAnnotation, deletePrediction } from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const AdminDashboard = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [annotations, setAnnotations] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => { fetchPredictions(); }, [debouncedSearch, filter]);

  const fetchPredictions = async () => {
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (filter !== 'all') params.filter = filter;
      const res = await getAllPredictions(params);
      setPredictions(res.data);
    } catch (err) {
      toast.error('Error fetching predictions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnnotation = async (id) => {
    const annotation = annotations[id];
    const feedback = feedbacks[id] || '';
    if (!annotation) { toast.error('Please select an annotation category'); return; }
    setSavingId(id);
    try {
      await addAnnotation(id, annotation, feedback);
      toast.success('Annotation & feedback saved!');
      setPredictions(prev => prev.map(p =>
        p._id === id ? { ...p, adminAnnotation: annotation, adminFeedback: feedback } : p
      ));
      setAnnotations(prev => ({ ...prev, [id]: '' }));
      setFeedbacks(prev => ({ ...prev, [id]: '' }));
    } catch (err) {
      toast.error('Error saving annotation');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deletePrediction(id);
      toast.success('Prediction deleted');
      setPredictions(prev => prev.filter(p => p._id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      toast.error('Error deleting prediction');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const getLabelBadge = (label) => {
    const l = label?.toLowerCase() || '';
    if (l.includes('suicide') || l.includes('suicidal')) return 'badge-danger';
    if (l.includes('depression') || l.includes('depressed')) return 'badge-warning';
    return 'badge-success';
  };

  const getAnnotationBadge = (annotation) => {
    if (annotation === 'Suicidal') return 'bg-red-500/15 text-red-400 border-red-500/30';
    if (annotation === 'Non Suicidal') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  };

  const stats = {
    total: predictions.length,
    annotated: predictions.filter(p => p.adminAnnotation).length,
    pending: predictions.filter(p => !p.adminAnnotation).length,
  };

  const STAT_ITEMS = [
    { label: 'Total Submissions', value: stats.total, color: '#00d4ff', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { label: 'Annotated', value: stats.annotated, color: '#10b981', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Pending Review', value: stats.pending, color: '#f59e0b', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <div className="min-h-screen bg-dark-950 bg-grid-pattern">
      <Navbar />
      <div className="absolute inset-0 bg-radial-blue pointer-events-none" />
      <main className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display font-bold text-3xl sm:text-4xl gradient-text mb-3">Admin Dashboard</h1>
          <p className="text-white/40 text-sm">Review all user submissions, annotate categories, leave feedback, and manage records.</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {STAT_ITEMS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="glass-card-hover p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-display font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-white/40 mt-1 font-medium">{s.label}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                  <svg className="w-5 h-5" style={{ color: s.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search + Filter */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="admin-search"
              type="text"
              placeholder="Search by username or text..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-dark pl-10 flex-1"
            />
          </div>
          <select
            id="admin-filter"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="input-dark sm:w-52 bg-dark-950 cursor-pointer"
          >
            <option value="all">📋 All Submissions</option>
            <option value="annotated">✅ Annotated</option>
            <option value="pending">⏳ Pending Review</option>
          </select>
        </motion.div>

        {/* Submissions */}
        {loading ? (
          <LoadingSpinner text="Loading submissions..." />
        ) : predictions.length === 0 ? (
          <EmptyState title="No submissions found" description="No matching predictions to display." />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {predictions.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card p-5 sm:p-6 group hover:border-white/20 transition-all duration-300"
              >
                {/* Top Row: User Info + Date + Delete */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm shadow-neon-blue/20">
                      {p.username?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white/90">{p.username}</span>
                      <p className="text-[10px] text-white/30">{formatDate(p.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Delete Button */}
                    {confirmDeleteId === p._id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-400">Delete?</span>
                        <button
                          onClick={() => handleDelete(p._id)}
                          disabled={deletingId === p._id}
                          className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 transition-all duration-200 disabled:opacity-50"
                        >
                          {deletingId === p._id ? (
                            <div className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                          ) : 'Yes'}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 text-white/40 text-xs font-semibold hover:bg-white/10 transition-all duration-200"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(p._id)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400/70 text-xs font-medium border border-red-500/15 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all duration-200 flex items-center gap-1.5"
                        title="Delete prediction"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* Full Input Text */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-3.5 h-3.5 text-neon-blue/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">User Input Text</span>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                    <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap break-words">
                      {p.inputText}
                    </p>
                  </div>
                </div>

                {/* Model Results */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg bg-white/[0.03] border border-white/5 px-4 py-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Model 1</span>
                      <span className={`text-[10px] font-semibold ${getLabelBadge(p.model1Prediction?.label)} px-2 py-0.5 rounded-full border`}>
                        {p.model1Prediction?.confidence?.toFixed(1) || 0}%
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${
                      getLabelBadge(p.model1Prediction?.label) === 'badge-danger' ? 'text-red-400' :
                      getLabelBadge(p.model1Prediction?.label) === 'badge-warning' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {p.model1Prediction?.label || 'N/A'}
                    </span>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] border border-white/5 px-4 py-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Model 2</span>
                      <span className={`text-[10px] font-semibold ${getLabelBadge(p.model2Prediction?.label)} px-2 py-0.5 rounded-full border`}>
                        {p.model2Prediction?.confidence?.toFixed(1) || 0}%
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${
                      getLabelBadge(p.model2Prediction?.label) === 'badge-danger' ? 'text-red-400' :
                      getLabelBadge(p.model2Prediction?.label) === 'badge-warning' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {p.model2Prediction?.label || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Annotation & Feedback Section */}
                {p.adminAnnotation ? (
                  /* Already annotated — show saved values */
                  <div className="rounded-xl bg-purple-500/5 border border-purple-500/20 px-4 py-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-purple-400/70 font-semibold uppercase tracking-wider">Expert Review</span>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getAnnotationBadge(p.adminAnnotation)}`}>
                        {p.adminAnnotation}
                      </span>
                    </div>
                    {p.adminFeedback && (
                      <div className="pt-2 border-t border-purple-500/10">
                        <p className="text-xs text-white/40 mb-1 font-medium">Feedback:</p>
                        <p className="text-sm text-purple-300/80 leading-relaxed">{p.adminFeedback}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Pending — show annotation form */
                  <div className="rounded-xl bg-white/[0.02] border border-dashed border-white/10 px-4 py-4 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                      <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Pending Review</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Annotation Dropdown */}
                      <div>
                        <label className="block text-[10px] text-white/30 font-medium mb-1.5 uppercase tracking-wider">Category</label>
                        <select
                          value={annotations[p._id] || ''}
                          onChange={e => setAnnotations(prev => ({ ...prev, [p._id]: e.target.value }))}
                          className="input-dark bg-dark-950 text-sm cursor-pointer w-full"
                        >
                          <option value="">Select category...</option>
                          <option value="Suicidal">🔴 Suicidal</option>
                          <option value="Non Suicidal">🟢 Non Suicidal</option>
                          <option value="Not Defined">🟡 Not Defined</option>
                        </select>
                      </div>
                      {/* Feedback Text */}
                      <div>
                        <label className="block text-[10px] text-white/30 font-medium mb-1.5 uppercase tracking-wider">Feedback / Message</label>
                        <input
                          type="text"
                          placeholder="Add feedback or message..."
                          value={feedbacks[p._id] || ''}
                          onChange={e => setFeedbacks(prev => ({ ...prev, [p._id]: e.target.value }))}
                          className="input-dark text-sm w-full"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleAnnotation(p._id)}
                        disabled={savingId === p._id || !annotations[p._id]}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-neon-blue/20 text-purple-300 text-xs font-bold border border-purple-500/20 hover:border-purple-500/40 hover:from-purple-500/30 hover:to-neon-blue/30 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {savingId === p._id ? (
                          <>
                            <div className="w-3 h-3 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Save Review
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Footer */}
            <div className="px-4 py-3 flex items-center justify-between">
              <p className="text-xs text-white/30">
                Showing {predictions.length} submission{predictions.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-3 text-xs text-white/30">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400" /> Suicidal</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Non Suicidal</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /> Not Defined</div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
