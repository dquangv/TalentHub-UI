import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Progress, notification } from "antd";
import { useNavigate } from "react-router-dom";
import config from "@/config";

const directions = ["front", "left", "right"] as const;
type Direction = (typeof directions)[number];

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};

// Thông điệp hướng dẫn cho từng hướng
const directionMessages = {
  front: "Vui lòng nhìn thẳng vào camera",
  left: "Vui lòng quay mặt sang phải",
  right: "Vui lòng quay mặt sang trái",
};

const FaceCapture = () => {
  const webcamRef = useRef<Webcam>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [capturedImages, setCapturedImages] = useState<
    Record<Direction, string[]>
  >({
    front: [],
    left: [],
    right: [],
  });
  const [currentDirection, setCurrentDirection] = useState<Direction>("front");
  const [isCapturing, setIsCapturing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentDirectionRef = useRef<Direction>("front");
  const navigate = useNavigate();

  // Load models khi component mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models");
        setModelsLoaded(true);
      } catch (error) {
        console.error("Không thể tải models:", error);
        notification.error({
          message: "Lỗi khởi tạo",
          description:
            "Không thể tải mô hình nhận diện khuôn mặt. Vui lòng tải lại trang.",
        });
      }
    };
    loadModels();

    // Cleanup khi unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Cập nhật progress bar
  useEffect(() => {
    const total = directions.reduce(
      (sum, dir) => sum + capturedImages[dir].length,
      0
    );
    setProgress(Math.min((total / 15) * 100, 100));
  }, [capturedImages]);

  // Cập nhật ref khi currentDirection thay đổi
  useEffect(() => {
    currentDirectionRef.current = currentDirection;
    setMessage(directionMessages[currentDirection]);
  }, [currentDirection]);

  // Xác định hướng khuôn mặt
  const getFaceDirection = async (
    video: HTMLVideoElement
  ): Promise<Direction | null> => {
    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks(true);

    if (!detection) return null;

    const landmarks = detection.landmarks;
    const nose = landmarks.getNose();
    const jaw = landmarks.getJawOutline();

    const noseX = nose[3].x;
    const leftJawX = jaw[0].x;
    const rightJawX = jaw[16].x;

    const center = (leftJawX + rightJawX) / 2;
    const offset = noseX - center;

    if (Math.abs(offset) < 10) return "front";
    if (offset < -10) return "left";
    if (offset > 10) return "right";

    return null;
  };

  // Bắt đầu quá trình chụp ảnh
  const handleStartCapture = () => {
    if (!modelsLoaded || !webcamRef.current) {
      notification.warning({
        message: "Chưa sẵn sàng",
        description: "Camera hoặc mô hình nhận diện chưa được khởi tạo.",
      });
      return;
    }

    // Reset state và bắt đầu quá trình chụp
    setCapturedImages({ front: [], left: [], right: [] });
    setCurrentDirection("front");
    setMessage(directionMessages.front);
    setIsCapturing(true);

    intervalRef.current = setInterval(async () => {
      if (!webcamRef.current?.video) return;

      const dir = await getFaceDirection(webcamRef.current.video);
      const currentDir = currentDirectionRef.current;

      if (dir !== currentDir) return;

      setCapturedImages((prev) => {
        const currentImages = prev[currentDir];
        if (currentImages.length >= 5) return prev;

        const image = webcamRef.current!.getScreenshot();
        if (!image) return prev;

        const updated = {
          ...prev,
          [currentDir]: [...currentImages, image],
        };

        // Nếu đã chụp đủ 5 ảnh cho hướng hiện tại
        if (updated[currentDir].length === 5) {
          const nextIndex = directions.indexOf(currentDir) + 1;
          if (nextIndex < directions.length) {
            // Chuyển sang hướng tiếp theo
            const nextDir = directions[nextIndex];
            setCurrentDirection(nextDir);
          } else {
            // Đã chụp đủ tất cả các hướng
            if (intervalRef.current) clearInterval(intervalRef.current);
            sendImagesToServer(updated);
          }
        }

        return updated;
      });
    }, 500);
  };

  // Gửi ảnh lên server
  const sendImagesToServer = async (images: Record<Direction, string[]>) => {
    setIsCapturing(false);
    setProcessing(true);
    setMessage("Đang xử lý...");

    try {
      const userInfoStr = localStorage.getItem("userInfo");
      if (!userInfoStr) throw new Error("User info not found");
      const userInfo = JSON.parse(userInfoStr);
      const email = userInfo.email;

      const response = await fetch(
        `${config.current.PY_URL}/api/register-face`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            userId: email,
            images,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Xác thực khuôn mặt thành công!");

        notification.success({
          message: "Đăng ký thành công",
          description: "Chào mừng bạn đến với TalentHub!",
        });

        // Điều hướng dựa vào loại người dùng
        if (userInfo.freelancerId) {
          navigate("/settingsfreelancer");
        } else if (userInfo.clientId) {
          navigate("/client/profile");
        }
      } else {
        setMessage(
          data.message ||
            "Không khớp khuôn mặt. Vui lòng điều chỉnh góc mặt và thử lại."
        );
        notification.warning({
          message: "Lỗi xác thực",
          description:
            data.message ||
            "Không khớp khuôn mặt. Vui lòng điều chỉnh góc mặt và thử lại.",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage("Không thể xác thực. Vui lòng thử lại.");
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Hủy quá trình chụp
  const handleCancelCapture = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsCapturing(false);
    setMessage("");
    setCapturedImages({ front: [], left: [], right: [] });
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Xác thực Liveness Detection
        </h2>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-center mb-6">
            <Webcam
              ref={webcamRef}
              width={400}
              height={400}
              mirrored={true}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="rounded-lg shadow-md"
            />
          </div>

          {message && (
            <div className="text-center text-lg font-medium mb-4 text-blue-600">
              {message}
            </div>
          )}

          <div className="flex justify-center mb-6">
            <Progress
              percent={Math.round(progress)}
              status={isCapturing || processing ? "active" : "normal"}
              className="w-full"
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
            />
          </div>

          <div className="flex justify-center gap-4">
            {!isCapturing && !processing ? (
              <Button
                onClick={handleStartCapture}
                disabled={!modelsLoaded}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Bắt đầu xác thực
              </Button>
            ) : (
              <>
                {isCapturing && (
                  <Button
                    onClick={handleCancelCapture}
                    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white"
                  >
                    Hủy
                  </Button>
                )}
                <Button
                  disabled
                  className="px-6 py-2 bg-blue-600 text-white flex items-center gap-2"
                >
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                  {isCapturing ? "Đang chụp..." : "Đang xử lý..."}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>
            Vui lòng đảm bảo gương mặt của bạn được chiếu sáng đầy đủ và không
            có vật cản
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaceCapture;
