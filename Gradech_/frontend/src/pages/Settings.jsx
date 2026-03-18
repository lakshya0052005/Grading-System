import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, Save, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Settings = () => {
    const { user } = useAuth();
    const { showSuccess, showError } = useToast();
    const [activeTab, setActiveTab] = useState('profile');

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: 'Advanced Academic Contributor focusing on Neural Architectures and Distributed Systems.'
    });

    const handleSave = () => {
        showSuccess('Intelligence configurations updated successfully.');
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Palette }
    ];

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '60px' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                    <SettingsIcon size={20} className="spin" /> Core Configurations
                </div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '950', lineHeight: '1', letterSpacing: '-2px', color: 'var(--text-main)' }}>
                    User <span className="gradient-text">Preferences.</span>
                </h1>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px', alignItems: 'start' }}>
                {/* Tabs Sidebar */}
                <div className="glass-card" style={{ padding: '20px' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '18px 25px',
                                borderRadius: '18px',
                                border: 'none',
                                background: activeTab === tab.id ? 'var(--primary-gradient)' : 'transparent',
                                color: activeTab === tab.id ? 'white' : 'var(--text-main)',
                                fontWeight: '800',
                                cursor: 'pointer',
                                transition: '0.3s',
                                marginBottom: '5px'
                            }}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="glass-card" style={{ padding: '60px' }}>
                    {activeTab === 'profile' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h3 style={{ fontSize: '2rem', fontWeight: '950', marginBottom: '40px', letterSpacing: '-1px' }}>Profile Integration</h3>
                            <div style={{ display: 'grid', gap: '30px' }}>
                                <div className="form-group">
                                    <label className="label-text">Full Identity Name</label>
                                    <input
                                        type="text" className="input-area"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label-text">Contact Vector (Email)</label>
                                    <input
                                        type="email" className="input-area"
                                        value={profileData.email} disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label-text">Academic Bio / Synopsis</label>
                                    <textarea
                                        className="input-area" style={{ minHeight: '120px' }}
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                    />
                                </div>
                                <button onClick={handleSave} className="glow-button" style={{ marginTop: '20px', width: 'fit-content' }}>
                                    <Save size={20} /> Deploy Changes
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'notifications' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h3 style={{ fontSize: '2rem', fontWeight: '950', marginBottom: '40px', letterSpacing: '-1px' }}>Alert Protocols</h3>
                            <div style={{ display: 'grid', gap: '25px' }}>
                                {[
                                    { label: 'Grading Protocol Completion', desc: 'Receive alerts when AI or Faculty finalize evaluation.' },
                                    { label: 'Peer Intelligence Sync', desc: 'Get notified when new shared resources are available.' },
                                    { label: 'System Maintenance', desc: 'Alerts for node updates and server expansion.' }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px', background: 'var(--primary-transparent)', borderRadius: '24px', border: '1px solid var(--card-border)' }}>
                                        <div>
                                            <p style={{ fontWeight: '850', fontSize: '1.1rem', color: 'var(--text-main)' }}>{item.label}</p>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px' }}>{item.desc}</p>
                                        </div>
                                        <div style={{ width: '50px', height: '26px', background: 'var(--primary)', borderRadius: '100px', cursor: 'pointer', position: 'relative' }}>
                                            <div style={{ position: 'absolute', right: '4px', top: '4px', width: '18px', height: '18px', background: 'white', borderRadius: '50%' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab !== 'profile' && activeTab !== 'notifications' && (
                        <div style={{ padding: '100px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <RefreshCw size={64} className="spin" style={{ marginBottom: '25px', opacity: 0.1 }} />
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '900' }}>Protocol Under Construction</h3>
                            <p>This configuration module is being optimized for the next deployment.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Settings;
