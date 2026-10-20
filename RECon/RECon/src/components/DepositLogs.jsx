import { useState } from 'react';
import './DepositLogs.css';

/* ===== Icons — same set as DashboardOverview, plus a few new ones for this page ===== */
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
  chevronRight: (
    <path d="M4.5 2.5 8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  chevronLeft: (
    <path d="M7.5 2.5 4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  chevronDown: (
    <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 8h14M7 2.5v3M13 2.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  download: (
    <path d="M10 3v9m0 0 3.5-3.5M10 12l-3.5-3.5M4 14.5v1A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  eye: (
    <>
      <path d="M1 8.5S4 3.5 9 3.5 17 8.5 17 8.5 14 13.5 9 13.5 1 8.5 1 8.5Z" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="9" cy="8.5" r="2.2" stroke="currentColor" strokeWidth="1.3" />
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

/* ===== Static data — swap these for real API data ===== */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'logs', label: 'Deposit Logs', icon: 'document' },
  { id: 'wifi', label: 'WiFi Sessions', icon: 'wifi' },
  { id: 'bins', label: 'Bin Management', icon: 'bin' },
  { id: 'settings', label: 'Settings', icon: 'gear' },
];

const STATUS_STYLES = {
  valid: { dotColor: '#576343', bg: '#DAE8BF', color: '#5D6948', label: 'VALID' },
  too_light: { dotColor: '#504328', bg: '#F5E0BC', color: '#53452B', label: 'TOO LIGHT' },
  invalid: { dotColor: '#BA1A1A', bg: '#FFDAD6', color: '#93000A', label: 'INVALID' },
};

const EARNED_COLOR = {
  valid: '#414822',
  too_light: '#46483D',
  invalid: '#BA1A1A',
};

const DEPOSIT_LOGS = [
  { id: '#DEP-94281', timestamp: 'Oct 24, 2023 · 14:32:05', binId: 'BIN-CENTRAL-01', weight: '450.2g', status: 'valid', minEarned: '+15.0' },
  { id: '#DEP-94280', timestamp: 'Oct 24, 2023 · 14:28:11', binId: 'BIN-NORTH-09', weight: '12.5g', status: 'too_light', minEarned: '0.0' },
  { id: '#DEP-94279', timestamp: 'Oct 24, 2023 · 14:15:56', binId: 'BIN-SOUTH-04', weight: '890.1g', status: 'invalid', minEarned: '0.0' },
  { id: '#DEP-94278', timestamp: 'Oct 24, 2023 · 14:02:40', binId: 'BIN-CENTRAL-01', weight: '1,240.5g', status: 'valid', minEarned: '+45.2' },
  { id: '#DEP-94277', timestamp: 'Oct 24, 2023 · 13:58:12', binId: 'BIN-NORTH-09', weight: '210.8g', status: 'valid', minEarned: '+7.0' },
];

const BIN_OPTIONS = ['All Bins', 'BIN-CENTRAL-01', 'BIN-NORTH-09', 'BIN-SOUTH-04'];
const STATUS_OPTIONS = ['All Statuses', 'Valid', 'Too Light', 'Invalid'];

const TOTAL_ENTRIES = 12482;
const PAGE_SIZE = 5;

function getInitials(name) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
}

export default function DepositLogs({
  adminName = 'Admin User',
  adminRole = 'ADMIN',
  logoSrc,
  avatarSrc,
  onSignOut,
  onNavigate,
}) {
  const [activeNav, setActiveNav] = useState('logs');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [binFilter, setBinFilter] = useState('All Bins');
  const [currentPage, setCurrentPage] = useState(1);

  function handleNavClick(id) {
    setActiveNav(id);
    onNavigate?.(id);
  }

  function handleExport() {
    // Hook this up to your real export/CSV logic
    console.log('Exporting deposit logs to CSV...', { dateFrom, dateTo, statusFilter, binFilter });
  }

  const totalPages = Math.ceil(TOTAL_ENTRIES / PAGE_SIZE);
  const startEntry = (currentPage - 1) * PAGE_SIZE + 1;
  const endEntry = Math.min(currentPage * PAGE_SIZE, TOTAL_ENTRIES);

  return (
    <div className="dashboard">
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

      <div className="dashboard__main">
        <header className="topbar">
          <h1 className="topbar__title">Deposit Logs</h1>
          <div className="topbar__actions">
            <div className="search">
              <Icon name="search" size={16} className="search__icon" />
              <input
                type="search"
                className="search__input"
                placeholder="Search records..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search records"
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
          <section className="filters" aria-label="Filter deposit logs">
            <div className="filter filter--range">
              <label className="filter__label">
                <Icon name="calendar" size={14} />
                Date Range
              </label>
              <div className="filter__range-row">
                <input
                  type="date"
                  className="filter__input"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  aria-label="From date"
                />
                <span className="filter__to">to</span>
                <input
                  type="date"
                  className="filter__input"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  aria-label="To date"
                />
              </div>
            </div>

            <div className="filter">
              <label className="filter__label" htmlFor="status-filter">
                Status
              </label>
              <div className="filter__select-wrap">
                <select
                  id="status-filter"
                  className="filter__select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <Icon name="chevronDown" size={12} className="filter__select-icon" />
              </div>
            </div>

            <div className="filter">
              <label className="filter__label" htmlFor="bin-filter">
                Bin ID
              </label>
              <div className="filter__select-wrap">
                <select
                  id="bin-filter"
                  className="filter__select"
                  value={binFilter}
                  onChange={(e) => setBinFilter(e.target.value)}
                >
                  {BIN_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <Icon name="chevronDown" size={12} className="filter__select-icon" />
              </div>
            </div>

            <button type="button" className="export-button" onClick={handleExport}>
              <Icon name="download" size={16} />
              Export to CSV
            </button>
          </section>

          <section className="logs-card" aria-label="Deposit log entries">
            <div className="logs-table-wrap">
              <table className="logs-table">
                <thead>
                  <tr>
                    <th scope="col">Deposit ID</th>
                    <th scope="col">Timestamp</th>
                    <th scope="col">Bin ID</th>
                    <th scope="col" className="logs-table__numeric">Weight (g)</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="logs-table__numeric">Min Earned</th>
                    <th scope="col" className="logs-table__center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {DEPOSIT_LOGS.map((entry) => {
                    const tone = STATUS_STYLES[entry.status];
                    return (
                      <tr key={entry.id}>
                        <td className="logs-table__id">{entry.id}</td>
                        <td className="logs-table__timestamp">{entry.timestamp}</td>
                        <td>{entry.binId}</td>
                        <td className="logs-table__numeric logs-table__weight">{entry.weight}</td>
                        <td>
                          <span className="badge" style={{ background: tone.bg, color: tone.color }}>
                            <span className="badge__dot" style={{ background: tone.dotColor }} />
                            {tone.label}
                          </span>
                        </td>
                        <td
                          className="logs-table__numeric logs-table__earned"
                          style={{ color: EARNED_COLOR[entry.status] }}
                        >
                          {entry.minEarned}
                        </td>
                        <td className="logs-table__center">
                          <button type="button" className="row-action" aria-label={`View details for ${entry.id}`}>
                            <Icon name="eye" size={18} viewBox="0 0 18 17" />
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
                Showing {startEntry} to {endEntry} of {TOTAL_ENTRIES.toLocaleString()} entries
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
                    className={`pagination__page ${currentPage === page ? 'pagination__page--active' : ''}`}
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