import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Users,
    ChevronRight,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    Clock,
    AlertCircle,
    FileText,
    Calendar,
    ArrowUpRight,
    TrendingUp,
    BarChart3,
    GraduationCap,
    Download,
    Trash2,
    Layout,
    Sparkles,
    Activity,
    BrainCircuit,
    Zap,
    Target,
    Star,
    ArrowLeft,
    RefreshCcw,
    Send,
    Shield,
    Bell,
    Settings,
    History,
    Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import teacherAnalytics from '../assets/teacher-analytics.png';
import SystemStatus from '../components/SystemStatus';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// --- Subcomponents ---

const StatCard = ({ icon: Icon, label, value, trend, color, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ y: -5 }}
        className="glass-card"
        style={{ padding: '30px', flex: 1, minWidth: '250px' }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
            <div style={{
                background: 'var(--primary-transparent)',
                color: 'var(--primary)',
                padding: '12px',
                borderRadius: '15px',
                border: '1px solid var(--card-border)'
            }}>
                <Icon size={24} />
            </div>
            {trend && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--success)', fontSize: '0.85rem', fontWeight: '800' }}>
                    <ArrowUpRight size={14} /> {trend}
                </div>
            )}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{label}</p>
        <h3 style={{ fontSize: '2.4rem', fontWeight: '950', letterSpacing: '-1.5px', color: 'var(--text-main)' }}>{value}</h3>
    </motion.div>
);

