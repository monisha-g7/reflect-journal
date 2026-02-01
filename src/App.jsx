import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Sparkles, Clock, Menu, X, Settings as SettingsIcon } from 'lucide-react';
import Settings from './components/Settings';
import { JournalProvider } from './context/JournalContext';
import HomePage from './pages/HomePage';
import JournalPage from './pages/JournalPage';
import DashboardPage from './pages/DashboardPage';
import InsightsPage from './pages/InsightsPage';
import HistoryPage from './pages/HistoryPage';

function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navItems = [
    { path: '/', icon: BookOpen, label: 'Write' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/insights', icon: Sparkles, label: 'Insights' },
    { path: '/history', icon: Clock, label: 'History' },
  ];

  // Don't show nav on landing page
  if (location.pathname === '/welcome') return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col p-6 bg-white/40 backdrop-blur-xl border-r border-gray-200/50 dark:bg-gray-900/40 dark:border-gray-700/50">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-semibold" style={{ color: '#3f4b3f' }}>Reflect</h1>
          <p className="text-sm mt-1" style={{ color: '#617461' }}>Your mindful companion</p>
        </div>

        <div className="flex flex-col gap-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={() => setSettingsOpen(true)}
            className="nav-link w-full mb-4"
          >
            <SettingsIcon size={20} />
            <span>Settings</span>
          </button>
          <div className="text-xs" style={{ color: '#7d917d' }}>
            <p>🔒 Your entries are stored</p>
            <p>locally and never leave your device.</p>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold" style={{ color: '#3f4b3f' }}>Reflect</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <SettingsIcon size={22} style={{ color: '#617461' }} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 p-4 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navItems.map(({ path, icon: Icon, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Settings Modal */}
      <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const isWelcome = location.pathname === '/welcome';

  // Initialize dark mode from localStorage
  useEffect(() => {
    const darkMode = localStorage.getItem('reflect-dark-mode') === 'true';
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="min-h-screen dark:bg-gray-950">
      <Navigation />
      <main className={`${!isWelcome ? 'md:ml-64 pt-16 md:pt-0' : ''} min-h-screen`}>
        <Routes>
          <Route path="/welcome" element={<HomePage />} />
          <Route path="/" element={<JournalPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <JournalProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </JournalProvider>
  );
}

export default App;
