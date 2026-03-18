import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen,
    Shield,
    Zap,
    BarChart3,
    ArrowRight,
    Clock,
    MousePointer2,
    CheckCircle2,
    Lock,
    Sparkles,
    Activity,
    BrainCircuit,
    ChevronDown,
    Users,
    Star,
    FileText,
    GraduationCap,
    Target,
    TrendingUp,
    Send,
    Play,
    Cpu,
    Globe
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import heroBg from '../assets/hero-bg.png';

const Landing = () => {
    const { showSuccess, showInfo } = useToast();
    const { scrollYProgress } = useScroll();
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false);
    const [enterpriseStep, setEnterpriseStep] = useState('form'); // 'form' or 'success'
    const [enterpriseData, setEnterpriseData] = useState({
        institution: '',
        contact: '',
        email: '',
        size: '100-500'
    });

    const testimonials = [
        {
            name: "Lakshya Giri",
            role: "Lead Developer",
            initials: "LG",
            text: "Gradech_ has fundamentally changed our institutional workflow. The efficiency gains are measurable—grading time reduced by 65%.",
            rating: 5
        },
        {
            name: "Prudvi",
            role: "Product Designer",
            initials: "PR",
            text: "The automated feedback system is a game-changer. My students get instant insights, allowing them to iterate and improve immediately.",
            rating: 5
        },
        {
            name: "Ravi Ranjan",
            role: "Academic Counselor",
            initials: "RR",
            text: "As a student, the clarity and speed of feedback I receive through this platform has significantly boosted my learning curve.",
            rating: 5
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    // Parallax and scroll effects
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scaleHero = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
    const yHero = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1, y: 0,
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', background: 'transparent' }}>

            {/* Floating Decorative Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, -30, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'fixed',
                    top: '10%',
                    left: '5%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                    filter: 'blur(120px)',
                    opacity: 0.15,
                    zIndex: -1,
                    borderRadius: '50%'
                }}
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, -60, 0],
                    y: [0, 40, 0]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'fixed',
                    bottom: '10%',
                    right: '5%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, var(--secondary) 0%, transparent 70%)',
                    filter: 'blur(140px)',
                    opacity: 0.1,
                    zIndex: -1,
                    borderRadius: '50%'
                }}
            />

            {/* Hero Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '120px 5% 60px',
                position: 'relative',
                textAlign: 'center'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `url(${heroBg}) center/cover no-repeat`,
                    opacity: 0.15,
                    zIndex: 0,
                    filter: 'saturate(1.5) contrast(1.1)'
                }} />

                <motion.div
                    style={{ opacity: opacityHero, scale: scaleHero, y: yHero, zIndex: 10, width: '100%', maxWidth: '1400px' }}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} style={{ marginBottom: '30px' }}>
                        <span style={{
                            background: 'var(--primary-transparent)',
                            color: 'var(--primary)',
                            padding: '12px 28px',
                            borderRadius: '100px',
                            fontSize: '0.9rem',
                            fontWeight: '800',
                            border: '1px solid var(--card-border)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            backdropFilter: 'var(--glass-blur)',
                            letterSpacing: '2px',
                            textTransform: 'uppercase'
                        }}>
                            <Sparkles size={18} className="float" /> Elite Homework Ecosystem
                        </span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} style={{
                        fontSize: 'clamp(3.5rem, 10vw, 8.5rem)',
                        fontWeight: '950',
                        lineHeight: '0.85',
                        marginBottom: '40px',
                        letterSpacing: '-0.06em',
                        maxWidth: '12ch',
                        margin: '0 auto 40px',
                        color: 'var(--text-main)'
                    }}>
                        Master Your <span className="gradient-text">Academic</span> <br /> Legacy.
                    </motion.h1>

                    <motion.p variants={itemVariants} style={{
                        fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)',
                        color: 'var(--text-muted)',
                        marginBottom: '60px',
                        maxWidth: '850px',
                        margin: '0 auto 60px',
                        lineHeight: '1.4',
                        fontWeight: '500'
                    }}>
                        Bridge the efficiency gap in online education with our elite, AI-enhanced homework submission and automated grading ecosystem. Gradech_ is built for the next generation of academic excellence.
                    </motion.p>

                    <motion.div variants={itemVariants} style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" className="glow-button" style={{
                            padding: '24px 65px',
                            fontSize: '1.4rem',
                            borderRadius: '24px',
                            boxShadow: 'var(--primary-glow)'
                        }}>
                            Begin Journey <ArrowRight size={28} />
                        </Link>
                        <a href="#intelligence" style={{
                            color: 'var(--text-main)',
                            textDecoration: 'none',
                            fontWeight: '700',
                            padding: '24px 60px',
                            borderRadius: '24px',
                            border: '1px solid var(--card-border)',
                            background: 'var(--primary-transparent)',
                            fontSize: '1.3rem',
                            transition: 'var(--transition-fast)',
                            backdropFilter: 'var(--glass-blur)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }} onMouseOver={e => e.currentTarget.style.background = 'var(--card-hover)'} onMouseOut={e => e.currentTarget.style.background = 'var(--primary-transparent)'}>
                            <Play size={24} fill="currentColor" /> Watch System Demo
                        </a>
                    </motion.div>
                </motion.div>

                {/* Animated Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}
                >
                    <span style={{ fontSize: '0.8rem', fontWeight: '900', letterSpacing: '5px', textTransform: 'uppercase' }}>Initialize</span>
                    <ChevronDown size={28} />
                </motion.div>
            </section>

            {/* Platform Section */}
            <section id="platform" style={{ padding: '150px 5%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '100px' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>The Backend of Excellence</span>
                        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: '950', marginTop: '20px', letterSpacing: '-2px', color: 'var(--text-main)' }}>A Platform Built for Scalable Logic.</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '50px' }}>
                        <div className="glass-card" style={{ padding: '50px' }}>
                            <div style={{ background: 'var(--primary-transparent)', padding: '15px', borderRadius: '15px', display: 'inline-flex', color: 'var(--primary)', marginBottom: '25px' }}>
                                <Cpu size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '20px', color: 'var(--text-main)' }}>Neural Submission Flow</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1.1rem' }}>Our platform streamlines the entire submission process using neural file analysis, ensuring that assignments are delivered securely and categorized instantly for grading.</p>
                        </div>
                        <div className="glass-card" style={{ padding: '50px' }}>
                            <div style={{ background: 'var(--secondary-transparent)', padding: '15px', borderRadius: '15px', display: 'inline-flex', color: 'var(--secondary)', marginBottom: '25px' }}>
                                <Activity size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '20px', color: 'var(--text-main)' }}>Unified Command Console</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1.1rem' }}>A single source of truth for all academic metadata. Manage courses, track student performance, and coordinate faculty grading from one high-performance interface.</p>
                        </div>
                        <div className="glass-card" style={{ padding: '50px' }}>
                            <div style={{ background: 'var(--success-transparent)', padding: '15px', borderRadius: '15px', display: 'inline-flex', color: 'var(--success)', marginBottom: '25px' }}>
                                <Lock size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '20px', color: 'var(--text-main)' }}>Integrity Protocol</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1.1rem' }}>Hardened security layers protect student data and submission timestamps, ensuring a level playing field and preventing unauthorized access or data tampering.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solutions Section */}
            <section id="solutions" style={{ padding: '150px 5%', background: 'var(--bg-body)', position: 'relative' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: '950', lineHeight: '1', color: 'var(--text-main)', marginBottom: '40px' }}>Tailored <span className="gradient-text">Solutions</span> for Every Entity.</h2>
                            <div style={{ display: 'grid', gap: '30px' }}>
                                <div style={{ paddingLeft: '30px', borderLeft: '4px solid var(--primary)' }}>
                                    <h4 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>For High-Performance Educators</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Reduce grading fatigue with AI-assisted rubric evaluation and automated feedback loops.</p>
                                </div>
                                <div style={{ paddingLeft: '30px', borderLeft: '4px solid var(--secondary)' }}>
                                    <h4 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>For Ambitious Students</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Master your curriculum with instant grading protocols and detailed revision insights.</p>
                                </div>
                                <div style={{ paddingLeft: '30px', borderLeft: '4px solid var(--success)' }}>
                                    <h4 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>For Forward-Thinking Institutions</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Deploy a scalable, secure, and data-driven homework ecosystem across your entire organization.</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div className="glass-card" style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                <img src={heroBg} alt="Solution" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--bg-body))' }} />
                                <div style={{ position: 'absolute', bottom: '50px', left: '50px' }}>
                                    <div
                                        className="glow-button"
                                        style={{ padding: '15px 35px', borderRadius: '15px', cursor: 'pointer' }}
                                        onClick={() => setIsEnterpriseModalOpen(true)}
                                    >
                                        Request Enterprise Access
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resources Section */}
            <section id="resources" style={{ padding: '150px 5%', position: 'relative' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '950', marginBottom: '80px', letterSpacing: '-1.5px', color: 'var(--text-main)' }}>Elite <span className="gradient-text">Resources</span> for Academic Dominance.</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                        {[
                            { title: "Technical Docs", desc: "Detailed API and integration guides for system administrators.", link: "Access Library" },
                            { title: "Faculty Training", desc: "Master the art of AI-assisted instruction with our curated modules.", link: "View Modules" },
                            { title: "System Status", desc: "Real-time monitoring of our neural networks and database clusters.", link: "Check Status" },
                            { title: "Premium Support", desc: "24/7 direct access to our senior engineering and academic elite.", link: "Contact Elite" }
                        ].map((resource, i) => (
                            <div key={i} className="glass-card" style={{ padding: '40px', textAlign: 'left', border: '1px solid var(--card-border)' }}>
                                <h4 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '15px', color: 'var(--text-main)' }}>{resource.title}</h4>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '25px', lineHeight: '1.5' }}>{resource.desc}</p>
                                <button
                                    onClick={() => showSuccess(`Initializing Secure Link for ${resource.title}...`)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: '800', textDecoration: 'none', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', padding: 0 }}
                                >
                                    {resource.link} &rarr;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Intelligence Section (Updating existing Spotlight) */}
            <section id="intelligence" style={{ padding: '150px 5%', background: 'var(--primary-transparent)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.05, background: 'linear-gradient(45deg, var(--primary) 25%, transparent 25%), linear-gradient(-45deg, var(--primary) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--primary) 75%), linear-gradient(-45deg, transparent 75%, var(--primary) 75%)', backgroundSize: '100px 100px' }} />
                <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
                        <div>
                            <span style={{ background: 'var(--primary)', color: 'white', padding: '5px 15px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>Intelligence Protocol</span>
                            <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: '950', marginTop: '25px', color: 'var(--text-main)', lineHeight: '1' }}>The <span className="gradient-text">Neural</span> Edge.</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', marginTop: '30px', lineHeight: '1.6' }}>Our system doesn't just grade—it thinks. By analyzing semantic patterns and structural logic, the Gradech_ Intelligence Engine provides feedback that bridges the gap between evaluation and learning.</p>

                            <div style={{ marginTop: '50px', display: 'grid', gap: '20px' }}>
                                <div style={{ background: 'var(--card-bg)', padding: '25px', borderRadius: '20px', border: '1px solid var(--primary-transparent)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ fontWeight: '800', color: 'var(--text-main)' }}>Neural Feedback Loop</span>
                                        <span style={{ color: 'var(--primary)', fontWeight: '900' }}>Active</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'var(--card-border)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '85%' }}
                                            transition={{ duration: 2 }}
                                            style={{ height: '100%', background: 'var(--primary-gradient)' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            {[
                                { icon: <Target />, title: 'Smart Submissions', desc: 'Secure, multi-vector file processing.' },
                                { icon: <BrainCircuit />, title: 'Cognitive Grading', desc: 'AI-driven rubric alignment.' },
                                { icon: <BarChart3 />, title: 'Elite Insights', desc: 'Real-time performance metrics.' },
                                { icon: <GraduationCap />, title: 'Instant Mastery', desc: 'Closing the feedback loop.' }
                            ].map((feature, i) => (
                                <div key={i} className="glass-card" style={{ padding: '30px', border: '1px solid var(--primary-transparent)' }}>
                                    <div style={{ color: 'var(--primary)', marginBottom: '15px' }}>{React.cloneElement(feature.icon, { size: 28 })}</div>
                                    <h5 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '10px' }}>{feature.title}</h5>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Section */}
            <section id="company" style={{ padding: '150px 5%', position: 'relative' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '950', marginBottom: '40px', letterSpacing: '-1.5px', color: 'var(--text-main)' }}>The <span className="gradient-text">Gradech_</span> Legacy.</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto 60px', lineHeight: '1.6' }}>We are a team of educators, engineers, and visionaries dedicated to re-engineering the academic experience for the digital age. Our mission is to empower every student and teacher with the tools for ultimate efficiency.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', fontWeight: '950', color: 'var(--primary)', marginBottom: '10px' }}>2025</div>
                            <p style={{ fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>Founded</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', fontWeight: '950', color: 'var(--secondary)', marginBottom: '10px' }}>Elite</div>
                            <p style={{ fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Network</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', fontWeight: '950', color: 'var(--success)', marginBottom: '10px' }}>Neural</div>
                            <p style={{ fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>Architecture</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Solution Visualization */}
            <section style={{ padding: '150px 5%', position: 'relative', background: 'hsla(0, 0%, 100%, 0.01)' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))',
                        gap: '100px',
                        alignItems: 'center'
                    }}>
                        <motion.div
                            whileInView={{ opacity: 1, x: 0 }}
                            initial={{ opacity: 0, x: -50 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: '950', marginBottom: '40px', lineHeight: '0.95', letterSpacing: '-0.05em', color: 'var(--text-main)' }}>
                                The <span className="gradient-text">Streamlined</span> <br /> Command Center.
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem', lineHeight: '1.6', marginBottom: '60px', fontWeight: '500' }}>
                                We've re-engineered the entire homework lifecycle. From predictive due-date notifications to granular rubric-based analysis, every step is optimized for peak performance.
                            </p>

                            <div style={{ display: 'grid', gap: '40px' }}>
                                {[
                                    { icon: <Globe size={32} />, title: "Unified Platform", desc: "No more app-switching. Everything from submission to grading happens in one cohesive ecosystem." },
                                    { icon: <TrendingUp size={32} />, title: "Growth Analytics", desc: "Visualize student progress over time with deep-data insights and trend projections using modern charts." }
                                ].map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '30px', alignItems: 'start' }}>
                                        <div style={{ background: 'var(--primary-gradient)', padding: '12px', borderRadius: '16px', color: 'var(--text-inv)', boxShadow: 'var(--primary-glow)' }}>{item.icon}</div>
                                        <div>
                                            <h4 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '10px', color: 'var(--text-main)' }}>{item.title}</h4>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '500' }}>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            style={{ position: 'relative' }}
                        >
                            <div className="glass-card" style={{ padding: '15px', borderRadius: '48px', background: 'var(--primary-transparent)' }}>
                                <div style={{ background: 'var(--bg-body)', borderRadius: '35px', height: '550px', overflow: 'hidden', position: 'relative', border: '1px solid var(--card-border)' }}>
                                    {/* Mock App Interface */}
                                    <div style={{ padding: '30px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-transparent)' }}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ff5f56', boxShadow: '0 0 10px #ff5f56' }} />
                                            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ffbd2e', boxShadow: '0 0 10px #ffbd2e' }} />
                                            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#27c93f', boxShadow: '0 0 10px #27c93f' }} />
                                        </div>
                                        <div style={{ background: 'var(--primary-transparent)', color: 'var(--primary)', padding: '8px 20px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '1px' }}>SYSTEM OPERATIONAL</div>
                                    </div>
                                    <div style={{ padding: '40px' }}>
                                        <div style={{ display: 'flex', gap: '25px', marginBottom: '40px' }}>
                                            <div style={{ flex: 1, background: 'hsla(252, 100%, 67%, 0.15)', height: '150px', borderRadius: '28px', padding: '25px', border: '1px solid hsla(252, 100%, 67%, 0.2)' }}>
                                                <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '800', marginBottom: '15px', textTransform: 'uppercase' }}>Average Performance</div>
                                                <div style={{ fontSize: '2.8rem', fontWeight: '950', letterSpacing: '-2px' }}>94.2%</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '5px', fontWeight: '700' }}>+4.1% this month</div>
                                            </div>
                                            <div style={{ flex: 1, background: 'hsla(330, 81%, 60%, 0.15)', height: '150px', borderRadius: '28px', padding: '25px', border: '1px solid hsla(330, 81%, 60%, 0.2)' }}>
                                                <div style={{ color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: '800', marginBottom: '15px', textTransform: 'uppercase' }}>Active Tasks</div>
                                                <div style={{ fontSize: '2.8rem', fontWeight: '950', letterSpacing: '-2px' }}>12/15</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px', fontWeight: '700' }}>3 due within 24h</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            {[1, 2, 3].map(i => (
                                                <div key={i} style={{ height: '55px', background: 'var(--primary-transparent)', borderRadius: '18px', display: 'flex', alignItems: 'center', padding: '0 25px', justifyContent: 'space-between', border: '1px solid var(--card-border)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: i === 1 ? 'var(--success)' : i === 2 ? 'var(--warning)' : 'var(--primary)' }} />
                                                        <div style={{ width: '140px', height: '10px', background: 'var(--card-border)', borderRadius: '5px' }} />
                                                    </div>
                                                    <div style={{ width: '60px', height: '10px', background: i === 1 ? 'var(--success)' : i === 2 ? 'var(--warning)' : 'var(--primary)', opacity: 0.6, borderRadius: '5px' }} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '250px', height: '250px', background: 'var(--primary-glow)', filter: 'blur(100px)', zIndex: -1, opacity: 0.5 }} />
                        </motion.div>
                    </div>
                </div>
            </section>



            {/* Testimonials */}
            <section style={{ padding: '150px 5%', background: 'hsla(0, 0%, 100%, 0.01)' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTestimonial}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.05, y: -20 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="glass-card"
                            style={{ padding: '100px 80px', textAlign: 'center', position: 'relative' }}
                        >
                            <div style={{ position: 'absolute', top: '50px', left: '50%', transform: 'translateX(-50%)', opacity: 0.1 }}>
                                <Star size={80} color="var(--primary)" fill="var(--primary)" />
                            </div>
                            <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: '850', marginBottom: '60px', lineHeight: '1.2', fontStyle: 'italic', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                                "{testimonials[activeTestimonial].text}"
                            </h2>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
                                <div style={{
                                    width: '90px',
                                    height: '90px',
                                    borderRadius: '30px',
                                    background: 'var(--primary-gradient)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '950',
                                    color: 'var(--text-inv)',
                                    fontSize: '1.8rem',
                                    boxShadow: 'var(--primary-glow)',
                                    transform: 'rotate(-5deg)'
                                }}>
                                    {testimonials[activeTestimonial].initials}
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ fontWeight: '900', fontSize: '1.6rem', color: 'var(--text-main)' }}>{testimonials[activeTestimonial].name}</p>
                                    <p style={{ color: 'var(--primary)', fontSize: '1.1rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px' }}>{testimonials[activeTestimonial].role}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '60px' }}>
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveTestimonial(idx)}
                                style={{
                                    width: idx === activeTestimonial ? '60px' : '14px',
                                    height: '14px',
                                    borderRadius: '100px',
                                    background: idx === activeTestimonial ? 'var(--primary)' : 'var(--card-border)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: '0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact CTA */}
            <section style={{ padding: '200px 5%', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle at center, var(--primary-glow) 0%, transparent 70%)', opacity: 0.1, zIndex: -1 }} />
                <motion.div
                    whileInView={{ y: 0, opacity: 1 }}
                    initial={{ y: 60, opacity: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <h2 style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)', fontWeight: '950', marginBottom: '40px', letterSpacing: '-0.06em', lineHeight: '0.9', color: 'var(--text-main)' }}>
                        Ready for the <span className="gradient-text">Future</span>?
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(1.2rem, 2.5vw, 1.9rem)', marginBottom: '80px', maxWidth: '850px', margin: '0 auto 80px', fontWeight: '500' }}>
                        Join the elite circle of educators and students who have mastered the art of high-performance homework management.
                    </p>
                    <Link to="/register" className="glow-button" style={{
                        display: 'inline-flex',
                        padding: '28px 90px',
                        fontSize: '1.6rem',
                        borderRadius: '28px',
                        boxShadow: 'var(--primary-glow)'
                    }}>
                        Get Started Free <Zap size={28} fill="currentColor" />
                    </Link>
                </motion.div>
            </section>

            {/* Elite Footer */}
            <footer style={{ padding: '120px 5%', borderTop: '1px solid var(--card-border)', background: 'var(--bg-body)' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '70px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ background: 'var(--primary-gradient)', padding: '15px', borderRadius: '20px', boxShadow: 'var(--primary-glow)' }}>
                            <BookOpen size={40} color="var(--text-inv)" />
                        </div>
                        <span style={{ fontWeight: '950', fontSize: '3rem', letterSpacing: '-2.5px', color: 'var(--text-main)' }}>Gradech_</span>
                    </div>
                    <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {['Platform', 'Solutions', 'Resources', 'Intelligence', 'Company'].map(link => (
                            <a key={link} href={`#${link.toLowerCase()}`} className="nav-link" style={{ fontSize: '1.2rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{link}</a>
                        ))}
                    </div>
                    <div style={{ width: '100%', height: '1px', background: 'var(--card-border)' }} />
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: '900px', fontSize: '1.1rem', opacity: 0.8, fontWeight: '500' }}>
                        &copy; 2025 Gradech_ Ecosystem. All rights reserved. Engineering efficiency for the next generation of academic excellence worldwide.
                    </p>
                </div>
            </footer>
            {/* Enterprise Access Modal */}
            <AnimatePresence>
                {isEnterpriseModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 10000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0,0,0,0.85)',
                            backdropFilter: 'blur(15px)',
                            padding: '20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 30, opacity: 0 }}
                            className="glass-card"
                            style={{ maxWidth: '600px', width: '100%', padding: '50px', position: 'relative' }}
                        >
                            <button
                                onClick={() => { setIsEnterpriseModalOpen(false); setEnterpriseStep('form'); }}
                                style={{ position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                            >
                                <Users size={24} />
                            </button>

                            {enterpriseStep === 'form' ? (
                                <>
                                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                        <div style={{ display: 'inline-flex', background: 'var(--primary-gradient)', padding: '15px', borderRadius: '20px', color: 'var(--text-inv)', marginBottom: '20px', boxShadow: 'var(--primary-glow)' }}>
                                            <Globe size={32} />
                                        </div>
                                        <h2 style={{ fontSize: '2.5rem', fontWeight: '950', color: 'var(--text-main)', letterSpacing: '-1.5px' }}>Enterprise Enrollment</h2>
                                        <p style={{ color: 'var(--text-muted)', marginTop: '10px', fontSize: '1.1rem' }}>Initiating institutional integration protocol.</p>
                                    </div>

                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        setEnterpriseStep('success');
                                        showSuccess("Neural Link Transmission Successful.");
                                    }} style={{ display: 'grid', gap: '25px' }}>
                                        <div className="form-group">
                                            <label className="label-text">Institutional Entity Name</label>
                                            <input
                                                type="text" className="input-area" placeholder="e.g. Neo-Academic University"
                                                required value={enterpriseData.institution}
                                                onChange={(e) => setEnterpriseData({ ...enterpriseData, institution: e.target.value })}
                                            />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            <div className="form-group">
                                                <label className="label-text">Primary Diplomatic Contact</label>
                                                <input
                                                    type="text" className="input-area" placeholder="Full Name"
                                                    required value={enterpriseData.contact}
                                                    onChange={(e) => setEnterpriseData({ ...enterpriseData, contact: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="label-text">Secure Email Address</label>
                                                <input
                                                    type="email" className="input-area" placeholder="email@institution.edu"
                                                    required value={enterpriseData.email}
                                                    onChange={(e) => setEnterpriseData({ ...enterpriseData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="label-text">Organization Magnitude</label>
                                            <select
                                                className="input-area" style={{ appearance: 'none' }}
                                                value={enterpriseData.size}
                                                onChange={(e) => setEnterpriseData({ ...enterpriseData, size: e.target.value })}
                                            >
                                                <option value="1-100">1 - 100 Entities</option>
                                                <option value="100-500">100 - 500 Entities</option>
                                                <option value="500-2000">500 - 2000 Entities</option>
                                                <option value="2000+">2000+ Entities (Global Edge)</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="glow-button" style={{ width: '100%', padding: '20px', fontSize: '1.1rem', marginTop: '10px' }}>
                                            Establish Neural Link <Send size={20} />
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ textAlign: 'center', padding: '40px 0' }}
                                >
                                    <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 40px' }}>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                            style={{ position: 'absolute', inset: 0, border: '4px dashed var(--primary)', borderRadius: '50%', opacity: 0.3 }}
                                        />
                                        <div style={{ position: 'absolute', inset: '10px', background: 'var(--primary-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-inv)', boxShadow: 'var(--primary-glow)' }}>
                                            <CheckCircle2 size={60} />
                                        </div>
                                    </div>
                                    <h2 style={{ fontSize: '2.8rem', fontWeight: '950', color: 'var(--text-main)', letterSpacing: '-2px', marginBottom: '20px' }}>Neural Link Established.</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto 40px' }}>
                                        Institutional request broadcasted to the Gradech_ High-Performance Counsel. Expect transmission within 12 standard hours.
                                    </p>
                                    <button
                                        onClick={() => { setIsEnterpriseModalOpen(false); setEnterpriseStep('form'); }}
                                        className="glow-button"
                                        style={{ padding: '15px 40px', background: 'var(--primary-transparent)' }}
                                    >
                                        Return to Ecosystem
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Landing;
