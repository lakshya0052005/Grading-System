import React, { useState, useEffect } from 'react';
import { Activity, Shield, Database, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const SystemStatus = () => {
    const [status, setStatus] = useState({
        database: 'Operational',
        aiEngine: 'Active',
        storage: 'Secure',
        latency: '24ms'
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStatus(prev => ({
                ...prev,
                latency: `${Math.floor(Math.random() * (45 - 18 + 1)) + 18}ms`
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const StatusItem = ({ icon: Icon, label, value, color }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>
            <Icon size={14} color={color} />
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}:</span>
            <span style={{ color: 'var(--text-main)' }}>{value}</span>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                display: 'flex',
                gap: '25px',
                padding: '10px 25px',
                background: 'var(--primary-transparent)',
                borderRadius: '100px',
                border: '1px solid var(--card-border)',
                backdropFilter: 'var(--glass-blur)',
                width: 'fit-content'
            }}
        >
            <StatusItem icon={Database} label="DB" value={status.database} color="var(--success)" />
            <StatusItem icon={Cpu} label="Neural Engine" value={status.aiEngine} color="var(--primary)" />
            <StatusItem icon={Shield} label="Storage" value={status.storage} color="var(--secondary)" />
            <StatusItem icon={Activity} label="Ping" value={status.latency} color="var(--warning)" />
        </motion.div>
    );
};

export default SystemStatus;
