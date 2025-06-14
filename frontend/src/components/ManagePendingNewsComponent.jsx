import React from "react";
import { Box } from "@mui/material";
import HeaderComponent from "./HeaderComponent";
import Sidebar from "./Sidebar";
import axios from "axios";
import { Redirect } from "react-router-dom";
import AdminApprovalService from "../services/AdminApprovalService";

class PendingNewsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      news: [],
      loading: true,
      searchQuery: "",
      searchDate: "",
      publicationDates: {}, // Store the publication dates per news item
      filteredNews: [] // Store the filtered news
    };

    this.approveNews = this.approveNews.bind(this);
    this.rejectNews = this.rejectNews.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  // Fetch news data from the server on component mount
  componentDidMount() {
    this.fetchNews();
  }

 fetchNews = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:8081/api/v1/pending/news", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Filter and sort news with pending status and non-null author (latest on top)
    const pendingNews = response.data
      .filter(news => news.status === "Pending" && news.author !== null)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    this.setState({ news: pendingNews, filteredNews: pendingNews, loading: false });
  } catch (error) {
    console.error("Error fetching news data:", error);
    this.setState({ news: [], filteredNews: [], loading: false });
  }
};



  handleSearchChange(event) {
    const query = event.target.value;
    this.setState({ searchQuery: query }, this.filterNews);
  }

  handleDateChange(event) {
    const date = event.target.value;
    this.setState({ searchDate: date }, this.filterNews);
  }

  filterNews() {
    const { searchQuery, searchDate, news } = this.state;
    let filteredNews = news;

    // Filter based on search query
    if (searchQuery) {
      filteredNews = filteredNews.filter((newsItem) =>
        newsItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        newsItem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        newsItem.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter based on date
    if (searchDate) {
      filteredNews = filteredNews.filter((newsItem) => {
        const newsDate = new Date(newsItem.createdAt).toISOString().split("T")[0]; // Assuming `createdAt` is in ISO format
        return newsDate === searchDate;
      });
    }

    this.setState({ filteredNews });
  }

  handleTogglePublicationDate = (id, checked) => {
    this.setState((prevState) => ({
      [`includePublicationDate_${id}`]: checked, // Use the dynamic key format here
    }));
  };

  // Navigate to view news page
  viewNews(id) {
    this.props.history.push(`/read-news/${id}`);
  }

  approveNews(id) {
    const token = localStorage.getItem("token");
    const NEWS_API_BASE_URL = "http://localhost:8081/api/v1";

    // Get the publicationDate from the state (if it exists)
    const publicationDate = this.state.publicationDates[id];

    // Prepare the request body
    const requestBody = {};

    // If a publication date exists, format it and add it to the request body
    if (publicationDate) {
      requestBody.publicationDate = new Date(publicationDate).toISOString(); // Convert to ISO format
    }

    // Send the request with the optional publicationDate
    axios
      .post(`${NEWS_API_BASE_URL}/approve/news/${id}`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // Assuming the response contains the updated list of news items,
        // or that you need to filter out the approved news item
        this.setState((prevState) => ({
          news: prevState.news.filter((news) => news.id !== id),
          filteredNews: prevState.filteredNews.filter((news) => news.id !== id), // Update filtered news as well
        }));
      })
      .catch((error) => {
        console.error("Error approving news:", error);
      });
  }

  // Reject news method
  rejectNews(id) {
    AdminApprovalService.rejectNews(id).then((res) => {
      this.setState({
        news: this.state.news.filter((news) => news.id !== id),
        filteredNews: this.state.filteredNews.filter((news) => news.id !== id), // Update filtered news as well
      });
    });
  }

  // Logout method
  logout = () => {
    localStorage.clear();
    this.props.history.push("/login");
  };

  render() {
    const role = localStorage.getItem("role");

    if (role !== "ADMIN") {
      return <Redirect to="/unauthorized" />;
    }

    return (
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <HeaderComponent />
          <Box sx={{ padding: "20px", marginTop: "70px" }}>
            <div>
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
              <br />
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
                    ) : this.state.filteredNews.length > 0 ? (
                      this.state.filteredNews.map((news) => (
                        <tr key={news.id}>
                          <td>
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
                          <td style={{ whiteSpace: "nowrap" }}>{news.author}</td>
                          <td>{news.status}</td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {/* Toggle for publication date */}
                            <div style={{ marginBottom: "10px" }}>
                              <label>
                                <input
                                  type="checkbox"
                                  onChange={(event) =>
                                    this.handleTogglePublicationDate(news.id, event.target.checked)
                                  }
                                />
                                Set Publication Date
                              </label>
                            </div>

                            {/* Date picker - displayed only if toggle is checked */}
                            {this.state[`includePublicationDate_${news.id}`] && (
                              <input
                                type="datetime-local"
                                style={{ marginBottom: "10px", display: "block" }}
                                onChange={(event) =>
                                  this.handleDateChange(news.id, event.target.value)
                                }
                              />
                            )}

                            <button
                              onClick={() => {
                                if (window.confirm("Are you sure you want to approve this news?")) {
                                  this.approveNews(news.id);
                                }
                              }}
                              className="bntAction"
                            >
                              Approve 
                            </button>

                            <button
                              style={{ marginLeft: "10px" }}
                              onClick={() => {
                                if (window.confirm("Are you sure you want to reject this news?")) {
                                  this.rejectNews(news.id);
                                }
                              }}
                              className="bntAction"
                            >
                              Reject
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
                          No Pending News Available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default PendingNewsComponent;
