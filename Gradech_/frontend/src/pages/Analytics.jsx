import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, Target, BrainCircuit, ChevronRight, ArrowUpRight, ShieldCheck, Zap, Activity } from 'lucide-react';
import * as api from '../services/api';
import { useToast } from '../context/ToastContext';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const { showError } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assignRes, subRes] = await Promise.all([
                    api.getAssignments(),
                    api.getStudentSubmissions()
                ]);
                setAssignments(assignRes.data);
                setSubmissions(subRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error syncing intelligence:', error);
                showError('Intelligence sync failure');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Real-time calculations
    const totalAssignments = assignments.length;
    const completedCount = submissions.length;
    const velocity = totalAssignments > 0 ? Math.round((completedCount / totalAssignments) * 100) : 0;

    const gradedSubmissions = submissions.filter(s => s.status === 'graded');
    const accuracy = gradedSubmissions.length > 0
        ? Math.round(gradedSubmissions.reduce((acc, curr) => acc + (curr.grade || 0), 0) / gradedSubmissions.length)
        : 0;

    const interactionDepth = totalAssignments > 0 ? (submissions.length / totalAssignments).toFixed(1) : 0;

    const stats = [
        { label: 'Intelligence Velocity', value: `${velocity}%`, trend: '+4.2%', color: 'var(--primary)' },
        { label: 'Mastery Accuracy', value: `${accuracy}%`, trend: '+2.1%', color: 'var(--secondary)' },
        { label: 'System Uptime', value: '99.98%', trend: 'Stable', color: 'var(--success)' },
        { label: 'Interaction Depth', value: `${interactionDepth}x`, trend: '+1.5x', color: 'var(--warning)' }
    ];

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
                    <BrainCircuit size={20} className="float" /> Intelligence Suite
                </div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '950', lineHeight: '1', letterSpacing: '-2px', color: 'var(--text-main)' }}>
                    Performance <span className="gradient-text">Metrics.</span>
                </h1>
            </motion.div>

            {/* Grid Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '60px' }}>
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="glass-card"
                        style={{ padding: '35px', position: 'relative', overflow: 'hidden' }}
                    >
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: stat.color, opacity: 0.05, borderRadius: '50%', filter: 'blur(30px)' }} />
                        <p style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>{stat.label}</p>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px' }}>
                            <h2 style={{ fontSize: '2.8rem', fontWeight: '950', color: 'var(--text-main)', lineHeight: '1' }}>{stat.value}</h2>
                            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: stat.color, display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <TrendingUp size={14} style={{ marginRight: '4px' }} /> {stat.trend}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Visualizer */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', alignItems: 'start' }}>
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card"
                    style={{ padding: '50px', minHeight: '500px' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: '950', color: 'var(--text-main)' }}>Neural Mapping Process</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['24h', '7d', '30d'].map(period => (
                                <button key={period} style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer' }}>{period}</button>
                            ))}
                        </div>
                    </div>

                    <div style={{ width: '100%', height: '300px', position: 'relative' }}>
                        <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                d="M0,250 Q100,200 200,220 T400,100 T600,150 T800,50 L800,300 L0,300 Z"
                                fill="url(#chartGradient)"
                            />
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                d="M0,250 Q100,200 200,220 T400,100 T600,150 T800,50"
                                fill="none"
                                stroke="var(--primary)"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                        </svg>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700' }}>
                            <span>DEC 10</span>
                            <span>DEC 15</span>
                            <span>DEC 20</span>
                            <span>DEC 25</span>
                            <span>TODAY</span>
                        </div>
                    </div>
                </motion.div>

                <div style={{ display: 'grid', gap: '30px' }}>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card"
                        style={{ padding: '40px', background: 'var(--primary-gradient)', color: 'white' }}
                    >
                        <ShieldCheck size={40} style={{ marginBottom: '20px' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '950', marginBottom: '15px' }}>Academic Trust Score</h3>
                        <p style={{ fontSize: '1.1rem', fontWeight: '500', opacity: 0.9, lineHeight: '1.5', marginBottom: '25px' }}>Your account maintains elite status with zero integrity flags.</p>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '98%' }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                style={{ height: '100%', background: 'white', borderRadius: '4px', boxShadow: '0 0 20px white' }}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card"
                        style={{ padding: '40px' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                            <Zap size={24} color="var(--warning)" />
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)' }}>Skill Breakdown</h3>
                        </div>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {[
                                { label: 'Architectural Design', val: accuracy },
                                { label: 'Neural Protocols', val: velocity },
                                { label: 'Data Ethics', val: 100 }
                            ].map((skill, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '800' }}>
                                        <span style={{ color: 'var(--text-main)' }}>{skill.label}</span>
                                        <span style={{ color: 'var(--primary)' }}>{skill.val}%</span>
                                    </div>
                                    <div style={{ height: '6px', background: 'var(--primary-transparent)', borderRadius: '3px' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${skill.val}%` }}
                                            style={{ height: '100%', background: 'var(--primary)', borderRadius: '3px' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Analytics;
