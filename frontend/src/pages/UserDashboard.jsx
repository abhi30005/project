import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { predictText } from '../services/api';
import Navbar from '../components/Navbar';
import PredictionCard from '../components/PredictionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import DisclaimerBanner from '../components/DisclaimerBanner';

const UserDashboard = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    if (text.trim().length < 5) {
      toast.error('Please enter a longer text for accurate analysis');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await predictText(text);
      setResult(res.data);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-dark-950 bg-grid-pattern relative">
      <Navbar />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-radial-blue pointer-events-none" />
      <div className="absolute inset-0 bg-radial-purple pointer-events-none" />

      <main className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-white/10 flex items-center justify-center mx-auto mb-5"
          >
            <svg className="w-7 h-7 text-neon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </motion.div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl gradient-text mb-3">
            Text Analysis Dashboard
          </h1>
          <p className="text-white/40 text-sm sm:text-base max-w-lg mx-auto">
            Enter text below to analyze for potential risk indicators using advanced AI models.
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <DisclaimerBanner />
        </motion.div>

        {/* Input Section */}
        <motion.form
          onSubmit={handlePredict}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-6 sm:p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-neon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-sm font-display font-semibold text-white/70 uppercase tracking-wider">
                Input Text
              </h2>
            </div>
            {text.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
            )}
          </div>

          <textarea
            id="prediction-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your post or sentence here for analysis..."
            rows={6}
            className="textarea-dark text-base mb-4"
            maxLength={5000}
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-white/30">
              {text.length.toLocaleString()}/5,000 characters
            </span>
            <button
              id="predict-btn"
              type="submit"
              disabled={loading || !text.trim()}
              className="btn-neon flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Predict
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Loading */}
        {loading && <LoadingSpinner text="Analyzing text with AI models..." />}

        {/* Results */}
        {result && !loading && <PredictionCard result={result} />}

        {/* Guide when no result */}
        {!result && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto mb-5"
            >
              <svg className="w-8 h-8 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </motion.div>
            <p className="text-sm text-white/30">
              Enter text above and click <span className="text-neon-blue font-medium">Predict</span> to get started
            </p>
            <p className="text-xs text-white/20 mt-1">Two AI models will analyze your text simultaneously</p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
