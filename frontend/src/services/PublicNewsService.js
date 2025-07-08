import axios from 'axios';

const NEWS_API_BASE_URL2 = "http://localhost:8080/api/v1/public-news";
const NEWS_API_BASE_URL3 = "http://localhost:8080/api/v1";

class PublicNewsService {
    getAllPublicNews() {
        return axios.get(NEWS_API_BASE_URL2);
    }

    getPublicNewsById(newsId) {
        return axios.get(`${NEWS_API_BASE_URL2}/${newsId}`);
    }

    submitRawContent(formData) {
        return axios.post(`${NEWS_API_BASE_URL3}/news-contribute`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    }
}

// ✅ Name the instance before exporting it
const publicNewsService = new PublicNewsService();
export default publicNewsService;
