import React from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Typography,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
} from "@mui/icons-material";
import HeaderComponent from "./HeaderComponent";
import Sidebar from "./Sidebar";
import axios from "axios";

class ListNewsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            news: [],
            filteredNews: [], // Store the filtered news
            loading: true,
            userFullName: "", // Store the full name of the logged-in user
            userRole: "", // Store the role of the logged-in user
            searchQuery: "", // Search query for filtering
            searchDate: "", // Search date for filtering
        };

        this.addNews = this.addNews.bind(this);
        this.editNews = this.editNews.bind(this);
        this.deleteNews = this.deleteNews.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    // Fetch news data and user info on component mount
    componentDidMount() {
        this.fetchUserInfo();
    }

    fetchUserInfo = () => {
        const userFullName = localStorage.getItem("fullname");
        const userRole = localStorage.getItem("role");
        this.setState({ userFullName: userFullName || "", userRole: userRole || "" }, this.fetchNews);
    };

    fetchNews = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8081/api/v1/news", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Filter news items if the user is an AUTHOR
            const filteredNews = response.data.filter((newsItem) => {
                if (this.state.userRole === "AUTHOR") {
                    return newsItem.author === this.state.userFullName;
                }
                return true;
            });

            this.setState({ news: filteredNews, filteredNews, loading: false }); // Initialize both news and filteredNews
        } catch (error) {
            console.error("Error fetching news data:", error);
            this.setState({ news: [], filteredNews: [], loading: false });
        }
    };

    // Filter news based on search query and date
    filterNews = () => {
        const { news, searchQuery, searchDate, userRole, userFullName } = this.state;

        const filteredNews = news.filter((newsItem) => {
            const matchesSearchQuery =
                newsItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                newsItem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                newsItem.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                newsItem.status.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesDate = searchDate
                ? new Date(newsItem.publicationDate).toLocaleDateString() ===
                new Date(searchDate).toLocaleDateString()
                : true;

            if (userRole === "AUTHOR") {
                return matchesSearchQuery && matchesDate && newsItem.author === userFullName;
            }

            return matchesSearchQuery && matchesDate;
        });

        this.setState({ filteredNews });
    };

    // Handle search query change
    handleSearchChange(event) {
        this.setState({ searchQuery: event.target.value }, this.filterNews);
    }

    // Handle date change for search
    handleDateChange(event) {
        this.setState({ searchDate: event.target.value }, this.filterNews);
    }

    // Navigate to add news page
    addNews() {
        this.props.history.push("/add-news/_add");
    }

    // Navigate to edit news page
    editNews(id) {
        this.props.history.push(`/add-news/${id}`);
    }

    // Navigate to view news page
    viewNews(id) {
        this.props.history.push(`/view-news/${id}`);
    }

    // Delete news method
    deleteNews(id) {
        axios.delete(`http://localhost:8081/api/v1/news/${id}`).then((res) => {
            this.setState(
                { news: this.state.news.filter((news) => news.id !== id) },
                this.filterNews
            );
        });
    }

    render() {
        return (
            <Box sx={{ display: "flex" }}>
                <Sidebar />
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <HeaderComponent />
                    <Box sx={{ padding: "20px" }}>
                        <Box sx={{ padding: "20px", marginTop: "40px" }}>
                            <input
                                type="text"
                                placeholder="Search by Title, Description, Author"
                                value={this.state.searchQuery}
                                onChange={this.handleSearchChange}
                                className="searchInput"
                                style={{ marginBottom: "10px", width: "300px" }}
                            />
                            <input
                                type="date"
                                value={this.state.searchDate}
                                onChange={this.handleDateChange}
                                className="dateInput"
                                style={{ marginLeft: "10px", marginBottom: "10px" }}
                            />
                        </Box>
                        <Grid container spacing={3}>
                            {this.state.loading ? (
                                <Typography
                                    variant="h6"
                                    align="center"
                                    sx={{ width: "100%" }}
                                >
                                    Loading...
                                </Typography>
                            ) : this.state.filteredNews.length > 0 ? (
                                this.state.filteredNews.map((news) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={news.id}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" component="div">
                                                    {news.title}
                                                </Typography>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        width: "300px", // Set a fixed width
                                                        height: "300px", // Set a fixed height
                                                        overflow: "hidden", // Hide overflow for consistent sizing
                                                    }}
                                                >
                                                    <img
                                                        src={`data:image/jpeg;base64,${news.thumbnailUrl}`}
                                                        alt={news.title}
                                                        style={{
                                                            objectFit: "cover", // Ensures the image fills the container while maintaining aspect ratio
                                                            width: "100%", // Scale to container width
                                                            height: "100%", // Scale to container height
                                                        }}
                                                    />
                                                </div>

                                                <Typography variant="subtitle2">
                                                    Status: {news.status}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => this.editNews(news.id)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => {
                                                        if (
                                                            window.confirm(
                                                                "Are you sure you want to delete this news?"
                                                            )
                                                        ) {
                                                            this.deleteNews(news.id);
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="info"
                                                    onClick={() => this.viewNews(news.id)}
                                                >
                                                    <ViewIcon />
                                                </IconButton>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Typography
                                    variant="h6"
                                    align="center"
                                    sx={{ width: "100%" }}
                                >
                                    No News Available
                                </Typography>
                            )}
                        </Grid>
                    </Box>
                </Box>
            </Box>
        );
    }
}

export default ListNewsComponent;
