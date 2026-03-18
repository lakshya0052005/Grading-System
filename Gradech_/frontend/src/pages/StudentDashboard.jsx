import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    Send,
    CheckCircle2,
    Clock,
    AlertCircle,
    FileText,
    Calendar,
    Search,
    Filter,
    ArrowUpRight,
    GraduationCap,
    TrendingUp,
    Layout,
    UploadCloud,
    X,
    MessageSquare,
    ChevronRight,
    Star,
    Sparkles,
    Trash2,
    Target,
    RefreshCcw,
    ExternalLink,
    Terminal,
    Trophy,
    Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import studentWelcome from '../assets/student-welcome.png';
import SystemStatus from '../components/SystemStatus';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Subcomponents
const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass-card"
        style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '25px', flex: 1 }}
    >
        <div style={{
            background: 'var(--primary-transparent)',
            color: 'var(--primary)',
            padding: '15px',
            borderRadius: '18px',
            border: '1px solid var(--card-border)'
        }}>
            <Icon size={32} />
        </div>
        <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{label}</p>
            <h3 style={{ fontSize: '2.4rem', fontWeight: '950', letterSpacing: '-1.5px', marginBottom: '5px', color: 'var(--text-main)' }}>{value}</h3>
            {trend && <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}><ArrowUpRight size={14} /> {trend} Improvement</div>}
        </div>
    </motion.div>
);

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [viewFeedback, setViewFeedback] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [pendingFile, setPendingFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [submissionText, setSubmissionText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStage, setSubmissionStage] = useState(null); // 'integrating', 'neural', 'indexing'
    const [timeLeft, setTimeLeft] = useState('2d 14h 35m');
    const [resources] = useState([
        { title: 'Neural Network Basics', type: 'PDF', icon: FileText, color: 'var(--primary)' },
        { title: 'Advanced React Patterns', type: 'Video', icon: Send, color: 'var(--secondary)' },
        { title: 'Academic Writing Guide', type: 'Link', icon: ExternalLink, color: 'var(--success)' },
    ]);

    const { showError, showSuccess } = useToast();
    const { user } = useAuth();

    // Stats calculation
    const totalAssignments = assignments.length;
    const completedCount = Object.values(submissions).length;
    const pendingCount = totalAssignments - completedCount;
    const gradedSubmissions = Object.values(submissions).filter(s => s.status === 'graded');
    const avgGrade = gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((acc, curr) => acc + (curr.grade || 0), 0) / gradedSubmissions.length
        : 0;
    const projectCount = assignments.filter(a => a.type === 'project').length;

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [assignmentsRes, submissionsRes] = await Promise.all([
                api.getAssignments(),
                api.getStudentSubmissions()
            ]);

            setAssignments(assignmentsRes.data);

            const submissionMap = {};
            submissionsRes.data.forEach(sub => {
                submissionMap[sub.assignmentId._id || sub.assignmentId] = sub;
            });
            setSubmissions(submissionMap);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            showError('Neural sync failure. Check connection.');
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPendingFile(file);
            if (file.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(file));
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const submitFinalAssignment = async () => {
        if (!pendingFile) return;
        setIsSubmitting(true);

        // --- Multi-stage Simulation ---
        setSubmissionStage('integrating');
        await new Promise(r => setTimeout(r, 1500));
        setSubmissionStage('neural');
        await new Promise(r => setTimeout(r, 2000));
        setSubmissionStage('indexing');
        await new Promise(r => setTimeout(r, 1500));
        // ------------------------------

        try {
            const formData = new FormData();
            formData.append('file', pendingFile);
            formData.append('assignmentId', selectedAssignment);
            formData.append('content', submissionText);

            await api.submitAssignment(formData);
            showSuccess('Deployment Authenticated. Evaluation Pending.');
            setPendingFile(null);
            setSelectedAssignment(null);
            setSubmissionText('');
            fetchDashboardData();
        } catch (error) {
            console.error('Submission failed:', error);
            showError(error.response?.data?.message || 'Submission sequence aborted');
        } finally {
            setIsSubmitting(false);
            setSubmissionStage(null);
        }
    };

    const filteredAssignments = assignments.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
        const sub = submissions[a._id];
        if (filterStatus === 'completed') return matchesSearch && sub;
        if (filterStatus === 'pending') return matchesSearch && !sub;
        return matchesSearch;
    });

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner" />
        </div>
    );

    return (
        <>
            {/* Header / Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '60px',
                    gap: '40px',
                    flexWrap: 'wrap'
                }}
            >
                <div style={{ flex: 1, minWidth: '350px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                        <Sparkles size={20} className="float" /> Student Portal
                    </div>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '950', lineHeight: '1', letterSpacing: '-2px', marginBottom: '25px', color: 'var(--text-main)' }}>
                        Welcome Back, <span className="gradient-text">Achiever</span>.
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '600px', fontWeight: '500' }}>
                        You've completed <span style={{ color: 'var(--text-main)', fontWeight: '800' }}>{completedCount}</span> out of <span style={{ color: 'var(--text-main)', fontWeight: '800' }}>{totalAssignments}</span> tasks. Keep the momentum going.
                    </p>
                </div>
                <div style={{ position: 'relative' }} className="hide-mobile">
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    >
                        <div className="glass-card" style={{
                            padding: '40px', background: 'var(--primary-gradient)', color: 'white',
                            textAlign: 'center', minWidth: '350px', border: 'none',
                            boxShadow: '0 40px 80px -20px var(--primary-glow)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '50%' }}>
                                    <Clock size={48} />
                                </div>
                            </div>
                            <p style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', opacity: 0.9, marginBottom: '10px' }}>Next Milestone Looming</p>
                            <h2 style={{ fontSize: '3.5rem', fontWeight: '950', letterSpacing: '-2px', marginBottom: '10px' }}>{timeLeft}</h2>
                            <p style={{ fontWeight: '600', opacity: 0.9 }}>Neural Architectures II</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
                <div className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Lightbulb size={20} color="var(--warning)" fill="var(--warning)" />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)' }}>Resource Hub</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {resources.map((res, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'hsla(0,0%,100%,0.02)', borderRadius: '20px', border: '1px solid var(--card-border)' }}>
                                <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--primary-transparent)', color: res.color }}>
                                    <res.icon size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{res.title}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{res.type}</p>
                                </div>
                                <ExternalLink
                                    size={16}
                                    color="var(--text-muted)"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate('/resources')}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ position: 'relative', width: '150px', height: '150px', marginBottom: '25px' }}>
                        <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary-transparent)" strokeWidth="8" />
                            <motion.circle
                                cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="8"
                                strokeDasharray="282.7"
                                initial={{ strokeDashoffset: 282.7 }}
                                animate={{ strokeDashoffset: 282.7 - (282.7 * (completedCount / totalAssignments || 0)) }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.8rem', fontWeight: '950', color: 'var(--text-main)' }}>{Math.round((completedCount / totalAssignments) * 100) || 0}%</span>
                        </div>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px' }}>Course Velocity</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>You're outpacing 85% of students</p>
                </div>

                <div className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Trophy size={20} color="var(--secondary)" fill="var(--secondary)" />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)' }}>Achievements</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        {[
                            { label: 'Fast Mover', color: 'var(--primary)' },
                            { label: 'A+ Streak', color: 'var(--secondary)' },
                            { label: 'Early Bird', color: 'var(--success)' },
                            { label: 'Top Contributor', color: 'var(--warning)' },
                        ].map((ach, i) => (
                            <div key={i} style={{
                                padding: '15px 10px', background: 'var(--primary-transparent)', border: '1px solid var(--card-border)',
                                borderRadius: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                            }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ach.color }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-main)' }}>{ach.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '50px' }}>
                <SystemStatus />
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '80px' }}>
                <StatCard icon={Target} label="Overall GPA" value={`${avgGrade.toFixed(1)}%`} color="252" />
                <StatCard icon={CheckCircle2} label="Tasks Verified" value={completedCount} color="150" />
                <StatCard icon={Clock} label="Pending Syncs" value={pendingCount} color="38" />
                <StatCard icon={Sparkles} label="Elite Projects" value={projectCount} color="330" />
            </div>

            {/* Tool Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', gap: '20px', flexWrap: 'wrap' }}>
                <div className="input-area" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 25px', flex: 1, maxWidth: '500px' }}>
                    <Search size={22} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Filter assignments by title..."
                        style={{ background: 'none', border: 'none', color: 'var(--text-main)', outline: 'none', width: '100%', fontSize: '1.1rem', fontWeight: '500' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    {['all', 'pending', 'completed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '15px',
                                border: '1px solid var(--card-border)',
                                background: filterStatus === status ? 'var(--primary-gradient)' : 'var(--primary-transparent)',
                                color: filterStatus === status ? 'var(--text-inv)' : 'var(--text-main)',
                                fontWeight: '700',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'var(--transition-fast)'
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Assignments Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
                <AnimatePresence>
                    {filteredAssignments.map((assignment, idx) => {
                        const submission = submissions[assignment._id];
                        const isGraded = submission?.status === 'graded';
                        const isReturned = submission?.status === 'returned';

                        return (
                            <motion.div
                                key={assignment._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                className="glass-card"
                                style={{ display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={{ padding: '35px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '25px' }}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <div style={{
                                                padding: '8px 16px',
                                                borderRadius: '100px',
                                                fontSize: '0.75rem',
                                                fontWeight: '900',
                                                letterSpacing: '1px',
                                                textTransform: 'uppercase',
                                                background: !submission ? 'hsla(38, 92%, 50%, 0.1)' : isGraded ? 'hsla(150, 100%, 40%, 0.1)' : 'hsla(252, 100%, 67%, 0.1)',
                                                color: !submission ? 'var(--warning)' : isGraded ? 'var(--success)' : 'var(--primary)',
                                                border: '1px solid currentColor'
                                            }}>
                                                {!submission ? 'Pending' : submission.status}
                                            </div>
                                            {submission?.lateSubmission && (
                                                <div style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '100px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '900',
                                                    letterSpacing: '1px',
                                                    textTransform: 'uppercase',
                                                    background: 'hsla(0, 100%, 50%, 0.1)',
                                                    color: 'var(--error)',
                                                    border: '1px solid var(--error)'
                                                }}>
                                                    Late
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)' }}>
                                            <Calendar size={18} />
                                            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '15px', letterSpacing: '-0.5px', color: 'var(--text-main)' }}>{assignment.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.1rem', marginBottom: '30px', fontWeight: '500' }}>{assignment.description}</p>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px', borderTop: '1px solid var(--card-border)', paddingTop: '30px' }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>Weight</p>
                                            <p style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>15% of total</p>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>Difficulty</p>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star key={star} size={14} fill={star <= 4 ? "var(--warning)" : "none"} color="var(--warning)" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: 'hsla(0, 0%, 100%, 0.02)', padding: '30px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '15px', marginTop: 'auto' }}>
                                    {!submission ? (
                                        <button
                                            onClick={() => setSelectedAssignment(assignment._id)}
                                            className="glow-button"
                                            style={{ width: '100%', padding: '15px' }}
                                        >
                                            <UploadCloud size={20} /> Submit Assignment
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setViewFeedback(submission)}
                                                style={{
                                                    flex: 1,
                                                    background: 'var(--primary-transparent)',
                                                    border: '1px solid var(--card-border)',
                                                    color: 'var(--primary)',
                                                    fontWeight: '700',
                                                    padding: '15px',
                                                    borderRadius: '15px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '10px',
                                                    transition: 'var(--transition-fast)'
                                                }}
                                                className="hover:bg-primary-transparent"
                                            >
                                                <FileText size={18} /> View Report
                                            </button>
                                            {isGraded && (
                                                <div style={{
                                                    flex: 1,
                                                    background: 'var(--primary-transparent)',
                                                    border: '1px solid var(--card-border)',
                                                    color: 'var(--success)',
                                                    fontWeight: '900',
                                                    fontSize: '1.4rem',
                                                    borderRadius: '15px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    {submission.grade}%
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Submission Modal */}
            <AnimatePresence>
                {selectedAssignment && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="glass-card"
                            style={{ maxWidth: '600px', width: '100%', padding: '50px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: '950', letterSpacing: '-1px', color: 'var(--text-main)' }}>Finalize Submission</h2>
                                <button onClick={() => setSelectedAssignment(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={32} /></button>
                            </div>

                            <div style={{ marginBottom: '40px' }}>
                                <label className="label-text">Academic Integrity Agreement</label>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '10px', lineHeight: '1.6', fontWeight: '500' }}>
                                    By submitting this work, I certify that this is my own original creation, and I have properly cited all outside sources. I understand that AI-generated content without disclosure is subject to review.
                                </p>
                            </div>

                            {!pendingFile ? (
                                <div style={{
                                    border: '2px dashed var(--card-border)',
                                    borderRadius: '24px',
                                    padding: '60px 30px',
                                    textAlign: 'center',
                                    position: 'relative',
                                    transition: 'var(--transition-gentle)',
                                    background: 'var(--primary-transparent)'
                                }}
                                    onDragOver={(e) => e.preventDefault()}
                                    className="hover:border-primary"
                                >
                                    <UploadCloud size={64} color="var(--primary)" style={{ marginBottom: '25px', opacity: 0.5 }} />
                                    <p style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-main)' }}>Select File to Upload</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '30px' }}>PDF, DOCX, or ZIP (Max 50MB)</p>
                                    <input
                                        type="file"
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                        onChange={handleFileChange}
                                    />
                                    <div className="glow-button" style={{ display: 'inline-flex', padding: '14px 40px' }}>Choose Explorer</div>
                                </div>
                            ) : (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                    <div style={{ background: 'var(--primary-transparent)', borderRadius: '24px', padding: '30px', border: '1px solid var(--card-border)', marginBottom: '30px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
                                            <div style={{ width: '60px', height: '60px', background: 'var(--primary-gradient)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FileText size={30} color="var(--text-inv)" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '4px', color: 'var(--text-main)' }}>{pendingFile.name}</p>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{(pendingFile.size / 1024 / 1024).toFixed(2)} MB • Ready for deployment</p>
                                            </div>
                                            <button onClick={() => { setPendingFile(null); setPreviewUrl(null); }} style={{ background: 'hsla(0, 84%, 60%, 0.1)', color: 'hsl(0, 84%, 70%)', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>
                                                <X size={20} />
                                            </button>
                                        </div>

                                        {previewUrl && (
                                            <div style={{ marginBottom: '25px', borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
                                                <img src={previewUrl} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                                            </div>
                                        )}

                                        <div className="form-group">
                                            <label className="label-text" style={{ fontSize: '0.8rem' }}>Submission Memo (Optional)</label>
                                            <textarea
                                                className="input-area"
                                                placeholder="Add notes for the instructor..."
                                                style={{ minHeight: '100px', marginTop: '10px', fontSize: '0.95rem' }}
                                                value={submissionText}
                                                onChange={(e) => setSubmissionText(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={submitFinalAssignment}
                                        className="glow-button"
                                        style={{ width: '100%', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <RefreshCcw size={20} className="spin" />
                                                {submissionStage === 'integrating' && "Authenticating Integrity Protocol..."}
                                                {submissionStage === 'neural' && "Neural File Analysis in Progress..."}
                                                {submissionStage === 'indexing' && "Indexing to Academic Cluster..."}
                                            </>
                                        ) : <><Send size={20} /> Authenticate & Submit</>}
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Feedback Modal / Report */}
            <AnimatePresence>
                {viewFeedback && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="glass-card"
                            style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <div style={{ padding: '60px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '60px' }}>
                                    <div>
                                        <p style={{ color: 'var(--primary)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '10px' }}>Academic Performance Report</p>
                                        <h2 style={{ fontSize: '2.5rem', fontWeight: '950', letterSpacing: '-1.5px', color: 'var(--text-main)' }}>Detailed Feedback</h2>
                                    </div>
                                    <button onClick={() => setViewFeedback(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={40} /></button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', marginBottom: '60px' }}>
                                    <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
                                        <p style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '10px' }}>Overall Grade</p>
                                        <p style={{ fontSize: '3.5rem', fontWeight: '950', color: viewFeedback.grade >= 90 ? 'var(--success)' : 'var(--primary)' }}>{viewFeedback.grade || 'N/A'}%</p>
                                    </div>
                                    <div className="glass-card" style={{ padding: '30px', textAlign: 'center', background: 'var(--primary-transparent)' }}>
                                        <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '10px' }}>Status</p>
                                        <p style={{ fontSize: '1.8rem', fontWeight: '900', textTransform: 'capitalize', color: 'var(--text-main)' }}>{viewFeedback.status}</p>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '60px' }}>
                                    <h4 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <MessageSquare size={24} color="var(--primary)" /> Instructor Feedback
                                    </h4>
                                    <div style={{ background: 'hsla(0,0%,100%,0.03)', padding: '40px', borderRadius: '24px', border: '1px solid var(--glass-border)', lineHeight: '1.7', fontSize: '1.2rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                                        "{viewFeedback.feedback || "No feedback provided yet. Your work is under review."}"
                                    </div>
                                </div>

                                {viewFeedback.rubricGrades && (
                                    <div>
                                        <h4 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Target size={24} color="var(--secondary)" /> Rubric Breakdown
                                        </h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                            {Object.entries(viewFeedback.rubricGrades).map(([criterion, score]) => (
                                                <div key={criterion}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                        <span style={{ fontWeight: '800', textTransform: 'capitalize', color: 'var(--text-muted)' }}>{criterion.replace(/([A-Z])/g, ' $1')}</span>
                                                        <span style={{ fontWeight: '950', color: 'var(--text-main)' }}>{score}/20</span>
                                                    </div>
                                                    <div style={{ height: '10px', background: 'hsla(0,0%,100%,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(score / 20) * 100}%` }}
                                                            transition={{ duration: 1, ease: 'easeOut' }}
                                                            style={{ height: '100%', background: 'var(--primary-gradient)', borderRadius: '100px', boxShadow: '0 0 15px var(--primary-glow)' }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default StudentDashboard;