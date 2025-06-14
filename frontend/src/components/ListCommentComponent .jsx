import React from "react";
import { Box, Button, Stack } from "@mui/material";
import HeaderComponent from "./HeaderComponent";
import Sidebar from "./Sidebar";
import CommentAndViewsService from '../services/CommentAndViewsService';
import { Redirect } from 'react-router-dom';

class ListCommentComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            news: [],

        };
    }

    componentDidMount() {
        this.fetchComments();
    }

    fetchComments = async () => {
        try {
            const comments = await CommentAndViewsService.getAllPendingComments();
            this.setState({ comments });
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    viewNews(id) {
        this.props.history.push(`/read-news/${id}`);
    }

    approveComment = async (id) => {
        try {
            await CommentAndViewsService.approveComment(id);
            this.setState({ comments: this.state.comments.filter(comment => comment.commentId !== id) });
        } catch (error) {
            console.error('Error approving comment:', error);
        }
    };

    deleteComment = async (id) => {
        try {
            await CommentAndViewsService.deleteComment(id);
            this.setState({ comments: this.state.comments.filter(comment => comment.commentId !== id) });
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    logout = () => {
        localStorage.clear();
        this.props.history.push('/login');
    };

    cms = () => {
        this.props.history.push('/news');
    };

    render() {
        const role = localStorage.getItem('role');
        if (role !== "ADMIN") {
            return <Redirect to="/unauthorized" />;
        }

        return (
            <Box sx={{ display: "flex" }}>
                <Sidebar />
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <HeaderComponent />
                    <Box sx={{ padding: "20px", marginTop: "70px" }}>
                        <div className="row scrollable-div">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Comment Content</th>
                                        <th>News Title</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(this.state.comments) && this.state.comments.map(comment => (
                                        <tr key={comment.commentId}>
                                            <td>{comment.commentText}</td>
                                            <td>{comment.newsTitle}</td>
                                            <td>{comment.commentStatus}</td>
                                            <td>
                                                <Stack direction="row" spacing={1}>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="success"
                                                        onClick={() => this.approveComment(comment.commentId)}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => this.deleteComment(comment.commentId)}
                                                    >
                                                        Delete
                                                    </Button>

                                                    <button
                                                        style={{ marginLeft: "10px" }}
                                                        onClick={() => this.viewNews(comment.newsId)}
                                                        className="bntAction"
                                                    >
                                                        View
                                                    </button>
                                                </Stack>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Box>
                </Box>
            </Box>
        );
    }
}

export default ListCommentComponent;
