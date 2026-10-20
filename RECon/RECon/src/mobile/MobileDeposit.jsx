import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, FileText, Wifi } from 'lucide-react';
import MobileNav from './MobileNav';
import HowToDeposit from './HowToDeposit';
import logo from '../assets/RECon-Logo.png'; // check the exact filename in src/assets
import './MobileDeposit.css';

// Mock data for now. Replace with the real deposit result from the API later.
const MOCK_DEPOSIT = {
  grams: 22,
  earnedMins: 15,
  totalMins: 42,
};

export default function MobileDeposit({
  deposit = MOCK_DEPOSIT,
  binReady = true,
  initiallyOpen = false,
  onActivate,
}) {
  const navigate = useNavigate();
  // Open the success sheet with /m/deposit?success=1 (handy for testing the design)
  const [params] = useSearchParams();
  const [open, setOpen] = useState(initiallyOpen || params.get('success') === '1');

  // Close the sheet with the Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function handleActivate() {
    if (onActivate) onActivate();
    else navigate('/m/session');
  }

  return (
    <div className="recon-d">
      <div className="recon-d__shell">
        <header className="recon-d__topbar">
          <img src={logo} alt="RECon" />
          {binReady && <span className="recon-d__status">BIN READY</span>}
        </header>

        {/* The How to Deposit guide sits behind the success sheet */}
        <main className={`recon-d__main ${open ? 'is-dimmed' : ''}`}>
          <HowToDeposit />
        </main>

        <MobileNav />

        {open && (
          <div className="recon-d__scrim" onClick={() => setOpen(false)}>
            <section
              className="recon-d__sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby="deposit-title"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="recon-d__sheet-head">
                <span className="recon-d__blob recon-d__blob--a" aria-hidden="true" />
                <span className="recon-d__blob recon-d__blob--b" aria-hidden="true" />
                <div className="recon-d__check" aria-hidden="true">
                  <Check size={40} strokeWidth={2.5} />
                </div>
                <h2 id="deposit-title">Deposit Successful</h2>
              </div>

              <div className="recon-d__sheet-body">
                <div className="recon-d__cards">
                  <div className="recon-d__accepted">
                    <div>
                      <p className="recon-d__label">Paper accepted</p>
                      <p className="recon-d__value">{deposit.grams} grams</p>
                    </div>
                    <FileText size={24} aria-hidden="true" />
                  </div>

                  <div className="recon-d__pair">
                    <div className="recon-d__earned">
                      <p className="recon-d__label">Earned</p>
                      <p className="recon-d__mins">
                        <strong>{deposit.earnedMins}</strong> <span>mins</span>
                      </p>
                    </div>
                    <div className="recon-d__total">
                      <p className="recon-d__label">New total</p>
                      <p className="recon-d__mins">
                        <strong>{deposit.totalMins}</strong> <span>mins</span>
                      </p>
                    </div>
                  </div>
                </div>

                <p className="recon-d__note">
                  Your contribution has been verified. You can now use your accumulated time to
                  access the high-speed local network.
                </p>

                <div className="recon-d__actions">
                  <button className="recon-d__activate" onClick={handleActivate} autoFocus>
                    <Wifi size={24} aria-hidden="true" />
                    ACTIVATE WIFI
                  </button>
                  <button className="recon-d__close" onClick={() => setOpen(false)}>
                    CLOSE
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}