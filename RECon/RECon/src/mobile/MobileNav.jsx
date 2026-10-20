import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Recycle, Timer } from 'lucide-react';
import './MobileNav.css';

// NavLink adds aria-current="page" to the active tab automatically,
// which is what the CSS uses for the green highlight.
export default function MobileNav() {
  return (
    <nav className="rnav" aria-label="Main">
      <NavLink to="/m" end>
        <LayoutDashboard size={20} aria-hidden="true" />
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/m/deposit">
        <Recycle size={20} aria-hidden="true" />
        <span>Deposit</span>
      </NavLink>
      <NavLink to="/m/session">
        <Timer size={20} aria-hidden="true" />
        <span>Session</span>
      </NavLink>
    </nav>
  );
}