import { useState, useEffect } from 'react';
import './DashboardOverview.css';
import logo from '../assets/RECon-Logo.png';

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
  alert: (
    <>
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6.5v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="13.5" r="1" fill="currentColor" />
    </>
  ),
  wrench: (
    <path d="M13.5 3.5a4 4 0 0 0-5.4 4.9L3 13.5 6.5 17l5.1-5.1a4 4 0 0 0 4.9-5.4l-2.3 2.3-2-2 2.3-2.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
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
  chevronRight: (
    <path d="M4.5 2.5 8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  chevronDown: (
    <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  plus: (
    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  ),
  grid: (
    <>
      <rect x="2" y="2" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10" y="2" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="2" y="10" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10" y="10" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
  menu: (
    <path d="M2.5 5h15M2.5 10h15M2.5 15h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  ),
  close: (
    <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  ),
};

function Icon({ name, size = 18, viewBox = '0 0 20 20', className }) {
  return (
    <svg width={size} height={size} viewBox={viewBox} fill="none" className={className} aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  );
}

/* ===== Static data — swap these for real API data ===== */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'logs', label: 'Deposit Logs', icon: 'document' },
  { id: 'wifi', label: 'WiFi Sessions', icon: 'wifi' },
  { id: 'bins', label: 'Bin Management', icon: 'bin' },
  { id: 'settings', label: 'Settings', icon: 'gear' },
];

const BIN_FILL = { percent: 68, used: 120, total: 180, comparison: '+12% vs avg' };

const STAT_CARDS = [
  {
    id: 'active-sessions',
    icon: 'leaf', iconBg: '#DAE8BF', iconColor: '#5D6948',
    label: 'Active Sessions', value: '142', valueColor: '#221A0F',
    sub: 'Across 8 bin clusters', subColor: 'rgba(93, 105, 72, 0.8)',
  },
  {
    id: 'sessions-granted',
    icon: 'document', iconBg: '#FAECD8', iconColor: '#414822',
    label: 'Sessions Granted', value: '856', valueColor: '#221A0F',
    sub: 'Cumulative today', subColor: '#46483D',
  },
  {
    id: 'rejected-deposits',
    icon: 'alert', iconBg: '#FFDAD6', iconColor: '#BA1A1A',
    label: 'Rejected Deposits', value: '24', valueColor: '#BA1A1A',
    link: 'Review errors',
  },
];

const TONE_STYLES = {
  positive: { iconBg: '#DAE8BF', iconColor: '#5D6948', badgeBg: '#DAE8BF', badgeColor: '#151F06' },
  negative: { iconBg: '#FFDAD6', iconColor: '#BA1A1A', badgeBg: '#FFDAD6', badgeColor: '#93000A' },
};

const ACTIVITY_LOG = [
  { time: '12:43:10 PM', icon: 'wifi', tone: 'positive', title: 'WiFi Access Granted', detail: 'User ID #9921 connected via Cluster A', status: 'Success' },
  { time: '12:41:05 PM', icon: 'alert', tone: 'negative', title: 'Rejected Deposit', detail: '45g wet cardboard detected. Not eligible for credit.', status: 'Rejected' },
  { time: '12:38:22 PM', icon: 'alert', tone: 'negative', title: 'Rejected Deposit', detail: 'Non-paper material detected in bin sensor.', status: 'Rejected' },
  { time: '12:35:45 PM', icon: 'wrench', tone: 'positive', title: 'System Maintenance', detail: 'Bin Unit B7 sensor recalibration complete.', status: 'Routine' },
  { time: '12:32:11 PM', icon: 'alert', tone: 'negative', title: 'Rejected Deposit', detail: '18g shredded paper detected. Below minimum weight.', status: 'Rejected' },
  { time: '12:28:50 PM', icon: 'wifi', tone: 'positive', title: 'WiFi Access Granted', detail: 'User ID #9844 connected via Cluster B', status: 'Success' },
];

function getInitials(name) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
}

