import axios from 'axios';

const NEWS_API_BASE_URL = 'http://localhost:8081/api/v1';

class AdminApprovalService {
    // Approve news
    approveNews(id) {
        const token = localStorage.getItem('token');
        return axios.post(`${NEWS_API_BASE_URL}/approve/news/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    // Reject news
    rejectNews(id) {
        const token = localStorage.getItem('token');
        return axios.post(`${NEWS_API_BASE_URL}/reject/news/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

export default new AdminApprovalService();
