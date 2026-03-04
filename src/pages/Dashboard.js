import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import EventList from './EventList';
import EventForm from './EventForm';
import ManageUsers from './ManageUsers';
import '../styles/dashboard.css';

function Dashboard() {
    const { currentUser } = useAuth();
    const [activePage, setActivePage] = useState('events');
    const [editingEvent, setEditingEvent] = useState(null);

    const handleNavigate = (page) => {
        setActivePage(page);
        setEditingEvent(null);
    };

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setActivePage('edit-event');
    };

    const handleEventSaved = () => {
        setEditingEvent(null);
        setActivePage('events');
    };

    const renderPage = () => {
        switch (activePage) {
            case 'events':
                return <EventList onEdit={handleEditEvent} />;
            case 'create-event':
                if (currentUser.data.role === 'organizer'){
                return <EventForm onSaved={handleEventSaved} />;
                }
                return <EventList onEdit={handleEditEvent} />;
            case 'edit-event':
                return <EventForm event={editingEvent} onSaved={handleEventSaved} />;
            case 'manage-users':
                if (currentUser.data.role === 'superadmin' || currentUser.data.role === 'admin') {
                    return <ManageUsers />;
                }
                return <EventList onEdit={handleEditEvent} />;
            default:
                return <EventList onEdit={handleEditEvent} />;
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar activePage={activePage} onNavigate={handleNavigate} />
            <div className="dashboard-main">
                <Header />
                <div className="dashboard-content">
                    {renderPage()}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
