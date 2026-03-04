// ============================================================================
// API SERVICE — Event Dashboard
// ============================================================================
// This file contains all API fetch functions for the backend.
// Currently the app uses localStorage (initialData.js). When your backend
// API is ready, uncomment the API imports in AuthContext.js and swap the
// function calls as indicated by the comments there.
//
// HOW TO USE:
// 1. Set your BASE_URL below to your backend server URL
// 2. Go to AuthContext.js
// 3. Uncomment the API import line
// 4. Inside each function, uncomment the "API VERSION" block
//    and comment out the "LOCAL VERSION" block
// ============================================================================

const BASE_URL = 'https://events.mpdatahub.com/api'; // <-- Change this to your backend URL



// ──────────────────────────────────────────────
// Helper: Get auth headers with token
// ──────────────────────────────────────────────
function getAuthHeaders() {
  const token = sessionStorage.getItem('token'); // <-- This the token for current user
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ──────────────────────────────────────────────
// Helper: Handle API response
// ──────────────────────────────────────────────
async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

// ============================================================================
// AUTH APIs
// ============================================================================

/**
 * POST /api/auth/login
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ success: boolean, user: object, token: string, message?: string }>}
 */
//Admin API
export async function loginAdminAPI(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    return { success: true, user: data, token: data.data.token };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Organizer API
export async function loginOrgAPI(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/Organizer-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    // Store token for future authenticated requests
    
    return { success: true, user: data, token: data.data.token };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * POST /api/auth/logout
 * @returns {Promise<{ success: boolean }>}
 */
export async function logoutAPI() {
  try {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    sessionStorage.removeItem('token');
    return { success: true };
  } catch (error) {
    // Even if API fails, clear local session
    sessionStorage.removeItem('token');
    return { success: true };
  }
}

// ============================================================================
// USER APIs
// ============================================================================

/**
 * GET /api/users
 * @returns {Promise<Array>} list of all users
 */
export async function fetchUsersAPI() {
  try {
    const response = await fetch(`${BASE_URL}/super-admin/dashboard`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    return data; // Expected: array of user objects
  } catch (error) {
    console.error('fetchUsersAPI error:', error.message);
    return [];
  }
}

/**
 * POST /api/users
 * @param {{ email: string, password: string }} userData
 * @returns {Promise<{ success: boolean, user?: object, message?: string }>}
 */
export async function createUserAPI(userData) {
  try {
    const response = await fetch(`${BASE_URL}/createOrganizer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    const data = await handleResponse(response);
    return { success: true, user: data.user || data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function createAdminUserAPI(userData) {
  try {
    const response = await fetch(`${BASE_URL}/admin-register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    const data = await handleResponse(response);
    return { success: true, user: data.user || data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * DELETE /api/users/:id
 * @param {string} userId
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export async function deleteUserAPI(userId) {
  try {
    const response = await fetch(`${BASE_URL}/delete-user/${userId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    await handleResponse(response);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ============================================================================
// EVENT APIs
// ============================================================================

/**
 * GET /api/events
 * Backend should filter events by role using the auth token.
 * - superadmin & admin: returns all events
 * - organizer: returns only their own events
 * @returns {Promise<Array>} list of events
 */
export async function fetchEventsAPI() {
  try {
    const response = await fetch(`${BASE_URL}/events`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    return data; // Expected: array of event objects
  } catch (error) {
    console.error('fetchEventsAPI error:', error.message);
    return [];
  }
}



/**
 * POST /api/events
 * @param {{ title, description, banner1, banner2, address, slot, type, qr_image }} eventData
 * @returns {Promise<{ success: boolean, event?: object, message?: string }>}
 */
export async function createEventAPI(eventData) {
  try {
    const token = sessionStorage.getItem('token'); // <-- This the token for current user
    const response = await fetch(`${BASE_URL}/create-event`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: eventData,
    });
    const data = await handleResponse(response);
    return { success: true, event: data.event || data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * PUT /api/events/:id
 * @param {string} eventId
 * @param {{ eventName, banner1, banner2, venue, contact, collegeName }} eventData
 * @returns {Promise<{ success: boolean, event?: object, message?: string }>}
 */
export async function updateEventAPI(eventId, eventData) {
  try {
    const response = await fetch(`${BASE_URL}/update-event/${eventId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    const data = await handleResponse(response);
    return { success: true, event: data.event || data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * DELETE /api/events/:id
 * @param {string} eventId
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export async function deleteEventAPI(eventId) {
  try {
    const response = await fetch(`${BASE_URL}/delete-event/${eventId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    await handleResponse(response);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
