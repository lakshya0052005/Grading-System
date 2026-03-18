import React, { useState } from 'react';
import { Book, GraduationCap, Terminal, ShieldCheck, Search, ChevronRight, FileText, Layout, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Resources = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('docs');

    const resourceData = {
        docs: [
            { title: "Dashboard Navigation", icon: <Layout />, desc: "Master the Unified Command Console layout and shortcuts." },
            { title: "Neural Submission Protocol", icon: <Cpu />, desc: "Technical specifications for file types and analysis vectors." },
            { title: "API Integration", icon: <Terminal />, desc: "Documentation for institutional database synchronization." }
        ],
        training: [
            { title: "Faculty AI Mastery", icon: <GraduationCap />, desc: "How to interpret and customize AI-generated grading rubrics." },
            { title: "Student Success Flow", icon: <Book />, desc: "Maximizing the utility of instant feedback loops." }
        ],
        security: [
            { title: "Integrity Protocol", icon: <ShieldCheck />, desc: "Understand our multi-vector plagiarism and identity verification." }
        ]
    };

    const filteredResources = (tab) => resourceData[tab].filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {/* Hero Section */}
            <header style={{ padding: '80px 0', textAlign: 'center', background: 'var(--primary-transparent)', borderRadius: '35px', marginBottom: '60px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ maxWidth: '900px', margin: '0 auto' }}
                >
                    <span style={{ color: 'var(--primary)', fontWeight: '900', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Knowledge Base</span>
                    <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: '950', color: 'var(--text-main)', marginTop: '20px', letterSpacing: '-2px' }}>
                        Academic <span className="gradient-text">Library.</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem', marginTop: '30px', fontWeight: '500' }}>
                        Access technical documentation, faculty training modules, and system security protocols.
                    </p>

                    <div style={{
                        marginTop: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        background: 'var(--card-bg)',
                        padding: '10px 30px',
                        borderRadius: '25px',
                        border: '1px solid var(--card-border)',
                        maxWidth: '600px',
                        margin: '60px auto 0'
                    }}>
                        <Search size={24} color="var(--primary)" />
                        <input
                            type="text"
                            placeholder="Universal search protocols..."
                            style={{ background: 'none', border: 'none', width: '100%', color: 'var(--text-main)', padding: '15px 0', fontSize: '1.2rem', outline: 'none' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </motion.div>
            </header>

            {/* Content Area */}
            <main style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '80px' }}>
                    {[
                        { id: 'docs', label: 'Technical Docs', icon: <FileText /> },
                        { id: 'training', label: 'Faculty Training', icon: <GraduationCap /> },
                        { id: 'security', label: 'Security Protocols', icon: <ShieldCheck /> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '18px 35px',
                                borderRadius: '20px',
                                border: '1px solid var(--card-border)',
                                background: activeTab === tab.id ? 'var(--primary-gradient)' : 'var(--card-bg)',
                                color: activeTab === tab.id ? 'var(--text-inv)' : 'var(--text-main)',
                                fontWeight: '800',
                                cursor: 'pointer',
                                transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                    <AnimatePresence mode="wait">
                        {filteredResources(activeTab).map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="glass-card"
                                style={{ padding: '40px', cursor: 'pointer', border: '1px solid var(--card-border)' }}
                            >
                                <div style={{ color: 'var(--primary)', marginBottom: '25px' }}>
                                    {React.cloneElement(item.icon, { size: 40 })}
                                </div>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '15px' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>{item.desc}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Init Protocol <ChevronRight size={16} />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </main>
        </>
    );
};

export default Resources;
