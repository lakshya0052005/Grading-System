import React, { useState, useEffect } from 'react';
import { Bell, Trash2, CheckCircle, Clock, Search, Filter, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as api from '../services/api';
import { useToast } from '../context/ToastContext';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { showError, showSuccess } = useToast();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.getNotifications();
            setNotifications(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            showError('Failed to sync with intelligence alerts.');
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.markNotifAsRead(id);
            fetchNotifications();
        } catch (error) {
            showError('Sync failure.');
        }
    };

    const deleteNotif = async (id) => {
        try {
            await api.deleteNotif(id);
            fetchNotifications();
            showSuccess('Alert purged from system.');
        } catch (error) {
            showError('Purge failed.');
        }
    };

    const filteredNotifs = notifications.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner" />
        </div>
    );

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '60px' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                    <Bell size={20} className="float" /> Intelligence Center
                </div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '950', lineHeight: '1', letterSpacing: '-2px', color: 'var(--text-main)' }}>
                    System <span className="gradient-text">Alerts.</span>
                </h1>
            </motion.div>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '30px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div className="input-area" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 25px', flex: 1, maxWidth: '500px' }}>
                        <Search size={22} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Filter alerts..."
                            style={{ background: 'none', border: 'none', color: 'var(--text-main)', outline: 'none', width: '100%', fontSize: '1.1rem', fontWeight: '500' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ minHeight: '400px' }}>
                    {filteredNotifs.length === 0 ? (
                        <div style={{ padding: '100px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <Sparkles size={64} style={{ marginBottom: '25px', opacity: 0.1 }} />
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '900' }}>No Alerts Detected</h3>
                            <p style={{ fontSize: '1.1rem', marginTop: '10px' }}>Your intelligence feed is currently clear.</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filteredNotifs.map((notif, idx) => (
                                <motion.div
                                    key={notif._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: idx * 0.05 }}
                                    style={{
                                        padding: '35px',
                                        borderBottom: '1px solid var(--card-border)',
                                        background: notif.isRead ? 'transparent' : 'var(--primary-transparent)',
                                        display: 'flex',
                                        gap: '30px',
                                        alignItems: 'start',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => markAsRead(notif._id)}
                                >
                                    <div style={{
                                        width: '60px', height: '60px', borderRadius: '18px',
                                        background: notif.isRead ? 'var(--card-hover)' : 'var(--primary-gradient)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: notif.isRead ? 'var(--text-muted)' : 'white'
                                    }}>
                                        <Bell size={28} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                                            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: notif.isRead ? 'var(--text-muted)' : 'var(--text-main)' }}>{notif.title}</h3>
                                            <div style={{ display: 'flex', gap: '15px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '700' }}>
                                                    <Clock size={16} /> {new Date(notif.createdAt).toLocaleString()}
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteNotif(notif._id); }}
                                                    style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '5px' }}
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '800px' }}>{notif.message}</p>
                                    </div>
                                    <ChevronRight size={24} color="var(--primary)" style={{ alignSelf: 'center', opacity: notif.isRead ? 0.3 : 1 }} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </>
    );
};

export default Notifications;
