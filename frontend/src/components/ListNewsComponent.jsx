import React from "react";
import { Box } from "@mui/material";
import HeaderComponent from "./HeaderComponent";
import Sidebar from "./Sidebar";
import axios from "axios";

class ListNewsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            news: [],
            loading: true,
            userFullName: "",  // Store the full name of the logged-in user
            userRole: "",      // Store the role of the logged-in user
            searchQuery: "",   // Store search query for title, description, etc.
            searchDate: "",    // Store selected date range
        };

        this.addNews = this.addNews.bind(this);
        this.editNews = this.editNews.bind(this);
        this.deleteNews = this.deleteNews.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    // Fetch news data and user info on component mount
    componentDidMount() {
        this.fetchNews();
        this.fetchUserInfo();  // Fetch user info
    }

    fetchUserInfo = () => {
        const userFullName = localStorage.getItem("fullname");
        const userRole = localStorage.getItem("role");
        this.setState({ userFullName: userFullName || "", userRole: userRole || "" });
    };

    // fetchNews = async () => {
    //     try {
    //         const token = localStorage.getItem("token");
    //         const response = await axios.get("http://localhost:8081/api/v1/news", {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         const filteredNews = this.filterNews(response.data).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Filter news based on search criteria
    //         this.setState({ news: filteredNews, loading: false });
    //     } catch (error) {
    //         console.error("Error fetching news data:", error);
    //         this.setState({ news: [], loading: false });
    //     }
    // };

    fetchNews = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8081/api/v1/news", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Filter for both Pending and Approved status
        const filteredNews = response.data
            .filter(news => news.status === "Pending" || news.status === "Approved")
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        this.setState({ news: filteredNews, filteredNews, loading: false });
    } catch (error) {
        console.error("Error fetching news data:", error);
        this.setState({ news: [], filteredNews: [], loading: false });
    }
};


    // Filter news based on search query and date
    filterNews = (newsData) => {
        const { searchQuery, searchDate, userRole, userFullName } = this.state;

        return newsData.filter((newsItem) => {
            const matchesSearchQuery =
                newsItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                newsItem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                newsItem.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                newsItem.status.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesDate =
                searchDate ? new Date(newsItem.publicationDate).toLocaleDateString() === new Date(searchDate).toLocaleDateString() : true;

            if (userRole === "AUTHOR") {
                return matchesSearchQuery && matchesDate && newsItem.author === userFullName;
            }

            return matchesSearchQuery && matchesDate;
        });
    };

    // Handle search query change
    handleSearchChange(event) {
        const searchQuery = event.target.value;
        this.setState({ searchQuery }, () => {
            this.fetchNews(); // Re-fetch news based on new search query
        });
    }

    // Handle date change for search
    handleDateChange(event) {
        const searchDate = event.target.value;
        this.setState({ searchDate }, () => {
            this.fetchNews(); // Re-fetch news based on new date
        });
    }

    addNews() {
        this.props.history.push("/add-news/_add");
    }

    editNews(id) {
        this.props.history.push(`/add-news/${id}`);
    }

    viewNews(id) {
        this.props.history.push(`/read-news/${id}`);
    }

    deleteNews(id) {
        axios.delete(`http://localhost:8081/api/v1/news/${id}`).then(() => {
            this.setState({ news: this.state.news.filter((news) => news.id !== id) });
        });
    }

    logout = () => {
        localStorage.clear();
        this.props.history.push("/login");
    };

    render() {
        return (
            <Box sx={{ display: "flex" }}>
                <Sidebar />
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <HeaderComponent />
                    <Box sx={{ padding: "20px", marginTop: "50px" }}>
                        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                            <input
                                type="text"
                                placeholder="Search by Title, Description, Author, Status"
                                value={this.state.searchQuery}
                                onChange={this.handleSearchChange}
                                className="searchInput"
                                style={{ marginRight: "10px" }} // To give some space between input fields
                            />
                            <input
                                type="date"
                                value={this.state.searchDate}
                                onChange={this.handleDateChange}
                                className="dateInput"
                                style={{ marginRight: "10px" }} // To give some space between input fields
                            />
                            <button className="bntAction" onClick={this.addNews}>
                                Add News
                            </button>
                        </Box>
                        <div className="row scrollable-div">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Author</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.loading ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: "center" }}>
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : this.state.news.length > 0 ? (
                                        this.state.news.map((news) => (
                                            <tr key={news.id}>
                                                <td style={{ wordWrap: "break-word", maxWidth: "200px" }}>
                                                    {news.title}
                                                    <br />
                                                    <span style={{ fontSize: "12px", textTransform: "lowercase", color: "gray" }}>
                                                        {new Date(news.publicationDate).toLocaleString("en-US", {
                                                            month: "numeric",
                                                            day: "numeric",
                                                            year: "2-digit",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        })}
                                                    </span>
                                                </td>
                                                <td style={{ wordWrap: "break-word", maxWidth: "300px" }}>
                                                    {news.description}
                                                </td>
                                                <td>{news.author}</td>
                                                <td>{news.status}</td>
                                                <td>
                                                    <button onClick={() => this.editNews(news.id)} className="bntAction">
                                                        Update
                                                    </button>
                                                    <button
                                                        style={{ marginLeft: "10px" }}
                                                        onClick={() => {
                                                            if (window.confirm("Are you sure you want to delete this news?")) {
                                                                this.deleteNews(news.id);
                                                            }
                                                        }}
                                                        className="bntAction"
                                                    >
                                                        Delete
                                                    </button>

                                                    <button
                                                        style={{ marginLeft: "10px" }}
                                                        onClick={() => this.viewNews(news.id)}
                                                        className="bntAction"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: "center" }}>
                                                No News Available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Box>
                </Box>
            </Box>

        );
    }
}

export default ListNewsComponent;
