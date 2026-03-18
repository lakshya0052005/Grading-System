import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Layout, Book, Bell, Settings, Calendar, BarChart3, HelpCircle, X, ChevronRight, Hash } from 'lucide-react';

const CommandCenter = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const commands = [
        { id: 'dash', label: 'Go to Dashboard', icon: Layout, action: '/student-dashboard', shortcut: 'D' },
        { id: 'intel', label: 'Open Intelligence Suite', icon: BarChart3, action: '/analytics', shortcut: 'A' },
        { id: 'time', label: 'View Academic Timeline', icon: Calendar, action: '/calendar', shortcut: 'C' },
        { id: 'lib', label: 'Browse Academic Library', icon: Book, action: '/resources', shortcut: 'L' },
        { id: 'alert', label: 'Check Alerts', icon: Bell, action: '/notifications', shortcut: 'N' },
        { id: 'pref', label: 'User Preferences', icon: Settings, action: '/settings', shortcut: 'S' },
        { id: 'help', label: 'Get Support', icon: HelpCircle, action: '/help', shortcut: 'H' }
    ];

    const filteredCommands = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (action) => {
        navigate(action);
        onClose();
    };

    const handleKeyDown = useCallback((e) => {
        if (!isOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredCommands[selectedIndex]) {
                handleSelect(filteredCommands[selectedIndex].action);
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    }, [isOpen, filteredCommands, selectedIndex, onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh' }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        style={{
                            width: '90%',
                            maxWidth: '650px',
                            background: 'var(--card-bg)',
                            backdropFilter: 'var(--glass-blur)',
                            borderRadius: '30px',
                            border: '1px solid var(--card-border)',
                            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
                            overflow: 'hidden',
                            position: 'relative',
                            zIndex: 1
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', padding: '25px', borderBottom: '1px solid var(--card-border)' }}>
                            <Search size={22} color="var(--primary)" style={{ marginRight: '15px' }} />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Universal command protocol..."
                                style={{
                                    flex: 1,
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-main)',
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    outline: 'none'
                                }}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: 'var(--primary-transparent)', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)' }}>
                                <Command size={14} /> K
                            </div>
                        </div>

                        <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '15px' }}>
                            {filteredCommands.length > 0 ? (
                                filteredCommands.map((cmd, idx) => (
                                    <div
                                        key={cmd.id}
                                        onClick={() => handleSelect(cmd.action)}
                                        onMouseEnter={() => setSelectedIndex(idx)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '18px 20px',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            background: selectedIndex === idx ? 'var(--primary-transparent)' : 'transparent',
                                            transition: '0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                            marginBottom: '5px'
                                        }}
                                    >
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '12px',
                                            background: selectedIndex === idx ? 'var(--primary-gradient)' : 'var(--card-hover)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: selectedIndex === idx ? 'white' : 'var(--text-muted)',
                                            marginRight: '15px'
                                        }}>
                                            <cmd.icon size={20} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '1.05rem', fontWeight: '750', color: 'var(--text-main)' }}>{cmd.label}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-muted)' }}>
                                            <Command size={12} /> {cmd.shortcut}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <Hash size={40} style={{ marginBottom: '15px', opacity: 0.2 }} />
                                    <p style={{ fontWeight: '600' }}>No commands found for "{query}"</p>
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '20px 25px', background: 'var(--primary-transparent)', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '20px', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ padding: '4px 8px', background: 'var(--card-bg)', borderRadius: '6px', border: '1px solid var(--card-border)' }}>↑↓</div> Select
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ padding: '4px 8px', background: 'var(--card-bg)', borderRadius: '6px', border: '1px solid var(--card-border)' }}>ENTER</div> Navigate
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ padding: '4px 8px', background: 'var(--card-bg)', borderRadius: '6px', border: '1px solid var(--card-border)' }}>ESC</div> Dismiss
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CommandCenter;
