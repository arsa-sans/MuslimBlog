import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Setup Base URL for Axios to connect with Laravel API
axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [token, setTokenState] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Custom setToken function that also updates localStorage and Axios default headers
  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
    setTokenState(newToken);
  };

  // Synchronize Axios Authorization header with current token state on load
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // Fetch current user info if token exists
  const getUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get("/api/user");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // If unauthorized (e.g. token expired), reset token
      if (error.response && error.response.status === 401) {
        setToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [token]);

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser, loading, getUser }}>
      {children}
    </AppContext.Provider>
  );
}
