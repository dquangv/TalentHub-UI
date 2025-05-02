import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import LoadingEffect from "@/components/ui/LoadingEffect";

export const OAuth2Callback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const getQueryParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("accessToken");
      const role = urlParams.get("role");
      const clientId = urlParams.get("clientId");
      const freelancerId = urlParams.get("freelancerId");
      const userId = urlParams.get("userId");
      const lat = urlParams.get("lat");
      const email = urlParams.get("email");
      const lng = urlParams.get("lng");

      // Kiểm tra các tham số bắt buộc
      if (!accessToken || !role || !userId) {
        setError("Missing required parameters.");
        return null;
      }

      // Tạo đối tượng data với xử lý đúng
      const data = {
        userId: userId,
        role: role,
        freelancerId: freelancerId === "null" ? null : freelancerId,
        clientId: clientId === "null" ? null : clientId,
        lat: lat ? Number(lat) : null,
        email: email || null,
        lng: lng ? Number(lng) : null,
        accessToken: accessToken, // Thêm accessToken vào data
      };

      return data;
    };

    const handleOAuth = async () => {
      try {
        const data = getQueryParams();

        if (data) {
          // Lưu thông tin người dùng vào localStorage
          localStorage.setItem("userInfo", JSON.stringify(data));

          // Đăng nhập người dùng
          await login(data);

          // Chuyển hướng sau khi đăng nhập thành công
          setTimeout(() => {
            navigate("/");
          }, 500); // Độ trễ nhỏ để đảm bảo localStorage được cập nhật
        } else {
          console.error("Invalid data received from OAuth2 callback.");
        }
      } catch (err) {
        // Xử lý lỗi khi login thất bại
        console.error("Login error:", err);
        setError(`Đăng nhập thất bại: ${err.message || "Lỗi không xác định"}`);
        notification.error({
          message: "Lỗi đăng nhập",
          description:
            err.message || "Đã xảy ra lỗi trong quá trình đăng nhập.",
        });
      } finally {
        setLoading(false);
      }
    };

    handleOAuth();
  }, [navigate, login]);

  if (loading) {
    return <LoadingEffect />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <div>Đang xử lý OAuth2 Callback...</div>;
};

export default OAuth2Callback;
