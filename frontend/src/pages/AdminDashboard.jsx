import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getAllPredictions, addAnnotation } from '../services/api';
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
  const [savingId, setSavingId] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

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
    if (!annotation?.trim()) { toast.error('Please enter an annotation'); return; }
    setSavingId(id);
    try {
      await addAnnotation(id, annotation);
      toast.success('Annotation saved successfully!');
      setPredictions(prev => prev.map(p => p._id === id ? { ...p, adminAnnotation: annotation } : p));
      setAnnotations(prev => ({ ...prev, [id]: '' }));
    } catch (err) {
      toast.error('Error saving annotation');
    } finally {
      setSavingId(null);
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
          <p className="text-white/40 text-sm">Review all user submissions and add expert annotations.</p>
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

        {/* Submissions Table */}
        {loading ? (
          <LoadingSpinner text="Loading submissions..." />
        ) : predictions.length === 0 ? (
          <EmptyState title="No submissions found" description="No matching predictions to display." />
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-dark min-w-[900px]">
                <thead>
                  <tr>
                    <th className="w-32">User</th>
                    <th className="w-56">Input Text</th>
                    <th>Model 1</th>
                    <th>Model 2</th>
                    <th className="w-52">Annotation</th>
                    <th className="w-36">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((p, i) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="group"
                    >
                      {/* User */}
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-sm shadow-neon-blue/20">
                            {p.username?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="text-white/80 text-xs font-medium truncate max-w-[80px]">{p.username}</span>
                        </div>
                      </td>

                      {/* Input Text */}
                      <td>
                        <p
                          className="text-white/60 text-xs line-clamp-2 max-w-[220px] cursor-pointer hover:text-white/80 transition-colors"
                          onClick={() => setExpandedRow(expandedRow === p._id ? null : p._id)}
                          title="Click to expand"
                        >
                          {expandedRow === p._id ? p.inputText : p.inputText}
                        </p>
                      </td>

                      {/* Model 1 */}
                      <td>
                        <span className={getLabelBadge(p.model1Prediction?.label)}>
                          {p.model1Prediction?.label || 'N/A'}
                          <span className="ml-1 opacity-70">({p.model1Prediction?.confidence?.toFixed(1) || 0}%)</span>
                        </span>
                      </td>

                      {/* Model 2 */}
                      <td>
                        <span className={getLabelBadge(p.model2Prediction?.label)}>
                          {p.model2Prediction?.label || 'N/A'}
                          <span className="ml-1 opacity-70">({p.model2Prediction?.confidence?.toFixed(1) || 0}%)</span>
                        </span>
                      </td>

                      {/* Annotation */}
                      <td>
                        {p.adminAnnotation ? (
                          <div className="flex items-center gap-1.5">
                            <span className="badge bg-purple-500/20 text-purple-400 border border-purple-500/30">
                              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {p.adminAnnotation}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              placeholder="Add annotation..."
                              value={annotations[p._id] || ''}
                              onChange={e => setAnnotations(prev => ({ ...prev, [p._id]: e.target.value }))}
                              onKeyDown={e => e.key === 'Enter' && handleAnnotation(p._id)}
                              className="input-dark py-1.5 px-2.5 text-xs w-32"
                            />
                            <button
                              onClick={() => handleAnnotation(p._id)}
                              disabled={savingId === p._id}
                              className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-semibold hover:bg-purple-500/30 transition-all duration-200 disabled:opacity-50 flex-shrink-0 hover:scale-105 active:scale-95"
                            >
                              {savingId === p._id ? (
                                <div className="w-3 h-3 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                              ) : (
                                'Save'
                              )}
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Date */}
                      <td>
                        <span className="text-white/30 text-[11px] whitespace-nowrap">{formatDate(p.createdAt)}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
              <p className="text-xs text-white/30">
                Showing {predictions.length} submission{predictions.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2 text-xs text-white/30">
                <div className="w-2 h-2 rounded-full bg-red-400" /> High Risk
                <div className="w-2 h-2 rounded-full bg-amber-400 ml-2" /> Depression
                <div className="w-2 h-2 rounded-full bg-emerald-400 ml-2" /> Safe
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
