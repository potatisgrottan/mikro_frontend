import React from "react";
import Navbar from "../components/Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">{children}</main>
    </div>
  );
}

export default Layout;
