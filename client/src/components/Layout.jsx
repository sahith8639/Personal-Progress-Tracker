import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  GraduationCap,
  Code2,
  BookOpen,
  Award,
  FolderGit2,
  Library,
  TrendingUp,
  Heart,
  LayoutDashboard,
  Calculator,
  Shield,
  Search,
  Moon,
  Sun,
  Laptop,
  Menu,
  X,
  LogOut,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SearchModal } from './SearchModal';

export const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Global Ctrl+K / Cmd+K search listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { title: 'Overview', items: [
      { path: '/', label: 'Home', icon: Home },
      { path: '/about', label: 'About Me', icon: User },
      { path: '/dashboard', label: 'Dashboard & Analytics', icon: LayoutDashboard },
    ]},
    { title: 'Academics', items: [
      { path: '/education', label: 'Education', icon: GraduationCap },
      { path: '/courses', label: 'Courses & Grades', icon: BookOpen },
      { path: '/gpa-calculator', label: 'GPA / CGPA Calculator', icon: Calculator },
      { path: '/resources', label: 'Resource Library', icon: Library },
    ]},
    { title: 'Skills & Learning', items: [
      { path: '/skills', label: 'Skills Tracker', icon: Code2 },
      { path: '/learning', label: 'Learning Progress & Roadmaps', icon: TrendingUp },
      { path: '/certificates', label: 'Certificates Repository', icon: Award },
    ]},
    { title: 'Portfolio & Profile', items: [
      { path: '/projects', label: 'Projects Showcase', icon: FolderGit2 },
      { path: '/interests', label: 'Interests & Focus', icon: Heart },
      { path: '/academic-summary', label: 'Printable Summary', icon: FileText },
    ]},
  ];

  return (
    <div className="app-container">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="modal-backdrop"
          style={{ zIndex: 35 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">
            <GraduationCap size={20} />
          </div>
          <div>
            <div className="sidebar-brand-name">AcademicPortal</div>
            <span className="sidebar-brand-badge">AIML & Engineering</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((section, idx) => (
            <div key={idx} style={{ marginBottom: '0.75rem' }}>
              <div className="nav-section-title">{section.title}</div>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}

          {/* Admin Navigation */}
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div className="nav-section-title">Administration</div>
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <Shield size={18} />
                  <span>Admin Console</span>
                </NavLink>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="nav-link"
                  style={{ width: '100%', color: 'var(--status-danger-text)' }}
                >
                  <LogOut size={18} />
                  <span>Log Out ({user?.name ? user.name.split(' ')[0] : 'Admin'})</span>
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Shield size={18} />
                <span>Admin Login</span>
              </NavLink>
            )}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>v1.0.0 • Connected</span>
          </div>
          <button
            onClick={toggleTheme}
            className="btn-outline btn-sm"
            title={`Current theme: ${theme}. Click to change.`}
          >
            {theme === 'dark' ? <Moon size={14} /> : theme === 'light' ? <Sun size={14} /> : <Laptop size={14} />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <button className="search-trigger-btn" onClick={() => setSearchOpen(true)}>
              <Search size={16} />
              <span>Search platform...</span>
              <kbd className="search-shortcut">Ctrl+K</kbd>
            </button>
          </div>

          <div className="header-right">
            <Link to="/academic-summary" className="btn btn-outline btn-sm no-print">
              <FileText size={15} />
              <span className="hide-mobile">Academic Report</span>
            </Link>

            {isAuthenticated ? (
              <Link to="/admin" className="btn btn-primary btn-sm">
                <Shield size={15} />
                <span>Admin Hub</span>
              </Link>
            ) : (
              <Link to="/login" className="btn btn-secondary btn-sm">
                <span>Admin Sign In</span>
              </Link>
            )}
          </div>
        </header>

        <main className="page-wrapper">{children}</main>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
