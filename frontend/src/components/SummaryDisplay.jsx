import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Copy, Download, Check, ShieldAlert, ShieldCheck, Shield, Eye, List, AlignLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SummaryDisplay = ({ summary }) => {
  const [activeTab, setActiveTab] = useState('glance');
  const [copied, setCopied] = useState(false);

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high': return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case 'medium': return <Shield className="w-4 h-4 text-yellow-600" />;
      case 'low': return <ShieldCheck className="w-4 h-4 text-green-600" />;
      default: return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  const copyToClipboard = () => {
    const text = `
Title: ${summary.title}
Last Updated: ${summary.lastUpdated}
---
At a Glance:
${summary.glance}
---
Key Points:
${summary.keyPoints.map(p => `- [${p.risk}] ${p.point}`).join('\n')}
    `.trim();
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(summary.title || "Terms Summary", 20, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Last Updated: ${summary.lastUpdated}`, 20, 28);
    
    let yPos = 40;
    
    // Abstract Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("At a Glance", 20, yPos);
    yPos += 10;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const splitGlance = doc.splitTextToSize(summary.glance, 170);
    doc.text(splitGlance, 20, yPos);
    yPos += (splitGlance.length * 7) + 10;
    
    // Key Points
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Key Points", 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    summary.keyPoints.forEach(item => {
        if (yPos > 270) { doc.addPage(); yPos = 20; }
        const text = `• [${item.risk?.toUpperCase()}] ${item.point}`;
        const splitText = doc.splitTextToSize(text, 170);
        doc.text(splitText, 20, yPos);
        yPos += (splitText.length * 7) + 5;
    });

    doc.save("terms-summary.pdf");
  };

  const tabs = [
    { id: 'glance', label: 'At a Glance', icon: Eye },
    { id: 'key', label: 'Key Points', icon: List },
    { id: 'detailed', label: 'Detailed Breakdown', icon: AlignLeft },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{summary.title}</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Last updated: {summary.lastUpdated}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={copyToClipboard}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-blue-600 tooltip"
            title="Copy Summary"
          >
            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
          </button>
          <button 
            onClick={downloadPDF}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-blue-600"
            title="Download PDF"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-6 gap-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "py-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap",
              activeTab === tab.id 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 min-h-[300px] bg-gray-50/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'glance' && (
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">{summary.glance}</p>
              </div>
            )}

            {activeTab === 'key' && (
              <ul className="space-y-4">
                {summary.keyPoints.map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn("p-4 rounded-xl border flex gap-3 items-start shadow-sm bg-white", getRiskColor(item.risk))}
                  >
                    <div className="mt-1 shrink-0">{getRiskIcon(item.risk)}</div>
                    <div>
                      <span className="font-semibold block mb-1 text-sm uppercase tracking-wider opacity-80">{item.risk} Risk</span>
                      <p className="text-gray-900 font-medium">{item.point}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}

            {activeTab === 'detailed' && (
              <div className="space-y-6">
                {summary.detailed.map((section, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-lg text-gray-900">{section.section}</h3>
                      <span className={cn("px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1", getRiskColor(section.risk))}>
                        {getRiskIcon(section.risk)}
                        {section.risk} risk
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">{section.content}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="bg-gray-50 p-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-400">
          AI-generated summary. Not legal advice. Always read the full document.
        </p>
      </div>
    </motion.div>
  );
};

export default SummaryDisplay;
