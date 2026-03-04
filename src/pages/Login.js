import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

function Login() {
    const {loginAdmin, loginOrganiser} = useAuth();
    const [isFlipped, setIsFlipped] = useState(false);

    // Admin Login State
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminError, setAdminError] = useState('');
    const [isAdminLoading, setIsAdminLoading] = useState(false);

    // Organizer Login State
    const [orgUsername, setOrgUsername] = useState('');
    const [orgPassword, setOrgPassword] = useState('');
    const [orgError, setOrgError] = useState('');
    const [isOrgLoading, setIsOrgLoading] = useState(false);

    const handleAdminSubmit = (e) => {
        e.preventDefault();
        setAdminError('');
        setIsAdminLoading(true);

        setTimeout(() => {
            const result = loginAdmin(adminUsername, adminPassword);
            if (!result.success) {
                setAdminError(result.message);
            }
            setIsAdminLoading(false);
        }, 500);
    };

    const handleOrgSubmit = (e) => {
        e.preventDefault();
        setOrgError('');
        setIsOrgLoading(true);

        setTimeout(() => {
            const result = loginOrganiser(orgUsername, orgPassword);
            if (!result.success) {
                setOrgError(result.message);
            }
            setIsOrgLoading(false);
        }, 500);
    };

    const toggleFlip = () => {
        setIsFlipped(!isFlipped);
        setAdminError('');
        setOrgError('');
    };

    return (
        <div className="login-page">
            <div className="login-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className={`login-flip ${isFlipped ? 'flip' : ''}`}>
                <div className="login-card">
                    {/* --- FRONT SIDE: ADMIN LOGIN --- */}
                    <div className="login-face login-front login-container">
                        <div className="login-header">
                            <div className="login-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2m-16 0H3" />
                                    <path d="M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4v4h4v-4" />
                                </svg>
                            </div>
                            <h1>Admin Login</h1>
                            <p>Sign in to manage the platform</p>
                        </div>

                        {adminError && (
                            <div className="login-error">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                {adminError}
                            </div>
                        )}

                        <form onSubmit={handleAdminSubmit} className="login-form">
                            <div className="form-group">
                                <label htmlFor="adminUsername">Username</label>
                                <div className="input-wrapper">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    <input
                                        id="adminUsername"
                                        type="text"
                                        placeholder="Enter admin username"
                                        value={adminUsername}
                                        onChange={(e) => setAdminUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="adminPassword">Password</label>
                                <div className="input-wrapper">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <input
                                        id="adminPassword"
                                        type="password"
                                        placeholder="Enter admin password"
                                        value={adminPassword}
                                        onChange={(e) => setAdminPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="login-btn btn-admin" disabled={isAdminLoading}>
                                {isAdminLoading ? (
                                    <span className="spinner"></span>
                                ) : (
                                    'Admin Sign In'
                                )}
                            </button>
                        </form>

                        <div className="login-footer">
                            <p>Default Super Admin: <strong>superadmin</strong> / <strong>super123</strong></p>
                            <div className="switch-login">
                                <button type="button" onClick={toggleFlip}>
                                    Switch to Organizer Login ⤻
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- BACK SIDE: ORGANIZER LOGIN --- */}
                    <div className="login-face login-back login-container">
                        <div className="login-header">
                            <div className="login-icon org-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <h1>Organizer Login</h1>
                            <p>Sign in to manage your events</p>
                        </div>

                        {orgError && (
                            <div className="login-error">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                {orgError}
                            </div>
                        )}

                        <form onSubmit={handleOrgSubmit} className="login-form">
                            <div className="form-group">
                                <label htmlFor="orgUsername">Username</label>
                                <div className="input-wrapper">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    <input
                                        id="orgUsername"
                                        type="text"
                                        placeholder="Enter organizer username"
                                        value={orgUsername}
                                        onChange={(e) => setOrgUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="orgPassword">Password</label>
                                <div className="input-wrapper">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <input
                                        id="orgPassword"
                                        type="password"
                                        placeholder="Enter organizer password"
                                        value={orgPassword}
                                        onChange={(e) => setOrgPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="login-btn btn-org" disabled={isOrgLoading}>
                                {isOrgLoading ? (
                                    <span className="spinner"></span>
                                ) : (
                                    'Organizer Sign In'
                                )}
                            </button>
                        </form>

                        <div className="login-footer">
                            <div className="switch-login">
                                <button type="button" onClick={toggleFlip}>
                                    ⤺ Back to Admin Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
