import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #ddd",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Left side */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link
          to="/"
          style={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            color: "#007bff",
            textDecoration: "none",
          }}
        >
          MediTrack
        </Link>

        {token && (
          <>
            <Link
              to="/patients"
              style={{ textDecoration: "none", color: "#333" }}
            >
              Patients
            </Link>
            <Link
              to="/messages"
              style={{ textDecoration: "none", color: "#333" }}
            >
              Messages
            </Link>
          </>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {token ? (
          <>
            {user && <span style={{ color: "#555" }}>Hi, {user.username}</span>}

            {/* Info button only for patients */}
            {user?.role === "PATIENT" && (
              <button
                onClick={() => navigate("/my-overview")}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Info
              </button>
            )}

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: "none", color: "#007bff" }}>
              Login
            </Link>
            <Link to="/register" style={{ textDecoration: "none", color: "#007bff" }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
