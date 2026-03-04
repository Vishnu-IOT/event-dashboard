import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import '../styles/eventBanner.css';

function EventBanner({ event, onClose }) {
    const bannerRef = useRef(null);

    // QR code data — encode event details as a JSON string or URL
    const qrData = JSON.stringify({
        id: event.id,
        name: event.eventName,
        venue: event.venue,
        college: event.collegeName,
        contact: event.contact,
    });

    const handleDownload = async () => {
        if (!bannerRef.current) return;
        try {
            const canvas = await html2canvas(bannerRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
            });
            const link = document.createElement('a');
            link.download = `${event.eventName.replace(/\s+/g, '_')}_banner.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Failed to download banner:', err);
        }
    };

    return (
        <div className="banner-overlay">
            <div className="banner-modal">
                {/* Close Button */}
                <button className="banner-close-btn" onClick={onClose}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <h2 className="banner-modal-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Event Created Successfully!
                </h2>
                <p className="banner-subtitle">Your event banner is ready. Download and share it!</p>

                {/* ─── The actual banner (captured for download) ─── */}
                <div className="banner-wrapper" ref={bannerRef}>
                    <div className="event-banner">
                        {/* Decorative Elements */}
                        <div className="banner-decor">
                            <div className="decor-circle decor-1"></div>
                            <div className="decor-circle decor-2"></div>
                            <div className="decor-circle decor-3"></div>
                        </div>

                        {/* College Name */}
                        <div className="banner-college">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2m-16 0H3" />
                                <path d="M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4v4h4v-4" />
                            </svg>
                            {event.collegeName}
                        </div>

                        {/* Divider */}
                        <div className="banner-divider">
                            <span className="divider-star">✦</span>
                        </div>

                        {/* Event Name */}
                        <h1 className="banner-event-name">{event.eventName}</h1>

                        {/* QR Code — Centered */}
                        <div className="banner-qr-section">
                            <div className="qr-container">
                                <QRCodeSVG
                                    value={qrData}
                                    size={160}
                                    bgColor="white"
                                    fgColor="#1a1d2e"
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                            <span className="qr-label">Scan to view event details</span>
                        </div>

                        {/* Event Details */}
                        <div className="banner-details">
                            <div className="banner-detail-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>{event.venue}</span>
                            </div>
                            <div className="banner-detail-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <span>{event.contact}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="banner-footer">
                            <span>Organized by {event.createdByName}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="banner-actions">
                    <button className="btn-download" onClick={handleDownload}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download Banner
                    </button>
                    <button className="btn-close-banner" onClick={onClose}>
                        Continue to Events
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EventBanner;
