import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-blue-600 p-4 text-white">
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
                            <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="mr-4">
                                Login
                            </Link>
                            <Link to="/signup" className="bg-green-500 px-4 py-2 rounded">
                                Signup
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
