import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const login = async (token) => {
        const response = await axios.post("/api/auth/google-signin", { token });
        setUser(response.data.user);
    };

    const logout = async () => {
        await axios.post("/api/auth/logout", {}, { withCredentials: true });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
