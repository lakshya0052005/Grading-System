import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Layout, BarChart2, Calendar, Trophy, Settings, HelpCircle, Book, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

const DashboardSidebar = ({ role }) => {
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);

    const menuItems = [
        { label: 'Overview', icon: Layout, to: role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard' },
        { label: 'Intelligence', icon: BarChart2, to: '/analytics' },
        { label: 'Timeline', icon: Calendar, to: '/calendar' },
        { label: 'Library', icon: Book, to: '/resources' },
        { label: 'Legends', icon: Trophy, to: '/leaderboard' },
        { label: 'Settings', icon: Settings, to: '/settings' },
        { label: 'Support', icon: HelpCircle, to: '/help' },
    ];

    return (
        <motion.div
            initial={false}
            animate={{
                width: isExpanded ? '280px' : '100px',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            style={{
                height: 'calc(100vh - 180px)',
                background: 'rgba(15, 15, 20, 0.7)',
                backdropFilter: 'blur(30px) saturate(180%)',
                borderRadius: '35px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '35px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isExpanded ? 'flex-start' : 'center',
                position: 'sticky',
                top: '120px',
                zIndex: 100,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden'
            }}
            className="hide-mobile"
        >
            <div style={{
                marginBottom: '40px',
                padding: '12px',
                borderRadius: '18px',
                background: 'var(--primary-gradient)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                width: isExpanded ? '100%' : '50px',
                justifyContent: isExpanded ? 'flex-start' : 'center',
                boxShadow: 'var(--primary-glow)'
            }}>
                <Layers size={26} />
                <AnimatePresence>
                    {isExpanded && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            style={{ fontWeight: '900', fontSize: '1.1rem', letterSpacing: '1px', whiteSpace: 'nowrap' }}
                        >
                            GRADECH_
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
                {menuItems.map((item, idx) => {
                    const isActive = location.pathname === item.to;
                    return (
                        <Link
                            key={idx}
                            to={item.to}
                            style={{
                                width: '100%',
                                height: '56px',
                                borderRadius: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                padding: isExpanded ? '0 20px' : '0',
                                justifyContent: isExpanded ? 'flex-start' : 'center',
                                background: isActive ? 'rgba(var(--primary-rgb), 0.15)' : 'transparent',
                                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                transition: '0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                position: 'relative',
                                textDecoration: 'none',
                                border: isActive ? '1px solid rgba(var(--primary-rgb), 0.2)' : '1px solid transparent',
                                gap: '18px'
                            }}
                            className="sidebar-link"
                        >
                            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <AnimatePresence mode="wait">
                                {isExpanded && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        style={{
                                            fontWeight: '800',
                                            fontSize: '0.95rem',
                                            whiteSpace: 'nowrap',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {isActive && (
                                <motion.div
                                    layoutId="active-indicator"
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        width: '6px',
                                        height: '6px',
                                        background: 'var(--primary)',
                                        borderRadius: '50%',
                                        boxShadow: '0 0 10px var(--primary)'
                                    }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>

            <div style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    style={{ color: 'var(--text-muted)', opacity: 0.5 }}
                >
                    <ChevronRight size={20} />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default DashboardSidebar;
