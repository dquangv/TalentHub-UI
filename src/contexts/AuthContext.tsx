import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (data) => {
    setIsLoggedIn(true);
    localStorage.setItem('authToken', data.token); 
    localStorage.setItem(
        "userInfo",
        JSON.stringify({
          userId: data.userId,
          role: data.role,
          freelancerId: data.freelancerId,
          clientId: data.clientId,
        })
      );
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
