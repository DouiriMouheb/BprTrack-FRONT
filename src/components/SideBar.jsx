import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, FileText, X, Settings, LogOut, AlertTriangle, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import Modal from './Modal';

const Sidebar = ({ open, setOpen, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setShowLogoutModal(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const navItems = [
    { to: '/cert-engine', label: 'Cert Engine', icon: Search },
    { to: '/profile', label: t('nav.profile'), icon: Settings },
  ];

  const handleLinkClick = () => {
    // Auto-close any overlay sidebar on mobile when navigating (no-op for bottom bar)
    if (isMobile && open) {
      setOpen(false);
    }
  };

  // Mobile: render a bottom nav bar always visible
  if (isMobile) {
    return (
      <nav style={{ backgroundColor: 'hsl(var(--black))' }} className="fixed bottom-0 left-0 right-0 z-50 border-t border-[hsl(var(--border-black))] px-2 py-2 flex items-center justify-around md:hidden">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={handleLinkClick}
              className={`flex flex-col items-center gap-1 text-sm w-20 py-1 rounded text-[hsl(var(--text-white))] ${isActive ? 'font-bold border-b-2 border-[hsl(var(--red))]' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} className={`text-[hsl(var(--text-white))] ${isActive ? 'text-[hsl(var(--red))]' : ''}`} />
              <span className="truncate text-xs">{label}</span>
            </Link>
          );
        })}
        <Modal
          open={showLogoutModal}
          title={t('nav.logout')}
          size="md"
          onBackdropClick={handleCancelLogout}
          footer={
            <>
              <button onClick={handleCancelLogout} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleLogout} className="btn btn-primary">
                {t('nav.logout')}
              </button>
            </>
          }
        >
          <p className="text-base">{t('nav.logoutConfirm')}</p>
        </Modal>
      </nav>
    );
  }

  // Desktop / large screens: existing sidebar behavior
  return (
  <aside className={`fixed h-screen z-40 left-0 top-0 transition-all duration-50 p-4 flex flex-col`} style={{ backgroundColor: 'hsl(var(--black))' }}>
      {/* Desktop toggle button */}
      <button className="btn btn-ghost mb-6 self-start" onClick={() => setOpen(!open)} aria-label={open ? 'Close sidebar' : 'Open sidebar'}>
  {open ? <X size={18} className="text-white" /> : <Menu size={18} className="text-white" />}
      </button>

      <nav className={`sidebar-nav flex flex-col gap-2 flex-1 ${!open ? 'items-center' : ''}`}>
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={handleLinkClick}
              title={!open ? label : ''}
              className={`transition-all duration-50 ease-in-out relative group text-[hsl(var(--text-white))] flex items-center gap-3 px-2 py-2 rounded ${!open ? 'justify-center' : ''} ${isActive ? 'font-bold border-l-4 border-[hsl(var(--red))] bg-[hsl(var(--black))]' : ''}`}
            >
              <Icon 
                size={20} 
                className={`transition-all duration-50 text-[hsl(var(--text-white))] ${isActive ? 'text-[hsl(var(--red))] scale-110' : ''}`}
              />
              {open && (
                <span className={`font-medium transition-colors`}>{label}</span>
              )}
            </Link>
          );
        })}
      </nav>
        
      {/* Logout Button - Fixed at bottom */}
      <button
        onClick={handleLogoutClick}
        title={!open ? 'Logout' : ''}
        className={`transition-all duration-50 relative group hover:text-red-500 mt-4 ${!open ? 'justify-center flex items-center' : 'flex items-center gap-3'}`}
      >
        <LogOut 
          size={20} 
          className="transition-all duration-50"
        />
        {open && (
          <span className="font-medium transition-colors">{t('nav.logout')}</span>
        )}
      </button>

      {/* Logout Confirmation Modal */}
      <Modal
        open={showLogoutModal}
        title={t('nav.logout')}
        size="md"
        onBackdropClick={handleCancelLogout}
        footer={
          <>
            <button onClick={handleCancelLogout} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleLogout} className="btn btn-primary">
              {t('nav.logout')}
            </button>
          </>
        }
      >
        <p className="text-base">{t('nav.logoutConfirm')}</p>
      </Modal>
    </aside>
  );
};

export default Sidebar;
