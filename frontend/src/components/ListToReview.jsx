import React, { Component } from 'react';
import NewsService from '../services/NewsService';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class ListNewsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            news: []
        };

        this.approveNews = this.approveNews.bind(this);
        this.rejectNews = this.rejectNews.bind(this);
        this.viewNews = this.viewNews.bind(this);
    }

    componentDidMount() {
        this.fetchNews();
    }

    fetchNews = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await NewsService.getPendingNews({
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            this.setState({ news: response.data });
        } catch (error) {
            console.error('Error fetching news data:', error);
        }
    };

    approveNews(id) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return;
        }
    
        // Make the API request to approve the news
        axios.post(`http://localhost:8081/api/v1/news/approve/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            console.log('News approved successfully:', response.data);
            
            // Optionally, update the state to reflect the approval
            // Example: Remove approved news item from the list (if relevant)
            this.setState({
                news: this.state.news.filter(newsItem => newsItem.id !== id)
            });
    
            // Optionally, show a success message to the user
            alert('News has been approved successfully');
        })
        .catch(error => {
            // Handle errors during the approval process
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Error approving news:', error.response.data);
            } else if (error.request) {
                // No response received from the server
                console.error('No response received:', error.request);
            } else {
                // Something else happened
                console.error('Error:', error.message);
            }
    
            // Optionally, show an error message to the user
            alert('There was an error approving the news. Please try again.');
        });
    }
    
    rejectNews(id) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return;
        }
    
        // Make the API call to reject the news
        axios.post(`http://localhost:8081/api/v1/news/reject/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            // Handle successful rejection
            console.log('News rejected successfully:', response.data);
    
            // Optionally, update the state or UI after rejection
            this.setState({
                news: this.state.news.filter(newsItem => newsItem.id !== id)
            });
    
            // Optionally, show an alert or message to inform the user
            alert('News has been rejected successfully');
        })
        .catch(error => {
            // Handle error while rejecting news
            console.error('Error rejecting news:', error.response ? error.response.data : error.message);
    
            // Optionally, display a message or toast to notify the user about the error
            alert('There was an error rejecting the news. Please try again.');
        });
    }
    

    viewNews(id) {
        this.props.history.push(`/view-news/${id}`);
    }

    render() {
        const role = localStorage.getItem('role');
        if (role !== "ADMIN") {
            return <Redirect to="/unauthorized" />;
        }

        return (
            <div>
                <header className="header">
                    <div>WEBTUBE NEWS CONTENT MANAGEMENT</div>
                </header>

                <div className="body">
                    <div className="row">
                        <div className="col-md-12">
                            <button className="bntAction" onClick={() => this.props.history.push('/add-news/_add')}>Add News</button>
                        </div>
                    </div>

                    <div className="row scrollable-div">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.news.map(newsItem => (
                                    <tr key={newsItem.id}>
                                        <td>{newsItem.title}</td>
                                        <td>{newsItem.category}</td>
                                        <td>{newsItem.description}</td>
                                        <td>
                                            <button className="bntAction" onClick={() => this.viewNews(newsItem.id)}>View</button>
                                            <button className="bntAction" onClick={() => this.approveNews(newsItem.id)} style={{ marginLeft: '10px' }}>Approve</button>
                                            <button className="bntAction" onClick={() => this.rejectNews(newsItem.id)} style={{ marginLeft: '10px' }}>Reject</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <footer className="footer">
                    <span>"Stay Connected with WebTube for the Latest Updates from De La Salle Araneta University!"</span><br />
                    <span>All Rights Reserved 2024 @JOHN PAUL PELLOGO</span>
                </footer>
            </div>
        );
    }
}

export default ListNewsComponent;
