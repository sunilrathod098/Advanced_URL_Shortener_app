import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("/api/auth/user", {
                    withCredentials: true,
                });
                setUser(response.data.user);
            } catch (error) {
                setUser(null);
                console.error("Not logged in", error);
                
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (data) => {
        try {
            const response = await axios.post("/api/auth/google-signin", data, {
                withCredentials: true,
            })
            setUser(response.data.user);
            localStorage.setItem("accessToken", response.data.accessToken);
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post("/api/auth/logout", {}, { withCredentials: true });
            setUser(null);
            localStorage.removeItem("accessToken");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
