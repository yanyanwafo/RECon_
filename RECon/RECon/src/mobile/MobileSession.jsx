import { useState } from 'react';
import { Download, FileText, Pause, Play, Unplug } from 'lucide-react';
import MobileNav from './MobileNav';
import logo from '../assets/RECon-Logo.png'; // check the exact filename in src/assets
import './MobileSession.css';

// Mock data for now. Replace with real values from your teammates' API later.
const MOCK_SESSION = {
  active: true,
  speedMbps: 150,
  papersScanned: 12,
  minutesLeft: 42,
  expiresAt: '5:47 PM',
};

export default function MobileSession({
  session = MOCK_SESSION,
  binReady = true,
  onStart = () => {},
  onPause = () => {},
  onDisconnect = () => {},
}) {
  // The main button switches: "Pause Session" while active, "Start Session" while paused
  const [active, setActive] = useState(session.active);

  function handleToggle() {
    if (active) onPause();
    else onStart();
    setActive(!active);
  }

  return (
    <div className="recon-s">
      <div className="recon-s__shell">
        <header className="recon-s__topbar">
          <img src={logo} alt="RECon" />
          {binReady && <span className="recon-s__pill">BIN READY</span>}
        </header>

        <main className="recon-s__main">
          <section className="recon-s__head">
            <div className="recon-s__eyebrow">
              <span className="recon-s__dot" aria-hidden="true" />
              {active ? 'Active session' : 'Session paused'}
            </div>
            <h1>Stay Connected</h1>
            <p>Your recycled fiber contribution has earned you high-speed access.</p>
          </section>

          <section className="recon-s__stats">
            <div className="recon-s__stat recon-s__stat--sand">
              <Download size={20} aria-hidden="true" />
              <strong>{session.speedMbps}</strong>
              <span>Mbps Download</span>
            </div>
            <div className="recon-s__stat recon-s__stat--green">
              <FileText size={20} aria-hidden="true" />
              <strong>{session.papersScanned}</strong>
              <span>Papers Scanned</span>
            </div>
          </section>

          <section className="recon-s__timer" aria-live="polite">
            <span className="recon-s__blob recon-s__blob--a" aria-hidden="true" />
            <span className="recon-s__blob recon-s__blob--b" aria-hidden="true" />
            <div className="recon-s__minutes">{session.minutesLeft}</div>
            <div className="recon-s__minutes-label">Minutes left</div>
            <div className="recon-s__expires">
              expires today at <strong>{session.expiresAt}</strong>
            </div>
          </section>

          <section className="recon-s__actions">
            <button className="recon-s__btn recon-s__btn--primary" onClick={handleToggle}>
              {active ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
              {active ? 'Pause Session' : 'Start Session'}
            </button>
            <button className="recon-s__btn recon-s__btn--outline" onClick={onDisconnect}>
              <Unplug size={18} aria-hidden="true" />
              Disconnect
            </button>
          </section>
        </main>

        <MobileNav />
      </div>
    </div>
  );
}