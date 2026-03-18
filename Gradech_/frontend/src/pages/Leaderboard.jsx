import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, Star, Crown, ChevronRight, Search, Medal, Target, Zap } from 'lucide-react';
import * as api from '../services/api';
import { useToast } from '../context/ToastContext';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showError } = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.getAllUsers();
                // Filter and sort for elite feel
                const students = res.data
                    .filter(u => u.role === 'student' || u.role === 'admin')
                    .map(u => ({
                        ...u,
                        score: Math.floor(Math.random() * 500) + 2000,
                        streak: Math.floor(Math.random() * 15) + 5
                    }))
                    .sort((a, b) => b.score - a.score);

                setUsers(students);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching legends:', error);
                showError('Legends sync failure');
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner" />
        </div>
    );

    const topThree = users.slice(0, 3);
    const others = users.slice(3, 10);

    const RankIcon = ({ rank }) => {
        if (rank === 0) return <Crown color="var(--primary)" size={24} fill="var(--primary)" />;
        if (rank === 1) return <Medal color="#C0C0C0" size={24} />;
        if (rank === 2) return <Medal color="#CD7F32" size={24} />;
        return <span style={{ fontWeight: '900', color: 'var(--text-muted)' }}>#{rank + 1}</span>;
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '60px' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                    <Star size={20} className="float" /> Platform Legends
                </div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '950', lineHeight: '1', letterSpacing: '-2px', color: 'var(--text-main)' }}>
                    Departmental <span className="gradient-text">Glory.</span>
                </h1>
            </motion.div>

            {/* Podium */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginBottom: '80px', alignItems: 'end' }}>
                {topThree.map((user, i) => (
                    <motion.div
                        key={user._id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card"
                        style={{
                            padding: i === 0 ? '60px 40px' : '40px',
                            textAlign: 'center',
                            border: i === 0 ? '2px solid var(--primary)' : '1px solid var(--card-border)',
                            position: 'relative',
                            zIndex: i === 0 ? 2 : 1,
                            boxShadow: i === 0 ? '0 30px 60px -15px var(--primary-glow)' : 'none'
                        }}
                    >
                        {i === 0 && <Crown size={40} color="var(--primary)" style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)' }} className="float" />}
                        <div style={{ width: i === 0 ? '120px' : '80px', height: i === 0 ? '120px' : '80px', borderRadius: '50%', background: 'var(--primary-gradient)', margin: '0 auto 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i === 0 ? '3rem' : '2rem', fontWeight: '900', color: 'white' }}>
                            {user.name.charAt(0)}
                        </div>
                        <h3 style={{ fontSize: i === 0 ? '1.8rem' : '1.3rem', fontWeight: '950', color: 'var(--text-main)', marginBottom: '8px' }}>{user.name}</h3>
                        <p style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.9rem', marginBottom: '20px', textTransform: 'uppercase' }}>{user.department || 'Elite Operative'}</p>
                        <div style={{ background: 'var(--primary-transparent)', padding: '15px', borderRadius: '15px', display: 'inline-block' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: '950', color: 'var(--text-main)' }}>{user.score}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px', fontWeight: '700' }}>PTS</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* List */}
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '30px 40px', background: 'var(--primary-transparent)', borderBottom: '1px solid var(--card-border)', display: 'grid', gridTemplateColumns: '80px 1fr 200px 150px 100px', alignItems: 'center', fontWeight: '900', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                    <span>Rank</span>
                    <span>Candidate</span>
                    <span>Specialization</span>
                    <span>Intelligence</span>
                    <span>Progress</span>
                </div>
                {others.map((user, i) => (
                    <motion.div
                        key={user._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        style={{ padding: '25px 40px', borderBottom: i === others.length - 1 ? 'none' : '1px solid var(--card-border)', display: 'grid', gridTemplateColumns: '80px 1fr 200px 150px 100px', alignItems: 'center' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontWeight: '900', color: 'var(--text-muted)' }}>#{i + 4}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '14px', background: 'var(--primary-transparent)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>{user.name.charAt(0)}</div>
                            <span style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1.1rem' }}>{user.name}</span>
                        </div>
                        <span style={{ fontWeight: '700', color: 'var(--text-muted)' }}>{user.department || 'Elite Operative'}</span>
                        <span style={{ fontWeight: '950', color: 'var(--text-main)', fontSize: '1.2rem' }}>{user.score} <Zap size={14} color="var(--primary)" fill="var(--primary)" style={{ display: 'inline', marginLeft: '5px' }} /></span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--success)', fontWeight: '800' }}>
                            <TrendingUp size={16} /> +{user.streak}%
                        </div>
                    </motion.div>
                ))}
            </div>
        </>
    );
};

export default Leaderboard;
