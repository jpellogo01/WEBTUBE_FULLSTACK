import React, { Component } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import PublicNewsService from '../services/PublicNewsService';

class ViewNewsDetailsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            news: {},
            summary: '',
            showModal: false,
            loading: false,
            comments: [],
            newComment: '',
            fullName: ''
        };
    }

    componentDidMount() {
        const visitorId = localStorage.getItem('visitorId');
        if (!visitorId) {
            const newVisitorId = crypto.randomUUID(); // Or use any UUID generator
            localStorage.setItem('visitorId', newVisitorId);
        }
        PublicNewsService.getPublicNewsById(this.state.id).then(res => {
            this.setState({ news: res.data });
        });
        this.fetchComments();
    }

    fetchComments = () => {
        axios.get(`http://localhost:8081/api/v1/news/approved/comments/${this.state.id}`)
            .then(response => this.setState({ comments: response.data }))
            .catch(error => console.error('Error fetching comments:', error));
    };

    handleCommentChange = (e) => {
        this.setState({ newComment: e.target.value });
    };

    handleFullNameChange = (e) => {
        this.setState({ fullName: e.target.value });
    };

    submitComment = () => {
        const { newComment, fullName, id } = this.state;
        const visitorId = localStorage.getItem('visitorId');
        if (!newComment.trim() || !fullName.trim()) return;

        const commentData = {
            fullName,
            content: newComment
            // No need to include visitorId here anymore
        };

        axios.post(`http://localhost:8081/api/v1/comment-news/${id}`, commentData, {
            headers: {
                'Visitor-Id': visitorId,
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                this.setState({ newComment: '', fullName: '' });
                this.fetchComments();
            })
            .catch(error => console.error('Error posting comment:', error));
    };


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

    back() {
        this.props.history.goBack();
    }

    handleSummarize = () => {
        this.setState({ loading: true });

        axios.post(`http://localhost:8081/hitOpenaiApi/${this.state.id}`)
            .then((response) => {
                this.setState({ summary: response.data, showModal: true, loading: false });
            })
            .catch((error) => {
                console.error("Error fetching the OpenAI response:", error);
                this.setState({ loading: false });
            });
    }
    deleteComment = (commentId) => {
        const visitorId = localStorage.getItem('visitorId');

        axios.delete(`http://localhost:8081/api/v1/user-delete-comment/${commentId}`, {
            headers: {
                'Visitor-Id': visitorId
            }
        })
            .then(() => {
                this.fetchComments(); // refresh comment list after delete
            })
            .catch(error => console.error('Error deleting comment:', error));
    };



    closeModal = () => {
        this.setState({ showModal: false });
    };

    render() {
        const { news, summary, showModal, loading, comments, newComment, fullName } = this.state;

        const sliderSettings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
        };

        return (
            <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', lineHeight: '1.6' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '30px auto' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <button className="btn btn-secondary" onClick={() => this.back()}>
                            ← Back
                        </button>
                    </div>

                    <div className="card shadow-lg" style={{ borderRadius: '15px' }}>
                        {news.embedYouTubeUrl ? (
                            <div className="ratio ratio-16x9">
                                <iframe
                                    src={news.embedYouTubeUrl}
                                    title="Embedded Content"
                                    allowFullScreen
                                    style={{ borderRadius: '10px', border: 'none', height: '300px', width: '100%' }}
                                ></iframe>
                            </div>
                        ) : news.thumbnailUrl && (
                            <div
                                style={{
                                    height: '300px',
                                    backgroundImage: `url(data:image/jpeg;base64,${news.thumbnailUrl})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            ></div>
                        )}

                        <div className="card-body" style={{ padding: '20px' }}>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>
                                <span>{this.formatDate(news.createdAt)}</span> |{' '}
                                <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{news.category}</span>
                            </div>

                            <h2 style={{ marginTop: '10px', color: '#1a1a2e' }}>{news.title}</h2>
                            <p style={{ fontStyle: 'italic', color: '#555' }}>By {news.author}</p>

                            {news.description && (
                                <p style={{ fontWeight: 'bold', color: '#444' }}>{news.description}</p>
                            )}

                            <button
                                className="btn btn-info"
                                onClick={this.handleSummarize}
                                style={{ display: 'block', margin: '20px auto' }}
                            >
                                Summarize this News
                            </button>

                            {loading && (
                                <div style={{ textAlign: 'center', color: '#17a2b8' }}>Summarizing... Please wait.</div>
                            )}

                            {news.content && (
                                <div style={{ fontSize: '1.1rem', marginTop: '20px', whiteSpace: 'pre-line' }}>
                                    {news.content}
                                </div>
                            )}

                            {news.additionalPhotos && news.additionalPhotos.length > 0 && (
                                <div style={{ marginTop: '30px' }}>
                                    <h4>Gallery</h4>
                                    <Slider {...sliderSettings}>
                                        {news.additionalPhotos.map((photo, index) => (
                                            <div key={index}>
                                                <img
                                                    src={`data:image/jpeg;base64,${photo}`}
                                                    alt={`Gallery ${index}`}
                                                    style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '10px' }}
                                                />
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            )}

                            {/* Comment Section */}
                            <div style={{ marginTop: '40px' }}>
                                <h4 style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Comments</h4>

                                {/* New Comment Input */}
                                <div style={{ marginBottom: '10px' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={fullName}
                                        onChange={this.handleFullNameChange}
                                        placeholder="Full name"
                                        style={{ marginBottom: '10px' }}
                                    />
                                    <textarea
                                        className="form-control"
                                        value={newComment}
                                        onChange={this.handleCommentChange}
                                        placeholder="Write a comment..."
                                        rows="2"
                                    ></textarea>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={this.submitComment}
                                        disabled={!newComment.trim() || !fullName.trim()}
                                    >
                                        Post
                                    </button>
                                </div>

                                {/* Display Comments */}
                                <div style={{ marginTop: '20px' }}>
                                    {comments.length > 0 ? (
                                        comments.map((comment, idx) => (
                                            <div key={idx} style={{ display: 'flex', marginBottom: '15px' }}>
                                                <img
                                                    src="https://www.gravatar.com/avatar?d=mp"
                                                    alt="Avatar"
                                                    style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: 'bold' }}>{comment.fullName || 'Guest'}</div>
                                                    <div style={{ background: '#f1f1f1', borderRadius: '10px', padding: '10px' }}>
                                                        {comment.content}
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                                        {this.formatDate(comment.createdAt)}
                                                    </div>

                                                    {localStorage.getItem('visitorId') === comment.visitorId && (
                                                        <button
                                                            onClick={() => this.deleteComment(comment.id)}
                                                            className="btn btn-sm btn-danger"
                                                            style={{ marginTop: '5px' }}
                                                        >
                                                            Delete
                                                        </button>
                                                    )}

                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No comments yet. Be the first to comment!</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Modal */}
                {showModal && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: 'white',
                                padding: '20px',
                                borderRadius: '10px',
                                width: '80%',
                                maxWidth: '600px',
                                textAlign: 'center'
                            }}
                        >
                            <h3>Summarized Content</h3>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{summary}</p>
                            <button
                                onClick={this.closeModal}
                                style={{
                                    backgroundColor: '#007BFF',
                                    border: 'none',
                                    padding: '10px 20px',
                                    marginTop: '20px',
                                    cursor: 'pointer',
                                    color: 'white',
                                    fontWeight: 'bold'
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

export default ViewNewsDetailsForm;
