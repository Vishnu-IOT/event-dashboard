import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ============================================================================
// API IMPORT — Uncomment the line below when your backend API is ready
// ============================================================================
import {
  loginOrgAPI,
  loginAdminAPI,
//   logoutAPI,
  fetchUsersAPI,
  createUserAPI,
  createAdminUserAPI,
  deleteUserAPI,
  fetchEventsAPI,
  createEventAPI,
  updateEventAPI,
  deleteEventAPI,
} from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(() => {
        const stored = sessionStorage.getItem('dashboard_currentUser');
        return stored ? JSON.parse(stored) : null;
    });

    const [users, setUsers] = useState({});
    const [events, setEvents] = useState({});

    // ========================================================================
    // OPTIONAL: useEffect to load data from API on mount
    // Uncomment below when API is ready (also add useEffect to the import above)
    // ========================================================================
    useEffect(() => {
      async function loadFromAPI() {
        const token = sessionStorage.getItem('token');
        if (!token) return;
        try {
            if(currentUser.data.role !== 'organizer'){
                const usersData = await fetchUsersAPI();
                setUsers(usersData);
            }
          const eventsData = await fetchEventsAPI();
          setEvents(eventsData);
        } catch (err) {
          console.error('Failed to load data from API:', err);
        }
      }
      if (currentUser) loadFromAPI();
    }, [currentUser]);

    // ========================================================================
    // LOGIN
    // ========================================================================

    //Admin Login
    const loginAdmin = useCallback(async (username, password) => {
        // ── API VERSION (uncomment below, comment out LOCAL VERSION above) ──
        const result = await loginAdminAPI(username, password);
        if (result.success) {
            setCurrentUser(result.user);
            sessionStorage.setItem('dashboard_currentUser', JSON.stringify(result.user));
        }
        return result;
    }, []);

    // Organizer Login
    const loginOrganiser = useCallback(async (username, password) => {

        // ── API VERSION (uncomment below, comment out LOCAL VERSION above) ──
        const result = await loginOrgAPI(username, password);
        if (result.success) {
            setCurrentUser(result.user);
            sessionStorage.setItem('dashboard_currentUser', JSON.stringify(result.user));
        }
        return result;
    }, []);

    // ========================================================================
    // LOGOUT
    // ========================================================================
    const logout = useCallback(() => {
        // ── LOCAL VERSION (active) ──
        setCurrentUser(null);
        sessionStorage.removeItem('dashboard_currentUser');
        sessionStorage.removeItem('token');

        // ── API VERSION (uncomment below, comment out LOCAL VERSION above) ──
        // await logoutAPI();
        // setCurrentUser(null);
        // sessionStorage.removeItem('dashboard_currentUser');
        // sessionStorage.removeItem('token');
    }, []);

    // ========================================================================
    // ADD USER (Register Admin / Event Organizer)
    // ========================================================================
    const addUser = useCallback(async (userData) => {

        // ── API VERSION (uncomment below, comment out LOCAL VERSION above) ──
        const result =(userData.role === 'admin' ? await createAdminUserAPI(userData) : await createUserAPI(userData));
        if (result.success) {
            // Refresh user list from API
            const updatedUsers = await fetchUsersAPI();
            setUsers(updatedUsers);
        }
        return result;
    }, []);


    // ========================================================================
    // DELETE USER
    // ========================================================================
    const deleteUser = useCallback(async (userId) => {

        // ── API VERSION (uncomment below, comment out LOCAL VERSION above) ──
        const result = await deleteUserAPI(userId);
        if (result.success) {
            const updatedUsers = await fetchUsersAPI();
            setUsers(updatedUsers);
        }
    }, []);

    // ========================================================================
    // ADD EVENT
    // ========================================================================
    const addEvent = useCallback(
        async (eventData) => {

            // ── API VERSION (uncomment below, comment out LOCAL VERSION above) ──
            const result = await createEventAPI(eventData);
            if (result.success) {
                // Refresh events list from API
                const updatedEvents = await fetchEventsAPI();
                setEvents(updatedEvents);
                return result.event;
            }
            return null;
        },
        []
    );

    // ========================================================================
    // UPDATE EVENT
    // ========================================================================
    const updateEvent = useCallback( async (eventId, eventData) => {
        
        // ── API VERSION (uncomment below, comment out LOCAL VERSION above) ──
        const result = await updateEventAPI(eventId, eventData);
        if (result.success) {
            const updatedEvents = await fetchEventsAPI();
            setEvents(updatedEvents);
        }
    }, []);

    // ========================================================================
    // DELETE EVENT
    // ========================================================================
    const deleteEvent = useCallback(async (eventId) => {

        // ── API VERSION (uncomment below, comment out LOCAL VERSION above) ──
        const result = await deleteEventAPI(eventId);
        if (result.success) {
            const updatedEvents = await fetchEventsAPI();
                setEvents(updatedEvents);
        }
    }, []);

    // ========================================================================
    // MAKE FUNCTION GLOBALLY AVAILABLE (filtered by role)
    // ========================================================================

    const value = {
        currentUser,
        users,
        events,
        loginAdmin,
        loginOrganiser,
        logout,
        addUser,
        deleteUser,
        addEvent,
        updateEvent,
        deleteEvent,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
