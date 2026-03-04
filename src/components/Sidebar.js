import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/sidebar.css';

function Sidebar({ activePage, onNavigate }) {
    const { currentUser } = useAuth();
    const canManageUsers =
        currentUser.data.role === 'superadmin' || currentUser.data.role === 'admin';
    const canCreateEvents = currentUser.data.role === 'organizer';

    const menuItems = [
        {
            id: 'events',
            label: 'Events',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            ),
        }
    ];

    if (canManageUsers) {
        menuItems.push({
            id: 'manage-users',
            label: 'Manage Users',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
        });
    }

    if (canCreateEvents) {
        menuItems.push({
            id: 'create-event',
            label: 'Create Event',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
            ),
        });
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">
                    {/* <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2m-16 0H3" />
                        <path d="M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4v4h4v-4" />
                    </svg> */} 
                    {/* Add the background Color in CSS while uncommenting SVG */}
                    <img src='/favicon.ico' alt='MyKonnect'/> 
                </div>
                <span className="logo-text">MyKonnect</span>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                        onClick={() => onNavigate(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-badge">
                    <div className={`role-dot role-${currentUser.data.role}`}></div>
                    <div className="user-info-mini">
                        <span className="user-name-mini">{currentUser.data.name}</span>
                        <span className="user-role-mini">
                            {currentUser.data.role === 'superadmin'
                                ? 'Super Admin'
                                : currentUser.data.role === 'admin'
                                    ? 'Admin'
                                    : 'Organizer'}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
