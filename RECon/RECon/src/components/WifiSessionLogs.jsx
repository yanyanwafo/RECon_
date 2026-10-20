import { useState } from 'react';
import './WiFiSessionLogs.css';

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
  chevronLeft: (
    <path d="M7.5 2.5 4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  chevronRight: (
    <path d="M4.5 2.5 8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  chevronDown: (
    <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  filter: (
    <path d="M3 5h14M6 10h8M9 15h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  ),
  download: (
    <path d="M10 3v9m0 0 3.5-3.5M10 12l-3.5-3.5M4 14.5v1A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  trendUp: (
    <path d="M3 13l4-4 3 3 5-6M17 6h-4M17 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  clock: (
    <>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6.5V10l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  more: (
    <>
      <circle cx="10" cy="5" r="1.2" fill="currentColor" />
      <circle cx="10" cy="10" r="1.2" fill="currentColor" />
      <circle cx="10" cy="15" r="1.2" fill="currentColor" />
    </>
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

const STAT_CARDS = [
  {
    id: 'active-sessions',
    label: 'ACTIVE SESSIONS',
    value: '142',
    sub: '12% from last hour',
    subIcon: 'trendUp',
  },
  {
    id: 'avg-duration',
    label: 'AVG. DURATION',
    value: '48m',
    sub: 'Sustained connectivity',
    subIcon: 'clock',
  },
  {
    id: 'bandwidth',
    label: 'BANDWIDTH USAGE',
    value: '1.2 TB',
    sub: 'Daily cycle',
    subIcon: null,
  },
];

const STATUS_STYLES = {
  active:  { bg: '#DAE8BF', dotColor: '#414822', color: '#151F06', label: 'ACTIVE' },
  paused:  { bg: '#F5E0BC', dotColor: '#504328', color: '#241A04', label: 'PAUSED' },
  expired: { bg: '#EFE0CD', dotColor: '#77786C', color: '#46483D', label: 'EXPIRED' },
};

const REMAINING_COLOR = {
  active:  '#414822',
  paused:  '#221A0F',
  expired: 'rgba(70, 72, 61, 0.50)',
};

const WIFI_SESSIONS = [
  {
    sessionId: '#WFX-90210',
    depositId: '#DEP-8842',
    mac: '48:51:B7:9F:32:01',
    allocated: '60 min',
    remaining: '42 min',
    status: 'active',
    startTime: '14:22:10',
    endTime: null,
  },
  {
    sessionId: '#WFX-90198',
    depositId: '#DEP-8839',
    mac: 'BC:67:84:11:00:A2',
    allocated: '30 min',
    remaining: '12 min',
    status: 'paused',
    startTime: '13:05:44',
    endTime: null,
  },
  {
    sessionId: '#WFX-90185',
    depositId: '#DEP-8831',
    mac: 'E0:D5:5E:24:99:65',
    allocated: '120 min',
    remaining: '0 min',
    status: 'expired',
    startTime: '11:00:12',
    endTime: '13:00:12',
  },
  {
    sessionId: '#WFX-90172',
    depositId: '#DEP-8820',
    mac: '11:22:33:44:55:66',
    allocated: '60 min',
    remaining: '58 min',
    status: 'active',
    startTime: '14:38:55',
    endTime: null,
  },
];

const STATUS_OPTIONS = ['All Statuses', 'Active', 'Paused', 'Expired'];
const TIME_OPTIONS = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days'];
const TOTAL_RESULTS = 248;
const PAGE_SIZE = 4;

function getInitials(name) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
}

export default function WiFiSessions({
  adminName = 'Admin User',
  adminRole = 'ADMIN',
  logoSrc,
  avatarSrc,
  onSignOut,
  onNavigate,
}) {
  const [activeNav, setActiveNav] = useState('wifi');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [timeFilter, setTimeFilter] = useState('Last 24 Hours');
  const [currentPage, setCurrentPage] = useState(1);

  function handleNavClick(id) {
    setActiveNav(id);
    onNavigate?.(id);
  }

  function handleExport() {
    console.log('Exporting WiFi sessions to CSV...');
  }

  const totalPages = Math.ceil(TOTAL_RESULTS / PAGE_SIZE);
  const startEntry = (currentPage - 1) * PAGE_SIZE + 1;
  const endEntry = Math.min(currentPage * PAGE_SIZE, TOTAL_RESULTS);

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
        <header className="topbar">
          <h1 className="topbar__title">WiFi Session Logs</h1>
          <div className="topbar__actions">
            <div className="search">
              <Icon name="search" size={16} className="search__icon" />
              <input
                type="search"
                className="search__input"
                placeholder="Search sessions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search sessions"
              />
            </div>
            <button type="button" className="icon-button icon-button--dot" aria-label="Notifications">
              <Icon name="bell" size={18} />
              <span className="icon-button__badge" aria-hidden="true" />
            </button>
            <button type="button" className="icon-button" aria-label="Account">
              <Icon name="user" size={18} />
            </button>
          </div>
        </header>

        <main className="content">

          {/* ===== Stat Cards + Filters row ===== */}
          <div className="wifi-toolbar">
            <div className="wifi-stats">
              {STAT_CARDS.map((card) => (
                <div className="wifi-stat-card" key={card.id}>
                  <p className="wifi-stat-card__label">{card.label}</p>
                  <p className="wifi-stat-card__value">{card.value}</p>
                  <p className="wifi-stat-card__sub">
                    {card.subIcon && <Icon name={card.subIcon} size={12} className="wifi-stat-card__sub-icon" />}
                    {card.sub}
                  </p>
                </div>
              ))}
            </div>

            <div className="wifi-filters">
              <div className="filter__select-wrap">
                <Icon name="filter" size={16} className="filter__prefix-icon" />
                <select
                  className="filter__select filter__select--warm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter by status"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
                <Icon name="chevronDown" size={12} className="filter__select-icon" />
              </div>

              <div className="filter__select-wrap">
                <Icon name="clock" size={16} className="filter__prefix-icon" />
                <select
                  className="filter__select filter__select--warm"
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  aria-label="Filter by time range"
                >
                  {TIME_OPTIONS.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
                <Icon name="chevronDown" size={12} className="filter__select-icon" />
              </div>

              <button type="button" className="export-button export-button--dark" onClick={handleExport}>
                <Icon name="download" size={16} />
                Export CSV
              </button>
            </div>
          </div>

          {/* ===== Table ===== */}
          <section className="logs-card logs-card--warm" aria-label="WiFi session entries">
            <div className="logs-table-wrap">
              <table className="logs-table logs-table--warm">
                <thead>
                  <tr>
                    <th scope="col">Session ID</th>
                    <th scope="col">Deposit ID</th>
                    <th scope="col">MAC Address</th>
                    <th scope="col">Allocated</th>
                    <th scope="col">Remaining</th>
                    <th scope="col">Status</th>
                    <th scope="col">Start / End Time</th>
                    <th scope="col" className="logs-table__center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {WIFI_SESSIONS.map((session) => {
                    const tone = STATUS_STYLES[session.status];
                    return (
                      <tr key={session.sessionId}>
                        <td className="logs-table__mono">{session.sessionId}</td>
                        <td className="logs-table__mono logs-table__deposit-id">{session.depositId}</td>
                        <td className="logs-table__mono">{session.mac}</td>
                        <td>{session.allocated}</td>
                        <td
                          className="logs-table__remaining"
                          style={{ color: REMAINING_COLOR[session.status] }}
                        >
                          {session.remaining}
                        </td>
                        <td>
                          <span className="badge" style={{ background: tone.bg, color: tone.color }}>
                            <span className="badge__dot" style={{ background: tone.dotColor }} />
                            {tone.label}
                          </span>
                        </td>
                        <td className="logs-table__time-col">
                          <span className="logs-table__time">{session.startTime}</span>
                          <span className="logs-table__time-sep" aria-hidden="true">—</span>
                          <span className="logs-table__time logs-table__time--end">
                            {session.endTime ?? '--:--:--'}
                          </span>
                        </td>
                        <td className="logs-table__center">
                          <button
                            type="button"
                            className="row-action"
                            aria-label={`More actions for ${session.sessionId}`}
                          >
                            <Icon name="more" size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="logs-card__footer">
              <p className="logs-card__count">
                Showing {startEntry} – {endEntry} of {TOTAL_RESULTS.toLocaleString()} results
              </p>
              <div className="pagination">
                <button
                  type="button"
                  className="pagination__arrow"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <Icon name="chevronLeft" size={12} viewBox="0 0 12 12" />
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`pagination__page ${currentPage === page ? 'pagination__page--active pagination__page--warm' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  className="pagination__arrow"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <Icon name="chevronRight" size={12} viewBox="0 0 12 12" />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}