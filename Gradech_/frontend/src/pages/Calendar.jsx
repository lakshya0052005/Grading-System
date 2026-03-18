import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, Info, Bell } from 'lucide-react';
import * as api from '../services/api';
import { useToast } from '../context/ToastContext';

const CalendarPage = () => {
    const [viewDate, setViewDate] = useState(new Date());
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showError } = useToast();

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await api.getAssignments();
                setAssignments(res.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching timeline:', error);
                showError('Timeline sync failure');
                setLoading(false);
            }
        };
        fetchAssignments();
    }, []);

    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const getDayEvents = (day) => {
        return assignments.filter(a => {
            const dueDate = new Date(a.dueDate);
            return dueDate.getDate() === day &&
                dueDate.getMonth() === viewDate.getMonth() &&
                dueDate.getFullYear() === viewDate.getFullYear();
        });
    };

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner" />
        </div>
    );

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '60px' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>
                    <CalendarIcon size={20} className="float" /> Academic Timeline
                </div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '950', lineHeight: '1', letterSpacing: '-2px', color: 'var(--text-main)' }}>
                    Visual <span className="gradient-text">Schedule.</span>
                </h1>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'start' }}>
                {/* Calendar Grid */}
                <div className="glass-card" style={{ padding: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '950', color: 'var(--text-main)' }}>
                            {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}
                                style={{ padding: '12px', borderRadius: '14px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', cursor: 'pointer' }}
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}
                                style={{ padding: '12px', borderRadius: '14px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', cursor: 'pointer' }}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '15px' }}>
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                            <div key={day} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '10px' }}>{day}</div>
                        ))}
                        {days.map(day => {
                            const dayEvents = getDayEvents(day);
                            const isToday = day === new Date().getDate() && viewDate.getMonth() === new Date().getMonth();
                            return (
                                <motion.div
                                    key={day}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    style={{
                                        minHeight: '120px',
                                        padding: '15px',
                                        background: isToday ? 'var(--primary-transparent)' : 'rgba(255,255,255,0.02)',
                                        borderRadius: '20px',
                                        border: isToday ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                                        position: 'relative'
                                    }}
                                >
                                    <span style={{ fontSize: '1.2rem', fontWeight: '900', color: isToday ? 'var(--primary)' : 'var(--text-main)' }}>{day}</span>
                                    {dayEvents.map((ev, i) => (
                                        <div key={i} style={{
                                            marginTop: '8px',
                                            padding: '6px 10px',
                                            borderRadius: '8px',
                                            background: 'var(--primary-gradient)',
                                            color: 'white',
                                            fontSize: '0.65rem',
                                            fontWeight: '800',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {ev.title}
                                        </div>
                                    ))}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Agenda Sidebar */}
                <div style={{ display: 'grid', gap: '30px' }}>
                    <div className="glass-card" style={{ padding: '40px' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: '950', marginBottom: '30px', color: 'var(--text-main)' }}>Upcoming Agenda</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {assignments.slice(0, 5).map((ev, i) => (
                                <div key={i} style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ width: '4px', background: 'var(--primary)', borderRadius: '2px' }} />
                                    <div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: '850', color: 'var(--text-main)' }}>{ev.title}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '5px', fontWeight: '700' }}>
                                            <Clock size={12} /> {new Date(ev.dueDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {assignments.length === 0 && (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontWeight: '600' }}>No upcoming milestones found.</p>
                            )}
                        </div>
                    </div>

                    <button className="glow-button" style={{ width: '100%', padding: '25px', borderRadius: '24px' }}>
                        <Plus size={24} /> Log Custom Event
                    </button>

                    <div className="glass-card" style={{ padding: '30px', background: 'var(--primary-transparent)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                            <Bell size={18} color="var(--primary)" />
                            <h4 style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--text-main)' }}>Quick Sync</h4>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', fontWeight: '600' }}>Your academic timeline is automatically synchronized with institutional deadlines and faculty office hours.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CalendarPage;
