import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackButton =
    location.pathname === "/form" || location.pathname.startsWith("/form/");

  return (
    <div className="navbar">
      <div className="navbar-title">Vizoroz Shipping Form</div>

      {showBackButton && (
        <div className="navbar-button">
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#2C3E50',
              '&:hover': { backgroundColor: '#1A252F' },
              color: '#ffffff',
              textTransform: 'none',
              boxShadow: 'none',
              borderRadius: '8px',
              fontWeight: 500,
              paddingX: '16px',
              paddingY: '6px',
            }}
            onClick={() => navigate("/")}
          >
            Back to List
          </Button>



        </div>
      )}
    </div>
  );
};

export default Navbar;


