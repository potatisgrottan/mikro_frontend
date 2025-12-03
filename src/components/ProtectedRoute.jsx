import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav style={{ background: "#eee", padding: "1rem" }}>
      <Link to="/dashboard">Home</Link>{" "}
      <Link to="/patients">Patients</Link>{" "}
      <Link to="/messages">Messages</Link>{" "}
      <Link to="/profile">Profile</Link>{" "}
      <button onClick={() => { localStorage.clear(); window.location.href = "/"; }}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
