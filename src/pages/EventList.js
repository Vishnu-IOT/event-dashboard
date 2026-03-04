import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/eventList.css';

function EventList({ onEdit }) {
  const { currentUser, deleteEvent } = useAuth();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [nevents, setnevents] = useState();

  useEffect(() => {
    const fetchEventsAPIs = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(
          `https://events.mpdatahub.com/api/events`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        const data = await response.json();
        setnevents(data);
        return data;
      } catch (error) {
        console.error('fetchEventsAPI error:', error.message);
        return [];
      }
    };
    fetchEventsAPIs();
  }, []);

  const handleDelete = (eventId) => {
    deleteEvent(eventId);
    setDeleteConfirm(null);
  };

  const canEditDelete = (event) => {
    if (
      currentUser.data.role === 'superadmin' ||
      currentUser.data.role === 'admin'
    ) {
      return true;
    }
    return event.id === currentUser.data.user_id;
  };

  const canDownloadImage = async (url, fileName) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="event-list-page">
      <div className="page-header">
        <h2>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          All Events
        </h2>
        <span className="event-count">
          {nevents?.data?.length} event{nevents?.data?.length !== 1 ? 's' : ''}
        </span>
      </div>

      {nevents?.data?.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="10" y1="14" x2="14" y2="18" />
              <line x1="14" y1="14" x2="10" y2="18" />
            </svg>
          </div>
          <h3>No Events Yet</h3>
          <p>Create your first event to get started!</p>
        </div>
      ) : (
        <div className="events-grid">
          {nevents?.data?.map((event) => (
            <div className="event-card" key={event.id}>
              <div className="event-banners">
                {event.banner1 && (
                  <img
                    src={event.banner1}
                    alt="Banner 1"
                    className="event-banner"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                {!event.banner1 && (
                  <div className="banner-placeholder">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="event-card-body">
                <h3 className="event-name">{event.title}</h3>
                <div className="event-details">
                  <div className="event-detail">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{event.address}</span>
                  </div>
                  <div className="event-detail">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2m-16 0H3" />
                    </svg>
                    <span>{event.description}</span>
                  </div>
                  <div className="event-detail">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>{event.type}</span>
                  </div>
                </div>
                <div className="event-meta">
                  <span className="created-by">
                    By: <strong>{event.organizer_details.name}</strong>
                  </span>
                  <span
                    className={`role-tag role-${event.organizer_details.role || 'organizer'}`}
                  >
                    {event.organizer_details.role === 'superadmin'
                      ? 'Super Admin'
                      : event.organizer_details.role === 'admin'
                        ? 'Admin'
                        : 'Organizer'}
                  </span>
                </div>
                <button
                  className="btn-edit"
                  onClick={() =>
                    canDownloadImage(event.qr_code, `${event.title}.pdf`)
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Download Banner
                </button>
                {/* <a href={event.qr_code} download alt =''>Download Banner</a> */}
              </div>
              {canEditDelete(event) && (
                <div className="event-actions">
                  <button className="btn-edit" onClick={() => onEdit(event)}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  {deleteConfirm === event.id ? (
                    <div className="confirm-delete">
                      <span>Sure?</span>
                      <button
                        className="btn-yes"
                        onClick={() => handleDelete(event.id)}
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
                      className="btn-delete"
                      onClick={() => setDeleteConfirm(event.id)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventList;
