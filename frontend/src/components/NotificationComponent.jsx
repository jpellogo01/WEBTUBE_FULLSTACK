import React, { Component } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Button, Divider } from '@mui/material';
import HeaderComponent from './HeaderComponent'; // Adjust path as needed
import Sidebar from './Sidebar'; // Adjust path as needed
import { Redirect } from 'react-router-dom';
import moment from 'moment'; // To format dates

class NotificationComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
    };
  }

  componentDidMount() {
    this.fetchNotifications();
  }

  // Fetch all notifications from the server
  fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/v1/news/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.setState({ notifications: response.data });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark a notification as read
  markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8081/api/v1/news/notifications/mark-read/${notificationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      this.setState((prevState) => ({
        notifications: prevState.notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        ),
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Delete a notification
  deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:8081/api/v1/news/notification/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the state to remove the deleted notification
      this.setState((prevState) => ({
        notifications: prevState.notifications.filter(
          (notification) => notification.id !== notificationId
        ),
      }));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Logout method
  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('fullname');
    localStorage.removeItem('username');

    this.props.history.push('/login');
  };

  render() {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN' && role !== 'AUTHOR') {
      return <Redirect to="/unauthorized" />;
    }

    const { notifications } = this.state;

    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden' }}>
        <Sidebar />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <HeaderComponent />
          <Box sx={{ padding: '20px', marginTop: '10px', overflowY: 'auto' }}>
            <Typography variant="h4" sx={{ marginBottom: '20px' }}>
              Notifications
            </Typography>
            {notifications.length === 0 ? (
              <Typography variant="body1">No new notifications.</Typography>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  sx={{
                    marginBottom: '20px',
                    backgroundColor: notification.read ? '#f5f5f5' : '#e3f2fd',
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                      }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 'bold', color: '#1976d2' }}
                        >
                          {notification.author}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ marginBottom: '10px', color: '#616161' }}
                        >
                          Received: {moment(notification.createdAt).format('MMMM Do YYYY, h:mm a')}
                        </Typography>
                        <Typography variant="body1">{notification.message}</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '10px',
                          marginTop: { xs: '10px', sm: '0' },
                        }}
                      >
                        {!notification.read && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => this.markAsRead(notification.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => this.deleteNotification(notification.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                    <Divider sx={{ marginTop: '10px' }} />
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </Box>
      </Box>
    );
  }
}

export default NotificationComponent;
