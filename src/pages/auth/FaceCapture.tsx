import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Progress } from "antd";
import { notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import config from "@/config";

const directions = ["front", "left", "right"] as const;
type Direction = (typeof directions)[number];

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
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
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models");
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  useEffect(() => {
    const total = directions.reduce(
      (sum, dir) => sum + capturedImages[dir].length,
      0
    );
    setProgress(Math.min((total / 15) * 100, 100));
  }, [capturedImages]);

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

  const currentDirectionRef = useRef<Direction>("front");

  useEffect(() => {
    currentDirectionRef.current = currentDirection;
  }, [currentDirection]);

  const handleStartCapture = () => {
    if (!modelsLoaded || !webcamRef.current) return;
    setLoading(true);
    setCapturedImages({ front: [], left: [], right: [] });
    setCurrentDirection("front");
    setMessage("Vui lòng nhìn thẳng vào camera");

    intervalRef.current = setInterval(async () => {
      if (!webcamRef.current?.video) return;

      const dir = await getFaceDirection(webcamRef.current.video);
      const currentDir = currentDirectionRef.current;

      console.log(currentDir);

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

        if (updated[currentDir].length === 5) {
          const nextIndex = directions.indexOf(currentDir) + 1;
          if (nextIndex < directions.length) {
            const nextDir = directions[nextIndex];
            setCurrentDirection(nextDir);
            setMessage(
              nextDir === "left"
                ? "Vui lòng quay mặt sang phải"
                : nextDir === "right"
                ? "Vui lòng quay mặt sang trái"
                : "Vui lòng nhìn thẳng vào camera"
            );
          } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            sendImagesToServer(updated);
          }
        }
        setLoading(false);
        return updated;
      });
    }, 500);
  };

  const sendImagesToServer = async (images: Record<Direction, string[]>) => {
    setProcessing(true);
    setMessage("Đang xử lý...");

    try {
      const userInfoStr = localStorage.getItem("userInfo");
      if (!userInfoStr) throw new Error("User info not found");
      const userInfo = JSON.parse(userInfoStr);
      const email = userInfo.email;

      console.log(images);

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

      console.log(response);

      const data = await response.json();

      console.log(data);
      if (data.success) {
        setMessage("Xác thực khuôn mặt thành công!");

        notification.success({
          message: "Đăng ký thành công",
          description: "Chào mừng bạn đến với TalentHub!",
        });

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
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-xl font-bold mb-4 text-center">
          Xác thực Liveness Detection
        </h2>
        <div className="flex justify-center mb-4">
          <Webcam
            ref={webcamRef}
            width={400}
            height={400}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-md shadow-md"
          />
        </div>
        {message && (
          <div className="text-center text-lg font-medium mb-4 text-blue-600">
            {message}
          </div>
        )}
        <div className="flex justify-center mb-4">
          <Progress
            percent={Math.round(progress)}
            status={processing ? "active" : "normal"}
          />
        </div>
        <div className="flex justify-center">
          <Button
            onClick={handleStartCapture}
            disabled={!modelsLoaded || processing}
          >
            {loading ? "Đang xác thực..." : "Bắt đầu xác thực"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FaceCapture;
