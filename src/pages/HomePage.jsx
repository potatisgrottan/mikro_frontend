import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to MediTrack</h1>
      <p className="text-lg mb-8 text-gray-600">
        A platform for managing patients, encounters, and communication between doctors and staff.
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <div className="inline-block w-4">       </div>
        <Link
          to="/register"
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
