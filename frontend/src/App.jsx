import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Link, FileText, Sparkles, Clock, Menu } from 'lucide-react';
import SummaryDisplay from './components/SummaryDisplay';
import HistorySidebar from './components/HistorySidebar';

const App = () => {
  const [inputType, setInputType] = useState('url');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('summaryHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (newSummary) => {
    const item = {
      ...newSummary,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
    };
    const updated = [item, ...history].slice(0, 50); // Keep last 50
    setHistory(updated);
    localStorage.setItem('summaryHistory', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('summaryHistory');
  };

  const generateSummary = async () => {
    if (!inputValue) return;

    setIsLoading(true);
    setSummary(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/summarize/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }

      const data = await response.json();
      setSummary(data);
      saveToHistory(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to summarize the text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background Blobs for specific "wow" factor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={(item) => {
          setSummary(item);
          setIsHistoryOpen(false);
        }}
        onClear={clearHistory}
      />

      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="p-3 bg-white/50 backdrop-blur-md rounded-xl hover:bg-white/80 transition-all shadow-sm border border-white/40 text-gray-600 hover:text-blue-600 group"
          >
            <Clock size={24} className="group-hover:rotate-12 transition-transform" />
          </button>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2 tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-gray-500 font-medium">Simplify the fine print in seconds.</p>
          </div>
          <div className="w-12"></div> {/* Spacer for balance */}
        </header>

        {/* Hero Input Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-3xl p-2 mb-10 mx-auto max-w-3xl"
        >
          <div className="bg-white/50 rounded-2xl p-6 md:p-8">
            <div className="flex bg-gray-100/80 p-1.5 rounded-xl mb-6 w-fit mx-auto">
              <button
                onClick={() => setInputType('url')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${inputType === 'url' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Link size={16} /> URL Link
              </button>
              <button
                onClick={() => setInputType('text')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${inputType === 'text' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FileText size={16} /> Paste Text
              </button>
            </div>

            <div className="relative group">
              {inputType === 'url' ? (
                <div className="relative">
                  <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="url"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-medium text-gray-700"
                    placeholder="https://example.com/terms"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
              ) : (
                <textarea
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-medium text-gray-700 min-h-[150px] resize-y"
                  placeholder="Paste the full legal text here..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              )}
            </div>

            <button
              onClick={generateSummary}
              disabled={!inputValue || isLoading}
              className={`mt-6 w-full py-4 text-lg font-bold rounded-xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${!inputValue || isLoading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-blue-500/30'
                }`}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Legal Text...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Summarize Now
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Summary Output */}
        {summary && (
          <SummaryDisplay summary={summary} />
        )}
      </div>
    </div>
  );
};

export default App;
