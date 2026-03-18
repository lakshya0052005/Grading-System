import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { useToast } from '../context/ToastContext';
import { UserPlus, Mail, Lock, User, GraduationCap, ArrowRight, Sparkles, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { showError, showSuccess } = useToast();
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const roles = [
        { id: 'student', title: 'Student', desc: 'Submit and track', icon: <GraduationCap size={28} /> },
        { id: 'teacher', title: 'Teacher', desc: 'Grade and manage', icon: <Sparkles size={28} /> }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await register(formData);
            const decoded = jwtDecode(data.token);
            const userData = {
                id: decoded.userId,
                role: decoded.role,
                name: decoded.name,
                email: decoded.email
            };
            loginUser(userData, data.token);
            showSuccess('Identity Created. Welcome to the Elite.');
            navigate(decoded.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Identity creation failed';
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
            <motion.div
                className="glass-card"
                style={{
                    width: '100%',
                    maxWidth: '700px',
                    padding: '60px',
                    position: 'relative'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px', background: 'var(--primary-glow)', filter: 'blur(100px)', opacity: 0.1 }} />

                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <div style={{
                        background: 'var(--primary-gradient)',
                        width: '80px',
                        height: '80px',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 30px',
                        boxShadow: 'var(--primary-glow)'
                    }}>
                        <UserPlus size={40} color="var(--text-inv)" />
                    </div>
                    <h2 className="gradient-text" style={{ fontSize: '3.3rem', fontWeight: '950', letterSpacing: '-2px', marginBottom: '10px' }}>Join Ecosystem</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600' }}>Initialize your academic intelligence protocol</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px', position: 'relative' }}>
                    <div className="form-group">
                        <label className="label-text">Full Governance Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={22} style={{ position: 'absolute', left: '22px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6 }} />
                            <input
                                type="text" className="input-area"
                                style={{ paddingLeft: '60px' }}
                                placeholder="Professor John Wick" required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label-text">Preferred Email Registry</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={22} style={{ position: 'absolute', left: '22px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6 }} />
                            <input
                                type="email" className="input-area"
                                style={{ paddingLeft: '60px' }}
                                placeholder="john@gradech.edu" required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', width: '100%' }}>
                        <div className="form-group">
                            <label className="label-text">Security Key</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={22} style={{ position: 'absolute', left: '22px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6 }} />
                                <input
                                    type="password" className="input-area"
                                    style={{ paddingLeft: '60px' }}
                                    placeholder="••••••••" required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label-text">Designated Role</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
                                {roles.map(role => (
                                    <div
                                        key={role.id}
                                        style={{
                                            padding: '20px',
                                            borderRadius: '20px',
                                            border: '1px solid ' + (formData.role === role.id ? 'var(--primary)' : 'var(--card-border)'),
                                            background: formData.role === role.id ? 'var(--primary-transparent)' : 'var(--card-bg)',
                                            cursor: 'pointer',
                                            transition: 'var(--transition-gentle)'
                                        }}
                                        onClick={() => setFormData({ ...formData, role: role.id })}
                                    >
                                        <div style={{ color: formData.role === role.id ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '8px' }}>{role.icon}</div>
                                        <div style={{ fontWeight: '800', fontSize: '1rem', color: formData.role === role.id ? 'var(--text-main)' : 'var(--text-muted)' }}>{role.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="glow-button" style={{ width: '100%', padding: '24px', fontSize: '1.2rem', marginTop: '10px' }} disabled={loading}>
                        {loading ? 'Processing Registry...' : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                                Establish Identity <ArrowRight size={24} />
                            </div>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: '500' }}>
                        Already have an identity? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '800', marginLeft: '8px' }}>Log In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;