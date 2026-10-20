import { useState } from 'react';
import './BinManagement.css';

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
  plus: (
    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  ),
  chevronRight: (
    <path d="M4.5 2.5 8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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

const STATUS_STYLES = {
  ready:    { dot: '#22C55E', label: 'READY',    color: '#354024' },
  full:     { dot: '#BA1A1A', label: 'FULL',     color: '#93000A' },
  offline:  { dot: '#77786C', label: 'OFFLINE',  color: '#46483D' },
};

const BINS = [
  {
    id: 'RC-9921-X',
    name: 'Student Lounge',
    status: 'ready',
    fillPercent: 24,
    cumulative: '1.2 Tons',
    lastEmptied: '2h ago',
    image: 'https://placehold.co/128x128',
  },
  {
    id: 'RC-9922-X',
    name: 'Main Canteen',
    status: 'full',
    fillPercent: 97,
    cumulative: '3.8 Tons',
    lastEmptied: '8h ago',
    image: 'https://placehold.co/128x128',
  },
  {
    id: 'RC-9923-X',
    name: 'Library Entrance',
    status: 'ready',
    fillPercent: 51,
    cumulative: '0.9 Tons',
    lastEmptied: '4h ago',
    image: 'https://placehold.co/128x128',
  },
  {
    id: 'RC-9924-X',
    name: 'Gymnasium',
    status: 'offline',
    fillPercent: 0,
    cumulative: '2.1 Tons',
    lastEmptied: '1d ago',
    image: 'https://placehold.co/128x128',
  },
];

function getInitials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function BinManagement({
  adminName = 'Admin User',
  adminRole = 'ADMIN',
  logoSrc,
  avatarSrc,
  onSignOut,
  onNavigate,
}) {
  const [activeNav, setActiveNav] = useState('bins');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  function handleNavClick(id) {
    setActiveNav(id);
    onNavigate?.(id);
  }

  const filteredBins = BINS.filter((bin) => {
    const matchesSearch =
      bin.id.toLowerCase().includes(search.toLowerCase()) ||
      bin.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === 'all' || (activeFilter === 'full' && bin.status === 'full');
    return matchesSearch && matchesFilter;
  });

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
          <h1 className="topbar__title">Bin Management</h1>
          <div className="topbar__actions">
            <div className="search">
              <Icon name="search" size={16} className="search__icon" />
              <input
                type="search"
                className="search__input"
                placeholder="Search bin ID or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search bins"
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
          {/* ===== Toolbar ===== */}
          <div className="bin-toolbar">
            <div className="bin-filters">
              <button
                type="button"
                className={`filter-chip ${activeFilter === 'all' ? 'filter-chip--active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All Bins
              </button>
              <button
                type="button"
                className={`filter-chip ${activeFilter === 'full' ? 'filter-chip--active' : ''}`}
                onClick={() => setActiveFilter('full')}
              >
                Full Only
              </button>
            </div>
            <button type="button" className="deploy-button">
              <Icon name="plus" size={14} viewBox="0 0 16 16" />
              Deploy New Bin
            </button>
          </div>

          {/* ===== Bin Cards ===== */}
          <div className="bin-list">
            {filteredBins.map((bin) => {
              const tone = STATUS_STYLES[bin.status];
              return (
                <div className="bin-card" key={bin.id}>
                  {/* Image */}
                  <div className="bin-card__image-wrap">
                    <img src={bin.image} alt="" className="bin-card__image" />
                    <div className="bin-card__image-overlay" aria-hidden="true" />
                    <span className="bin-card__status-badge">
                      <span className="bin-card__status-dot" style={{ background: tone.dot }} />
                      <span style={{ color: tone.color }}>{tone.label}</span>
                    </span>
                  </div>

                  {/* Body */}
                  <div className="bin-card__body">
                    <div className="bin-card__header">
                      <div>
                        <p className="bin-card__id">ID: {bin.id}</p>
                        <h2 className="bin-card__name">{bin.name}</h2>
                      </div>
                      <button type="button" className="row-action" aria-label={`More actions for ${bin.id}`}>
                        <Icon name="more" size={18} />
                      </button>
                    </div>

                    <div className="bin-card__stats">
                      {/* Fill level */}
                      <div className="bin-stat">
                        <p className="bin-stat__label">Fill Level</p>
                        <div className="bin-stat__fill-row">
                          <span className="bin-stat__fill-value">{bin.fillPercent}%</span>
                          <div className="bin-stat__track">
                            <div
                              className="bin-stat__fill"
                              style={{ width: `${bin.fillPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Cumulative */}
                      <div className="bin-stat">
                        <p className="bin-stat__label">Cumulative</p>
                        <p className="bin-stat__cumulative">{bin.cumulative}</p>
                      </div>
                    </div>

                    <div className="bin-card__footer">
                      <div className="bin-card__last-emptied">
                        <Icon name="clock" size={14} />
                        <span>Last emptied: {bin.lastEmptied}</span>
                      </div>
                      <button type="button" className="bin-card__details-link">
                        Details
                        <Icon name="chevronRight" size={10} viewBox="0 0 12 12" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}