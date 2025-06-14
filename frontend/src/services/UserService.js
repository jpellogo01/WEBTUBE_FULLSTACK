import axios from 'axios';

const USER_API_BASE_URL = "http://localhost:8081/api/v1/user";


class UserService {
    

    getUser() {
        const token = localStorage.getItem('token'); // Get the token from local storage
        return axios.get(USER_API_BASE_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    
    getUserById(userId) {
        const token = localStorage.getItem('token'); // Get the token from local storage
        return axios.get(`${USER_API_BASE_URL}/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    
    deleteUser(userId) {
        const token = localStorage.getItem('token'); // Get the token from local storage
        return axios.delete(`${USER_API_BASE_URL}/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    createUser(user) {
        const token = localStorage.getItem('token'); // Get the token from local storage
        return axios.post(`${USER_API_BASE_URL}`, user, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    updateUser(user, id) {
        const token = localStorage.getItem('token'); // Get the token from local storage
        return axios.put(`${USER_API_BASE_URL}/${id}`, user, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }


}

export default new UserService();
