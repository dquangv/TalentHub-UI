import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { notification } from "antd";
import { Card } from "@/components/ui/card";
import config from "@/config";

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};

const FaceVerification = () => {
  const webcamRef = useRef<Webcam>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // ✅ Check đăng ký + camera
  useEffect(() => {
    const checkInit = async () => {
      const userInfoStr = localStorage.getItem("userInfo");
      if (!userInfoStr) {
        notification.error({
          message: "Lỗi",
          description: "Không tìm thấy thông tin người dùng",
        });
        return navigate("/login");
      }

      const userInfo = JSON.parse(userInfoStr);
      const email = userInfo.email;

      try {
        const res = await fetch(
          `${config.current.PY_URL}/api/check-face-registered?userId=${email}`,
          {
            headers: {
              Accept: "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        const data = await res.json();

        if (!data.registered) {
          notification.info({
            message: "Chưa đăng ký khuôn mặt",
            description: "Vui lòng đăng ký khuôn mặt trước khi xác thực.",
          });
          return navigate("/face-capture");
        }
      } catch (err) {
        console.error("Lỗi kiểm tra đăng ký:", err);
        notification.error({
          message: "Lỗi kiểm tra khuôn mặt",
          description: "Không thể kiểm tra thông tin đăng ký.",
        });
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setHasCamera(true);
        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.error("Camera error:", err);
        notification.error({
          message: "Lỗi truy cập camera",
          description: "Vui lòng cho phép truy cập camera.",
        });
        setHasCamera(false);
      }
    };

    checkInit();
  }, [navigate]);

  // ✅ Tự động gửi xác thực mỗi 2s
  useEffect(() => {
    const verifyLoop = async () => {
      if (!webcamRef.current || verifying) return;

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      const userInfoStr = localStorage.getItem("userInfo");
      if (!userInfoStr) return;

      const userInfo = JSON.parse(userInfoStr);
      const email = userInfo.email;

      try {
        setVerifying(true);
        const res = await fetch(`${config.current.PY_URL}/api/verify-face`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({ image: imageSrc, userId: email }),
        });

        const data = await res.json();
        if (data.success) {
          notification.success({ message: "Xác thực thành công" });
          clearInterval(intervalRef.current!);
          return navigate("/", { replace: true });
        } else {
          setErrorMessage(
            "Không xác thực được khuôn mặt. Vui lòng điều chỉnh góc mặt và thử lại."
          );
          console.log("Không khớp khuôn mặt, thử lại...");
          notification.warning({
            message: "Không khớp khuôn mặt",
            description: "Vui lòng điều chỉnh góc mặt và thử lại.",
            key: "face-verification-warning",
            duration: 3,
          });
        }
      } catch (err) {
        setErrorMessage("Có lỗi xảy ra khi xác thực. Vui lòng thử lại.");
        console.error("Lỗi xác thực:", err);
      } finally {
        setVerifying(false);
      }
    };

    if (hasCamera) {
      intervalRef.current = setInterval(verifyLoop, 1000); // mỗi 2 giây
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hasCamera, verifying, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Đang xác thực khuôn mặt...
          </h2>
          <p className="text-center text-gray-600 mb-4">
            Vui lòng giữ khuôn mặt trong khung hình, nhìn thẳng vào camera để
            xác thực.
          </p>
          {errorMessage && (
            <p className="text-center text-red-500 mb-4">{errorMessage}</p>
          )}
          <div className="flex justify-center">
            {hasCamera ? (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                width={400}
                height={400}
                className="rounded-lg shadow-lg"
              />
            ) : (
              <div className="text-gray-500">Không tìm thấy camera</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FaceVerification;
