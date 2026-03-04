import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/manageUsers.css';

function ManageUsers() {
  const { currentUser, users, addUser, deleteUser } = useAuth();
  const [nusers, setnusers] = useState(null);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchUsersAPIs = async () => {
      try {
        const response = await fetch(
          `https://events.mpdatahub.com/api/super-admin/dashboard`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        const data = await response.json();
        setnusers(data);
        return data; // Expected: array of event objects
      } catch (error) {
        console.error('fetchUsersAPI error:', error.message);
        return [];
      }
    };
    fetchUsersAPIs();
  }, [token]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    mobile: '',
    role: currentUser.data.role === 'superadmin' ? 'admin' : 'organizer',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // if (!formData.name.trim() || !formData.username.trim() || !formData.password.trim()) {
    //     if (!formData.name || !formData.username || !formData.password) {
    //     setError('All fields are required');
    //     return;
    // }

    if (formData.password.length < 6) {
      setError('Password must be at least 4 characters');
      return;
    }

    const result = addUser(formData);
    if (result.success) {
      setSuccess(
        `${formData.role === 'admin' ? 'Admin' : 'Event Organizer'} "${formData.name}" created successfully!`
      );
      setFormData({
        name: '',
        email: '',
        password: '',
        dob: '',
        mobile: '',
        role: currentUser.data.role === 'superadmin' ? 'admin' : 'organizer',
      });
    } else {
      setError(result.message);
    }
  };

  const handleDelete = (userId) => {
    deleteUser(userId);
    setDeleteConfirm(null);
  };

  // Filter the User List
  console.log(nusers);
  const superadmin_list = users.data.superadmin || [];
  const admin_list = users.data.admins || [];
  const organizer_list = users.data.organizers || [];

  const filteredUsers1 = [
    {
      ...superadmin_list,
      role: 'superadmin',
    },
    ...admin_list,
    ...organizer_list,
  ];

  const adminOrganizers = filteredUsers1.filter(
    (user) =>
      user.role === 'organizer' && user.admin_id === currentUser.data.user_id
  );

  const filteredUsers =
    currentUser.data.role === 'admin' ? adminOrganizers : filteredUsers1;

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
    <div className="manage-users-page">
      <div className="page-header">
        <h2>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Manage Users
        </h2>
      </div>

      <div className="manage-users-layout">
        {/* Registration Form */}
        <div className="register-section">
          <div className="section-card">
            <h3>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Register New User
            </h3>

            {success && (
              <div className="alert alert-success">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                {success}
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-username">Email</label>
                <input
                  id="reg-username"
                  name="email"
                  type="text"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  placeholder="Enter password (min 4 chars)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  id="mobile"
                  name="mobile"
                  type="number"
                  placeholder="Enter mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dob">DOB</label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  placeholder="Enter date of birth"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  {currentUser.data.role === 'superadmin' && (
                    <option value="admin">Admin</option>
                  )}
                  <option value="organizer">Event Organizer</option>
                </select>
              </div>

              <button type="submit" className="btn-register">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                Register User
              </button>
            </form>
          </div>
        </div>

        {/* Users List */}
        <div className="users-list-section">
          <div className="section-card">
            <h3>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Registered Users
              <span className="user-count">{filteredUsers.length}</span>
            </h3>

            {filteredUsers.length === 0 ? (
              <div className="empty-state">
                <p>No other users registered yet.</p>
              </div>
            ) : (
              <div className="users-table-wrapper">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers?.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            {user.name}
                          </div>
                        </td>
                        <td>
                          <code>{user.email}</code>
                        </td>
                        <td>
                          <span className={`role-tag role-${user.role}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td>
                          {user.role !== 'superadmin' && (
                            <>
                              {deleteConfirm === user.id ? (
                                <div className="confirm-delete">
                                  <button
                                    className="btn-yes"
                                    onClick={() => handleDelete(user.id)}
                                  >
                                    Yes
                                  </button>
                                  <button
                                    className="btn-no"
                                    onClick={() => setDeleteConfirm(null)}
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="btn-delete-sm"
                                  onClick={() => setDeleteConfirm(user.id)}
                                >
                                  Remove
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
