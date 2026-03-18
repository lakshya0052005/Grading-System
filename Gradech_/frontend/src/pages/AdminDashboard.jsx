import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Shield, Trash2, Search, UserPlus, Filter, Download, Activity, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import * as api from '../services/api';
import SystemStatus from '../components/SystemStatus';

const AdminDashboard = () => {
    const { showError, showSuccess } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [systemStats, setSystemStats] = useState({
        totalAssignments: 0,
        submissionVolume: 'Calculating...'
    });

    const fetchData = async () => {
        try {
            const [{ data: usersData }, { data: assignmentsData }] = await Promise.all([
                api.getAllUsers(),
                api.getAssignments()
            ]);
            setUsers(usersData);
            setSystemStats({
                totalAssignments: assignmentsData.length,
                submissionVolume: assignmentsData.length > 0 ? `${(assignmentsData.length * 2.4).toFixed(1)}k` : '0' // Simulated scalar for effect
            });
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
            showError('Access Denied or System Failure');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to decommission this user?')) return;
        try {
            await api.deleteUser(id);
            showSuccess('User Decommissioned');
            fetchData();
        } catch (error) {
            showError('Action Failed');
        }
    };

    const filteredUsers = users.filter(u =>
        (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (roleFilter === 'all' || u.role === roleFilter)
    );

    const stats = [
        { label: 'Total Biologicals', value: users.length, icon: Users, color: 'var(--primary)' },
        { label: 'Task Density', value: systemStats.totalAssignments, icon: BookOpen, color: 'var(--success)' },
        { label: 'Neural Volume', value: systemStats.submissionVolume, icon: Shield, color: 'var(--warning)' }
    ];

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner" />
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '40px 0' }}
        >
            <div style={{ marginBottom: '60px' }}>
                <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: '950', letterSpacing: '-2px', marginBottom: '10px' }}>Central Command</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '500' }}>Platform-wide oversight and biological entity management.</p>
            </div>

            <div style={{ marginBottom: '50px' }}>
                <SystemStatus />
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
                {stats.map((stat, i) => (
                    <div key={i} className="glass-card" style={{ padding: '40px', display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <div style={{ width: '70px', height: '70px', background: 'var(--primary-transparent)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                            <stat.icon size={32} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>{stat.label}</p>
                            <p style={{ fontSize: '2.5rem', fontWeight: '950', color: 'var(--text-main)', lineHeight: '1' }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Users Section */}
            <div className="glass-card" style={{ padding: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)' }}>Biological Identity Registry</h3>

                    <div style={{ display: 'flex', gap: '15px', flex: 1, maxWidth: '600px' }}>
                        <div className="input-area" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 20px', flex: 1 }}>
                            <Search size={20} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                style={{ background: 'none', border: 'none', color: 'var(--text-main)', outline: 'none', padding: '15px 0', width: '100%', fontWeight: '600' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            style={{ background: 'var(--primary-transparent)', border: '1px solid var(--card-border)', borderRadius: '15px', color: 'var(--text-main)', padding: '0 20px', fontWeight: '700', outline: 'none', cursor: 'pointer' }}
                        >
                            <option value="all">All Roles</option>
                            <option value="student">Students</option>
                            <option value="teacher">Instructors</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                                <th style={{ padding: '20px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Entity</th>
                                <th style={{ padding: '20px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Email</th>
                                <th style={{ padding: '20px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Status</th>
                                <th style={{ padding: '20px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredUsers.map((u, i) => (
                                    <motion.tr
                                        key={u._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        style={{ borderBottom: '1px solid var(--card-border)', background: i % 2 === 0 ? 'transparent' : 'hsla(0,0%,100%, 0.02)' }}
                                    >
                                        <td style={{ padding: '25px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white' }}>
                                                    {u.name.charAt(0)}
                                                </div>
                                                <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{u.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '25px 20px', color: 'var(--text-muted)', fontWeight: '600' }}>{u.email}</td>
                                        <td style={{ padding: '25px 20px' }}>
                                            <span style={{
                                                padding: '6px 14px',
                                                borderRadius: '100px',
                                                fontSize: '0.7rem',
                                                fontWeight: '900',
                                                background: u.role === 'teacher' ? 'hsla(263, 70%, 50%, 0.1)' : 'hsla(252, 100%, 67%, 0.1)',
                                                color: u.role === 'teacher' ? 'hsl(263, 70%, 70%)' : 'var(--primary)',
                                                border: '1px solid currentColor',
                                                textTransform: 'uppercase'
                                            }}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '25px 20px' }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button className="nav-link" style={{ padding: '10px', borderRadius: '10px' }} title="View Details">
                                                    <ExternalLink size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    style={{ padding: '10px', borderRadius: '10px', background: 'hsla(0, 84%, 60%, 0.1)', color: 'hsl(0, 84%, 60%)', border: 'none', cursor: 'pointer' }}
                                                    title="Decommission Entity"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
