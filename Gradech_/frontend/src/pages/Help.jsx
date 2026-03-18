import React, { useState } from 'react';
import { HelpCircle, Book, MessageCircle, Mail, ChevronDown, Search, Cpu, GraduationCap, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Help = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        { q: "How does the AI Grading Assistant work?", a: "The AI assistant uses advanced semantic analysis and neural mapping to evaluate submissions against the rubrics defined by the instructor. It provides a baseline score and detailed feedback vectors which are then verified by the faculty." },
        { q: "Can I resubmit an assignment after the deadline?", a: "Late submissions are permitted but will be flagged with a 'LATE' protocol tag. Instructors have the ultimate authority on whether to accept or penalize late deployments." },
        { q: "Is my personal data encrypted?", a: "Gradech_ uses 256-bit AES encryption at rest and TLS 1.3 for all data in transit. Your academic integrity and identity are protected by our multi-vector security protocols." },
        { q: "How do I sync my institutional calendar?", a: "Calendar synchronization can be initiated from the Settings > Integrations panel. We currently support Google Calendar, Outlook, and iCal protocols." }
    ];

    const supportCategories = [
        { title: "Technical Support", desc: "For system bugs, access issues, or neural sync failures.", icon: Cpu, contact: "tech-nexus@gradech.edu" },
        { title: "Academic Inquiry", desc: "Questions regarding grading rubrics or assignment objectives.", icon: GraduationCap, contact: "academic-registry@gradech.edu" },
        { title: "Security Office", desc: "Report integrity violations or unauthorized access attempts.", icon: Shield, contact: "security@gradech.edu" }
    ];

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '100px' }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                    <HelpCircle size={24} className="float" /> Support Ecosystem
                </div>
                <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: '950', lineHeight: '1', letterSpacing: '-3px', color: 'var(--text-main)' }}>
                    How can we <span className="gradient-text">Assist you?</span>
                </h1>

                <div style={{
                    marginTop: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    background: 'var(--card-bg)',
                    padding: '10px 30px',
                    borderRadius: '25px',
                    border: '1px solid var(--card-border)',
                    maxWidth: '700px',
                    margin: '60px auto 0'
                }}>
                    <Search size={24} color="var(--primary)" />
                    <input
                        type="text"
                        placeholder="Search the knowledge base..."
                        style={{ background: 'none', border: 'none', width: '100%', color: 'var(--text-main)', padding: '15px 0', fontSize: '1.25rem', outline: 'none' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', marginBottom: '100px' }}>
                {supportCategories.map((cat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -10 }}
                        className="glass-card"
                        style={{ padding: '45px', textAlign: 'center' }}
                    >
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '24px', background: 'var(--primary-transparent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                            margin: '0 auto 30px'
                        }}>
                            <cat.icon size={40} />
                        </div>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '900', marginBottom: '15px', color: 'var(--text-main)' }}>{cat.title}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>{cat.desc}</p>
                        <a href={`mailto:${cat.contact}`} style={{ color: 'var(--primary)', fontWeight: '800', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <Mail size={18} /> {cat.contact}
                        </a>
                    </motion.div>
                ))}
            </div>

            <div className="glass-card" style={{ padding: '80px', maxWidth: '1000px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '950', marginBottom: '60px', textAlign: 'center', letterSpacing: '-1.5px' }}>Frequently Asked Questions</h2>
                <div style={{ display: 'grid', gap: '20px' }}>
                    {faqs.map((faq, i) => (
                        <div key={i} style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '20px' }}>
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                style={{
                                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '20px', background: 'transparent', border: 'none', cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                            >
                                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>{faq.q}</span>
                                <ChevronDown
                                    size={24}
                                    style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s' }}
                                    color="var(--primary)"
                                />
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{ padding: '0 20px 20px', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.7' }}>
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Help;
