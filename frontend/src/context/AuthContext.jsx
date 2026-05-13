import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('mg_token');
    const storedUser = localStorage.getItem('mg_user');
    if (storedToken && storedUser) {
      try {
        const decoded = jwtDecode(storedToken);
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          localStorage.removeItem('mg_token');
          localStorage.removeItem('mg_user');
        }
      } catch {
        localStorage.removeItem('mg_token');
        localStorage.removeItem('mg_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const { token: userToken, ...userInfo } = userData;
    setToken(userToken);
    setUser(userInfo);
    localStorage.setItem('mg_token', userToken);
    localStorage.setItem('mg_user', JSON.stringify(userInfo));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mg_token');
    localStorage.removeItem('mg_user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
