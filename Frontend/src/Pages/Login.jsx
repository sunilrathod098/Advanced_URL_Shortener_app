import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/auth/google-signin", {
                email,
                password,
            });
            login(response.data.accessToken);
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button
                    type="submit"
                    className="w-fill bg-blue-500 text-white p-2 rounded"
                >
                    Login
                </button>
            </form>
            {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
    );
}
