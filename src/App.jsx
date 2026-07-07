import React, { useState } from 'react';

// Unified UI Translation and Discovery Chips Data Matrix
const uiTranslations = {
  en: {
    appTitle: 'SevaMitra AI',
    appSubtitle: 'Your Digital Government Guide',
    sevaTab: 'Seva Kendra',
    dastavezTab: 'Dastavez Kendra',
    shikayatTab: 'Shikayat Kendra',
    sevaDesc: 'Scheme Information Desk',
    dastavezDesc: 'Document Checker Desk',
    shikayatDesc: 'Grievance Formulator Desk',
    inputLabel: 'Describe your civic query or service requirement in detail:',
    submitBtn: 'Get AI Assistance',
    loading: 'Processing request across secure serverless gateways...',
    idleMessage: 'Your localized structural response blueprint will render inside this console view.',
    errorMessage: 'An execution error occurred. Please verify connections and try again.',
    langLabel: 'Locale',
    voiceBtn: 'Simulate Voice Input',
    voiceListening: 'Listening to voice stream... Speak your query clearly.',
    copyBtn: 'Copy Text',
    copiedLabel: 'Copied!',
    exportBtn: 'Export Document (.md)',
    suggestionsTitle: 'Popular Discovery Queries:',
    suggestions: {
      seva: ['PM-Kisan Welfare Eligibility', 'Ayushman Bharat Healthcare Benefits'],
      dastavez: ['New Passport Mandatory Documents', 'Ration Card Name Addition Requirements'],
      shikayat: ['PWD Road Damage Formal Complaint', 'Municipal Water Supply Disruption Letter']
    }
  },
  hi: {
    appTitle: 'सेवामित्र AI',
    appSubtitle: 'आपका डिजिटल सरकार गाइड',
    sevaTab: 'सेवा केंद्र',
    dastavezTab: 'दस्तावेज़ केंद्र',
    shikayatTab: 'शिकायत केंद्र',
    sevaDesc: 'योजना जानकारी डेस्क',
    dastavezDesc: 'दस्तावेज़ जांच डेस्क',
    shikayatDesc: 'शिकायत प्रारूप डेस्क',
    inputLabel: 'अपने नागरिक प्रश्न या सेवा आवश्यकता का विवरण विस्तार से लिखें:',
    submitBtn: 'AI सहायता प्राप्त करें',
    loading: 'सुरक्षित सर्वरलेस गेटवे पर अनुरोध प्रोसेस हो रहा है...',
    idleMessage: 'आपका स्थानीयकृत संरचनात्मक प्रतिक्रिया खाका इस कंसोल दृश्य के अंदर दिखाई देगा।',
    errorMessage: 'एक त्रुटि हुई। कृपया कनेक्शन की जांच करें और पुनः प्रयास करें।',
    langLabel: 'भाषा',
    voiceBtn: 'आवाज इनपुट सिमुलेट करें',
    voiceListening: 'आवाज सुनी जा रही है... अपना प्रश्न स्पष्ट रूप से बोलें।',
    copyBtn: 'कॉपी करें',
    copiedLabel: 'कॉपी हो गया!',
    exportBtn: 'दस्तावेज़ एक्सपोर्ट (.md)',
    suggestionsTitle: 'लोकप्रिय खोज प्रश्न:',
    suggestions: {
      seva: ['पीएम-किसान योजना पात्रता', 'आयुष्मान भारत स्वास्थ्य लाभ'],
      dastavez: ['नए पासपोर्ट के लिए जरूरी दस्तावेज', 'राशन कार्ड में नाम जोड़ने की आवश्यकताएं'],
      shikayat: ['सड़क मरम्मत के लिए औपचारिक शिकायत', 'नगर पालिका जलापूर्ति व्यवधान पत्र']
    }
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('seva');
  const [language, setLanguage] = useState('hi');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const t = uiTranslations[language];
  const langMap = { hi: 'Hindi', en: 'English' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setOutput('');
    setVoiceActive(false);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input.trim(),
          contextType: activeTab,
          language: langMap[language]
        })
      });

      const data = await response.json();
      if (data.success) {
        setOutput(data.text);
      } else {
        setOutput(data.error || t.errorMessage);
      }
    } catch (err) {
      setOutput(t.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceSimulation = () => {
    if (loading) return;
    if (!voiceActive) {
      setVoiceActive(true);
      setInput('');
    } else {
      setVoiceActive(false);
      // Simulate capturing voice streaming data text
      const mockVoiceQueries = {
        seva: language === 'hi' ? 'वृद्धावस्था पेंशन योजना की पात्रता क्या है' : 'What is the eligibility for old age pension scheme',
        dastavez: language === 'hi' ? 'नया ड्राइविंग लाइसेंस बनवाने के दस्तावेज' : 'Documents required for new driving license',
        shikayat: language === 'hi' ? 'मोहल्ले में स्ट्रीट लाइट खराब होने की शिकायत PWD को' : 'Complaint to PWD regarding broken street lights in locality'
      };
      setInput(mockVoiceQueries[activeTab]);
    }
  };

  const handleCopyMacro = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500);
  };

  const handleExportMacro = () => {
    if (!output) return;
    const blob = new Blob([`# SevaMitra AI Generated Document\n\n${output}`], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `sevamitra-${activeTab}-${language}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.appContainer}>
      {/* Media Query Dynamic Style Injection Injector */}
      <style>{`
        @media (max-width: 768px) {
          .twin-pane-grid { grid-template-columns: 1fr !important; }
          .nav-tabs-container { flex-direction: column !important; }
        }
        .suggestion-chip:hover { border-color: #f97316 !important; background: rgba(249,115,22,0.1) !important; color: #fff !important; }
        .macro-btn:hover { background: rgba(255,255,255,0.15) !important; transform: translateY(-1px); }
        .tab-btn:hover { background: rgba(255,255,255,0.05) !important; }
      `}</style>

      {/* Global Accessibility Structural Header Landmark */}
      <header role="banner" style={styles.header}>
        <div>
          <h1 style={styles.brandTitle}>{t.appTitle}</h1>
          <p style={styles.brandSubtitle}>{t.appSubtitle}</p>
        </div>
        <div style={styles.langSelectorWrapper}>
          <label htmlFor="locale-switch" style={styles.langLabel}>{t.langLabel}:</label>
          <select 
            id="locale-switch"
            value={language}
            onChange={(e) => { setLanguage(e.target.value); setInput(''); setOutput(''); setVoiceActive(false); }}
            style={styles.selectDropdown}
            aria-label="Switch Language Locale"
          >
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="en">English</option>
          </select>
        </div>
      </header>

      {/* Global Accessibility Navigation Workspace Tab Selector Landmark */}
      <nav role="navigation" aria-label="Service Desk Tabs Selector" style={styles.navBar}>
        <div style={styles.navTabsContainer} className="nav-tabs-container">
          {['seva', 'dastavez', 'shikayat'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => { setActiveTab(tab); setInput(''); setOutput(''); setVoiceActive(false); }}
                style={{ ...styles.tabBtn, ...(isActive ? styles.activeTabBtn : {}) }}
                aria-label={t[`${tab}Tab`]}
                aria-current={isActive ? 'page' : undefined}
                className="tab-btn"
              >
                <span style={styles.tabTitleText}>{t[`${tab}Tab`]}</span>
                <span style={styles.tabDescText}>{t[`${tab}Desc`]}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Global Accessibility Main Workspace Dashboard Execution Grid Landmark */}
      <main id="root" role="main" className="twin-pane-grid" style={styles.dashboardGrid}>
        
        {/* Left Pane Compartment: Management Form Controller */}
        <section style={styles.paneCard}>
          <form onSubmit={handleSubmit} style={styles.formStructure}>
            <label htmlFor="query-input" style={styles.textareaLabel}>
              {t.inputLabel}
            </label>
            
            <textarea
              id="query-input"
              value={voiceActive ? t.voiceListening : input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading || voiceActive}
              placeholder={voiceActive ? t.voiceListening : t.inputLabel}
              required
              rows={8}
              style={{
                ...styles.textareaControl,
                ...(voiceActive ? styles.voiceTextareaActive : {}),
                ...(loading ? styles.disabledControl : {})
              }}
            />

            {/* Contextual Suggestion Discovery Chips Sub-Tray */}
            <div style={styles.suggestionsContainer}>
              <span style={styles.suggestionsHeader}>{t.suggestionsTitle}</span>
              <div style={styles.chipsRow}>
                {t.suggestions[activeTab].map((chipText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInput(chipText)}
                    disabled={loading || voiceActive}
                    style={styles.suggestionChip}
                    className="suggestion-chip"
                    aria-label={`Load discovery query: ${chipText}`}
                  >
                    {chipText}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Execution Controller Interface Tray */}
            <div style={styles.actionTray}>
              <button
                type="button"
                onClick={toggleVoiceSimulation}
                disabled={loading}
                style={{ ...styles.voiceBtnControl, ...(voiceActive ? styles.voiceBtnActive : {}) }}
                aria-label={t.voiceBtn}
                aria-pressed={voiceActive}
              >
                {voiceActive ? '🛑' : '🎤'} {t.voiceBtn}
              </button>
              
              <button
                type="submit"
                disabled={loading || voiceActive || !input.trim()}
                style={{
                  ...styles.submitBtnControl,
                  ...((loading || voiceActive || !input.trim()) ? styles.submitBtnDisabled : {})
                }}
                aria-label={t.submitBtn}
              >
                {t.submitBtn}
              </button>
            </div>
          </form>
        </section>

        {/* Right Pane Compartment: Live Structured Output Stream Monitor */}
        <section 
          aria-live="polite" 
          aria-atomic="true" 
          style={{ ...styles.paneCard, ...styles.outputPaneLayout }}
        >
          <div style={styles.outputHeaderBar}>
            <h2 style={styles.outputTitle}>{t[`${activeTab}Tab`]} — Console Output</h2>
            {output && !loading && (
              <div style={styles.macroBtnGroup}>
                <button
                  type="button"
                  onClick={handleCopyMacro}
                  style={styles.macroBtn}
                  className="macro-btn"
                  aria-label={t.copyBtn}
                >
                  {copySuccess ? t.copiedLabel : `📋 ${t.copyBtn}`}
                </button>
                <button
                  type="button"
                  onClick={handleExportMacro}
                  style={styles.macroBtn}
                  className="macro-btn"
                  aria-label={t.exportBtn}
                >
                  📄 Export (.md)
                </button>
              </div>
            )}
          </div>

          <div style={styles.outputScrollArea}>
            {loading ? (
              <div style={styles.loadingDisplayBlock}>
                <div style={styles.loadingPulsarAnimation} />
                <p style={styles.loadingTextAlert}>{t.loading}</p>
              </div>
            ) : output ? (
              <div style={styles.renderedOutputMarkdownBlock}>
                {output.split('\n').map((line, index) => {
                  // Custom structural clean rendering for document checklist checkboxes
                  if (line.trim().startsWith('- [ ]') || line.trim().startsWith('- []')) {
                    const cleanText = line.replace(/- \s*\[\s*\]\s*/, '');
                    return (
                      <div key={index} style={styles.checkboxLineItem}>
                        <input type="checkbox" disabled style={styles.checkboxMarkerInput} />
                        <span style={styles.checkboxBodyText}>{cleanText}</span>
                      </div>
                    );
                  }
                  // Render general layout lines clean
                  return <p key={index} style={styles.markdownLineParagraph}>{line}</p>;
                })}
              </div>
            ) : (
              <p style={styles.idleStateDisplayPlaceholder}>{t.idleMessage}</p>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

// Ultra-Premium Patriotic Saffron & Midnight Navy Glassmorphic Theme Layout Dictionary
const styles = {
  appContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0b0f19 0%, #111827 100%)',
    color: '#f1f5f9',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '24px',
    boxSizing: 'border-box'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '20px',
    marginBottom: '24px'
  },
  brandTitle: {
    fontSize: '2.25rem',
    fontWeight: '800',
    margin: '0 0 4px 0',
    background: 'linear-gradient(90deg, #f97316 0%, #ffffff 50%, #22c55e 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px'
  },
  brandSubtitle: {
    fontSize: '1rem',
    color: '#94a3b8',
    margin: 0
  },
  langSelectorWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(30, 41, 59, 0.5)',
    padding: '8px 14px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  langLabel: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    fontWeight: '500'
  },
  selectDropdown: {
    background: '#0f172a',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    outline: 'none'
  },
  navBar: {
    marginBottom: '24px'
  },
  navTabsContainer: {
    display: 'flex',
    gap: '12px',
    background: 'rgba(15, 23, 42, 0.6)',
    padding: '6px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  tabBtn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'transparent',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.25s ease-in-out',
    outline: 'none'
  },
  activeTabBtn: {
    background: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(249, 115, 22, 0.3)',
    boxShadow: '0 4px 20px rgba(249, 115, 22, 0.15)'
  },
  tabTitleText: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '2px'
  },
  tabDescText: {
    fontSize: '0.75rem',
    color: '#94a3b8'
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '45fr 55fr',
    gap: '24px',
    alignItems: 'stretch'
  },
  paneCard: {
    background: 'rgba(30, 41, 59, 0.4)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '24px',
    boxSizing: 'border-box',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
  },
  outputPaneLayout: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '500px'
  },
  formStructure: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
    gap: '16px'
  },
  textareaLabel: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: '-4px'
  },
  textareaControl: {
    width: '100%',
    background: 'rgba(15, 23, 42, 0.6)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    padding: '16px',
    fontSize: '1rem',
    lineHeight: '1.5',
    outline: 'none',
    resize: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.25s ease-in-out',
    focus: {
      borderColor: '#f97316',
      boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.2)'
    }
  },
  voiceTextareaActive: {
    borderColor: '#f97316',
    boxShadow: '0 0 15px rgba(249, 115, 22, 0.3)',
    fontStyle: 'italic',
    color: '#f97316'
  },
  disabledControl: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  suggestionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  suggestionsHeader: {
    fontSize: '0.815rem',
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  chipsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  suggestionChip: {
    background: 'rgba(15, 23, 42, 0.4)',
    color: '#cbd5e1',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '0.815rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out'
  },
  actionTray: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px'
  },
  voiceBtnControl: {
    background: 'rgba(30, 41, 59, 0.6)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '14px',
    padding: '14px 20px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.25s ease-in-out'
  },
  voiceBtnActive: {
    background: '#f97316',
    borderColor: '#f97316',
    boxShadow: '0 0 15px rgba(249, 115, 22, 0.4)'
  },
  submitBtnControl: {
    flex: 1,
    background: 'linear-gradient(90deg, #ea580c 0%, #f97316 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    padding: '14px 24px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.25s ease-in-out',
    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)'
  },
  submitBtnDisabled: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#64748b',
    boxShadow: 'none',
    cursor: 'not-allowed'
  },
  outputHeaderBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '14px',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  outputTitle: {
    fontSize: '1.125rem',
    fontWeight: '700',
    margin: 0,
    color: '#f8fafc'
  },
  macroBtnGroup: {
    display: 'flex',
    gap: '8px'
  },
  macroBtn: {
    background: 'rgba(255, 255, 255, 0.06)',
    color: '#e2e8f0',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '0.815rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out'
  },
  outputScrollArea: {
    flex: 1,
    overflowY: 'auto',
    maxHeight: '440px',
    paddingRight: '4px'
  },
  idleStateDisplayPlaceholder: {
    color: '#64748b',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    textAlign: 'center',
    marginTop: '100px',
    fontStyle: 'italic'
  },
  loadingDisplayBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '80px',
    gap: '16px'
  },
  loadingPulsarAnimation: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '3px solid rgba(249, 115, 22, 0.1)',
    borderTopColor: '#f97316',
    animation: 'spin 1s linear infinite'
  },
  loadingTextAlert: {
    fontSize: '0.925rem',
    color: '#94a3b8'
  },
  renderedOutputMarkdownBlock: {
    fontSize: '0.95rem',
    lineHeight: '1.7',
    color: '#cbd5e1'
  },
  markdownLineParagraph: {
    margin: '0 0 12px 0'
  },
  checkboxLineItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    margin: '0 0 10px 0',
    background: 'rgba(255,255,255,0.02)',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.04)'
  },
  checkboxMarkerInput: {
    marginTop: '4px',
    accentColor: '#f97316',
    cursor: 'not-allowed'
  },
  checkboxBodyText: {
    color: '#e2e8f0',
    fontWeight: '500'
  }
};
