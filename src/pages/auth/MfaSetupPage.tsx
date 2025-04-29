import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Copy, Smartphone } from "lucide-react";
import { notification } from "antd";
import api from "@/api/axiosConfig";

const MfaSetupPage = () => {
  // Authentication context
  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);

  // Setup process states
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [setupStep, setSetupStep] = useState(1); // 1: initial, 2: scan QR, 3: verify code

  // Load current MFA status
  useEffect(() => {
    if (!user?.email) return;

    const checkMfaStatus = async () => {
      try {
        const response = await api.get(
          `/v1/auth/mfa/status?email=${user.email}`
        );
        const isEnabled = response.data?.data || false;
        setIsMfaEnabled(isEnabled);
      } catch (err) {
        console.error("Error checking MFA status:", err);
        notification.error({
          message: "Lỗi",
          description: "Không thể kiểm tra trạng thái xác thực 2 lớp",
        });
      }
    };

    checkMfaStatus();
  }, []);

  // Start MFA setup process
  const handleStartSetup = async () => {
    if (!user?.email) {
      notification.error({
        message: "Lỗi",
        description: "Bạn cần đăng nhập để thiết lập xác thực 2 lớp",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/v1/auth/mfa/setup", {
        email: user.email,
      });
      const data = response.data;

      setQrCodeImage(data.qrCodeImage);
      setSecretKey(data.secretKey);
      setIsSetupMode(true);
      setSetupStep(2);
    } catch (err) {
      console.error("Error starting MFA setup:", err);
      notification.error({
        message: "Lỗi thiết lập",
        description: "Không thể bắt đầu thiết lập xác thực 2 lớp",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copy secret key to clipboard
  const copySecretKey = () => {
    navigator.clipboard.writeText(secretKey);
    notification.success({
      message: "Đã sao chép",
      description: "Mã bí mật đã được sao chép vào clipboard",
    });
  };

  // Verify the entered code to complete setup
  const verifyAndEnableMfa = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      notification.warning({
        message: "Mã không hợp lệ",
        description: "Vui lòng nhập mã xác thực 6 số từ ứng dụng của bạn",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/v1/auth/mfa/verify", {
        email: user.email,
        code: verificationCode,
      });

      const isVerified = response.data.verified;

      if (isVerified) {
        notification.success({
          message: "Thiết lập thành công",
          description: "Xác thực 2 lớp đã được bật cho tài khoản của bạn",
        });

        setIsMfaEnabled(true);
        setIsSetupMode(false);
        setSetupStep(1);
        setVerificationCode("");

        // Update user context with MFA status
        if (updateUserMfaStatus) {
          updateUserMfaStatus(true);
        }
      } else {
        notification.error({
          message: "Xác thực thất bại",
          description: "Mã xác thực không đúng. Vui lòng thử lại.",
        });
      }
    } catch (err) {
      console.error("Error verifying MFA code:", err);
      notification.error({
        message: "Lỗi xác thực",
        description: err.response?.data?.message || "Không thể xác thực mã",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Disable MFA for the account
  const handleDisableMfa = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn tắt xác thực 2 lớp không?")) {
      return;
    }

    setIsLoading(true);

    try {
      await api.post(`/v1/auth/mfa/disable?email=${user.email}`);

      notification.success({
        message: "Đã tắt xác thực 2 lớp",
        description: "Xác thực 2 lớp đã được tắt cho tài khoản của bạn",
      });

      setIsMfaEnabled(false);

      // Update user context with MFA status
      if (updateUserMfaStatus) {
        updateUserMfaStatus(false);
      }
    } catch (err) {
      console.error("Error disabling MFA:", err);
      notification.error({
        message: "Lỗi",
        description: "Không thể tắt xác thực 2 lớp. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel setup process
  const handleCancelSetup = () => {
    setIsSetupMode(false);
    setSetupStep(1);
    setVerificationCode("");
    setQrCodeImage("");
    setSecretKey("");
  };

  // Go to next setup step
  const handleNextStep = () => {
    setSetupStep(3);
  };

  // Go back to previous setup step
  const handlePreviousStep = () => {
    setSetupStep(2);
  };

  // Render current MFA status
  const renderMfaStatus = () => {
    return (
      <div className="flex flex-col items-center space-y-6 py-4">
        <div className="rounded-full bg-primary/10 p-6">
          <ShieldCheck
            size={64}
            className={
              isMfaEnabled ? "text-green-500" : "text-muted-foreground"
            }
          />
        </div>

        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">
            {isMfaEnabled
              ? "Xác thực 2 lớp đang bật"
              : "Xác thực 2 lớp đang tắt"}
          </h3>
          <p className="text-muted-foreground">
            {isMfaEnabled
              ? "Tài khoản của bạn được bảo vệ bằng xác thực 2 lớp."
              : "Bật xác thực 2 lớp để bảo vệ tài khoản của bạn tốt hơn."}
          </p>
        </div>

        {isMfaEnabled ? (
          <Button
            variant="destructive"
            onClick={handleDisableMfa}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Tắt xác thực 2 lớp"}
          </Button>
        ) : (
          <Button onClick={handleStartSetup} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Bật xác thực 2 lớp"}
          </Button>
        )}
      </div>
    );
  };

  // Render step 2: Scan QR code
  const renderScanQrStep = () => {
    return (
      <div className="space-y-6">
        <Alert>
          <Smartphone className="h-4 w-4" />
          <AlertTitle>Cài đặt ứng dụng xác thực</AlertTitle>
          <AlertDescription>
            Tải Google Authenticator hoặc Microsoft Authenticator trên thiết bị
            di động của bạn.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col items-center space-y-4">
          <p className="text-center text-muted-foreground">
            Quét mã QR bên dưới bằng ứng dụng xác thực
          </p>

          {qrCodeImage && (
            <div className="border p-4 rounded-lg bg-white">
              <img src={qrCodeImage} alt="QR Code" width={200} height={200} />
            </div>
          )}

          <div className="relative w-full my-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-muted-foreground text-sm">
              Hoặc
            </span>
          </div>

          <p className="text-center text-muted-foreground">
            Nhập mã bí mật này vào ứng dụng xác thực của bạn
          </p>

          <div className="flex items-center space-x-2 w-full max-w-xs">
            <Input
              value={secretKey}
              readOnly
              className="font-mono text-center"
            />
            <Button size="icon" variant="outline" onClick={copySecretKey}>
              <Copy size={16} />
            </Button>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleCancelSetup}>
            Hủy
          </Button>
          <Button onClick={handleNextStep}>Tiếp tục</Button>
        </div>
      </div>
    );
  };

  // Render step 3: Verify code
  const renderVerifyCodeStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Xác nhận thiết lập</h3>
          <p className="text-muted-foreground">
            Nhập mã 6 số từ ứng dụng xác thực của bạn để hoàn tất thiết lập
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <Input
            type="text"
            placeholder="Nhập mã 6 số"
            value={verificationCode}
            onChange={(e) =>
              setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="text-center text-lg tracking-widest max-w-xs"
            autoFocus
            maxLength={6}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handlePreviousStep}>
            Quay lại
          </Button>
          <Button
            onClick={verifyAndEnableMfa}
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading ? "Đang xác thực..." : "Xác nhận"}
          </Button>
        </div>
      </div>
    );
  };

  // Main render function
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldCheck className="mr-2" /> Thiết lập xác thực hai lớp (2FA)
          </CardTitle>
          <CardDescription>
            Bảo vệ tài khoản của bạn bằng lớp bảo mật bổ sung
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isSetupMode && renderMfaStatus()}
          {isSetupMode && setupStep === 2 && renderScanQrStep()}
          {isSetupMode && setupStep === 3 && renderVerifyCodeStep()}
        </CardContent>

        <CardFooter className="flex-col space-y-4">
          <Separator />
          <div className="text-sm text-muted-foreground text-center">
            <p>
              Xác thực hai lớp giúp bảo vệ tài khoản của bạn khỏi truy cập trái
              phép.
            </p>
            <p>
              Ngay cả khi mật khẩu bị lộ, kẻ tấn công vẫn cần mã xác thực từ
              thiết bị của bạn.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MfaSetupPage;
