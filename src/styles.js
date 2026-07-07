// Ultra-Premium Patriotic Saffron & Midnight Navy Glassmorphic Theme Layout Dictionary
export const styles = {
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
