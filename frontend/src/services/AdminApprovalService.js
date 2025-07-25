import axios from 'axios';

const NEWS_API_BASE_URL = 'http://localhost:8080/api/v1';

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

const adminApprovalService = new AdminApprovalService();
export default adminApprovalService;