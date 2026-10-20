import { Cylinder, Droplet, LifeBuoy, Lightbulb, Package, Wifi, X } from 'lucide-react';
import './HowToDeposit.css';

// Swap this for a real photo of the bin's LCD screen (put it in src/assets and import it)
const LCD_IMAGE = 'https://placehold.co/292x160';

const ACCEPTED = ['Paper Cups', 'Cardboard', 'Bond Paper'];
const NOT_ACCEPTED = [
  { icon: Droplet, label: 'Wet or greasy paper' },
  { icon: Package, label: 'Plastic containers/wrappers' },
  { icon: Cylinder, label: 'Metal cans or foil' },
];

export default function HowToDeposit({ onContactSupport = () => {} }) {
  return (
    <div className="htd">
      <header className="htd__head">
        <h1>How to Deposit</h1>
        <p>Follow these simple steps to convert your paper waste into high-speed WiFi sessions.</p>
      </header>

      <ol className="htd__steps">
        {/* 1 */}
        <li className="htd__step">
          <span className="htd__num">1</span>
          <div className="htd__body">
            <p className="htd__label">Initial action</p>
            <p className="htd__text">Place paper waste in the slot.</p>
            <div className="htd__card htd__card--chips">
              {ACCEPTED.map((item) => (
                <span key={item} className="htd__chip">{item}</span>
              ))}
            </div>
          </div>
        </li>

        {/* 2 */}
        <li className="htd__step">
          <span className="htd__num">2</span>
          <div className="htd__body">
            <p className="htd__label">Verification</p>
            <p className="htd__text">Wait for LCD confirmation.</p>
            <div className="htd__card htd__card--photo">
              <img src={LCD_IMAGE} alt="The bin's LCD screen showing a confirmation" />
              <div className="htd__caption">
                <Lightbulb size={17} aria-hidden="true" />
                <span>Wait for the green light before proceeding.</span>
              </div>
            </div>
          </div>
        </li>

        {/* 3 */}
        <li className="htd__step">
          <span className="htd__num">3</span>
          <div className="htd__body">
            <p className="htd__label">App interaction</p>
            <p className="htd__text">
              Tap <em>&apos;Check my Session&apos;</em>.
            </p>
            {/* Decorative preview of the real button, so it isn't clickable */}
            <div className="htd__card htd__card--demo" aria-hidden="true">
              <div className="htd__demo-btn">
                <Wifi size={20} />
                Check my Session
              </div>
            </div>
          </div>
        </li>

        {/* 4 */}
        <li className="htd__step">
          <span className="htd__num">4</span>
          <div className="htd__body">
            <p className="htd__label">Final step</p>
            <p className="htd__text htd__text--tight">
              Tap <em>&apos;Connect&apos;</em>.
            </p>
            <div className="htd__ready" aria-hidden="true">
              <span>WiFi Ready</span>
              <span className="htd__connect">Connect</span>
            </div>
          </div>
        </li>
      </ol>

      <section className="htd__no">
        <div className="htd__no-head">
          <span className="htd__no-icon" aria-hidden="true">
            <X size={20} />
          </span>
          <h2>Not Accepted</h2>
        </div>
        <p className="htd__no-text">
          To maintain machine health and recycling quality, please do NOT deposit:
        </p>
        <ul className="htd__no-list">
          {NOT_ACCEPTED.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Icon size={20} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </section>

      <section className="htd__help">
        <LifeBuoy className="htd__help-bg" size={90} aria-hidden="true" />
        <h2>Having trouble?</h2>
        <p>Our support team is active 24/7 at this station.</p>
        <button onClick={onContactSupport}>Contact Support</button>
      </section>
    </div>
  );
}