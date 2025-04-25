import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { useAuth } from "@/contexts/AuthContext";

export const BannedAccountCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    navigate("/login");
    notification.error({
      message: "Lỗi đăng nhập",
      description: "Tài khoản của bạn đã bị khóa",
    });
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <div>Processing OAuth2 Callback...</div>;
};

export default BannedAccountCallback;
