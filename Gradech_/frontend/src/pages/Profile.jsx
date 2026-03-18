import React, { useState, useEffect } from 'react';
import { User, Mail, GraduationCap, Calendar, Edit3, Save, X, ArrowRight, Shield, Bell, Zap, Award, Sparkles, TrendingUp, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

const Profile = () => {
    const { showError, showSuccess } = useToast();
    const { user: authUser, loginUser } = useAuth();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const { data } = await api.getProfile();
            setUser(data);
            setEditData(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            showError('Security Registry Error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEditToggle = async () => {
        if (isEditing) {
            try {
                const { data } = await api.updateProfile(editData);
                setUser(data.user);
                // Update AuthContext and LocalStorage with the new token
                loginUser(data.user, data.token);
                setIsEditing(false);
                showSuccess('Security Registry Updated');
            } catch (error) {
                showError('Update failed. Try again.');
                console.error(error);
            }
        } else {
            setIsEditing(true);
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner" />
        </div>
    );

    return (
        <div style={{ maxWidth: '1400px', margin: '140px auto 60px', padding: '0 5%', display: 'flex', flexDirection: 'column', gap: '60px' }}>

            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{ padding: '60px', display: 'flex', gap: '60px', alignItems: 'center', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}
            >
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'var(--primary-glow)', filter: 'blur(150px)', opacity: 0.15, zIndex: 0 }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        width: '240px',
                        height: '240px',
                        borderRadius: '60px',
                        background: 'var(--primary-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '7rem',
                        color: 'var(--text-inv)',
                        fontWeight: '950',
                        boxShadow: '0 40px 80px -20px var(--primary-glow)',
                        transform: 'rotate(-4deg)',
                        border: '8px solid var(--card-border)'
                    }}>
                        {user?.name?.charAt(0)}
                    </div>
                </div>

                <div style={{ flex: 1, minWidth: '400px', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '35px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--primary)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '15px' }}>
                                <Award size={20} className="float" /> Elite Credentials
                            </div>
                            <h1 className="gradient-text" style={{ fontSize: '4.5rem', fontWeight: '950', letterSpacing: '-3px', marginBottom: '15px', lineHeight: '0.9' }}>
                                {user?.name}
                            </h1>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: '500' }}>
                                <Mail size={20} /> {user?.email}
                            </p>
                        </div>
                        <button onClick={handleEditToggle} className="glow-button" style={{ padding: '20px 45px', borderRadius: '24px', fontSize: '1.1rem' }}>
                            {isEditing ? <><Save size={22} /> Commit Edits</> : <><Edit3 size={22} /> Modify Profile</>}
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '30px' }}>
                        {[
                            { label: 'System Access', value: user?.role === 'teacher' ? 'Instructor' : user?.role === 'admin' ? 'Administrator' : 'Student', color: 'var(--primary)' },
                            { label: 'Academic Standing', value: 'Distinguished', color: 'var(--success)' },
                            { label: 'Ecosystem Rank', value: 'Gold Tier', color: 'var(--warning)' }
                        ].map((stat, i) => (
                            <div key={i} style={{ background: 'var(--primary-transparent)', padding: '25px', borderRadius: '24px', border: '1px solid var(--card-border)' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>{stat.label}</p>
                                <p style={{ fontSize: '1.4rem', fontWeight: '950', color: stat.color }}>{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '40px' }}>

                {/* Information Sector */}
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: '50px' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: '950', marginBottom: '45px', display: 'flex', alignItems: 'center', gap: '20px', color: 'var(--text-main)' }}>
                        <Shield size={32} color="var(--primary)" /> Security Clearance
                    </h3>
                    <div style={{ display: 'grid', gap: '35px' }}>
                        <div className="form-group">
                            <label className="label-text">Official Identifier</label>
                            {isEditing ? (
                                <input type="text" className="input-area" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                            ) : (
                                <div style={{ padding: '20px', background: 'var(--primary-transparent)', borderRadius: '18px', border: '1px solid var(--card-border)', fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)' }}>{user?.name}</div>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="label-text">Authenticated Email Registry</label>
                            {isEditing ? (
                                <input type="email" className="input-area" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                            ) : (
                                <div style={{ padding: '20px', background: 'var(--primary-transparent)', borderRadius: '18px', border: '1px solid var(--card-border)', fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)' }}>{user?.email}</div>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="label-text">Administrative Access</label>
                            <div style={{ padding: '20px', background: 'var(--primary-transparent)', borderRadius: '18px', border: '1px solid var(--card-border)', fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {user?.role} ACCESS AUTHORIZED
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Intelligence & Prefs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: '50px' }}>
                        <h3 style={{ fontSize: '2rem', fontWeight: '950', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px', color: 'var(--text-main)' }}>
                            <Zap size={32} color="var(--secondary)" /> Neural Preferences
                        </h3>
                        <div style={{ display: 'grid', gap: '25px' }}>
                            {[
                                { title: 'AI Assistant Integration', desc: 'Predictive grading and submission insights', active: true },
                                { title: 'Intelligent Alerts', desc: 'Real-time push notifications for priority tasks', active: true },
                                { title: 'Global Sync', desc: 'Multi-device state persistence', active: false }
                            ].map((pref, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px', borderRadius: '24px', background: 'var(--primary-transparent)', border: '1px solid var(--card-border)' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem', fontWeight: '850', marginBottom: '5px', color: 'var(--text-main)' }}>{pref.title}</h4>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>{pref.desc}</p>
                                    </div>
                                    <div style={{ width: '64px', height: '34px', borderRadius: '100px', background: pref.active ? 'var(--primary-gradient)' : 'var(--card-border)', position: 'relative', cursor: 'pointer', padding: '5px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', marginLeft: pref.active ? 'auto' : '0' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '50px', border: '1px solid var(--error)', background: 'var(--primary-transparent)' }}>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '950', marginBottom: '30px', color: 'var(--error)' }}>Critical Actions</h3>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <button style={{ width: '100%', padding: '20px', borderRadius: '18px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontWeight: '800', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} className="hover:text-primary transition-colors">
                                Reset Security Protocols <RefreshCcw size={20} />
                            </button>
                            <button style={{ width: '100%', padding: '20px', borderRadius: '18px', border: '1px solid var(--error)', background: 'var(--error)', color: 'white', fontWeight: '900', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', opacity: 0.8 }} className="hover:opacity-100 transition-opacity">
                                Decommission Account <X size={20} />
                            </button>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default Profile;