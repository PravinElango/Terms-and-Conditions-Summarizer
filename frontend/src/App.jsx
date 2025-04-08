import React, { useState } from 'react';

const App = () => {
  const [inputType, setInputType] = useState('url');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('glance');

  const generateSummary = async () => {
    if (!inputValue) return;

    setIsLoading(true);
    setSummary(null);

    try {
      const response = await fetch('http://localhost:8000/summarize/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }

      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to summarize the text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Terms & Conditions Summarizer</h1>

      {/* Input */}
      <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex mb-4">
          <button
            onClick={() => setInputType('url')}
            className={`px-4 py-2 rounded-l-md ${inputType === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            URL
          </button>
          <button
            onClick={() => setInputType('text')}
            className={`px-4 py-2 rounded-r-md ${inputType === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Paste Text
          </button>
        </div>

        {inputType === 'url' ? (
          <input
            type="url"
            className="w-full p-3 border border-gray-300 rounded-md mb-4"
            placeholder="Enter T&C page URL"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        ) : (
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md mb-4 h-32"
            placeholder="Paste full Terms and Conditions text here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}

        <button
          onClick={generateSummary}
          disabled={!inputValue || isLoading}
          className={`px-6 py-3 rounded-md ${!inputValue || isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium`}
        >
          {isLoading ? 'Analyzing...' : 'Summarize Terms'}
        </button>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center p-8">
          <div className="inline-block h-8 w-8 border-4 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Analyzing terms & conditions...</p>
        </div>
      )}

      {/* Summary Output */}
      {summary && (
        <div className="bg-white rounded-lg border border-gray-200 summary-container" id="summary-content">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-xl font-semibold">{summary.title}</h2>
            <p className="text-sm text-gray-600">Last updated: {summary.lastUpdated}</p>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('glance')}
                className={`px-4 py-2 font-medium ${activeTab === 'glance' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                At a Glance
              </button>
              <button
                onClick={() => setActiveTab('key')}
                className={`px-4 py-2 font-medium ${activeTab === 'key' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                Key Points
              </button>
              <button
                onClick={() => setActiveTab('detailed')}
                className={`px-4 py-2 font-medium ${activeTab === 'detailed' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                Detailed Breakdown
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'glance' && (
              <p className="text-gray-800">{summary.glance}</p>
            )}
            {activeTab === 'key' && (
              <ul className="space-y-3">
                {summary.keyPoints.map((item, idx) => (
                  <li key={idx} className={`p-3 rounded-md border ${getRiskColor(item.risk)}`}>
                    {item.point}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'detailed' && (
              <div className="space-y-6">
                {summary.detailed.map((section, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-4">
                    <h3 className="font-medium text-lg mb-2 flex items-center">
                      {section.section}
                      <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getRiskColor(section.risk)}`}>
                        {section.risk} risk
                      </span>
                    </h3>
                    <p className="text-gray-700">{section.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 text-sm text-gray-600 rounded-b-lg">
            <p>This summary is generated automatically and should not be considered legal advice. Always review the full terms when making important decisions.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
