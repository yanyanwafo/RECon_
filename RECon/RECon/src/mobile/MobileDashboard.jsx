import { useNavigate } from 'react-router-dom';
import { Wifi, ChevronRight, CircleHelp, MapPin, Leaf } from 'lucide-react';
import MobileNav from './MobileNav';
import './MobileDashboard.css';
import logo from '../assets/RECon-Logo.png'; // check the exact filename in src/assets

const LOGO = logo;
const LOGO_SMALL = logo;

export default function MobileDashboard({ binReady = true }) {
  const navigate = useNavigate();

  return (
    <div className="recon-m">
      <div className="recon-m__shell">
        <header className="recon-m__topbar">
          <img src={LOGO_SMALL} alt="RECon" />
          {binReady && <span className="recon-m__pill">BIN READY</span>}
        </header>

        <main className="recon-m__main">
          <section className="recon-m__hero">
            <div className="recon-m__logo">
              <img src={LOGO} alt="" />
            </div>
            <h1 className="recon-m__title">RECon</h1>
            <p className="recon-m__tagline">Deposit paper waste, earn free WiFi</p>
          </section>

          <div className="recon-m__status" role="status">
            <span className="recon-m__dot" aria-hidden="true" />
            {binReady ? 'Ready - accepting deposits' : 'Bin unavailable'}
          </div>

          <section className="recon-m__actions">
            <button className="recon-m__session" onClick={() => navigate('/m/session')}>
              <div className="recon-m__session-icons">
                <Wifi size={30} aria-hidden="true" />
                <ChevronRight size={20} aria-hidden="true" />
              </div>
              <div>
                <h2>Check my Session</h2>
                <p>View remaining data and earned time</p>
              </div>
              <div className="recon-m__session-bg" aria-hidden="true">
                <Wifi size={120} />
              </div>
            </button>

            <div className="recon-m__tiles">
              <button className="recon-m__tile" onClick={() => navigate('/m/deposit')}>
                <CircleHelp size={20} aria-hidden="true" />
                How to Deposit?
              </button>
              <button className="recon-m__tile" onClick={() => alert('Bin Map is coming soon')}>
                <MapPin size={20} aria-hidden="true" />
                Bin Map
              </button>
            </div>
          </section>

          <aside className="recon-m__fact">
            <div className="recon-m__fact-icon" aria-hidden="true">
              <Leaf size={20} />
            </div>
            <div>
              <p className="recon-m__fact-label">Quick fact</p>
              <p className="recon-m__fact-text">
                1kg of paper provides 2 hours of high-speed fiber connection. Keep our campus clean!
              </p>
            </div>
          </aside>
        </main>

        <MobileNav />
      </div>
    </div>
  );
}