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
    if (data?.role == 'ADMIN'){
      localStorage.setItem('adminRole', "true"); 

    }

    console.log("data", data)
    localStorage.setItem(
        "userInfo",
        JSON.stringify({
          userId: data.userId,
          role: data.role,
          freelancerId: data.freelancerId,
          clientId: data.clientId,
          lat: data.lat,
          lng: data.lng
        })
      );
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    localStorage.setItem('adminRole', "false")
    
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
