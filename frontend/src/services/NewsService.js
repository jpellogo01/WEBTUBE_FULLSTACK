import axios from 'axios';

const NEWS_API_BASE_URL = "http://localhost:8081/api/v1/news";
const NEWS_API_BASE_URL2 = "http://localhost:8081/api/v1/news/approve";
const NEWS_API_BASE_URL3 = "http://localhost:8081/api/v1/news/reject";
const NEWS_API_BASE_URL4 = "http://localhost:8081/api/v1/AInews";




class NewsService {

    getPendingNews() {
        const token = localStorage.getItem('token'); // Get the token from local storage
        return axios.get("http://localhost:8081/api/v1/news/pending", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    approveNews(newsId) {
        const token = localStorage.getItem('token'); // Get the token from local storage
        console.log("Token:", token);  // Add this line to check if the token is being retrieved correctly

        return axios.post(`${NEWS_API_BASE_URL2}/${newsId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    rejectNews(newsId) {
        const token = localStorage.getItem('token'); // Get the token from local storage
        return axios.post(`${NEWS_API_BASE_URL3}/${newsId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }


    getNews() {
        const token = localStorage.getItem('token'); // Get the token from local storage
        return axios.get(NEWS_API_BASE_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    getNewsById(newsId) {
        const token = localStorage.getItem('token'); // Get the token from local storage
        return axios.get(`${NEWS_API_BASE_URL}/${newsId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    createNews(news) {
        const token = localStorage.getItem('token'); // Get the token from local storage
        return axios.post(NEWS_API_BASE_URL, news, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
     createAiNews(news) {
        const token = localStorage.getItem('token'); // Get the token from local storage
        return axios.post(NEWS_API_BASE_URL4, news, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    updateNews(news, newsId) {
        const token = localStorage.getItem('token'); // Get the token from local storage
        return axios.put(`${NEWS_API_BASE_URL}/${newsId}`, news, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    deleteNews(newsId) {
        const token = localStorage.getItem('token'); // Get the token from local storage
        return axios.delete(`${NEWS_API_BASE_URL}/${newsId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

export default new NewsService();
