import axios from 'axios';

const NEWS_API_BASE_URL2 = "http://localhost:8081/api/v1/public-news";
const NEWS_API_BASE_URL3 = "http://localhost:8081/api/v1";


class PublicNewService {
    getAllPublicNews(){
        return axios.get(NEWS_API_BASE_URL2);
    }
    getPublicNewsById(newsId){
        return axios.get(`${NEWS_API_BASE_URL2}/${newsId}`);
    }

      // ✅ New method for raw content submission
    submitRawContent(formData) {
        return axios.post(`${NEWS_API_BASE_URL3}/news-contribute`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    }

}

export default new PublicNewService();
