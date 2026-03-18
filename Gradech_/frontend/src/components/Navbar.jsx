import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, BookOpen, User as UserIcon, LayoutDashboard, Sparkles, ChevronDown, Bell, Trash2, CheckCircle, Clock, ChevronRight, Shield, Book, Search, Trophy, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logoutUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [showNotifs, setShowNotifs] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const { data } = await api.getNotifications();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await api.markNotifAsRead(id);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.markAllNotifsAsRead();
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleDeleteNotif = async (id, e) => {
        e.stopPropagation();
        try {
            await api.deleteNotif(id);
            fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
                margin: '20px auto',
                width: 'calc(100% - 40px)',
                maxWidth: '1200px',
                padding: '12px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: '20px',
                zIndex: 1000,
                backdropFilter: 'var(--glass-blur)',
                background: 'var(--nav-bg)',
                borderRadius: '20px',
                border: '1px solid var(--card-border)',
                boxShadow: 'var(--card-shadow)'
            }}
        >
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none', color: 'var(--text-main)' }} className="hover:scale-105 transition-transform">
                <div style={{
                    background: 'var(--primary-gradient)',
                    padding: '10px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 20px var(--primary-glow)'
                }}>
                    <BookOpen size={28} color="white" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: '950', letterSpacing: '-1.5px', lineHeight: '1' }}>Gradech_</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '2px' }}>Ecosystem</span>
                </div>
            </Link>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <button
                    onClick={() => {
                        const e = new KeyboardEvent('keydown', { ctrlKey: true, key: 'k' });
                        window.dispatchEvent(e);
                    }}
                    style={{
                        padding: '12px 24px',
                        background: 'var(--primary-transparent)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '16px',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        transition: '0.3s'
                    }}
                    className="hover:scale-105"
                >
                    <Search size={18} color="var(--primary)" />
                    <span className="hide-mobile">Quick Search</span>
                    <div style={{ padding: '2px 8px', background: 'var(--card-bg)', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '900', border: '1px solid var(--card-border)' }}>Ctrl K</div>
                </button>

                {user ? (
                    <>
                        <ThemeToggle />
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginRight: '10px' }}>
                            <Link to={user.role === 'teacher' ? '/teacher-dashboard' : user.role === 'admin' ? '/admin' : '/student-dashboard'} className="nav-link" style={{
                                padding: '10px 18px',
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <LayoutDashboard size={18} />
                                <span className="hide-mobile">Dashboard</span>
                            </Link>

                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-link" style={{
                                    padding: '10px 18px',
                                    fontSize: '0.9rem',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <Shield size={18} />
                                    <span className="hide-mobile">Admin Panel</span>
                                </Link>
                            )}

                            {/* Notification Bell */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowNotifs(!showNotifs)}
                                    className="nav-link"
                                    style={{
                                        padding: '12px',
                                        borderRadius: '16px',
                                        background: showNotifs ? 'var(--primary-transparent)' : 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        position: 'relative'
                                    }}
                                >
                                    <Bell size={22} color={unreadCount > 0 ? 'var(--primary)' : 'var(--text-main)'} />
                                    {unreadCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            style={{
                                                position: 'absolute',
                                                top: '8px',
                                                right: '8px',
                                                background: 'var(--primary)',
                                                color: 'white',
                                                fontSize: '0.65rem',
                                                fontWeight: '900',
                                                padding: '2px 6px',
                                                borderRadius: '100px',
                                                border: '2px solid var(--bg-main)'
                                            }}
                                        >
                                            {unreadCount}
                                        </motion.span>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {showNotifs && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            style={{
                                                position: 'absolute',
                                                top: '100%',
                                                right: '0',
                                                width: '380px',
                                                maxHeight: '500px',
                                                background: 'var(--nav-bg)',
                                                backdropFilter: 'var(--glass-blur)',
                                                borderRadius: '24px',
                                                border: '1px solid var(--card-border)',
                                                marginTop: '20px',
                                                boxShadow: 'var(--card-shadow)',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <div style={{ padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)' }}>
                                                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900' }}>Intelligence Alerts</h4>
                                                {unreadCount > 0 && (
                                                    <button
                                                        onClick={markAllAsRead}
                                                        style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer' }}
                                                    >
                                                        Mark all as read
                                                    </button>
                                                )}
                                            </div>

                                            <div style={{ overflowY: 'auto', flex: 1, padding: '10px' }}>
                                                {notifications.length === 0 ? (
                                                    <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                        <Sparkles size={40} style={{ marginBottom: '15px', opacity: 0.3 }} />
                                                        <p style={{ fontWeight: '600' }}>No new intelligence protocol alerts.</p>
                                                    </div>
                                                ) : (
                                                    notifications.map((notif) => (
                                                        <div
                                                            key={notif._id}
                                                            onClick={() => markAsRead(notif._id)}
                                                            style={{
                                                                padding: '20px',
                                                                borderRadius: '18px',
                                                                background: notif.isRead ? 'transparent' : 'var(--primary-transparent)',
                                                                border: '1px solid transparent',
                                                                marginBottom: '5px',
                                                                cursor: 'pointer',
                                                                transition: '0.2s',
                                                                position: 'relative'
                                                            }}
                                                            className="hover:bg-primary-transparent"
                                                        >
                                                            <div style={{ display: 'flex', gap: '15px' }}>
                                                                <div style={{
                                                                    width: '10px', height: '10px', borderRadius: '50%',
                                                                    background: notif.isRead ? 'transparent' : 'var(--primary)',
                                                                    marginTop: '6px', flexShrink: 0
                                                                }} />
                                                                <div style={{ flex: 1 }}>
                                                                    <p style={{ margin: '0 0 5px 0', fontSize: '0.95rem', fontWeight: '800', color: notif.isRead ? 'var(--text-muted)' : 'var(--text-main)' }}>
                                                                        {notif.title}
                                                                    </p>
                                                                    <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                                                        {notif.message}
                                                                    </p>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>
                                                                        <Clock size={12} /> {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => handleDeleteNotif(notif._id, e)}
                                                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: '5px', borderRadius: '8px', cursor: 'pointer' }}
                                                                    className="hover:text-red-400"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Link to="/profile" className="nav-link" style={{
                                padding: '10px 18px',
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <UserIcon size={18} />
                                <span className="hide-mobile">Profile</span>
                            </Link>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <div
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    background: 'var(--primary-transparent)',
                                    padding: '8px 20px 8px 10px',
                                    borderRadius: '100px',
                                    border: '1px solid var(--card-border)',
                                    cursor: 'pointer',
                                    transition: '0.3s'
                                }}
                                className="hover:bg-primary-transparent"
                            >
                                <div style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '50%',
                                    background: 'var(--primary-gradient)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '900',
                                    fontSize: '1rem',
                                    color: 'white',
                                    boxShadow: '0 5px 15px var(--primary-glow)'
                                }}>
                                    {user.name?.charAt(0)}
                                </div>
                                <div className="hide-mobile">
                                    <p style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.2' }}>{user.name}</p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>{user.role}</p>
                                </div>
                                <ChevronDown size={16} color="var(--text-muted)" style={{ transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s' }} />
                            </div>

                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: '0',
                                            width: '240px',
                                            background: 'var(--nav-bg)',
                                            backdropFilter: 'var(--glass-blur)',
                                            borderRadius: '24px',
                                            border: '1px solid var(--card-border)',
                                            marginTop: '15px',
                                            boxShadow: 'var(--card-shadow)',
                                            padding: '12px',
                                            zIndex: 2000
                                        }}
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        {[
                                            { to: '/profile', icon: UserIcon, label: 'Profile Settings' },
                                            { to: '/leaderboard', icon: Trophy, label: 'Platform Legends' },
                                            { to: '/settings', icon: Settings, label: 'Preferences' },
                                            { to: '/help', icon: Book, label: 'Help & Docs' },
                                            { to: '/resources', icon: Sparkles, label: 'Academic Library' },
                                        ].map((item, idx) => (
                                            <Link
                                                key={idx}
                                                to={item.to}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    padding: '12px 18px',
                                                    borderRadius: '16px',
                                                    textDecoration: 'none',
                                                    color: 'var(--text-main)',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '700',
                                                    transition: '0.2s'
                                                }}
                                                className="hover:bg-primary-transparent"
                                            >
                                                <item.icon size={18} color="var(--primary)" />
                                                {item.label}
                                            </Link>
                                        ))}
                                        <div style={{ height: '1px', background: 'var(--card-border)', margin: '10px 0' }} />
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '12px 18px',
                                                borderRadius: '16px',
                                                border: 'none',
                                                background: 'hsla(0, 84%, 60%, 0.1)',
                                                color: 'hsl(0, 84%, 70%)',
                                                fontSize: '0.9rem',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                transition: '0.2s'
                                            }}
                                            onMouseOver={e => e.currentTarget.style.background = 'hsla(0, 84%, 60%, 0.15)'}
                                            onMouseOut={e => e.currentTarget.style.background = 'hsla(0, 84%, 60%, 0.1)'}
                                        >
                                            <LogOut size={18} /> Exit Ecosystem
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ display: 'flex', gap: '30px', marginRight: '40px' }} className="hide-mobile">
                            {['Platform', 'Solutions', 'Resources', 'Intelligence', 'Company'].map(link => (
                                <a
                                    key={link}
                                    href={location.pathname === '/' ? `#${link.toLowerCase()}` : `/#${link.toLowerCase()}`}
                                    className="nav-link"
                                    style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                        <ThemeToggle />
                        <Link to="/login" style={{
                            color: 'var(--text-main)',
                            textDecoration: 'none',
                            fontWeight: '800',
                            padding: '12px 20px',
                            fontSize: '0.9rem',
                            borderRadius: '16px',
                            transition: '0.3s'
                        }} className="nav-link">Secure Login</Link>
                        <Link to="/register" className="glow-button" style={{
                            padding: '12px 25px',
                            fontSize: '0.9rem',
                            borderRadius: '16px',
                            boxShadow: '0 15px 30px var(--primary-glow)'
                        }}>
                            Enter Ecosystem <ChevronRight size={18} style={{ marginLeft: '8px' }} />
                        </Link>
                    </>
                )}
            </div>
        </motion.nav>
    );
};

export default Navbar;
