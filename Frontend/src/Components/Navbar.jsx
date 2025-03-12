import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
      <nav className="bg-blue-400 p-4 text-black">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            URL Shortener
          </Link>
          <div>
            {user ? (
              <>
                <Link to="/dashboard" className="mr-4">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-500 px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-700 px-4 mr-4 py-2 text-white rounded hover:bg-blue-500"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-700 px-4 py-2 rounded text-white hover:bg-blue-500"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    );
}
