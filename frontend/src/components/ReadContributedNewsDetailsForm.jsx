import React, { Component } from 'react';
import axios from 'axios';

const CONTRIBUTED_NEWS_API_BASE_URL = 'http://localhost:8081/api/v1/contribute-news';

class ReadContributedNewsDetailsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            news: {},
            previewPhoto: null,
        };
    }

    componentDidMount() {
        this.getContributedNewsById(this.state.id).then(res => {
            this.setState({ news: res.data });
        });
    }

    getContributedNewsById(newsId) {
        const token = localStorage.getItem('token');
        return axios.get(`${CONTRIBUTED_NEWS_API_BASE_URL}/${newsId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    render() {
        const { news, previewPhoto } = this.state;
        const additionalPhotos = news.additionalPhotos || [];

        return (
            <div style={{ fontFamily: 'Segoe UI, sans-serif', color: '#333', background: '#f4f6f8', minHeight: '100vh', padding: '30px' }}>
                <div className="container" style={{ maxWidth: '850px', margin: '0 auto' }}>
                    <div className="card shadow" style={{ borderRadius: '12px', background: '#fff', padding: '25px' }}>

                        {/* Back Button */}
                        <button
                            onClick={() => this.props.history.goBack()}
                            style={{
                                float: 'left',
                                marginBottom: '15px',
                                padding: '4px 8px',
                                fontSize: '0.8rem',
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor: '#6c757d',
                                color: '#fff',
                                cursor: 'pointer',
                                width: 'fit-content'
                            }}
                        >
                            ← Back
                        </button>

                        {/* News Metadata */}
                        <div style={{ marginTop: '1px', marginBottom: '0px' }}>
                            <h3 style={{ marginBottom: '10px', color: '#1a1a2e' }}>Contributor Details</h3>
                            <p><strong>Author:</strong> {news.author}</p>
                            <p><strong>Email:</strong> {news.authorEmail}</p>
                            <p><strong>Category:</strong> {news.category}</p>
                            <p><strong>Contributed On:</strong> {news.publicationDate ? new Date(news.publicationDate).toLocaleString() : 'N/A'}</p>
                        </div>

                        {/* Content */}
                        <div>
                            <h4 style={{ color: '#1a1a2e', marginBottom: '10px' }}>Details for Content</h4>
                            {news.content ? (
                                <div style={{
                                    fontSize: '1.05rem',
                                    color: '#222',
                                    background: '#f9f9f9',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    whiteSpace: 'pre-line',
                                    lineHeight: '1.7'
                                }}>
                                    {news.content}
                                </div>
                            ) : (
                                <p style={{ color: '#888' }}>No content available.</p>
                            )}
                        </div>

                        {/* Additional Photos */}
                        <div style={{ marginTop: '40px' }}>
                            <h4 style={{ color: '#1a1a2e', marginBottom: '15px' }}>Photos:</h4>
                            {additionalPhotos.length > 0 ? (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                    gap: '15px'
                                }}>
                                    {additionalPhotos.map((photo, index) => (
                                        <img
                                            key={index}
                                            src={`data:image/jpeg;base64,${photo}`}
                                            alt={`Gallery ${index}`}
                                            onClick={() => this.setState({ previewPhoto: photo })}
                                            style={{
                                                width: '100%',
                                                height: '160px',
                                                borderRadius: '8px',
                                                objectFit: 'cover',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: '#888' }}>No additional photos available.</p>
                            )}
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
                            backgroundColor: 'rgba(0, 0, 0, 0.85)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                        }}
                    >
                        <img
                            src={`data:image/jpeg;base64,${previewPhoto}`}
                            alt="Preview"
                            style={{
                                maxWidth: '90%',
                                maxHeight: '90%',
                                borderRadius: '10px',
                                boxShadow: '0 0 20px rgba(255,255,255,0.2)'
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
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default ReadContributedNewsDetailsForm;
