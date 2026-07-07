import { useState } from 'react';

// ---------------------------------------------------------------------------
// UI Translation Matrix — English & Hindi (with Discovery Chips)
// ---------------------------------------------------------------------------
const uiTranslations = {
  en: {
    appTitle: 'SevaMitra AI',
    appSubtitle: 'Your Digital Government Guide',
    sevaTab: 'Seva Kendra',
    dastavezTab: 'Dastavez Kendra',
    shikayatTab: 'Shikayat Kendra',
    sevaDesc: 'Information Desk',
    dastavezDesc: 'Document Desk',
    shikayatDesc: 'Grievance Desk',
    inputLabel: 'Enter your query below',
    inputPlaceholder: 'Type your question here...',
    submitBtn: 'Get Assistance',
    loading: 'Processing your request...',
    idleMessage: 'Your AI-powered response will appear here.\nSelect a service desk, type your question, and get instant assistance.',
    errorMessage: 'Something went wrong. Please try again.',
    langLabel: 'Language',
    sevaIcon: '🏛️',
    dastavezIcon: '📋',
    shikayatIcon: '📢',
    voiceBtn: 'Voice Input',
    voiceListening: 'Listening to voice input...',
    copyBtn: 'Copy Text',
    copiedBtn: 'Copied!',
    exportBtn: 'Export Doc',
    outputTitle: 'AI Response',
    quickSuggestions: 'Quick Suggestions',
    suggestions: {
      seva: ['PM-Kisan Eligibility', 'Ayushman Bharat Benefits'],
      dastavez: ['New Passport Documents', 'Ration Card Check'],
      shikayat: ['PWD Road Damage Complaint', 'Water Supply Disruption'],
    },
  },
  hi: {
    appTitle: 'सेवामित्र AI',
    appSubtitle: 'आपका डिजिटल सरकार गाइड',
    sevaTab: 'सेवा केंद्र',
    dastavezTab: 'दस्तावेज़ केंद्र',
    shikayatTab: 'शिकायत केंद्र',
    sevaDesc: 'जानकारी डेस्क',
    dastavezDesc: 'दस्तावेज़ डेस्क',
    shikayatDesc: 'शिकायत डेस्क',
    inputLabel: 'नीचे अपना सवाल लिखें',
    inputPlaceholder: 'अपना सवाल यहाँ लिखें...',
    submitBtn: 'सहायता प्राप्त करें',
    loading: 'आपका अनुरोध प्रोसेस हो रहा है...',
    idleMessage: 'आपका AI-संचालित उत्तर यहाँ दिखाई देगा।\nसेवा डेस्क चुनें, अपना सवाल लिखें, और तुरंत सहायता प्राप्त करें।',
    errorMessage: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
    langLabel: 'भाषा',
    sevaIcon: '🏛️',
    dastavezIcon: '📋',
    shikayatIcon: '📢',
    voiceBtn: 'आवाज इनपुट',
    voiceListening: 'आवाज सुन रहा है...',
    copyBtn: 'कॉपी करें',
    copiedBtn: 'कॉपी हुआ!',
    exportBtn: 'निर्यात करें',
    outputTitle: 'AI उत्तर',
    quickSuggestions: 'त्वरित सुझाव',
    suggestions: {
      seva: ['पीएम-किसान पात्रता', 'आयुष्मान भारत लाभ'],
      dastavez: ['नए पासपोर्ट दस्तावेज', 'राशन कार्ड चेक'],
      shikayat: ['सड़क मरम्मत शिकायत', 'पानी की समस्या'],
    },
  },
};

// Language token → full name mapping for backend
const langMap = { hi: 'Hindi', en: 'English' };

// Tab configuration
const tabs = [
  { key: 'seva', tabLabel: 'sevaTab', descLabel: 'sevaDesc', iconLabel: 'sevaIcon' },
  { key: 'dastavez', tabLabel: 'dastavezTab', descLabel: 'dastavezDesc', iconLabel: 'dastavezIcon' },
  { key: 'shikayat', tabLabel: 'shikayatTab', descLabel: 'shikayatDesc', iconLabel: 'shikayatIcon' },
];

