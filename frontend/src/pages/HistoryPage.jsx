import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getHistory } from '../services/api';
import Navbar from '../components/Navbar';
import HistoryCard from '../components/HistoryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const HistoryPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await getHistory();
      setPredictions(res.data);
    } catch (err) {
      toast.error('Error fetching history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 bg-grid-pattern relative">
      <Navbar />
      <div className="absolute inset-0 bg-radial-blue pointer-events-none" />
      <div className="absolute inset-0 bg-radial-purple pointer-events-none" />
      <main className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl gradient-text mb-3">Analysis History</h1>
              <p className="text-white/40 text-sm">View your submitted analyses with AI model predictions, expert annotations, and feedback.</p>
            </div>
            {predictions.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-white/50 font-medium">{predictions.length} total analyses</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Legend */}
        {predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 flex items-center gap-4 text-xs text-white/30"
          >
            <span className="text-white/50 font-medium">Legend:</span>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400" /> Suicidal</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Non Suicidal</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /> Not Defined / Other</div>
          </motion.div>
        )}

        {/* Content */}
        {loading ? (
          <LoadingSpinner text="Loading history..." />
        ) : predictions.length === 0 ? (
          <EmptyState
            title="No analyses yet"
            description="Your prediction history will appear here once you start analyzing text from the dashboard."
            actionLabel="Go to Dashboard"
            onAction={() => navigate('/dashboard')}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {predictions.map((p, i) => <HistoryCard key={p._id} prediction={p} index={i} />)}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
