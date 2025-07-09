import React, { Component } from 'react';
import axios from 'axios';
import PublicNewsService from '../services/PublicNewsService';
import Header from './Header';
import ViewNewsPreview from './ViewNewsPreview';

class NewHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newsList: [],
            filteredNews: [],
            searchQuery: '',
            searchMonth: '',
            searchYear: '',
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
                const sortedNewsList = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                this.setState({ newsList: sortedNewsList, filteredNews: sortedNewsList });
            })
            .catch(error => {
                console.error('Error fetching news:', error);
            });
    }

    handleSearchInputChange = (e) => {
        this.setState({ searchQuery: e.target.value });
    };

    handleMonthChange = (e) => {
        this.setState({ searchMonth: e.target.value });
    }

    handleYearChange = (e) => {
        this.setState({ searchYear: e.target.value });
    }

    handleSearchSubmit = (e) => {
        e.preventDefault();
        const { searchQuery, searchMonth, searchYear, newsList } = this.state;

        // If all are empty, reset
        if (!searchQuery.trim() && !searchMonth && !searchYear) {
            this.setState({ filteredNews: newsList });
            return;
        }

        // If only month and year are provided
        if (!searchQuery.trim() && searchMonth && searchYear) {
            axios.get(`http://localhost:8080/api/v1/news/search-by-month?month=${searchMonth}&year=${searchYear}`)
                .then(res => {
                    const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    this.setState({ filteredNews: sorted });
                })
                .catch(err => {
                    console.error("Search error:", err);
                    this.setState({ filteredNews: [] });
                });
            return;
        }

        // If only searchQuery is provided
        if (searchQuery.trim() && !searchMonth && !searchYear) {
            axios.get(`http://localhost:8080/api/v1/news/fuzzy-search?query=${encodeURIComponent(searchQuery)}`)
                .then(res => {
                    const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    this.setState({ filteredNews: sorted });
                })
                .catch(err => {
                    console.error("Search error:", err);
                    this.setState({ filteredNews: [] });
                });
            return;
        }

        // ✅ Combined: searchQuery + month/year
        axios.get(`http://localhost:8080/api/v1/news/fuzzy-search?query=${encodeURIComponent(searchQuery)}`)
            .then(res => {
                const filtered = res.data.filter(news => {
                    const date = new Date(news.publicationDate);
                    return (
                        (!searchMonth || date.getMonth() + 1 === parseInt(searchMonth)) &&
                        (!searchYear || date.getFullYear() === parseInt(searchYear))
                    );
                });
                const sorted = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                this.setState({ filteredNews: sorted });
            })
            .catch(err => {
                console.error("Combined search error:", err);
                this.setState({ filteredNews: [] });
            });
    };

    handleScroll() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const bottomThreshold = 50;

        this.setState({
            showHeader: scrollTop <= this.state.lastScrollTop,
            lastScrollTop: scrollTop <= 0 ? 0 : scrollTop,
            showFooter: documentHeight - (scrollTop + windowHeight) < bottomThreshold
        });
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true,
        });
    }

    getViewerIp = async () => {
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            return data.ip;
        } catch {
            return 'unknown';
        }
    };

    openModal = (news) => {
        this.setState({ selectedNews: news, showModal: true });
        this.getViewerIp().then(ip => {
            axios.post(`http://localhost:8080/api/v1/view-news/${news.id}?viewerIp=${ip}`).catch(console.error);
        });
    };

    closeModal = () => this.setState({ showModal: false, selectedNews: null });

    render() {
        const { showHeader, showModal, selectedNews, filteredNews, searchQuery } = this.state;

        return (
            <div style={{ position: 'relative' }}>
                <Header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, display: showHeader ? 'block' : 'none' }} />
                <div className="container" style={{ marginTop: '110px' }}>
                    <form className="mb-4 d-flex justify-content-center" onSubmit={this.handleSearchSubmit}>
                        <div style={{ display: 'flex', gap: '10px', maxWidth: '600px', width: '100%' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search..."
                                style={{ borderRadius: '0.375rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                                value={this.state.searchQuery}
                                onChange={this.handleSearchInputChange}
                            />
                            <select className="form-control" onChange={this.handleMonthChange}>
                                <option value="">Month</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en', { month: 'long' })}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Year"
                                onChange={this.handleYearChange}
                                min="2000"
                                max={new Date().getFullYear()}
                            />
                            <button type="submit" className="btn btn-success">Search</button>
                        </div>
                    </form>

                    <div className="row">
                        {filteredNews.length === 0 && (
                            <div className="col-12 text-center text-muted">
                                No news found for "{searchQuery}"
                            </div>
                        )}

                        {filteredNews.map(news => (
                            <div key={news.id} className="col-md-4 mb-4">
                                <div className="card h-100 clickable-card" onClick={() => this.openModal(news)} style={{ cursor: 'pointer' }}>
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
                                        <img src={`data:image/jpeg;base64,${news.thumbnailUrl}`} className="card-img-top" alt="Thumbnail" style={{ objectFit: 'cover', maxHeight: '300px' }} />
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
                            zIndex: 1050,
                            padding: '20px', // space for mobile view
                        }}
                        onClick={this.closeModal}
                    >
                        <div
                            className="card shadow"
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: '16px',
                                width: '100%',
                                maxWidth: '600px',
                                maxHeight: '85vh',
                                overflowY: 'auto',
                                padding: '30px 20px 20px 20px',
                                position: 'relative',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={this.closeModal}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: '#28a745', // Bootstrap green
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
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                                }}
                                title="Close"
                            >
                                &times;
                            </button>

                            {/* Centered news preview */}
                            <div style={{ width: '100%' }}>
                                <ViewNewsPreview news={selectedNews} />
                            </div>
                        </div>
                    </div>
                )}

            </div>
        );
    }
}

export default NewHomePage;
