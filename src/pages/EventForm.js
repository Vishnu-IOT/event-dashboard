import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/eventForm.css';

function EventForm({ event, onSaved }) {
    const { addEvent, updateEvent } = useAuth();
    const isEditing = !!event;

    const [formData, setFormData] = useState({
        eventName: '',
        eventDesc: '',
        banner1: null,
        banner2: null,
        qrbanner: null,
        venue: '',
        slot: '',
        type: '',
        contact: '',
        collegeName: '',
        subevents: []
    });

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (event) {
            setFormData({
                eventName: event.title || '',
                eventDesc: event.description || '',
                banner1: event.banner1 || null,
                banner2: event.banner2 || null,
                qrbanner: event.qr_code || null,
                venue: event.address || '',
                slot: event.slot || '',
                type: event.type || '',
                contact: event.contact || '9514532527',
                collegeName: event.collegeName || 'College',
                subevents: event.subevents ? JSON.parse(event.subevents) : []
            });
        }
    }, [event]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubeventChange = (index, field, value) => {
        const updatedSubevents = [...formData.subevents];
        updatedSubevents[index][field] = value;
        setFormData((prev) => ({ ...prev, subevents: updatedSubevents }));
    };

    const handleAddSubevent = () => {
        setFormData((prev) => ({
            ...prev,
            subevents: [...prev.subevents, { subevent: '', subevent_location: '' }]
        }));
    };

    const handleRemoveSubevent = (index) => {
        const updatedSubevents = formData.subevents.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, subevents: updatedSubevents }));
    };

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.eventName.trim()) {
            setError('Event name is required');
            return;
        }
        if (!formData.venue.trim()) {
            setError('Venue location is required');
            return;
        }
        if (!formData.contact.trim()) {
            setError('Contact is required');
            return;
        }
        if (!formData.collegeName.trim()) {
            setError('College name is required');
            return;
        }

        const newformData = new FormData();
        newformData.append('title', formData.eventName);
        newformData.append('description', formData.eventDesc);
        newformData.append('address', formData.venue);
        newformData.append('slot', formData.slot);
        newformData.append('type', formData.type);
        newformData.append('banner1', formData.banner1);
        newformData.append('banner2', formData.banner2);
        newformData.append('qr_image', formData.qrbanner);
        newformData.append('subevents', JSON.stringify(formData.subevents));

        if (isEditing) {
            updateEvent(event.id, newformData);
            setSuccess('Event updated successfully!');
        } else {
            // for (let pair of newformData.entries()) {
            //     console.log(pair[0], pair[1]);
            // }
            addEvent(newformData);
            setSuccess('Event created successfully!');
            setFormData({
                eventName: '',
                eventDesc: '',
                banner1: null,
                banner2: null,
                qrbanner: null,
                venue: '',
                slot: '',
                type: '',
                contact: '',
                collegeName: '',
                subevents: []
            });
        }

        setTimeout(() => {
            onSaved();
        }, 1000);
    };

    return (
        <div className="event-form-page">
            <div className="page-header">
                <h2>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {isEditing ? (
                            <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>
                        ) : (
                            <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></>
                        )}
                    </svg>
                    {isEditing ? 'Edit Event' : 'Create New Event'}
                </h2>
            </div>

            {success && (
                <div className="alert alert-success">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {success}
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="event-form">
                <div className="form-card">
                    <div className="form-section">
                        <h3>Event Details</h3>
                        <div className="form-group">
                            <label htmlFor="eventName">Event Name *</label>
                            <input
                                id="eventName"
                                name="eventName"
                                type="text"
                                placeholder="Enter event name"
                                value={formData.eventName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="eventDesc">Event Description *</label>
                            <textarea
                                id="eventDesc"
                                name="eventDesc"
                                type="text"
                                placeholder="Enter event description"
                                value={formData.eventDesc}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="venue">Venue Location *</label>
                                <input
                                    id="venue"
                                    name="venue"
                                    type="text"
                                    placeholder="Enter venue location"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="collegeName">Organisation Name *</label>
                                <input
                                    id="collegeName"
                                    name="collegeName"
                                    type="text"
                                    placeholder="Enter organisation name"
                                    value={formData.collegeName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="type">Slot Type *</label>
                                <select
                                    id="type"
                                    name="type"
                                    type="text"
                                    placeholder="Enter Slot Type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option></option>
                                    <option>Unlimited</option>
                                    <option>Limited</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="slot">Slot</label>
                                <input
                                    id="slot"
                                    name="slot"
                                    type="text"
                                    placeholder="Enter slot"
                                    value={formData.slot}
                                    onChange={handleChange}
                                    required
                                    disabled={formData.type === "Unlimited"}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="contact">Contact *</label>
                            <input
                                id="contact"
                                name="contact"
                                type="text"
                                placeholder="Enter contact number or email"
                                value={formData.contact}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="section-header">
                            <h3>Sub-events</h3>
                            <button type="button" className="btn-add-subevent" onClick={handleAddSubevent}>
                                + Add Sub-event
                            </button>
                        </div>
                        {formData.subevents.map((subevent, index) => (
                            <div key={index} className="subevent-row">
                                <div className="form-group">
                                    <label>Sub-event Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter sub-event name"
                                        value={subevent.subevent}
                                        onChange={(e) => handleSubeventChange(index, 'subevent', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        placeholder="Enter location"
                                        value={subevent.subevent_location}
                                        onChange={(e) => handleSubeventChange(index, 'subevent_location', e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="btn-remove-subevent"
                                    onClick={() => handleRemoveSubevent(index)}
                                    title="Remove this sub-event"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="form-section">
                        <h3>Banners</h3>
                        <div className="form-group">
                            <label htmlFor="banner1">Banner 1 (Image File)</label>
                            <input
                                id="banner1"
                                name="banner1"
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                placeholder="https://example.com/banner1.jpg"
                                // value={formData.banner1}
                                onChange={handleImageChange}
                            />
                            {formData.banner1 && (
                                <div className="banner-preview">
                                    <img src={formData.banner1} alt="Banner 1 Preview" onError={(e) => { e.target.style.display = 'none'; }} />
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="banner2">Banner 2 (Image File)</label>
                            <input
                                id="banner2"
                                name="banner2"
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                placeholder="https://example.com/banner2.jpg"
                                // value={formData.banner2}
                                onChange={handleImageChange}
                            />
                            {formData.banner2 && (
                                <div className="banner-preview">
                                    <img src={formData.banner2} alt="Banner 2 Preview" onError={(e) => { e.target.style.display = 'none'; }} />
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="qrbanner">QR Banner (Image File)</label>
                            <input
                                id="qrbanner"
                                name="qrbanner"
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                placeholder="https://example.com/qrbanner.jpg"
                                // value={formData.qrbanner}
                                onChange={handleImageChange}
                            />
                            {formData.qrbanner && (
                                <div className="banner-preview">
                                    <img src={formData.qrbanner} alt="QR Banner Preview" onError={(e) => { e.target.style.display = 'none'; }} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onSaved}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            {isEditing ? 'Update Event' : 'Create Event'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EventForm;
