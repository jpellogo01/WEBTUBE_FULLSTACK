import React, { Component } from 'react';
import NewsService from '../services/NewsService';
import { Box, FormHelperText } from '@mui/material';
import Sidebar from './Sidebar';
import HeaderComponent from './HeaderComponent';

class AddNewsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,
            title: '',
            thumbnailUrl: null,
            description: '',
            content: '',
            category: '',
            categories: ['AniModel', 'Animo In-Demand', 'InfoTalk', 'Animo-Idol','Galing Araneta', 'Lasallian Tambayan','Balitaraneta', 'Proud Lasallian', 'Testimonial'],
            author: '',
            embedYoutubeUrl: '',
            additionalPhotos: [],

            // Validation errors
            errors: {
                category: '',
                description: ''
            }
        };

        // Bind event handlers
        this.changeTitleHandler = this.changeTitleHandler.bind(this);
        this.changeThumbnailUrlHandler = this.changeThumbnailUrlHandler.bind(this);
        this.changeDescriptionHandler = this.changeDescriptionHandler.bind(this);
        this.changeContentHandler = this.changeContentHandler.bind(this);
        this.changeCategoryHandler = this.changeCategoryHandler.bind(this);
        this.changeEmbedYoutubeUrlHandler = this.changeEmbedYoutubeUrlHandler.bind(this);
        this.changeAdditionalPhotosHandler = this.changeAdditionalPhotosHandler.bind(this);
        this.removePhotoHandler = this.removePhotoHandler.bind(this);
        this.saveOrUpdateNews = this.saveOrUpdateNews.bind(this);
    }

    componentDidMount() {
        const { id } = this.state;
        const author = localStorage.getItem('fullname');

        if (id !== '_add') {
            NewsService.getNewsById(id).then(res => {
                let news = res.data;
                this.setState({
                    title: news.title,
                    thumbnailUrl: news.thumbnailUrl,
                    description: news.description,
                    content: news.content,
                    category: news.category,
                    author,
                    embedYoutubeUrl: news.embedYouTubeUrl,
                    additionalPhotos: news.additionalPhotos || []
                });
            });
        } else {
            this.setState({ author });
        }
    }

    validate() {
        const errors = { category: '', description: '' };
        let valid = true;

        if (!this.state.category) {
            errors.category = 'Category is required.';
            valid = false;
        }
        if (this.state.description.length > 255) {
            errors.description = `Description must be 255 characters or less (currently ${this.state.description.length}).`;
            valid = false;
        }

        this.setState({ errors });
        return valid;
    }

    saveOrUpdateNews(e) {
        e.preventDefault();
        if (!this.validate()) return;

        const { id, title, thumbnailUrl, description, content, category, author, embedYoutubeUrl, additionalPhotos } = this.state;
        const formData = new FormData();
        formData.append('title', title);
        formData.append('thumbnailUrl', thumbnailUrl);
        formData.append('description', description);
        formData.append('content', content);
        formData.append('category', category);
        formData.append('author', author);
        formData.append('embedYoutubeUrl', embedYoutubeUrl);
        additionalPhotos.forEach(photo => formData.append('additionalPhotos', photo));

        if (id === '_add') {
            NewsService.createNews(formData)
                .then(res => {
                    const role = localStorage.getItem('role');
                    this.props.history.push(role === 'AUTHOR' ? '/my-news' : '/news-management');
                })
                .catch(error => console.error('Error:', error));
        } else {
            formData.delete('author');
            NewsService.updateNews(formData, id)
                .then(res => {
                    const role = localStorage.getItem('role');
                    this.props.history.push(role === 'AUTHOR' ? '/my-news' : '/news-management');
                })
                .catch(error => console.error('Error:', error));
        }
    }

    changeTitleHandler(event) { this.setState({ title: event.target.value }); }
    changeThumbnailUrlHandler(event) { this.setState({ thumbnailUrl: event.target.files[0] }); }
    changeDescriptionHandler(event) { this.setState({ description: event.target.value }); }
    changeContentHandler(event) { this.setState({ content: event.target.value }); }
    changeCategoryHandler(event) { this.setState({ category: event.target.value }); }
    changeEmbedYoutubeUrlHandler(event) { this.setState({ embedYoutubeUrl: event.target.value }); }
    changeAdditionalPhotosHandler(event) { this.setState({ additionalPhotos: Array.from(event.target.files) }); }
    removePhotoHandler(index) {
        const photos = [...this.state.additionalPhotos];
        photos.splice(index, 1);
        this.setState({ additionalPhotos: photos });
    }

    render() {
        const {
            title, description, content,
            category, categories,
            embedYoutubeUrl, additionalPhotos,
            errors
        } = this.state;

        return (
            <Box sx={{ display: 'flex' }}>
                <Sidebar />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <HeaderComponent />
                    <Box sx={{ padding: "20px", marginTop: 0 }}>
                        <div className="container mt-5 py-4">
                            <div className="row justify-content-center">
                                <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                                    <div className="card shadow" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                                        <div
                                            className="card-header text-white text-center"
                                            style={{
                                                backgroundColor: '#004d00',
                                                padding: '15px',
                                                fontSize: '1.5rem',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {this.state.id === '_add' ? 'Create Post' : 'Edit Post'}
                                        </div>
                                        <div className="card-body" style={{ backgroundColor: '#f7f9f8' }}>
                                            <form>
                                                <div className="row g-4">
                                                    {/* Title */}
                                                    <div className="col-12">
                                                        <label className="form-label fw-bold" style={{ color: '#004d00', fontSize: '1.2rem' }}>
                                                            Title:
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="title"
                                                            className="form-control shadow-sm"
                                                            style={{ border: '2px solid #004d00', borderRadius: '10px' }}
                                                            value={title}
                                                            onChange={this.changeTitleHandler}
                                                        />
                                                    </div>

                                                    {/* Thumbnail */}
                                                    <div className="col-12 col-md-6">
                                                        <label className="form-label fw-bold" style={{ color: '#004d00', fontSize: '1.2rem' }}>
                                                            Thumbnail:
                                                        </label>
                                                        <input
                                                            type="file"
                                                            name="thumbnail"
                                                            className="form-control shadow-sm"
                                                            style={{ height: '38px', borderRadius: '10px' }}
                                                            onChange={this.changeThumbnailUrlHandler}
                                                        />
                                                    </div>

                                                    {/* Embed URL */}
                                                    <div className="col-12">
                                                        <br />
                                                        <label className="form-label fw-bold" style={{ color: '#004d00', fontSize: '1.2rem' }}>
                                                            Embed URL:
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="embedYoutubeUrl"
                                                            className="form-control shadow-sm"
                                                            style={{ border: '2px solid #004d00', borderRadius: '10px' }}
                                                            value={embedYoutubeUrl}
                                                            onChange={this.changeEmbedYoutubeUrlHandler}
                                                        />
                                                    </div>

                                                    {/* Category */}
                                                    <div className="col-12 col-md-6">
                                                        <br></br>
                                                        <label className="form-label fw-bold" style={{ color: '#004d00', fontSize: '1.2rem' }}>
                                                            Category:
                                                        </label>
                                                        <select
                                                            className="form-select shadow-sm"
                                                            style={{ height: '38px', border: '2px solid #004d00', borderRadius: '10px' }}
                                                            value={category}
                                                            onChange={this.changeCategoryHandler}
                                                        >
                                                            <option value="">Select Category</option>
                                                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                        </select>
                                                        {errors.category && <FormHelperText error>{errors.category}</FormHelperText>}
                                                    </div>

                                                    {/* Description */}
                                                    <div className="col-12">
                                                        <label className="form-label fw-bold" style={{ color: '#004d00', fontSize: '1.2rem' }}>
                                                            Description:
                                                        </label>
                                                        <textarea
                                                            name="description"
                                                            className="form-control shadow-sm"
                                                            style={{ border: '2px solid #004d00', borderRadius: '10px' }}
                                                            value={description}
                                                            onChange={this.changeDescriptionHandler}
                                                            rows={3}
                                                        />
                                                        {errors.description && <FormHelperText error>{errors.description}</FormHelperText>}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="col-12">
                                                        <label className="form-label fw-bold" style={{ color: '#004d00', fontSize: '1.2rem' }}>
                                                            Content:
                                                        </label>
                                                        <textarea
                                                            name="content"
                                                            className="form-control shadow-sm"
                                                            style={{ border: '2px solid #004d00', borderRadius: '10px' }}
                                                            value={content}
                                                            onChange={this.changeContentHandler}
                                                            rows={5}
                                                        />
                                                    </div>

                                                    {/* Additional Photos */}
                                                    <div className="col-12">
                                                        <br />
                                                        <label className="form-label fw-bold" style={{ color: '#004d00', fontSize: '1.2rem' }}>
                                                            Additional Photos:
                                                        </label>
                                                        <input
                                                            type="file"
                                                            id="fileInput"
                                                            multiple
                                                            name="additionalPhotos"
                                                            className="d-none"
                                                            onChange={this.changeAdditionalPhotosHandler}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-success"
                                                            style={{
                                                                borderRadius: '10px',
                                                                fontWeight: 'bold',
                                                                padding: '10px 20px',
                                                                backgroundColor: '#004d00',
                                                                color: '#fff'
                                                            }}
                                                            onClick={() => document.getElementById('fileInput').click()}
                                                        >
                                                            Choose Files
                                                        </button>
                                                        <div className="mt-3">
                                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                                                                {additionalPhotos.map((photo, index) => (
                                                                    <div key={index} style={{ position: 'relative' }}>
                                                                        <img
                                                                            src={`data:image/jpeg;base64,${photo}`}
                                                                            alt=""
                                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => this.removePhotoHandler(index)}
                                                                            style={{
                                                                                position: 'absolute',
                                                                                top: '5px',
                                                                                right: '5px',
                                                                                background: 'rgba(0, 0, 0, 0.6)',
                                                                                color: 'white',
                                                                                border: 'none',
                                                                                borderRadius: '50%',
                                                                                padding: '5px',
                                                                                cursor: 'pointer'
                                                                            }}
                                                                        >
                                                                            X
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Save & Cancel */}
                                                    <div className="col-12">
                                                        <div className="d-flex justify-content-between" style={{ padding: '5px' }}>
                                                            <button
                                                                type="submit"
                                                                className="btn btn-dark btn-lg shadow-sm"
                                                                onClick={this.saveOrUpdateNews}
                                                                style={{ backgroundColor: '#004d00', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', width: '48%' }}
                                                            >
                                                                Save News
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-lg"
                                                                style={{ width: '48%' }}
                                                                onClick={() => {
                                                                    const role = localStorage.getItem('role');
                                                                    this.props.history.push(role === 'AUTHOR' ? '/my-news' : '/news-management');
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Box>
            </Box>
        );
    }
}

export default AddNewsComponent;
