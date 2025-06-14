import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { FaUsers, FaFileAlt, FaComments, FaNewspaper, FaInbox } from "react-icons/fa"; // Import different icons
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation(); // Get the current location

  // Determine the title and icon based on the current route
  const getHeaderContent = () => {
    if (location.pathname === "/user-management") {
      return { title: "USER MANAGEMENT", icon: <FaUsers /> };
    }
    if (location.pathname === "/pending-news") {
      return { title: "PENDING NEWS MANAGEMENT", icon: <FaFileAlt /> };
    }
    if (location.pathname === "/comments-management") {
      return { title: "COMMENTS MODERATION", icon: <FaComments /> };
    }
    if (location.pathname === "/ListContributeContent") {
      return { title: "CONTENT FORM CONTRIBUTOR", icon: <FaNewspaper /> };
    }
       if (location.pathname === "/news-management") {
      return { title: "CONTENT MANAGEMENT", icon: <FaNewspaper /> };
    }
    if (location.pathname === "/my-news") {
      return { title: "MY CONTENTS", icon: <FaNewspaper /> };
    }
    if (location.pathname === "/notification") {
      return { title: "INBOX", icon: <FaInbox /> };
    }
    
    // Add other routes as needed
    return { title: "CONTENT UPLOAD", icon: <FaInbox /> }; // Default icon
  };

  const { title, icon } = getHeaderContent();

  return (
    <AppBar
      position="relative"
      sx={{
        backgroundColor: "#386241",
        zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure the AppBar sits above other elements like a drawer
        position: "fixed", // Keeps the header fixed while scrolling
        top: 0, // Positions it at the top
        width: "100%", // Ensures it spans the entire width
        marginBottom: "50px", // Adjust this value to control the overlap
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Adding dynamic icon and title */}
        {icon && <span style={{ marginRight: "10px", color: "white" }}>{icon}</span>} {/* Icon added */}
        <Typography variant="h6" sx={{ textAlign: "left", width: "auto", color: "white" }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
