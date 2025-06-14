import React from "react";
import { Box } from "@mui/material";
import HeaderComponent from "./HeaderComponent";
import Sidebar from "./Sidebar";
import axios from "axios";

class ListContributedNewsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            contributedNews: [],
            loading: true,
        };
    }

    componentDidMount() {
        this.fetchContributedNews();
    }

    fetchContributedNews = async () => {
        try {
            const response = await axios.get("http://localhost:8081/api/v1/contribute-news");
            this.setState({ contributedNews: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching contributed news:", error);
            this.setState({ contributedNews: [], loading: false });
        }
    };


    deleteContribution = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this contribution?");
        if (!confirmed) return;

        try {
            await axios.delete(`http://localhost:8081/api/v1/contribute-news/${id}`);
            this.setState({
                contributedNews: this.state.contributedNews.filter((item) => item.id !== id),
            });
        } catch (error) {
            console.error("Error deleting contribution:", error);
        }
    };

    viewContribution = (id) => {
        this.props.history.push(`/ReadContributeContent/${id}`);
    };

    render() {
        return (
            <Box sx={{ display: "flex" }}>
                <Sidebar />
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <HeaderComponent />
                    <Box sx={{ padding: "20px", marginTop: "50px" }}>
                        <div className="row scrollable-div">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Contributor's Name</th>
                                        <th>Contributor's Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.loading ? (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: "center" }}>
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : this.state.contributedNews.length > 0 ? (
                                        this.state.contributedNews.map((news) => (
                                            <tr key={news.id}>
                                                <td>{news.author}</td>
                                                <td>{news.authorEmail}</td>
                                                <td>
                                                    <button
                                                        className="bntAction"
                                                        onClick={() => this.viewContribution(news.id)}
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        className="bntAction"
                                                        style={{ marginLeft: "10px" }}
                                                        onClick={() => this.deleteContribution(news.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: "center" }}>
                                                No Contributed News Available
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

export default ListContributedNewsComponent;
