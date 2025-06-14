import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const history = useHistory();

    useEffect(() => {
        // Fetch username suggestions from the database
        async function fetchSuggestions() {
            try {
                const response = await axios.get("http://localhost:8081/api/v1/user"); // Assuming this endpoint returns username suggestions
                setSuggestions(response.data.map(user => user.username));
            } catch (error) {
                console.error('Error fetching username suggestions:', error);
            }
        }

        fetchSuggestions();
    }, []);

    async function login(event) {
        event.preventDefault();
    
        // Reset previous error messages
        setUsernameError("");
        setPasswordError("");
    
        // Validation for username
        if (!username) {
            setUsernameError("Username is required");
            return;
        }
      
    
        // Validation for password
        if (!password) {
            setPasswordError("Password is required");
            return;
        }
    
        try {
            const response = await axios.post("http://localhost:8081/api/v1/login", {
                username: username,
                password: password,
            });
        
            if (response.status === 200) {
                // Log the entire response for debugging
                console.log('API response:', response.data);
        
                const { accessToken, roles, username, email, fullname } = response.data;
        
                // Assume the user is authenticated successfully
                const role = roles.includes("ROLE_ADMIN") ? "ADMIN" : roles.includes("ROLE_AUTHOR") ? "AUTHOR" : "USER";
        
                // Store information in local storage
                localStorage.setItem('token', accessToken);
                localStorage.setItem('role', role);
                localStorage.setItem('username', username);
                localStorage.setItem('email', email);
                localStorage.setItem('fullname', fullname);

        
                // Call onLogin and navigate to the appropriate page based on role
                onLogin(accessToken, role);
                if (role === "ADMIN") {
                    history.push("/user-management");
                } else if (role === "AUTHOR") {
                    history.push("/my-news");
                } else {
                    console.error("Invalid or undefined role");
                }
            }
        } catch (error) {
            console.error('Error logging in:', error);
            if (error.response && error.response.status === 401) {
                setUsernameError("Invalid username or password");
                setPasswordError("Invalid username or password");
            }
        }
        
        
    }

    function handleSuggestionClick(username) {
        setUsername(username);
    }
    function filterSuggestions(input) {
        return suggestions.filter(suggestion => suggestion.toLowerCase().startsWith(input.toLowerCase()));
    }

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="card1">
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">Login</h2>
                        <form onSubmit={login}>
                        <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    placeholder="Enter Username"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    autoComplete="off"
                                />
                                {usernameError && <div className="text-danger">{usernameError}</div>}
                                {username && (
                                    <ul className="suggestions-list">
                                        {filterSuggestions(username).map((suggest, index) => (
                                            <li key={index} onClick={() => handleSuggestionClick(suggest)}>
                                                {suggest}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                                {passwordError && <div className="text-danger">{passwordError}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">Login</button>
                        </form>
                    </div>
                </div>
            </div>
            <footer className="custom-footer">
                <p> 2024 WebTube. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Login;
