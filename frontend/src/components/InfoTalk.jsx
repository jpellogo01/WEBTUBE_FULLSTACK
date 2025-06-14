import React, { Component } from 'react';
import axios from 'axios';
import PublicNewsService from '../services/PublicNewsService';
import Header from './Header';
import ViewNewsPreview from './ViewNewsPreview';

class balitaraneta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newsList: [],
            showFooter: false,
            showHeader: true,
            lastScrollTop: 0,
            showModal: false,
            selectedNews: null,
        };
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        this.fetchNews();
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

   fetchNews() {
    PublicNewsService.getAllPublicNews()
        .then(res => {
            const filteredNews = res.data
                .filter(news => news.category && news.category() === 'InfoTalk')
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            this.setState({ newsList: filteredNews });
        })
        .catch(error => {
            console.error('Error fetching news:', error);
        });
}

    handleScroll() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const bottomThreshold = 50;

        if (scrollTop > this.state.lastScrollTop) {
            this.setState({ showHeader: false });
        } else {
            this.setState({ showHeader: true });
        }
        this.setState({ lastScrollTop: scrollTop <= 0 ? 0 : scrollTop });

        if (documentHeight - (scrollTop + windowHeight) < bottomThreshold) {
            this.setState({ showFooter: true });
        } else {
            this.setState({ showFooter: false });
        }
    }

    formatDate(dateString) {
        const options = {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };

        return new Date(dateString).toLocaleDateString('en-US', options);
    }

   getViewerIp = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) throw new Error('IP fetch failed');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Failed to fetch IP:', error);
        return 'unknown';
    }
};


    openModal = (news) => {
    // Immediately show the modal
    this.setState({ selectedNews: news, showModal: true });

    // Then fetch IP and track view in the background
    this.getViewerIp().then(viewerIp => {
        axios.post(`http://localhost:8081/api/v1/view-news/${news.id}?viewerIp=${viewerIp}`)
            .then(() => {
                console.log('View tracked successfully');
            })
            .catch(err => {
                console.error('Failed to track view:', err);
            });
    });
};

    closeModal = () => {
        this.setState({ showModal: false, selectedNews: null });
    }

    render() {
        const { newsList, showHeader, showModal, selectedNews } = this.state;

        return (
            <div style={{ position: 'relative' }}>
                <Header style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    display: showHeader ? 'block' : 'none'
                }} />

                <div className="container" style={{ marginTop: '10px' }}>
                    <div className="row" style={{
                        maxHeight: 'calc(100vh - 60px)',
                        overflowY: 'auto',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}>
                        {newsList.map(news => (
                            <div key={news.id} className="col-md-4 mb-4">
                                <div
                                    className="card h-100 clickable-card"
                                    onClick={() => this.openModal(news)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {news.embedYouTubeUrl ? (
                                        <div className="embed-responsive embed-responsive-16by9">
                                            <iframe
                                                className="embed-responsive-item"
                                                src={news.embedYouTubeUrl}
                                                title={news.title}
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    ) : news.thumbnailUrl && (
                                        <img
                                            src={`data:image/jpeg;base64,${news.thumbnailUrl}`}
                                            className="card-img-top"
                                            alt="Thumbnail"
                                            style={{ objectFit: 'cover', maxHeight: '300px' }}
                                        />
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title">{news.title}</h5>
                                        <p className="card-text">{news.summary}</p>
                                        <small className="text-muted">{this.formatDate(news.publicationDate)}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {showModal && selectedNews && (
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
                            zIndex: 1000,
                        }}
                        onClick={this.closeModal}
                    >
                        <div
                            style={{
                                backgroundColor: 'white',
                                padding: '20px',
                                borderRadius: '10px',
                                width: '90%',
                                maxWidth: '600px',
                                maxHeight: '80vh',
                                overflowY: 'auto',
                                textAlign: 'center',
                                position: 'relative',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={this.closeModal}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    backgroundColor: 'green',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    lineHeight: '30px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                                }}
                                title="Close"
                            >
                                &times;
                            </button>

                            <ViewNewsPreview news={selectedNews} />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default balitaraneta;
