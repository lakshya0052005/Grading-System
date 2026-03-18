import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import AdminDashboard from './pages/AdminDashboard';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Analytics from './pages/Analytics';
import CalendarPage from './pages/Calendar';
import Leaderboard from './pages/Leaderboard';
import CommandCenter from './components/CommandCenter';
import DashboardLayout from './components/DashboardLayout';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'var(--bg-body)',
        color: 'var(--text-main)'
      }}>
        <div className="mesh-bg" />
        <div className="grid-overlay" />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="loading-spinner" style={{
            width: '80px',
            height: '80px',
            borderWidth: '5px',
            borderTopColor: 'var(--primary)',
            margin: '0 auto 30px'
          }}></div>
          <h1 className="gradient-text" style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            letterSpacing: '-1px',
            marginBottom: '10px'
          }}>GRADECH_</h1>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '1rem',
            fontWeight: '500',
            letterSpacing: '2px'
          }}>INITIALIZING SYSTEMS</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app" style={{
        minHeight: '100vh',
        background: 'transparent',
        color: 'var(--text-main)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden'
      }}>
        <div className="mesh-bg" />
        <div className="grid-overlay" />
        <Navbar />
        <div style={{ flex: 1, width: '100%', position: 'relative' }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={user ? <Navigate to={user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'} /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to={user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'} /> : <Register />} />
            <Route
              path="/student-dashboard"
              element={user?.role === 'student' ? <DashboardLayout><StudentDashboard /></DashboardLayout> : <Navigate to="/login" />}
            />
            <Route
              path="/teacher-dashboard"
              element={user?.role === 'teacher' ? <DashboardLayout><TeacherDashboard /></DashboardLayout> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={user?.role === 'admin' ? <DashboardLayout><AdminDashboard /></DashboardLayout> : <Navigate to="/" />}
            />
            <Route
              path="/profile"
              element={user ? <DashboardLayout><Profile /></DashboardLayout> : <Navigate to="/login" />}
            />
            <Route
              path="/resources"
              element={user ? <DashboardLayout><Resources /></DashboardLayout> : <Navigate to="/login" />}
            />
            <Route
              path="/notifications"
              element={user ? <DashboardLayout><Notifications /></DashboardLayout> : <Navigate to="/login" />}
            />
            <Route
              path="/settings"
              element={user ? <DashboardLayout><Settings /></DashboardLayout> : <Navigate to="/login" />}
            />
            <Route
              path="/help"
              element={user ? <DashboardLayout><Help /></DashboardLayout> : <Navigate to="/login" />}
            />
            <Route
              path="/analytics"
              element={user ? <DashboardLayout><Analytics /></DashboardLayout> : <Navigate to="/login" />}
            />
            <Route
              path="/calendar"
              element={user ? <DashboardLayout><CalendarPage /></DashboardLayout> : <Navigate to="/login" />}
            />
            <Route
              path="/leaderboard"
              element={user ? <DashboardLayout><Leaderboard /></DashboardLayout> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
        <CommandPortal />
      </div>
    </Router>
  );
};

const CommandPortal = () => {
  const [isCommandOpen, setIsCommandOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return <CommandCenter isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;