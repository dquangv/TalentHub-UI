import { createContext, useContext, useState, useEffect } from 'react';
import websocketService from '@/pages/ChatComponents/websocketService';
const AuthContext = createContext(undefined);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<null | any>(null)
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsLoggedIn(true);
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        const userInfoData = JSON.parse(storedUserInfo);
        setUserInfo(userInfoData);
        if (userInfoData.userId) {
          initializeWebSocketConnection(userInfoData.userId);
        }
      }
    }
  }, []);

  const login = (data) => {
    setIsLoggedIn(true);
    localStorage.setItem('authToken', data.token);
    if (data?.role == 'ADMIN') {
      localStorage.setItem('adminRole', "true");
    }

    const userInfoData = {
      userId: data.userId,
      role: data.role,
      freelancerId: data.freelancerId,
      clientId: data.clientId,
      email: data.email,
      lat: data.lat,
      lng: data.lng
    };

    setUserInfo(userInfoData);
    localStorage.setItem("userInfo", JSON.stringify(userInfoData));

    initializeWebSocketConnection(data.userId);
  };
  const initializeWebSocketConnection = (userId) => {
    if (!websocketService.isConnected() && userId) {
      const callbacks = {
        onMessageReceived: (message) => {
          console.log('Tin nhắn mới nhận được:', message);
        },
        onReadReceiptReceived: (receipt) => {
          console.log('Xác nhận đã đọc:', receipt);
        },
        onStatusReceived: (status) => {
          console.log('Cập nhật trạng thái người dùng:', status);
        },
        onConnectionEstablished: () => {
          console.log('Kết nối WebSocket thành công');
        },
        onConnectionLost: () => {
          console.log('Mất kết nối WebSocket, đang thử kết nối lại...');
        }
      };

      websocketService.connect(userId, callbacks);
    }
  };

  const logout = () => {
    websocketService.disconnect();
    setIsLoggedIn(false);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ userInfo, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
