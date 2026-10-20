import { useState, useEffect } from 'react';
import './SystemSettings.css';

/* ===== Icons ===== */
const ICON_PATHS = {
  wifi: (
    <>
      <path d="M3 7.5a10 10 0 0 1 14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 11a6 6 0 0 1 8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="15" r="1.2" fill="currentColor" />
    </>
  ),
  document: (
    <>
      <rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7h6M7 10.5h6M7 14h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  bin: (
    <path d="M4 6h12M8 6V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2M5.5 6l.7 10a2 2 0 0 0 2 1.8h3.6a2 2 0 0 0 2-1.8l.7-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  gear: (
    <>
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4M15.3 15.3l-1.4-1.4M6.1 6.1 4.7 4.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  leaf: (
    <>
      <path d="M16 4C9 4 4 9 4 16c7 0 12-5 12-12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 16C9 13 12 10 16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  search: (
    <>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 17l-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  bell: (
    <>
      <path d="M5 8a5 5 0 0 1 10 0c0 4 1.5 5 1.5 5h-13S5 12 5 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.3 16a1.8 1.8 0 0 0 3.4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  user: (
    <>
      <circle cx="10" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 17c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  signOut: (
    <>
      <path d="M8 4H5a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 5 16h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12.5 13.5 16 10l-3.5-3.5M16 10H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  grid: (
    <>
      <rect x="2" y="2" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10" y="2" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="2" y="10" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10" y="10" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
  chevronDown: (
    <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  check: (
    <path d="M3 9l4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  ),
  download: (
    <path d="M10 3v9m0 0 3.5-3.5M10 12l-3.5-3.5M4 14.5v1A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
};

function Icon({ name, size = 18, viewBox = '0 0 20 20', className }) {
  return (
    <svg width={size} height={size} viewBox={viewBox} fill="none" className={className} aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  );
}

/* ===== Static data ===== */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'logs', label: 'Deposit Logs', icon: 'document' },
  { id: 'wifi', label: 'WiFi Sessions', icon: 'wifi' },
  { id: 'bins', label: 'Bin Management', icon: 'bin' },
  { id: 'settings', label: 'Settings', icon: 'gear' },
];

const EXPIRY_OPTIONS = ['6 Hours', '12 Hours', '24 Hours', '48 Hours', '72 Hours'];

function getInitials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function SystemSettings({
  adminName = 'Admin User',
  adminRole = 'ADMIN',
  logoSrc,
  avatarSrc,
  onSignOut,
  onNavigate,
}) {
  const [activeNav, setActiveNav] = useState('settings');
  const [search, setSearch] = useState('');

  // Formula fields
  const [multiplier, setMultiplier] = useState('12');
  const [sessionLimit, setSessionLimit] = useState('3');

  // Operations fields
  const [sessionExpiry, setSessionExpiry] = useState('24 Hours');
  const [minThreshold, setMinThreshold] = useState('5');

  // UI state
  const [showToast, setShowToast] = useState(false);
  const [lastSync, setLastSync] = useState('2 mins ago');

  // Live preview — recomputes whenever multiplier changes
  const previewGrams = 50;
  const previewMinutes = Number(multiplier) * previewGrams || 0;

  function handleNavClick(id) {
    setActiveNav(id);
    onNavigate?.(id);
  }

  function handleSaveFormula() {
    setLastSync('just now');
    setShowToast(true);
  }

  function handleExportConfig() {
    console.log('Exporting config...');
  }

  function handleFactoryReset() {
    if (window.confirm('Reset all settings to factory defaults? This cannot be undone.')) {
      setMultiplier('12');
      setSessionLimit('3');
      setSessionExpiry('24 Hours');
      setMinThreshold('5');
      setLastSync('just now');
      setShowToast(true);
    }
  }

  // Auto-hide toast after 3s
  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, [showToast]);

  return (
    <div className="dashboard">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
        <div className="sidebar__top">
          <div className="sidebar__brand">
            {logoSrc ? (
              <img src={logoSrc} alt="" className="sidebar__logo-img" />
            ) : (
              <div className="sidebar__logo-fallback" aria-hidden="true">
                <Icon name="leaf" size={28} />
              </div>
            )}
            <div className="sidebar__brand-text">
              <p className="sidebar__title">RECon Admin</p>
              <p className="sidebar__subtitle">Smart Bin Network</p>
            </div>
          </div>
        </div>

        <nav className="sidebar__nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`sidebar__nav-item ${activeNav === item.id ? 'sidebar__nav-item--active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              aria-current={activeNav === item.id ? 'page' : undefined}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar__bottom">
          <div className="sidebar__profile">
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="sidebar__avatar-img" />
            ) : (
              <div className="sidebar__avatar-fallback" aria-hidden="true">{getInitials(adminName)}</div>
            )}
            <div>
              <p className="sidebar__profile-name">{adminName}</p>
              <p className="sidebar__profile-role">{adminRole}</p>
            </div>
          </div>
          <button type="button" className="sidebar__signout" onClick={onSignOut}>
            <Icon name="signOut" size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ===== Main ===== */}
      <div className="dashboard__main">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar__breadcrumb">
            <span className="topbar__breadcrumb-root">RECon</span>
            <span className="topbar__breadcrumb-sep">/</span>
            <span className="topbar__breadcrumb-page">Global System Settings</span>
          </div>
          <div className="topbar__actions">
            <div className="search">
              <Icon name="search" size={16} className="search__icon" />
              <input
                type="search"
                className="search__input"
                placeholder="Search settings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search settings"
              />
            </div>
            <button type="button" className="icon-button" aria-label="Notifications">
              <Icon name="bell" size={18} />
            </button>
            <button type="button" className="icon-button" aria-label="Account">
              <Icon name="user" size={18} />
            </button>
          </div>
        </header>

        <main className="content">
          {/* Page heading */}
          <div className="settings-heading">
            <h1 className="settings-heading__title">System Configuration</h1>
            <p className="settings-heading__desc">
              Manage the core logic of the RECon recycling ecosystem, including reward conversion
              rates, hardware thresholds, and administrative access.
            </p>
          </div>

          <div className="settings-body">
            {/* ===== WiFi Conversion Formula card ===== */}
            <div className="settings-card">
              <div className="settings-card__header">
                <div className="settings-card__icon-wrap">
                  <Icon name="wifi" size={20} />
                </div>
                <h2 className="settings-card__title">WiFi Conversion Formula</h2>
              </div>

              <div className="settings-fields">
                {/* Multiplier */}
                <div className="field-group">
                  <label className="field-group__label" htmlFor="multiplier">
                    Conversion Multiplier (mins/g)
                  </label>
                  <div className="field-group__input-row">
                    <input
                      id="multiplier"
                      type="number"
                      min="1"
                      className="field-group__input"
                      value={multiplier}
                      onChange={(e) => setMultiplier(e.target.value)}
                    />
                    <span className="field-group__unit">min/g</span>
                  </div>
                  <p className="field-group__hint">
                    Minutes of WiFi granted per gram of plastic deposited.
                  </p>
                </div>

                {/* Session limit */}
                <div className="field-group">
                  <label className="field-group__label" htmlFor="session-limit">
                    Daily Session Limit
                  </label>
                  <div className="field-group__input-row">
                    <input
                      id="session-limit"
                      type="number"
                      min="1"
                      className="field-group__input"
                      value={sessionLimit}
                      onChange={(e) => setSessionLimit(e.target.value)}
                    />
                    <span className="field-group__unit">sessions</span>
                  </div>
                  <p className="field-group__hint">
                    Maximum number of unique session codes per user per day.
                  </p>
                </div>

                {/* Live preview */}
                <div className="formula-preview">
                  <div className="formula-preview__header">
                    <span className="formula-preview__label">Formula Preview:</span>
                    <span className="formula-preview__badge">LIVE PREVIEW</span>
                  </div>
                  <p className="formula-preview__result">
                    <span>{previewGrams}g Plastic = </span>
                    <span className="formula-preview__highlight">{previewMinutes} Minutes</span>
                    <span> WiFi</span>
                  </p>
                </div>
              </div>

              <div className="settings-card__actions">
                <button type="button" className="btn-primary" onClick={handleSaveFormula}>
                  Save Formula
                </button>
              </div>
            </div>

            {/* ===== Operations card ===== */}
            <div className="settings-card settings-card--slim">
              <p className="settings-card__overline">Operations</p>

              <div className="settings-fields">
                {/* Session expiry */}
                <div className="field-group">
                  <label className="field-group__label" htmlFor="session-expiry">
                    Session Expiry
                  </label>
                  <div className="field-group__select-wrap">
                    <select
                      id="session-expiry"
                      className="field-group__select"
                      value={sessionExpiry}
                      onChange={(e) => setSessionExpiry(e.target.value)}
                    >
                      {EXPIRY_OPTIONS.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                    <Icon name="chevronDown" size={16} className="field-group__select-icon" />
                  </div>
                </div>

                {/* Min deposit threshold */}
                <div className="field-group">
                  <label className="field-group__label" htmlFor="min-threshold">
                    Minimum Deposit Threshold
                  </label>
                  <div className="field-group__input-row">
                    <input
                      id="min-threshold"
                      type="number"
                      min="1"
                      className="field-group__input"
                      value={minThreshold}
                      onChange={(e) => setMinThreshold(e.target.value)}
                    />
                    <span className="field-group__unit field-group__unit--muted">grams</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Status footer bar ===== */}
          <div className="status-bar">
            <div className="status-bar__left">
              <div className="status-bar__online">
                <span className="status-bar__dot" aria-hidden="true" />
                <span>System Online</span>
              </div>
              <div className="status-bar__divider" aria-hidden="true" />
              <div className="status-bar__sync">
                <span className="status-bar__sync-label">Last Formula Sync:</span>
                <span className="status-bar__sync-value">{lastSync}</span>
              </div>
            </div>
            <div className="status-bar__right">
              <button type="button" className="btn-outline" onClick={handleExportConfig}>
                <Icon name="download" size={16} />
                Export Config
              </button>
              <button type="button" className="btn-danger" onClick={handleFactoryReset}>
                Factory Reset
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ===== Toast ===== */}
      {showToast && (
        <div className="toast" role="status" aria-live="polite">
          <Icon name="check" size={18} />
          Settings updated successfully!
        </div>
      )}
    </div>
  );
}