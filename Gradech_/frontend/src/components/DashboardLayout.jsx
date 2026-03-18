import React from 'react';
import DashboardSidebar from './DashboardSidebar';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
    const { user } = useAuth();

    return (
        <div style={{
            display: 'flex',
            gap: '30px',
            padding: '120px 5% 60px',
            minHeight: '100vh',
            maxWidth: '1600px',
            margin: '0 auto',
            position: 'relative'
        }}>
            <DashboardSidebar role={user?.role} />
            <div style={{ flex: 1, minWidth: 0 }}>
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;