export default function DashboardOverview({
  adminName = 'Admin User',
  adminRole = 'ADMIN',
  logoSrc = logo,
  avatarSrc,
  onSignOut,
  onNavigate,
}) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [now, setNow] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Close the mobile drawer automatically if the viewport grows back to desktop size
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 900) setSidebarOpen(false);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const lastUpdated = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });

  function handleNavClick(id) {
    setActiveNav(id);
    onNavigate?.(id);
    setSidebarOpen(false); // close drawer after navigating on mobile
  }

  return (
    <div className="dashboard">
      {/* Overlay — only visible/clickable on mobile when the drawer is open */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'sidebar-overlay--visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
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
          <button
            type="button"
            className="sidebar__close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <Icon name="close" size={20} />
          </button>
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

      <div className="dashboard__main">
        <header className="topbar">
          <div className="topbar__left">
            <button
              type="button"
              className="hamburger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Icon name="menu" size={20} />
            </button>
            <h1 className="topbar__title">Real-time Overview</h1>
          </div>
          <div className="topbar__actions">
            <div className="search">
              <Icon name="search" size={16} className="search__icon" />
              <input
                type="search"
                className="search__input"
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search logs"
              />
            </div>
            <button type="button" className="icon-button" aria-label="Notifications">
              <Icon name="bell" size={18} />
              <span className="icon-button__dot" aria-hidden="true" />
            </button>
            <button type="button" className="icon-button" aria-label="Account">
              <Icon name="user" size={18} />
            </button>
          </div>
        </header>

        <main className="content">
          <div className="status-pill">
            <span className="status-pill__dot" aria-hidden="true" />
            <span className="status-pill__label">System Status: Live</span>
            <span className="status-pill__divider" aria-hidden="true" />
            <span className="status-pill__updated">Last updated: {lastUpdated}</span>
          </div>

          <section className="stats" aria-label="Key metrics">
            <div className="stat-card stat-card--featured">
              <div className="stat-card--featured__top">
                <div className="stat-card--featured__icon" aria-hidden="true">
                  <Icon name="bin" size={20} />
                </div>
                <span className="badge badge--neutral">{BIN_FILL.comparison}</span>
              </div>
              <h2 className="stat-card__label stat-card__label--display">Bin Fill Level</h2>
              <div className="fill-row">
                <p className="fill-value">
                  <span className="fill-value__number">{BIN_FILL.percent}</span>
                  <span className="fill-value__unit">%</span>
                </p>
                <p className="fill-capacity">Capacity: {BIN_FILL.used}L / {BIN_FILL.total}L</p>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${BIN_FILL.percent}%` }} />
              </div>
            </div>

            <div className="stat-grid">
              {STAT_CARDS.map((stat) => (
                <div className="stat-card" key={stat.id}>
                  <div className="stat-card__icon" style={{ background: stat.iconBg, color: stat.iconColor }} aria-hidden="true">
                    <Icon name={stat.icon} size={20} />
                  </div>
                  <p className="stat-card__label">{stat.label}</p>
                  <p className="stat-card__value" style={{ color: stat.valueColor }}>{stat.value}</p>
                  {stat.sub && <p className="stat-card__sub" style={{ color: stat.subColor }}>{stat.sub}</p>}
                  {stat.link && (
                    <button type="button" className="stat-card__link">
                      {stat.link}
                      <Icon name="chevronRight" size={10} viewBox="0 0 12 12" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="activity" aria-label="Recent activity">
            <div className="activity__header">
              <div className="activity__title-row">
                <Icon name="document" size={18} />
                <h2 className="activity__title">Recent Activity</h2>
              </div>
              <button type="button" className="button-secondary">View All Logs</button>
            </div>

            <div className="activity-card">
              <div className="activity-table-wrap">
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th scope="col">Timestamp</th>
                      <th scope="col">Activity Type</th>
                      <th scope="col">Details</th>
                      <th scope="col" className="activity-table__status-col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ACTIVITY_LOG.map((entry, i) => {
                      const tone = TONE_STYLES[entry.tone];
                      return (
                        <tr key={i}>
                          <td className="activity-table__time">{entry.time}</td>
                          <td>
                            <div className="activity-table__type">
                              <span
                                className="activity-table__type-icon"
                                style={{ background: tone.iconBg, color: tone.iconColor }}
                                aria-hidden="true"
                              >
                                <Icon name={entry.icon} size={14} />
                              </span>
                              <span className="activity-table__type-label">{entry.title}</span>
                            </div>
                          </td>
                          <td className="activity-table__detail">{entry.detail}</td>
                          <td className="activity-table__status-col">
                            <span
                              className="badge"
                              style={{ background: tone.badgeBg, color: tone.badgeColor }}
                            >
                              {entry.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="activity-card__footer">
                <button type="button" className="load-more">
                  Load More Activity
                  <Icon name="chevronDown" size={10} viewBox="0 0 12 12" />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      <button type="button" className="fab" aria-label="Quick report">
        <Icon name="plus" size={16} viewBox="0 0 16 16" />
        <span className="fab__tooltip">Quick Report</span>
      </button>
    </div>
  );
}