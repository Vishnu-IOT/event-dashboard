import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/header.css';

function Header() {
    const { currentUser, logout } = useAuth();

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'superadmin':
                return 'badge-superadmin';
            case 'admin':
                return 'badge-admin';
            case 'organizer':
                return 'badge-organizer';
            default:
                return '';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'superadmin':
                return 'Super Admin';
            case 'admin':
                return 'Admin';
            case 'organizer':
                return 'Event Organizer';
            default:
                return role;
        }
    };

    return (
        <header className="main-header">
            <div className="header-left">
                <h2 className="header-title">Dashboard</h2>
            </div>
            <div className="header-right">
                <div className="header-user">
                    <div className="user-avatar">
                        {currentUser.data.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                        <span className="user-name">{currentUser.data.name}</span>
                        <span className={`role-badge ${getRoleBadgeClass(currentUser.data.role || 'organizer')}`}>
                            {getRoleLabel(currentUser.data.role || 'organizer')}
                        </span>
                    </div>
                </div>
                <button className="logout-btn" onClick={logout}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Header;
