import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import { getAssignments } from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const { data } = await getAssignments();
            setAssignments(data);
        } catch (error) {
            console.error('Failed to fetch assignments', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Dashboard...</div>;

    return (
        <div className="animate-fade">
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Welcome, {user.name}!</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your homework and track progress efficiently.</p>
            </header>

            {user.role === 'teacher' ? (
                <TeacherDashboard assignments={assignments} refreshAssignments={fetchAssignments} />
            ) : (
                <StudentDashboard assignments={assignments} />
            )}
        </div>
    );
};

export default Dashboard;
