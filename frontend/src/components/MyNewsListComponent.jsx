import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
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
            loading: true,
            userFullName: "",
            userRole: "",
            searchQuery: "",
        };
    }

    componentDidMount() {
        this.fetchUserInfo();
    }

    fetchUserInfo = () => {
        const userFullName = localStorage.getItem("fullname");
        const userRole = localStorage.getItem("role");
        this.setState(
            { userFullName: userFullName || "", userRole: userRole || "" },
            this.fetchNews
        );
    };

    fetchNews = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8080/api/v1/news", {
                headers: { Authorization: `Bearer ${token}` },
            });

            let allNews = response.data;
            if (this.state.userRole === "AUTHOR") {
                allNews = allNews.filter(n => n.author === this.state.userFullName);
            }

            this.setState({ news: allNews, loading: false });
        } catch (error) {
            console.error("Error fetching news:", error);
            this.setState({ news: [], loading: false });
        }
    };

    searchNews = async () => {
        const { searchQuery, userRole, userFullName } = this.state;

        if (!searchQuery.trim()) {
            this.fetchNews(); // reload all
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8080/api/v1/news/fuzzy-search", {
                headers: { Authorization: `Bearer ${token}` },
                params: { query: searchQuery },
            });

            let results = response.data;

            if (userRole === "AUTHOR") {
                results = results.filter(n => n.author === userFullName);
            }

            this.setState({ news: results });
        } catch (error) {
            console.error("Error during fuzzy search:", error);
        }
    };

    handleSearchChange = (e) => {
        this.setState({ searchQuery: e.target.value });
    };

    deleteNews = async (id) => {
        if (!window.confirm("Are you sure you want to delete this news?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/v1/news/${id}`);
            this.setState({ news: this.state.news.filter(news => news.id !== id) });
        } catch (error) {
            console.error("Error deleting news:", error);
        }
    };

    editNews = (id) => {
        this.props.history.push(`/add-news/${id}`);
    };

    viewNews = (id) => {
        this.props.history.push(`/view-news/${id}`);
    };

    render() {
        const { news, loading, searchQuery } = this.state;

        return (
            <Box sx={{ display: "flex" }}>
                <Sidebar />
                <Box sx={{ flex: 1 }}>
                    <HeaderComponent />
                    <Box sx={{ p: 3, mt: 5 }}>
                        {/* Compact search bar */}
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
                            <input
                                type="text"
                                placeholder="Search news..."
                                value={searchQuery}
                                onChange={this.handleSearchChange}
                                style={{
                                    padding: "6px 10px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    width: "200px",
                                    marginTop: "20px",
                                }}
                            />
                            <Button
                                variant="contained"
                                size="small"
                                onClick={this.searchNews}
                                sx={{ textTransform: "none" }}
                            >
                                Search
                            </Button>
                        </Box>

                        {loading ? (
                            <Typography align="center">Loading...</Typography>
                        ) : news.length === 0 ? (
                            <Typography align="center">No News Found</Typography>
                        ) : (
                            news.map(news => (
                                <Box
                                    key={news.id}
                                    sx={{
                                        border: "1px solid #ddd",
                                        borderRadius: "6px",
                                        mb: 2,
                                        p: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box sx={{ maxWidth: "70%" }}>
                                        <Typography variant="h6">{news.title}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {news.description}
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            By: {news.author} | Status: {news.status}
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            Date: {new Date(news.publicationDate).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <IconButton onClick={() => this.editNews(news.id)} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => this.deleteNews(news.id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton onClick={() => this.viewNews(news.id)} color="info">
                                            <ViewIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))
                        )}
                    </Box>
                </Box>
            </Box>
        );
    }
}

export default ListNewsComponent;
