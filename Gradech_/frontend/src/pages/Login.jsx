import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useToast } from '../context/ToastContext';
import { LogIn, Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { showError, showSuccess } = useToast();
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await login(formData);
            const decoded = jwtDecode(data.token);
            const userData = {
                id: decoded.userId,
                role: decoded.role,
                name: decoded.name,
                email: decoded.email
            };
            loginUser(userData, data.token);
            showSuccess('Identity Verified. Access Granted.');
            navigate(decoded.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Authentication sequence failed';
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
                    maxWidth: '500px',
                    padding: '60px 40px',
                    position: 'relative'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
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
                        <Lock size={36} color="var(--text-inv)" />
                    </div>
                    <h2 className="gradient-text" style={{ fontSize: '3rem', fontWeight: '950', letterSpacing: '-2px', marginBottom: '10px' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600' }}>Intelligence Protocol Authorization Required</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px', position: 'relative' }}>
                    <div className="form-group">
                        <label className="label-text">Academic Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={22} style={{ position: 'absolute', left: '22px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6 }} />
                            <input
                                type="email" className="input-area"
                                style={{ paddingLeft: '60px' }}
                                placeholder="name@gradech.edu" required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label-text">Security Key</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={22} style={{ position: 'absolute', left: '22px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.6 }} />
                            <input
                                type="password" className="input-area"
                                style={{ paddingLeft: '60px' }}
                                placeholder="••••••••••••" required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="glow-button" style={{ width: '100%', padding: '24px', fontSize: '1.2rem', marginTop: '10px' }} disabled={loading}>
                        {loading ? 'Decrypting...' : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                                Initiate Access <ArrowRight size={24} />
                            </div>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '50px', textAlign: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '40px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: '500' }}>
                        Missing credentials? <Link to="/register" style={{ color: 'white', textDecoration: 'none', fontWeight: '800', marginLeft: '8px' }} className="hover:text-primary transition-colors">Register Identity</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;