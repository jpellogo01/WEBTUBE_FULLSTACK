import React from "react";
import { Box } from "@mui/material";
import HeaderComponent from "./HeaderComponent";
import Sidebar from "./Sidebar";


const DashboardLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <HeaderComponent />
        <Box sx={{ padding: "20px" }}>
          
        </Box>
      </Box>
    </Box>
  );
};


export default DashboardLayout;
