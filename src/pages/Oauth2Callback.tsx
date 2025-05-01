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
      var data: any = {
        userId: userId,
        role: role,
        freelancerId: freelancerId == "null" ? null : freelancerId,
        clientId: clientId == "null" ? null : clientId,
        lat: Number(lat),
        email: email,
        lng: Number(lng),
      };
      if (!accessToken || !role || !clientId || !freelancerId || !userId) {
        setError("Missing required parameters.");
        return null;
      }

      return data;
    };

    const data = getQueryParams();
    if (data) {
      login(data);

      navigate("/");
    } else {
      notification.error({
        message: "Error",
        description: "Failed to extract OAuth2 parameters.",
      });
    }

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <LoadingEffect />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <div>Processing OAuth2 Callback...</div>;
};

export default OAuth2Callback;
