import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Nav, NavItem, NavLink } from "reactstrap";
import {
  FaUsers,
  FaFileAlt,
  FaComments,
  FaNewspaper,
  FaInbox,
  FaSignOutAlt,
  FaUpload,
} from "react-icons/fa"; // Importing icons from react-icons
import "bootstrap/dist/css/bootstrap.min.css";
import webtubelogo from "../image/webtubelogo.jfif";

const Sidebar = () => {
  const history = useHistory();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { text: "User Management", path: "/user-management", icon: <FaUsers />, role: "ADMIN" },
    { text: "Pending News", path: "/pending-news", icon: <FaFileAlt />, role: "ADMIN" },
    { text: "Comments", path: "/comments-management", icon: <FaComments />, role: "ADMIN" },
    { text: "News List", path: "/news-management", icon: <FaNewspaper />, role: "ADMIN" },
    { text: "My News List", path: "/my-news", icon: <FaNewspaper />, role: "AUTHOR" },
    { text: "Inbox", path: "/notification", icon: <FaInbox />, role: "AUTHOR" },
    { text: "Contributed News", path: "/ListContributeContent", icon: <FaInbox />, role: "ADMIN" },
    { text: "POST", path: "/add-news/_add", icon: <FaUpload /> },
    { text: "POST With AI", path: "/add-news-withAI/_add", icon: <FaUpload /> },

  ];

  const logout = () => {
    localStorage.clear();
    history.push("/login");
  };

  // Close sidebar if screen width is below 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize(); // Check initial screen size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Prevent scrolling on mobile when sidebar is open
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // Ensure overflow is reset when component is unmounted or sidebar is closed
    };
  }, [isOpen]);

  return (
    <>
      <div
        className="sidebar-container"
        style={{
          width: isOpen ? "250px" : "0", // Dynamically adjust width
          overflow: "hidden", // Hide content when closed
          transition: "width 0.4s ease", // Smooth transition
          backgroundColor: "#386241",
          color: "white",
          height: "100vh",
          position: "fixed", // Fix the sidebar to the left
          top: "0", // Stay at the top of the page
          left: "0", // Fix to the left side of the page
          // boxShadow: isOpen ? "4px 0 6px rgba(0, 0, 0, 0.1)" : "none",
        }}
      >
        {isOpen && (
          <div style={{ height: "100%", overflowY: "auto" }}>
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "50%",
                right: "-15px",
                transform: "translateY(-50%)",
                backgroundColor: "#386241",
                border: "none",
                borderRadius: "50%",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
                width: "30px",
                height: "30px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              }}
            >
              &larr;
            </button>

            {/* Sidebar content */}
            <div className="d-flex align-items-center mb-4 p-3">
              <img
                src={webtubelogo}
                alt="WebTube Logo"
                style={{
                  width: "50px",
                  height: "50px",
                  marginRight: "10px",
                  borderRadius: "50%",
                }}
              />
              <div
                className="text-uppercase font-weight-bold"
                style={{ fontSize: "17px" }}
              >
                {role === "ADMIN" ? "WEBTUBE ADMIN" : "WEBTUBE AUTHOR"}
              </div>
            </div>

            <Nav vertical>
              {menuItems.map((item, index) => {
                if (
                  (role === "ADMIN" && item.role === "AUTHOR") ||
                  (role === "AUTHOR" && item.role === "ADMIN")
                ) {
                  return null; // Do not display the item for the wrong role
                }
                const isActive = location.pathname === item.path;
                return (
                  <NavItem key={index}>
                    <NavLink
                      tag={Link}
                      to={item.path}
                      style={{
                        borderRadius: "5px",
                        marginBottom: "10px",
                        color: isActive ? "#000" : "white",
                        fontWeight: "500",
                        backgroundColor: isActive ? "#e0f2f1" : "transparent",
                      }}
                      onClick={() => window.innerWidth < 768 && setIsOpen(false)} // Close sidebar on click in mobile view
                    >
                      <span style={{ marginRight: "10px" }}>{item.icon}</span>{" "}
                      {item.text}
                    </NavLink>
                  </NavItem>
                );
              })}
            </Nav>

            <hr />

            <Nav vertical>
              <NavItem className="mt-auto">
                <NavLink
                  tag="button"
                  onClick={logout}
                  className="btn btn-danger w-100"
                  style={{
                    borderRadius: "5px",
                    textAlign: "center",
                    padding: "10px",
                  }}
                >
                  <FaSignOutAlt style={{ marginRight: "10px" }} />
                  Logout
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        )}
      </div>

      {/* Open button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            top: "50%",
            left: "0",
            transform: "translateY(-50%)",
            backgroundColor: "#386241",
            border: "none",
            borderRadius: "0 5px 5px 0",
            color: "white",
            fontSize: "20px",
            cursor: "pointer",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          &rarr;
        </button>
      )}

      {/* Main content (adjusted for sidebar width) */}
      <div
        style={{
          marginLeft: isOpen ? "250px" : "0",
          transition: "margin-left 0.4s ease",
        }}
      >
        {/* Main content goes here */}
      </div>
    </>
  );
};

export default Sidebar;
