import React, { Component } from 'react';
import axios from 'axios';

const NEWS_API_BASE_URL = 'http://localhost:8081/api/v1/news';

class ReadNewsDetailsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            news: {},
            previewPhoto: null,
            showGalleryModal: false
        };
    }

    componentDidMount() {
        this.getNewsById(this.state.id).then(res => {
            this.setState({ news: res.data });
        });
    }

    getNewsById(newsId) {
        const token = localStorage.getItem('token');
        return axios.get(`${NEWS_API_BASE_URL}/${newsId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    formatDate(dateString) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return new Date(dateString).toLocaleString('en-US', options);
    }

    render() {
        const { news, previewPhoto, showGalleryModal } = this.state;
        const additionalPhotos = news.additionalPhotos || [];
        const hasThumbnail = !!news.thumbnailUrl;

        return (
            <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.6' }}>
                <div className="container" style={{ maxWidth: '950px', margin: '30px auto' }}>
                    <div className="card shadow-lg" style={{ border: 'none', borderRadius: '15px', overflow: 'hidden' }}>
                        <div className="card-body" style={{ padding: '20px' }}>
                            <button
                                onClick={() => this.props.history.goBack()}
                                style={{
                                    marginBottom: '15px',
                                    padding: '6px 12px',
                                    fontSize: '0.9rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#6c757d',
                                    color: '#fff',
                                    cursor: 'pointer'
                                }}
                            >
                                ← Back
                            </button>

                            <div style={{ fontSize: '0.9rem', color: '#888' }}>
                                <span>{this.formatDate(news.createdAt)}</span> |{' '}
                                <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                                    {news.category}
                                </span>
                            </div>

                            <h2 style={{ marginTop: '10px', marginBottom: '10px', color: '#1a1a2e' }}>
                                {news.title}
                            </h2>

                            <p style={{ fontStyle: 'italic', color: '#555', marginBottom: '20px' }}>
                                By {news.author}
                            </p>

                            {news.description && (
                                <p style={{ fontWeight: 'bold', color: '#444', marginBottom: '15px' }}>
                                    {news.description}
                                </p>
                            )}

                            {news.content && (
                                <div style={{ fontSize: '1.1rem', color: '#222', whiteSpace: 'pre-line', marginBottom: '30px' }}>
                                    {news.content}
                                </div>
                            )}

                            {/* Image Section */}
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'space-between', maxWidth: '100%', minHeight: '300px' }}>
                                {/* Thumbnail */}
                                <div style={{ flex: '1', maxWidth: '48%', minHeight: '300px', backgroundColor: '#f8f9fa', borderRadius: '10px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {hasThumbnail ? (
                                        <img
                                            src={`data:image/jpeg;base64,${news.thumbnailUrl}`}
                                            alt="Thumbnail"
                                            onClick={() => this.setState({ previewPhoto: news.thumbnailUrl })}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '300px',
                                                borderRadius: '10px',
                                                objectFit: 'contain',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s',
                                            }}
                                            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                                            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                                        />
                                    ) : news.embedYouTubeUrl ? (
                                        <div style={{ textAlign: 'center', width: '100%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '10px' }}>
                                                Embedded YouTube Link:
                                            </label>
                                            <a
                                                href={news.embedYouTubeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#007bff', wordBreak: 'break-all', fontSize: '0.95rem' }}
                                            >
                                                {news.embedYouTubeUrl}
                                            </a>
                                        </div>
                                    ) : (
                                        <div style={{ color: '#aaa' }}>No Thumbnail or YouTube Link Available</div>
                                    )}


                                </div>

                                {/* Additional Photos Grid */}
                                <div style={{ flex: '1', maxWidth: '48%', minHeight: '300px', borderRadius: '10px' }}>
                                    {additionalPhotos.length > 0 ? (
                                        <>
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: additionalPhotos.length > 1 ? 'repeat(2, 1fr)' : '1fr',
                                                    gap: '10px',
                                                    maxHeight: '500px'
                                                }}
                                            >
                                                {additionalPhotos.slice(0, 4).map((photo, index) => (
                                                    <img
                                                        key={index}
                                                        src={`data:image/jpeg;base64,${photo}`}
                                                        alt={`Gallery ${index}`}
                                                        onClick={() => this.setState({ previewPhoto: photo })}
                                                        style={{
                                                            width: '100%',
                                                            height: 'auto',
                                                            maxHeight: '240px',
                                                            borderRadius: '10px',
                                                            cursor: 'pointer',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            {additionalPhotos.length > 4 && (
                                                <button
                                                    onClick={() => this.setState({ showGalleryModal: true })}
                                                    style={{
                                                        marginTop: '10px',
                                                        padding: '6px 12px',
                                                        fontSize: '0.9rem',
                                                        borderRadius: '6px',
                                                        border: 'none',
                                                        backgroundColor: '#007bff',
                                                        color: '#fff',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    View All Photos
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <div style={{ color: '#aaa', textAlign: 'center' }}>No Additional Photos</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Image Modal */}
                {previewPhoto && (
                    <div
                        onClick={() => this.setState({ previewPhoto: null })}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000
                        }}
                    >
                        <img
                            src={`data:image/jpeg;base64,${previewPhoto}`}
                            alt="Preview"
                            style={{
                                maxWidth: '90%',
                                maxHeight: '90%',
                                borderRadius: '10px'
                            }}
                        />
                        <button
                            onClick={() => this.setState({ previewPhoto: null })}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                padding: '8px 12px',
                                fontSize: '1rem',
                                backgroundColor: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            Close
                        </button>
                    </div>
                )}

                {/* Gallery Modal */}
                {showGalleryModal && (
                    <div
                        onClick={() => this.setState({ showGalleryModal: false })}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            overflowY: 'auto',
                            padding: '20px'
                        }}
                    >
                        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', maxWidth: '90%' }}>
                            <h4>All Gallery Photos</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                                {additionalPhotos.map((photo, index) => (
                                    <img
                                        key={index}
                                        src={`data:image/jpeg;base64,${photo}`}
                                        alt={`Gallery ${index}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            this.setState({ previewPhoto: photo });
                                        }}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => this.setState({ showGalleryModal: false })}
                                style={{
                                    marginTop: '20px',
                                    padding: '6px 12px',
                                    fontSize: '1rem',
                                    backgroundColor: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default ReadNewsDetailsForm;