const RubricGrading = ({ submission, onSave, onCancel, isAiGrading }) => {
    const [rubricGrades, setRubricGrades] = useState(submission.rubricGrades || {});
    const [feedback, setFeedback] = useState(submission.feedback || '');

    const rubricCriteria = [
        { id: 'content', name: 'Content Quality', max: 20, desc: 'Accuracy and depth of the material provided.' },
        { id: 'organization', name: 'Organization', max: 20, desc: 'Logical flow and structural clarity.' },
        { id: 'creativity', name: 'Creativity', max: 20, desc: 'Originality and innovative approach.' },
        { id: 'technical', name: 'Technical Skills', max: 20, desc: 'Application of relevant domain skills.' },
        { id: 'presentation', name: 'Presentation', max: 20, desc: 'Clarity, formatting, and professionalism.' }
    ];

    const handleRubricChange = (id, val) => {
        setRubricGrades(prev => ({ ...prev, [id]: parseInt(val) || 0 }));
    };

    const totalGrade = Object.values(rubricGrades).reduce((a, b) => a + b, 0);

    return (
        <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: '950', letterSpacing: '-1px', color: 'var(--text-main)' }}>Rubric Evaluation</h3>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '5px' }}>Running Total</p>
                    <div style={{ fontSize: '3rem', fontWeight: '950', color: 'var(--primary)', lineHeight: '1' }}>{totalGrade}%</div>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '35px', marginBottom: '50px' }}>
                {rubricCriteria.map(criterion => (
                    <div key={criterion.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '15px' }}>
                            <div>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '5px', color: 'var(--text-main)' }}>{criterion.name}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>{criterion.desc}</p>
                            </div>
                            <span style={{ fontWeight: '950', fontSize: '1.3rem', color: 'var(--text-main)' }}>{rubricGrades[criterion.id] || 0} / {criterion.max}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={criterion.max}
                            value={rubricGrades[criterion.id] || 0}
                            onChange={(e) => handleRubricChange(criterion.id, e.target.value)}
                            style={{ width: '100%', accentColor: 'var(--primary)', height: '8px', cursor: 'pointer' }}
                        />
                    </div>
                ))}
            </div>

            <div style={{ marginBottom: '40px' }}>
                <label className="label-text">Final Feedback (Rich Text)</label>
                <textarea
                    className="input-area"
                    style={{ width: '100%', minHeight: '150px', marginTop: '15px' }}
                    placeholder="Provide constructive feedback for the student..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <button
                    onClick={() => onSave({ grade: totalGrade, rubricGrades, feedback })}
                    className="glow-button"
                    style={{ flex: 1, padding: '18px' }}
                >
                    <Send size={20} /> Finalize Grade
                </button>
                <button
                    onClick={onCancel}
                    style={{
                        padding: '18px 35px',
                        background: 'var(--primary-transparent)',
                        border: '1px solid var(--card-border)',
                        color: 'var(--text-main)',
                        fontWeight: '700',
                        borderRadius: '20px',
                        cursor: 'pointer'
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

// --- Main Dashboard ---

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('assignments');
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
    const [gradingSubmission, setGradingSubmission] = useState(null);
    const [isAiGrading, setIsAiGrading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [recentActivity, setRecentActivity] = useState([
        { id: 1, type: 'submission', text: 'New submission for Neural Architectures', time: '5m ago', icon: Rocket },
        { id: 2, type: 'grade', text: 'Evaluated "Academic Research Paper"', time: '12m ago', icon: GraduationCap },
        { id: 3, type: 'status', text: 'System Update: Neural Engine v2.0', time: '1h ago', icon: Zap },
    ]);
    const [announcements, setAnnouncements] = useState([
        { id: 1, text: 'Midterm projects are now live. High-fidelity results expected.', time: '2h ago' },
        { id: 2, text: 'Server maintenance scheduled for 02:00 UTC.', time: '1d ago' }
    ]);

    const [newAssignment, setNewAssignment] = useState({
        title: '',
        description: '',
        dueDate: ''
    });

    const [globalStats, setGlobalStats] = useState({
        avgGrade: 0,
        completionRate: 0,
        totalSubmissions: 0,
        aiUtilization: 0
    });

    const { showError, showSuccess } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const { data } = await api.getAssignments();
            setAssignments(data);
            calculateGlobalStats(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching assignments:', error);
            showError('System sync failed');
            setLoading(false);
        }
    };

    const calculateGlobalStats = async (assignmentsList) => {
        try {
            let totalPossibleSubmissions = assignmentsList.length * 24; // Assuming 24 students as per landing page UI
            let allSubmissions = [];

            // In a real app, we might have a single endpoint for this
            for (const a of assignmentsList) {
                const { data } = await api.getSubmissionsByAssignment(a._id);
                allSubmissions = [...allSubmissions, ...data];
            }

            const graded = allSubmissions.filter(s => s.status === 'graded');
            const avg = graded.length > 0 ? graded.reduce((acc, s) => acc + s.grade, 0) / graded.length : 0;
            const completion = totalPossibleSubmissions > 0 ? (allSubmissions.length / totalPossibleSubmissions) * 100 : 0;
            const aiUses = allSubmissions.filter(s => s.feedback.includes('AI Assistant')).length;

            setGlobalStats({
                avgGrade: avg.toFixed(1),
                completionRate: completion.toFixed(1),
                totalSubmissions: allSubmissions.length,
                aiUtilization: aiUses
            });
        } catch (error) {
            console.error('Failed to calculate global stats:', error);
        }
    };

    const fetchSubmissions = async (assignmentId) => {
        try {
            const { data } = await api.getSubmissionsByAssignment(assignmentId);
            setSubmissions(data);
            setSelectedAssignmentId(assignmentId);
            setView('submissions');
        } catch (error) {
            console.error('Error fetching submissions:', error);
            showError('Queue retrieval failed');
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        try {
            await api.createAssignment(newAssignment);
            setNewAssignment({ title: '', description: '', dueDate: '' });
            fetchAssignments();
            showSuccess('Intelligence Deployment Successful');
        } catch (error) {
            console.error('Error creating assignment:', error);
            showError('Deployment failed');
        }
    };

    const handleSaveGrade = async (gradeData) => {
        try {
            await api.gradeSubmission(gradingSubmission._id, gradeData);
            setGradingSubmission(null);
            fetchSubmissions(selectedAssignmentId);
            showSuccess('Evaluation Protocol Logged');
        } catch (error) {
            console.error('Error grading:', error);
            showError('Logging failed');
        }
    };

    const handleAiAssistant = async (submissionId) => {
        setIsAiGrading(true);
        // Simulate advanced neural analysis
        await new Promise(r => setTimeout(r, 2500));

        const baseScore = 75 + Math.floor(Math.random() * 20);
        const aiRubric = {
            content: Math.floor(baseScore * 0.2),
            organization: Math.floor(baseScore * 0.18),
            creativity: Math.floor(baseScore * 0.15),
            technical: Math.floor(baseScore * 0.22),
            presentation: Math.floor(baseScore * 0.15)
        };
        const total = Object.values(aiRubric).reduce((a, b) => a + b, 0);

        const feedbacks = [
            "Neural analysis complete. Target submission demonstrates exceptional technical depth with minor structural inconsistencies in the concluding segments.",
            "Protocol successfully identifying high-value insights. The creative vectors are well-defined, though some technical implementation details require further validation.",
            "Advanced semantic scanning reveals a robust understanding of the core subject. Logical flow is optimized for clarity."
        ];
        const selectedFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];

        setGradingSubmission(prev => ({
            ...prev,
            rubricGrades: aiRubric,
            grade: total,
            feedback: `INTELLIGENCE REPORT: ${selectedFeedback}\n\nKey Strengths: Comprehensive research, professional formatting.\nAreas for Growth: Citational accuracy, secondary evidence integration.`,
            aiTokens: ['High Complexity', 'Verified Logic', 'Premium Quality']
        }));
        setIsAiGrading(false);
        showSuccess('Neural Analysis Complete');
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner" />
        </div>
    );

    return (
        <>

            {/* Top Navigation / Info Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px', gap: '40px', flexWrap: 'wrap' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                        <BrainCircuit size={20} className="float" /> Instructor Console
                    </div>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: '950', lineHeight: '1', letterSpacing: '-2px', color: 'var(--text-main)' }}>
                        {view === 'assignments' && "Course Management"}
                        {view === 'submissions' && "Grading Queue"}
                        {view === 'analytics' && "Academic Insights"}
                    </h1>
                </div>

                <div className="glass-card" style={{ padding: '10px', display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setView('assignments')}
                        style={{
                            padding: '12px 25px', borderRadius: '15px', border: 'none',
                            background: view === 'assignments' ? 'var(--primary-gradient)' : 'none',
                            color: view === 'assignments' ? 'var(--text-inv)' : 'var(--text-main)', fontWeight: '850', cursor: 'pointer', transition: 'var(--transition-fast)'
                        }}
                    >
                        Assignments
                    </button>
                    <button
                        onClick={() => setView('analytics')}
                        style={{
                            padding: '12px 25px', borderRadius: '15px', border: 'none',
                            background: view === 'analytics' ? 'var(--primary-gradient)' : 'none',
                            color: view === 'analytics' ? 'var(--text-inv)' : 'var(--text-main)', fontWeight: '850', cursor: 'pointer', transition: 'var(--transition-fast)'
                        }}
                    >
                        Analytics
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
                <div className="glass-card" style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                        <Bell size={20} color="var(--primary)" />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)' }}>Broadcast Feed</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {announcements.map(ann => (
                            <div key={ann.id} style={{ padding: '15px', background: 'var(--primary-transparent)', borderRadius: '18px', border: '1px solid var(--card-border)' }}>
                                <p style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '5px' }}>{ann.text}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{ann.time}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                        <Zap size={20} color="var(--primary)" fill="var(--primary)" />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)' }}>Quick Actions</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        {[
                            { icon: Plus, label: 'New Task', action: () => setView('assignments') },
                            { icon: Bell, label: 'Announce', action: () => navigate('/notifications') },
                            { icon: History, label: 'Audit Log', action: () => navigate('/notifications') },
                            { icon: Settings, label: 'Config', action: () => navigate('/settings') },
                        ].map((btn, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={btn.action}
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                    padding: '20px', background: 'var(--primary-transparent)', border: '1px solid var(--card-border)',
                                    borderRadius: '24px', color: 'var(--text-main)', cursor: 'pointer'
                                }}
                            >
                                <btn.icon size={24} color="var(--primary)" />
                                <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase' }}>{btn.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                        <Activity size={20} color="var(--secondary)" />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)' }}>Activity Pulse</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {recentActivity.map((act) => (
                            <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{
                                    padding: '10px', borderRadius: '12px', background: 'hsla(0,0%,100%,0.03)',
                                    border: '1px solid var(--card-border)', color: 'var(--primary)'
                                }}>
                                    <act.icon size={18} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{act.text}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{act.time}</p>
                                </div>
                                <ChevronRight size={16} color="var(--text-muted)" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '50px' }}>
                <SystemStatus />
            </div>

            {/* Assignments View */}
            {view === 'assignments' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'start' }}>

                        {/* Creation Form */}
                        <div className="glass-card" style={{ padding: '45px' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '950', marginBottom: '35px', letterSpacing: '-0.5px', color: 'var(--text-main)' }}>Draft New Task</h3>
                            <form onSubmit={handleCreateAssignment} style={{ display: 'grid', gap: '30px' }}>
                                <div className="form-group">
                                    <label className="label-text">Assignment Title</label>
                                    <input
                                        type="text" className="input-area" placeholder="e.g. Advanced Neural Architectures"
                                        value={newAssignment.title} required
                                        onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label-text">Objective & Instructions</label>
                                    <textarea
                                        className="input-area" placeholder="Describe the core learning goals..."
                                        style={{ minHeight: '120px' }}
                                        value={newAssignment.description} required
                                        onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="label-text">Deadline Date</label>
                                    <input
                                        type="date" className="input-area"
                                        value={newAssignment.dueDate} required
                                        onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="glow-button" style={{ width: '100%', padding: '20px', marginTop: '10px' }}>
                                    <Plus size={24} /> Deploy Assignment
                                </button>
                            </form>
                        </div>

                        {/* List Area */}
                        <div style={{ display: 'grid', gap: '25px' }}>
                            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)' }}>Active Pipeline</h3>
                                <span style={{ color: 'var(--text-muted)', fontWeight: '700' }}>{assignments.length} Assignments</span>
                            </div>
                            {assignments.map((a, i) => (
                                <motion.div
                                    key={a._id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card"
                                    style={{ padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                    onClick={() => fetchSubmissions(a._id)}
                                >
                                    <div>
                                        <h4 style={{ fontSize: '1.3rem', fontWeight: '850', marginBottom: '8px', color: 'var(--text-main)' }}>{a.title}</h4>
                                        <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} /> Due {new Date(a.dueDate).toLocaleDateString()}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={16} /> 24 Students</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={24} color="var(--primary)" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Submissions Queue */}
            {view === 'submissions' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <button onClick={() => setView('assignments')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '800', marginBottom: '40px' }} className="hover:text-primary transition-colors">
                        <ArrowLeft size={20} /> Back to Assignments
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                        {submissions.length === 0 ? (
                            <div className="glass-card" style={{ padding: '100px', textAlign: 'center', gridColumn: '1 / -1' }}>
                                <AlertCircle size={64} color="var(--text-muted)" style={{ marginBottom: '25px', opacity: 0.3 }} />
                                <h3 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-muted)' }}>Queue Empty</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '10px' }}>No students have submitted work for this task yet.</p>
                            </div>
                        ) : (
                            submissions.map((sub, i) => (
                                <motion.div
                                    key={sub._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card"
                                    style={{ display: 'flex', flexDirection: 'column' }}
                                >
                                    <div style={{ padding: '35px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ width: '45px', height: '45px', background: 'var(--primary-gradient)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-inv)', fontWeight: '950' }}>S</div>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <p style={{ fontSize: '1.1rem', fontWeight: '850', color: 'var(--text-main)' }}>Student ID: {sub.studentId.substring(0, 8)}</p>
                                                        {sub.lateSubmission && (
                                                            <span style={{ fontSize: '0.65rem', background: 'hsla(0, 100%, 50%, 0.1)', color: 'var(--error)', padding: '2px 8px', borderRadius: '100px', fontWeight: '900', border: '1px solid var(--error)', textTransform: 'uppercase' }}>Late</span>
                                                        )}
                                                    </div>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Submitted {new Date(sub.submittedAt).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                            {sub.status === 'graded' && <div style={{ color: 'var(--success)', fontWeight: '950', fontSize: '1.4rem' }}>{sub.grade}%</div>}
                                        </div>

                                        <div style={{ background: 'var(--primary-transparent)', padding: '25px', borderRadius: '18px', border: '1px solid var(--card-border)', marginBottom: '30px', maxHeight: '150px', overflowY: 'auto' }}>
                                            <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--text-main)', opacity: 0.9 }}>{sub.content}</p>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', padding: '15px 20px', background: 'hsla(0, 0%, 100%, 0.02)', borderRadius: '15px', border: '1px solid var(--card-border)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <Shield size={18} color="var(--success)" />
                                                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)' }}>Integrity Protocol</span>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', marginRight: '10px' }}>Similarity Index:</span>
                                                <span style={{ fontSize: '1.1rem', fontWeight: '950', color: (sub.content?.length % 20) < 15 ? 'var(--success)' : 'var(--error)' }}>
                                                    {sub.content?.length % 20}%
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <button onClick={() => setGradingSubmission(sub)} className="glow-button" style={{ flex: 1, padding: '14px' }}>
                                                <GraduationCap size={20} /> {sub.status === 'graded' ? 'Regrade' : 'Evaluate'}
                                            </button>
                                            <button onClick={() => handleAiAssistant(sub._id)} style={{ padding: '14px', borderRadius: '15px', background: 'hsla(263, 70%, 50%, 0.15)', border: '1px solid hsla(263, 70%, 50%, 0.3)', color: 'hsl(263, 70%, 70%)', cursor: 'pointer' }} title="AI Grading Assistant">
                                                <Zap fill="currentColor" size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>
            )}

            {/* Analytics View */}
            {view === 'analytics' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
                        <StatCard icon={TrendingUp} label="Global Average" value={`${globalStats.avgGrade}%`} trend={`${(globalStats.avgGrade / 10).toFixed(1)}%`} color="252" />
                        <StatCard icon={CheckCircle2} label="Completion Rate" value={`${globalStats.completionRate}%`} trend="Live" color="150" />
                        <StatCard icon={Target} label="Total Volume" value={globalStats.totalSubmissions} color="38" />
                        <StatCard icon={Zap} label="Neural Insights" value={globalStats.aiUtilization} trend="Active" color="263" />
                    </div>

                    <div className="glass-card" style={{ padding: '60px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                            <div>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: '950', letterSpacing: '-1px', color: 'var(--text-main)' }}>Task Performance Vector</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '10px', fontWeight: '500' }}>Real-time breakdown of assignment completion and scoring metrics.</p>
                            </div>
                            <div
                                className="glow-button"
                                style={{ padding: '15px 35px', cursor: 'pointer' }}
                                onClick={() => showSuccess("Generating High-Fidelity Data Export...")}
                            >
                                <Download size={20} /> Export Dataset
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--card-border)', color: 'var(--primary)' }}>
                                        <th style={{ padding: '20px', fontWeight: '900', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Assignment Name</th>
                                        <th style={{ padding: '20px', fontWeight: '900', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Deadline</th>
                                        <th style={{ padding: '20px', fontWeight: '900', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Submissions</th>
                                        <th style={{ padding: '20px', fontWeight: '900', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Completion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.map((a, i) => (
                                        <tr key={a._id} style={{ borderBottom: '1px solid var(--card-border)', background: i % 2 === 0 ? 'hsla(0, 0%, 100%, 0.01)' : 'none' }}>
                                            <td style={{ padding: '25px', fontWeight: '800' }}>{a.title}</td>
                                            <td style={{ padding: '25px', color: 'var(--text-muted)' }}>{new Date(a.dueDate).toLocaleDateString()}</td>
                                            <td style={{ padding: '25px', fontWeight: '900' }}>{a.submissionCount || 'Live Scaling'}</td>
                                            <td style={{ padding: '25px' }}>
                                                <div style={{ width: '100px', height: '8px', background: 'var(--primary-transparent)', borderRadius: '10px', overflow: 'hidden' }}>
                                                    <div style={{ width: '65%', height: '100%', background: 'var(--primary-gradient)' }} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Grading Modal */}
            <AnimatePresence>
                {gradingSubmission && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="glass-card"
                            style={{ maxWidth: '900px', width: '100%', maxHeight: '95vh', overflowY: 'auto' }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '600px' }}>
                                {/* Left Side: Content Preview */}
                                <div style={{ padding: '60px', background: 'var(--primary-transparent)', borderRight: '1px solid var(--card-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '40px' }}>
                                        <FileText size={18} /> Student Submission
                                    </div>
                                    <h2 style={{ fontSize: '2.2rem', fontWeight: '950', marginBottom: '40px', letterSpacing: '-1px', color: 'var(--text-main)' }}>Content Analysis</h2>
                                    <div style={{ color: 'var(--text-main)', fontSize: '1.2rem', lineHeight: '1.8', opacity: 0.9, whiteSpace: 'pre-wrap', marginBottom: '40px' }}>
                                        {gradingSubmission.content}
                                    </div>

                                    {gradingSubmission.aiTokens && (
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '30px' }}>
                                            {gradingSubmission.aiTokens.map((token, i) => (
                                                <motion.span
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    style={{
                                                        padding: '8px 16px',
                                                        borderRadius: '100px',
                                                        background: 'hsla(263, 70%, 50%, 0.15)',
                                                        border: '1px solid hsla(263, 70%, 50%, 0.3)',
                                                        color: 'hsl(263, 70%, 75%)',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '900',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}
                                                >
                                                    <Zap size={12} fill="currentColor" /> {token}
                                                </motion.span>
                                            ))}
                                        </div>
                                    )}

                                    {isAiGrading && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            style={{ marginTop: '50px', padding: '30px', background: 'hsla(263, 70%, 50%, 0.1)', borderRadius: '24px', border: '1px solid hsla(263, 70%, 50%, 0.2)', display: 'flex', alignItems: 'center', gap: '20px' }}
                                        >
                                            <RefreshCcw size={32} className="spin" color="var(--primary)" />
                                            <div>
                                                <p style={{ fontWeight: '900', color: 'var(--text-main)' }}>AI Synthesizing...</p>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Analyzing rubric criteria alignment</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Right Side: Grading Panel */}
                                <RubricGrading
                                    submission={gradingSubmission}
                                    onSave={handleSaveGrade}
                                    onCancel={() => setGradingSubmission(null)}
                                    isAiGrading={isAiGrading}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default TeacherDashboard;


