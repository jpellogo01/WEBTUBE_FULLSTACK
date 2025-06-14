import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material'; // Import CircularProgress for loading animation
import Sidebar from './Sidebar';
import HeaderComponent from './HeaderComponent';
import UserService from '../services/UserService';


const AddUserComponent = () => {
    const { id } = useParams(); // Access route parameter `id`
    const history = useHistory(); // For navigation

    const [state, setState] = useState({
        fullname: '',
        username: '',
        password: '',
        email: '',
        role: '',
        roles: ['ROLE_AUTHOR', 'ROLE_ADMIN'], // Role options
    });

    const [loading, setLoading] = useState(false); // New state for loading

    // Fetch user data if editing an existing user
    useEffect(() => {
        if (id !== '_add') {
            UserService.getUserById(id).then((res) => {
                const user = res.data;
                setState({
                    fullname: user.fullname,
                    username: user.username,
                    password: '*****',
                    email: user.email,
                    role: user.role,
                    roles: ['ROLE_AUTHOR', 'ROLE_ADMIN'], // Ensure roles remain intact
                });
            });
        }
    }, [id]);

    const saveOrUpdateUser = (e) => {
        e.preventDefault();
        const { fullname, username, password, email, role } = state;

        setLoading(true); // Start loading when the request is initiated

        // Prepare user object
        const user = {
            fullname: fullname.trim(),
            username: username.trim(),
            email: email.trim(),
            role: [role.trim()],
        };

        if (password.trim() !== '*****') {
            user.password = password.trim();
        }

        if (id === '_add') {
            UserService.createUser(user)
                .then(() => {
                    setLoading(false); // Stop loading after the request is complete
                    history.push('/user-management'); // Navigate to users list
                })
                .catch((error) => {
                    setLoading(false); // Stop loading if an error occurs
                    console.error('Error:', error);
                });
        } else {
            UserService.updateUser(user, id)
                .then(() => {
                    setLoading(false); // Stop loading after the request is complete
                    history.push('/user-management'); // Navigate to users list
                })
                .catch((error) => {
                    setLoading(false); // Stop loading if an error occurs
                    console.error('Error:', error);
                });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const { fullname, username, password, email, role, roles } = state;

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <HeaderComponent />
                <Box sx={{ padding: "20px", marginTop: "70px", }}>
                    <div className="container">
                        <div className="row">
                            <div className="card col-md-6 offset-md-3 offset-md-3 mt-5">
                                <h3 className="text-center">{id === '_add' ? 'Add' : 'Update'} User</h3>
                                <div className="card-body">
                                    {loading ? (
                                        <div className="text-center">
                                            <CircularProgress /> {/* Show loading spinner */}
                                        </div>
                                    ) : (
                                        <form>
                                            <div className="form-group">
                                                <label>Full Name:</label>
                                                <input
                                                    type="text"
                                                    placeholder="Full Name"
                                                    name="fullname"
                                                    className="form-control"
                                                    value={fullname}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Username:</label>
                                                <input
                                                    type="text"
                                                    placeholder="Username"
                                                    name="username"
                                                    className="form-control"
                                                    value={username}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Password:</label>
                                                <input
                                                    type="text"
                                                    placeholder="Password"
                                                    name="password"
                                                    className="form-control"
                                                    value={password}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Email:</label>
                                                <input
                                                    type="email"
                                                    placeholder="Email"
                                                    name="email"
                                                    className="form-control"
                                                    value={email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Role:</label>
                                                <select
                                                    name="role"
                                                    className="form-control"
                                                    value={role}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select Role</option>
                                                    {roles.map((roleOption) => (
                                                        <option key={roleOption} value={roleOption}>
                                                            {roleOption}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <button
                                                className="btn btn-success"
                                                onClick={saveOrUpdateUser}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => history.push('/user-management')}
                                                style={{ marginLeft: '10px' }}
                                            >
                                                Cancel
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
            </Box>
        </Box>
    );
};

export default AddUserComponent;
