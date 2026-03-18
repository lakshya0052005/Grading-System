import React, { createContext, useContext, useState } from 'react';
import { AlertCircle, CheckCircle, X, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = Date.now() + Math.random();
        const toast = {
            id,
            message,
            type,
            createdAt: Date.now()
        };
        
        setToasts(prev => [...prev, toast]);
        
        // Auto remove toast after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const showError = (message) => addToast(message, 'error');
    const showSuccess = (message) => addToast(message, 'success');
    const showInfo = (message) => addToast(message, 'info');
    const showWarning = (message) => addToast(message, 'warning');

    const ToastComponent = ({ toast, onRemove }) => {
        const getIcon = () => {
            switch (toast.type) {
                case 'success': return <CheckCircle size={20} color="var(--success)" />;
                case 'error': return <AlertCircle size={20} color="var(--error)" />;
                case 'warning': return <AlertTriangle size={20} color="var(--warning)" />;
                default: return <Info size={20} color="var(--primary)" />;
            }
        };

        const getBackground = () => {
            switch (toast.type) {
                case 'success': return 'rgba(34, 197, 94, 0.1)';
                case 'error': return 'rgba(239, 68, 68, 0.1)';
                case 'warning': return 'rgba(251, 191, 36, 0.1)';
                default: return 'rgba(99, 102, 241, 0.1)';
            }
        };

        return (
            <div 
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '15px 20px',
                    background: getBackground(),
                    border: `1px solid ${toast.type === 'success' ? 'var(--success)' : toast.type === 'error' ? 'var(--error)' : toast.type === 'warning' ? 'var(--warning)' : 'var(--primary)'}`,
                    borderRadius: '8px',
                    color: 'white',
                    maxWidth: '400px',
                    animation: 'slideIn 0.3s ease-out'
                }}
            >
                {getIcon()}
                <span style={{ flex: 1 }}>{toast.message}</span>
                <button 
                    onClick={() => onRemove(toast.id)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        padding: '5px'
                    }}
                >
                    <X size={16} />
                </button>
            </div>
        );
    };

    return (
        <ToastContext.Provider value={{ 
            showError, 
            showSuccess, 
            showInfo, 
            showWarning,
            addToast
        }}>
            {children}
            {toasts.map(toast => (
                <ToastComponent 
                    key={toast.id} 
                    toast={toast} 
                    onRemove={removeToast} 
                />
            ))}
            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </ToastContext.Provider>
    );
};