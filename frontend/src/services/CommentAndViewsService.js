import axios from 'axios';

const NEWS_API_BASE_URL = "http://localhost:8081/api/v1/news"; // Base for most news routes
const NEWS_API_BASE_URL2 = "http://localhost:8081/api/v1";     // Base for other endpoints

class CommentAndViewsService {
    // ✅ 1. Fetch all pending comments (admin/mod)
    getAllPendingComments() {
        const token = localStorage.getItem('token');

        return axios.get(`${NEWS_API_BASE_URL}/comments/visible`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(response => response.data)
            .catch(error => {
                console.error("There was an error fetching pending comments!", error);
                throw error;
            });
    }


    // ✅ 2. Approve a comment
    approveComment(commentID) {
        const token = localStorage.getItem('token');

        return axios.put(`${NEWS_API_BASE_URL2}/approve-comment/${commentID}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(response => response.data)
            .catch(error => {
                console.error("There was an error approving the comment!", error);
                throw error;
            });
    }


    // ✅ 3. Delete a comment
    deleteComment(commentID) {
        const token = localStorage.getItem('token');

        return axios.delete(`${NEWS_API_BASE_URL2}/delete-comment/${commentID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(response => response.data)
            .catch(error => {
                console.error("There was an error deleting the comment!", error);
                throw error;
            });
    }

    deleteOwnComment(commentID) {
        const visitorId = localStorage.getItem('visitorId');

        return axios.delete(`${NEWS_API_BASE_URL2}/user-delete-comment/${commentID}`, {
            headers: {
                'Visitor-Id': visitorId,
            }
        })
            .then(response => response.data)
            .catch(error => {
                console.error("There was an error deleting your own comment!", error);
                throw error;
            });
    }

    // ✅ 4. Add a view to a news item
    addView(newsId, viewerIp) {
        return axios.post(`${NEWS_API_BASE_URL2}/view-news/${newsId}`, null, {
            params: { viewerIp },
        })
            .then(response => response.data)
            .catch(error => {
                console.error("There was an error adding a view!", error);
                throw error;
            });
    }

    // ✅ 5. Get all approved comments for a specific news item
    getApprovedComments(newsId) {
        return axios.get(`${NEWS_API_BASE_URL2}/news/approved/comments/${newsId}`)
            .then(response => response.data)
            .catch(error => {
                console.error("There was an error fetching approved comments!", error);
                throw error;
            });
    }

    // ✅ 6. Add a new comment to a news item
    addComment(newsId, commentData) {
        return axios.post(`${NEWS_API_BASE_URL2}/comment-news/${newsId}`, commentData)
            .then(response => response.data)
            .catch(error => {
                console.error("There was an error adding the comment!", error);
                throw error;
            });
    }

    // ✅ 7. Reply to a comment on a news item
    replyToComment(newsId, parentCommentId, commentData) {
        const visitorId = localStorage.getItem('visitorId');

        return axios.post(
            `${NEWS_API_BASE_URL2}/comment-news/${newsId}?parentId=${parentCommentId}`,
            commentData,
            {
                headers: {
                    'Visitor-Id': visitorId,
                },
            }
        )
            .then(response => response.data)
            .catch(error => {
                console.error("There was an error replying to the comment!", error);
                throw error;
            });
    }

}



export default new CommentAndViewsService();
