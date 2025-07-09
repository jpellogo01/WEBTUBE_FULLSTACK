

import React from "react";
import { Box } from "@mui/material";
import HeaderComponent from "./HeaderComponent";
import Sidebar from "./Sidebar";
import UserService from "../services/UserService";
import axios from "axios";
import { Redirect } from "react-router-dom";

class ListUserComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      searchQuery: ""

    };

    this.addUser = this.addUser.bind(this);
    this.editUser = this.editUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  // Method to mask passwords for display
  maskPassword(password) {
    return "*".repeat(15);
  }

  // Delete user method
  deleteUser(id) {
    UserService.deleteUser(id).then((res) => {
      this.setState({ users: this.state.users.filter((user) => user.id !== id) });
    });
  }

  // Navigate to view user page
  viewUser(id) {
    this.props.history.push(`/view-user/${id}`);
  }

  // Navigate to edit user page
  editUser(id) {
    this.props.history.push(`/add-user/${id}`);
  }

  // Navigate to add user page
  addUser() {
    this.props.history.push("/add-user/_add");
  }

  // Fetch users from the server on component mount
  componentDidMount() {
    this.fetchUsers();
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  searchUsers = async () => {
    const { searchQuery } = this.state;
    const token = localStorage.getItem("token");

    if (!searchQuery.trim()) {
      this.fetchUsers(); // fallback to all users
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/v1/user/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { query: searchQuery }
      });

      this.setState({ users: response.data });
    } catch (error) {
      console.error("Error searching users:", error);
      this.setState({ users: [] });
    }
  };


  fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/v1/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      this.setState({ users: response.data });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Logout method
  logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("fullname");
    localStorage.removeItem("username");

    this.props.history.push("/login");
  };

  render() {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      return <Redirect to="/unauthorized" />;
    }

    return (
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <HeaderComponent />
          <Box sx={{ padding: "20px", marginTop: "70px", }}>
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
              <Box sx={{ display: "flex", maxWidth: "400px", width: "100%" }}>
                <input
                  type="text"
                  placeholder="Search by Name"
                  value={this.state.searchQuery}
                  onChange={this.handleSearchChange}
                  className="searchInput"
                  style={{ marginRight: "10px", width: "250px" }} // fixed width
                />
                <button className="bntAction" onClick={this.searchUsers}>
                  Search
                </button>
              </Box>
            </Box>
            <button className="bntAction" onClick={this.addUser}>
              Add User
            </button>

            <br />
            <div className="row scrollable-div">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>User Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(this.state.users) &&
                    this.state.users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.fullname}</td>
                        <td>{user.username}</td>
                        <td>{this.maskPassword(user.password)}</td>
                        <td>{user.roles && user.roles.join(", ")}</td>
                        <td>
                          <button onClick={() => this.editUser(user.id)} className="bntAction">
                            Update
                          </button>
                          <button
                            style={{ marginLeft: "10px" }}
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this user?")) {
                                this.deleteUser(user.id);
                              }
                            }}
                            className="bntAction"
                            id="btnDel"
                          >
                            Delete
                          </button>
                          <button
                            style={{ marginLeft: "10px" }}
                            onClick={() => this.viewUser(user.id)}
                            className="bntAction"
                          >
                            View
                          </button>
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

export default ListUserComponent;

