import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    // Handle email/password signup
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password }); // Call login function with email/password
            navigate("/dashboard"); // Redirect to dashboard after signup
        } catch (error) {
            setError(error.response?.data?.message || "Signup failed");
        }
    };

    // Handle Google Sign-In success
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await login({ token: credentialResponse.credential }); // Call login function with Google token
            navigate("/dashboard"); // Redirect to dashboard after signup
        } catch (error) {
            setError(error.response?.data?.message || "Google Sign-In failed");
        }
    };

    // Handle Google Sign-In failure
    const handleGoogleFailure = () => {
        setError("Google Sign-In failed. Please try again.");
    };

    return (
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <div className="max-w-md mx-auto mt-10">
                <h1 className="text-3xl font-bold text-center mb-6">Signup</h1>
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
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Signup with Email
                    </button>
                </form>

                {/* Google Sign-In Button */}
                <div className="mt-6">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleFailure}
                        useOneTap
                    />
                </div>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
        </GoogleOAuthProvider>
    );
}