// ---------------------------------------------------------------------------
// App Component
// ---------------------------------------------------------------------------
function App() {
  const [activeTab, setActiveTab] = useState('seva');
  const [language, setLanguage] = useState('hi');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = uiTranslations[language];

  // -------------------------------------------------------------------------
  // Proxy Communication Loop (PRESERVED — no changes)
  // -------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setOutput('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input.trim(),
          contextType: activeTab,
          language: langMap[language],
        }),
      });

      const data = await res.json();

      if (data.success) {
        setOutput(data.text);
      } else {
        setOutput(data.error || t.errorMessage);
      }
    } catch {
      setOutput(t.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Workspace Action Handlers
  // -------------------------------------------------------------------------
  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API not available
    }
  };

  const handleExport = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sevamitra-document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleVoice = () => {
    setVoiceActive((prev) => !prev);
  };

  // Current suggestion chips
  const chips = t.suggestions[activeTab] || [];

  // -------------------------------------------------------------------------
  // Render — Twin-Pane Command Dashboard
  // -------------------------------------------------------------------------
  return (
    <div className="app-shell">
      {/* ---- Header / Branding ---- */}
      <header role="banner" className="header-bar">
        <div className="header-content">
          <div className="brand-block">
            <div className="brand-icon">🇮🇳</div>
            <div>
              <h1 className="app-title">{t.appTitle}</h1>
              <p className="app-subtitle">{t.appSubtitle}</p>
            </div>
          </div>
          <div className="lang-switcher">
            <label htmlFor="lang-select" className="lang-label">
              {t.langLabel}
            </label>
            <select
              id="lang-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label={t.langLabel}
              className="lang-select"
            >
              <option value="hi">हिन्दी</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </header>

      {/* ---- Twin-Pane Grid ---- */}
      <div className="twin-pane">
        {/* ==== LEFT PANE — Configuration ==== */}
        <aside className="left-pane">
          {/* Kendra Navigation Tabs */}
          <nav role="navigation" aria-label="Service desks" className="tab-nav">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                aria-label={t[tab.tabLabel]}
                className={`tab-btn ${activeTab === tab.key ? 'tab-active' : ''}`}
              >
                <span className="tab-icon">{t[tab.iconLabel]}</span>
                <span className="tab-name">{t[tab.tabLabel]}</span>
                <span className="tab-desc">{t[tab.descLabel]}</span>
              </button>
            ))}
          </nav>

          {/* Query Form */}
          <main role="main" className="form-card">
            <form onSubmit={handleSubmit} className="query-form">
              <label htmlFor="query-input" className="form-label">
                {t.inputLabel}
              </label>
              <textarea
                id="query-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={voiceActive ? t.voiceListening : t.inputPlaceholder}
                rows={5}
                className={`query-textarea ${voiceActive ? 'voice-glow' : ''}`}
                disabled={loading}
              />

              {/* Suggestion Chips */}
              <div className="chip-row">
                <span className="chip-label">{t.quickSuggestions}:</span>
                {chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="suggestion-chip"
                    onClick={() => setInput(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Action Controls */}
              <div className="form-actions">
                <button
                  type="submit"
                  aria-label={t.submitBtn}
                  disabled={loading || !input.trim()}
                  className={`submit-btn ${loading || !input.trim() ? 'btn-disabled' : ''}`}
                >
                  <span className="btn-icon">✦</span>
                  {loading ? t.loading : t.submitBtn}
                </button>
                <button
                  type="button"
                  aria-label={t.voiceBtn}
                  aria-pressed={voiceActive}
                  onClick={toggleVoice}
                  className={`mic-btn ${voiceActive ? 'mic-active' : ''}`}
                >
                  🎤
                </button>
              </div>
            </form>
          </main>
        </aside>

        {/* ==== RIGHT PANE — Intelligence Output ==== */}
        <section className="right-pane">
          {/* Output Header with Action Macros */}
          <div className="output-header">
            <h2 className="output-title">
              <span className="output-title-icon">⚡</span>
              {t.outputTitle}
            </h2>
            {output && !loading && (
              <div className="action-tray">
                <button
                  type="button"
                  className="action-btn"
                  onClick={handleCopy}
                  aria-label={t.copyBtn}
                >
                  {copied ? '✓' : '📋'} {copied ? t.copiedBtn : t.copyBtn}
                </button>
                <button
                  type="button"
                  className="action-btn"
                  onClick={handleExport}
                  aria-label={t.exportBtn}
                >
                  📄 {t.exportBtn}
                </button>
              </div>
            )}
          </div>

          {/* Output Content */}
          <div className="output-body" aria-live="polite">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner">
                  <div className="spinner-ring" />
                </div>
                <p className="loading-text">{t.loading}</p>
              </div>
            ) : output ? (
              <pre className="output-text">{output}</pre>
            ) : (
              <div className="idle-state">
                <div className="idle-icon">🏛️</div>
                <p className="idle-text">{t.idleMessage}</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ---- Global Styles ---- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #0b0f19 0%, #111827 100%);
          color: #f1f5f9;
          min-height: 100vh;
        }

        /* ===== App Shell ===== */
        .app-shell {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px 24px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ===== Header ===== */
        .header-bar {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 18px 28px;
          margin-bottom: 20px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .brand-block {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brand-icon {
          font-size: 2.2rem;
          line-height: 1;
        }

        .app-title {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #f97316, #fb923c, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .app-subtitle {
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 500;
          margin-top: 2px;
        }

        .lang-switcher {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .lang-label {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .lang-select {
          background: rgba(245, 18, 18, 0.06);
          border: 1px solid rgba(241, 104, 6, 0.25);
          border-radius: 10px;
          color: #58c917ff;
          padding: 8px 14px;
          font-size: 0.9rem;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.25s ease-in-out;
        }

        .lang-select:hover {
          border-color: rgba(249, 115, 22, 0.5);
        }

        .lang-select:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
        }

        /* ===== Twin-Pane Grid ===== */
        .twin-pane {
          display: grid;
          grid-template-columns: 45fr 55fr;
          gap: 24px;
          flex: 1;
          min-height: 0;
        }

        @media (max-width: 768px) {
          .twin-pane {
            grid-template-columns: 1fr;
          }
        }

        /* ===== Left Pane ===== */
        .left-pane {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ===== Tab Navigation ===== */
        .tab-nav {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .tab-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          padding: 14px 8px;
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          color: #64748b;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.8rem;
          transition: all 0.25s ease-in-out;
        }

        .tab-btn:hover {
          background: rgba(249, 115, 22, 0.08);
          border-color: rgba(249, 115, 22, 0.2);
          color: #94a3b8;
          transform: translateY(-1px);
        }

        .tab-btn:focus-visible {
          outline: 2px solid #f97316;
          outline-offset: 2px;
        }

        .tab-active {
          background: rgba(249, 115, 22, 0.12) !important;
          border-color: rgba(249, 115, 22, 0.45) !important;
          color: #f97316 !important;
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.12), inset 0 -2px 0 #f97316;
        }

        .tab-icon { font-size: 1.4rem; }
        .tab-name { font-weight: 600; font-size: 0.82rem; }
        .tab-desc { font-size: 0.68rem; opacity: 0.65; }

        /* ===== Form Card ===== */
        .form-card {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 22px;
          flex: 1;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
        }

        .query-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          height: 100%;
        }

        .form-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #cbd5e1;
          letter-spacing: 0.2px;
        }

        .query-textarea {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          color: #f1f5f9;
          font-size: 0.92rem;
          font-family: inherit;
          resize: vertical;
          min-height: 120px;
          line-height: 1.6;
          transition: all 0.25s ease-in-out;
        }

        .query-textarea::placeholder {
          color: #475569;
        }

        .query-textarea:focus {
          outline: none;
          border-color: rgba(249, 115, 22, 0.5);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
          background: rgba(255, 255, 255, 0.06);
        }

        .query-textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .voice-glow {
          border-color: rgba(249, 115, 22, 0.4) !important;
          box-shadow: 0 0 16px rgba(249, 115, 22, 0.15) !important;
        }

        /* ===== Suggestion Chips ===== */
        .chip-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }

        .chip-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
        }

        .suggestion-chip {
          padding: 6px 14px;
          background: rgba(249, 115, 22, 0.08);
          border: 1px solid rgba(249, 115, 22, 0.2);
          border-radius: 20px;
          color: #fb923c;
          font-size: 0.78rem;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.25s ease-in-out;
          white-space: nowrap;
        }

        .suggestion-chip:hover {
          background: rgba(249, 115, 22, 0.18);
          border-color: rgba(249, 115, 22, 0.45);
          transform: translateY(-1px);
          box-shadow: 0 2px 12px rgba(249, 115, 22, 0.2);
        }

        .suggestion-chip:focus-visible {
          outline: 2px solid #f97316;
          outline-offset: 2px;
        }

        /* ===== Form Actions ===== */
        .form-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-top: auto;
        }

        .submit-btn {
          flex: 1;
          padding: 13px 24px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 4px 18px rgba(249, 115, 22, 0.3);
          transition: all 0.25s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn:hover:not(.btn-disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(249, 115, 22, 0.4);
          filter: brightness(1.05);
        }

        .submit-btn:focus-visible {
          outline: 2px solid #fbbf24;
          outline-offset: 2px;
        }

        .btn-icon {
          font-size: 1rem;
        }

        .btn-disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
        }

        .mic-btn {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.25s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mic-btn:hover {
          background: rgba(249, 115, 22, 0.1);
          border-color: rgba(249, 115, 22, 0.3);
        }

        .mic-active {
          background: rgba(249, 115, 22, 0.2) !important;
          border-color: #f97316 !important;
          color: #f97316 !important;
          box-shadow: 0 0 16px rgba(249, 115, 22, 0.25);
          animation: micPulse 1.5s ease-in-out infinite;
        }

        .mic-btn:focus-visible {
          outline: 2px solid #f97316;
          outline-offset: 2px;
        }

        /* ===== Right Pane — Output ===== */
        .right-pane {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
        }

        .output-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 22px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          flex-shrink: 0;
        }

        .output-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #e2e8f0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .output-title-icon {
          color: #f97316;
          font-size: 1.1rem;
        }

        .action-tray {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 7px 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #94a3b8;
          font-size: 0.78rem;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.25s ease-in-out;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .action-btn:hover {
          background: rgba(249, 115, 22, 0.1);
          border-color: rgba(249, 115, 22, 0.3);
          color: #fb923c;
          transform: translateY(-1px);
        }

        .action-btn:focus-visible {
          outline: 2px solid #f97316;
          outline-offset: 2px;
        }

        /* ===== Output Body ===== */
        .output-body {
          flex: 1;
          padding: 22px;
          overflow-y: auto;
          min-height: 300px;
        }

        .output-text {
          white-space: pre-wrap;
          word-break: break-word;
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          color: #e2e8f0;
          line-height: 1.85;
          animation: fadeIn 0.35s ease;
        }

        .idle-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 280px;
          gap: 16px;
          text-align: center;
        }

        .idle-icon {
          font-size: 3.5rem;
          opacity: 0.25;
        }

        .idle-text {
          color: #475569;
          font-size: 0.9rem;
          line-height: 1.7;
          max-width: 320px;
          white-space: pre-line;
        }

        /* ===== Loading State ===== */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 280px;
          gap: 20px;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          position: relative;
        }

        .spinner-ring {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 3px solid rgba(249, 115, 22, 0.15);
          border-top-color: #f97316;
          animation: spin 0.9s linear infinite;
        }

        .loading-text {
          color: #94a3b8;
          font-size: 0.88rem;
          font-weight: 500;
          animation: pulse 1.5s ease-in-out infinite;
        }

        /* ===== Scrollbar ===== */
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.25);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.45);
        }

        /* ===== Keyframes ===== */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes micPulse {
          0%, 100% { box-shadow: 0 0 16px rgba(249, 115, 22, 0.25); }
          50% { box-shadow: 0 0 28px rgba(249, 115, 22, 0.45); }
        }

        /* ===== Focus Visible Global ===== */
        select:focus-visible {
          outline: 2px solid #f97316;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

export default App;
