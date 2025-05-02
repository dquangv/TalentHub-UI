import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Lock,
  Key,
  ShieldCheck,
  Copy,
  Smartphone,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { notification } from "antd";
import userService from "@/api/userService";
import api from "@/api/axiosConfig";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";

const PASSWORD_PATTERN = /^.{3,}$/;

const Security = () => {
  // Password states
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // MFA states
  const [isLoadingMfa, setIsLoadingMfa] = useState(false);
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [setupStep, setSetupStep] = useState(1); // 1: initial, 2: scan QR, 3: verify code
  const [hasPassword, setHasPassword] = useState(true);
  const [isSettingInitialPassword, setIsSettingInitialPassword] =
    useState(false);
  const [initialPassword, setInitialPassword] = useState({
    new: "",
    confirm: "",
  });
  const [initialPasswordErrors, setInitialPasswordErrors] = useState({
    new: "",
    confirm: "",
  });
  // Dialog state for MFA disable confirmation
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);

  // Get user info
  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

  // Load current MFA status
  useEffect(() => {
    if (!user?.email) return;

    const checkMfaStatus = async () => {
      try {
        const response = await api.get(
          `/v1/auth/mfa/status?email=${user.email}`
        );
        const isEnabled = response.data || false;
        console.log(response.data?.data);

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

  useEffect(() => {
    if (!user?.email) return;

    const checkPasswordStatus = async () => {
      try {
        const response = await api.get(
          `/api/v1/account/is-password-set?email=${user.email}`
        );
        setHasPassword(response.data || false);
      } catch (err) {
        console.error("Error checking password status:", err);
        setHasPassword(true);
      }
    };

    checkPasswordStatus();
  }, [user?.email]);
  // Password change functions
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    setErrors({
      current: "",
      new: "",
      confirm: "",
    });

    const userEmail = user.email;
    let hasError = false;

    if (!userEmail) {
      notification.error({
        message: "Lỗi",
        description:
          "Không thể xác định email người dùng. Vui lòng đăng nhập lại.",
      });
      return;
    }

    if (!passwords.current) {
      setErrors((prev) => ({
        ...prev,
        current: "Vui lòng nhập mật khẩu hiện tại",
      }));
      hasError = true;
    }

    if (!passwords.new) {
      setErrors((prev) => ({ ...prev, new: "Vui lòng nhập mật khẩu mới" }));
      hasError = true;
    } else if (!PASSWORD_PATTERN.test(passwords.new)) {
      setErrors((prev) => ({
        ...prev,
        new: "Mật khẩu phải có ít nhất 6 ký tự",
      }));
      hasError = true;
    }

    if (!passwords.confirm) {
      setErrors((prev) => ({ ...prev, confirm: "Vui lòng xác nhận mật khẩu" }));
      hasError = true;
    } else if (passwords.new !== passwords.confirm) {
      setErrors((prev) => ({
        ...prev,
        confirm: "Mật khẩu xác nhận không trùng khớp",
      }));
      hasError = true;
    }

    if (hasError) return;

    // Submit password change
    try {
      setLoading(true);

      const response = await userService.changePassword({
        email: userEmail,
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });

      if (response.status === 200) {
        notification.success({
          message: "Thành công",
          description: "Mật khẩu đã được cập nhật.",
        });

        // Reset form
        setPasswords({
          current: "",
          new: "",
          confirm: "",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);

      if (error.response?.status === 400) {
        notification.error({
          message: "Lỗi",
          description: "Mật khẩu hiện tại không đúng.",
        });
      } else {
        notification.error({
          message: "Lỗi",
          description: "Đã xảy ra lỗi khi cập nhật mật khẩu.",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSetInitialPassword = async (e) => {
    e.preventDefault();

    setInitialPasswordErrors({
      new: "",
      confirm: "",
    });

    const userEmail = user.email;
    let hasError = false;

    if (!userEmail) {
      notification.error({
        message: "Lỗi",
        description:
          "Không thể xác định email người dùng. Vui lòng đăng nhập lại.",
      });
      return;
    }

    if (!initialPassword.new) {
      setInitialPasswordErrors((prev) => ({
        ...prev,
        new: "Vui lòng nhập mật khẩu mới",
      }));
      hasError = true;
    } else if (!PASSWORD_PATTERN.test(initialPassword.new)) {
      setInitialPasswordErrors((prev) => ({
        ...prev,
        new: "Mật khẩu phải có ít nhất 3 ký tự",
      }));
      hasError = true;
    }

    if (!initialPassword.confirm) {
      setInitialPasswordErrors((prev) => ({
        ...prev,
        confirm: "Vui lòng xác nhận mật khẩu",
      }));
      hasError = true;
    } else if (initialPassword.new !== initialPassword.confirm) {
      setInitialPasswordErrors((prev) => ({
        ...prev,
        confirm: "Mật khẩu xác nhận không trùng khớp",
      }));
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);

      // We can use the same changePassword API but with empty currentPassword
      const response = await userService.changePassword({
        email: userEmail,
        currentPassword: "", // Empty string as this is a new password setup
        newPassword: initialPassword.new,
      });

      if (response.status === 200) {
        notification.success({
          message: "Thành công",
          description: "Mật khẩu đã được thiết lập.",
        });

        // Set hasPassword to true so the UI updates
        setHasPassword(true);
        setIsSettingInitialPassword(false);

        // Reset form
        setInitialPassword({
          new: "",
          confirm: "",
        });
      }
    } catch (error) {
      console.error("Error setting initial password:", error);
      notification.error({
        message: "Lỗi",
        description: "Đã xảy ra lỗi khi thiết lập mật khẩu.",
      });
    } finally {
      setLoading(false);
    }
  };
  // MFA functions
  const handleStartSetup = async () => {
    if (!user?.email) {
      notification.error({
        message: "Lỗi",
        description: "Bạn cần đăng nhập để thiết lập xác thực 2 lớp",
      });
      return;
    }

    setIsLoadingMfa(true);

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
      setIsLoadingMfa(false);
    }
  };

  const copySecretKey = () => {
    navigator.clipboard.writeText(secretKey);
    notification.success({
      message: "Đã sao chép",
      description: "Mã bí mật đã được sao chép vào clipboard",
    });
  };

  const verifyAndEnableMfa = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      notification.warning({
        message: "Mã không hợp lệ",
        description: "Vui lòng nhập mã xác thực 6 số từ ứng dụng của bạn",
      });
      return;
    }

    setIsLoadingMfa(true);

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
      setIsLoadingMfa(false);
    }
  };

  // Show disable MFA dialog
  const showDisableDialog = () => {
    setDisableDialogOpen(true);
  };

  // Hide disable MFA dialog
  const hideDisableDialog = () => {
    setDisableDialogOpen(false);
  };

  // Disable MFA function, now triggered from Dialog
  const handleDisableMfa = async () => {
    setIsLoadingMfa(true);
    hideDisableDialog();

    try {
      await api.post(`/v1/auth/mfa/disable?email=${user.email}`);

      notification.success({
        message: "Đã tắt xác thực 2 lớp",
        description: "Xác thực 2 lớp đã được tắt cho tài khoản của bạn",
      });

      setIsMfaEnabled(false);
    } catch (err) {
      console.error("Error disabling MFA:", err);
      notification.error({
        message: "Lỗi",
        description: "Không thể tắt xác thực 2 lớp. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoadingMfa(false);
    }
  };

  const handleCancelSetup = () => {
    setIsSetupMode(false);
    setSetupStep(1);
    setVerificationCode("");
    setQrCodeImage("");
    setSecretKey("");
  };

  const handleNextStep = () => {
    setSetupStep(3);
  };

  const handlePreviousStep = () => {
    setSetupStep(2);
  };

  // MFA UI render functions
  const renderMfaStatus = () => {
    return (
      <div className="flex flex-col items-center space-y-6 py-4">
        <div className="rounded-full bg-primary/10 p-6">
          <ShieldCheck
            size={48}
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
          <Button onClick={showDisableDialog} disabled={isLoadingMfa}>
            {isLoadingMfa ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Tắt xác thực 2 lớp"
            )}
          </Button>
        ) : (
          <Button onClick={handleStartSetup} disabled={isLoadingMfa}>
            {isLoadingMfa ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Bật xác thực 2 lớp"
            )}
          </Button>
        )}
      </div>
    );
  };

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
            disabled={isLoadingMfa || verificationCode.length !== 6}
          >
            {isLoadingMfa ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xác thực...
              </>
            ) : (
              "Xác nhận"
            )}
          </Button>
        </div>
      </div>
    );
  };

  // Main component render
  return (
    <div className="space-y-6 mb-8">
      {/* Disable MFA Confirmation Dialog */}
      <Dialog open={disableDialogOpen} onOpenChange={setDisableDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Tắt xác thực 2 lớp
            </DialogTitle>
            <DialogDescription>
              Việc tắt xác thực 2 lớp sẽ làm giảm tính bảo mật cho tài khoản của
              bạn. Bạn có chắc chắn muốn tiếp tục?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Alert
              variant="warning"
              className="bg-amber-50 text-amber-800 border-amber-200"
            >
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle>Cảnh báo bảo mật</AlertTitle>
              <AlertDescription>
                Không có xác thực 2 lớp, tài khoản của bạn sẽ chỉ được bảo vệ
                bằng mật khẩu. Điều này có thể làm tăng nguy cơ tài khoản bị xâm
                nhập.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={hideDisableDialog}
              className="mt-2 sm:mt-0"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisableMfa}
              disabled={isLoadingMfa}
              className="mt-2 sm:mt-0"
            >
              {isLoadingMfa ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Tắt xác thực 2 lớp"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {!hasPassword && renderInitialPasswordSetup()}

      {hasPassword && (
        <>
          <FadeInWhenVisible>
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <CardTitle>Xác thực hai lớp (2FA)</CardTitle>
                </div>
                <CardDescription>
                  Bảo vệ tài khoản của bạn bằng lớp bảo mật bổ sung
                </CardDescription>
              </CardHeader>

              <CardContent>
                {!isSetupMode && renderMfaStatus()}
                {isSetupMode && setupStep === 2 && renderScanQrStep()}
                {isSetupMode && setupStep === 3 && renderVerifyCodeStep()}
              </CardContent>

              {!isSetupMode && (
                <div className="px-6 pb-6">
                  <Separator className="mb-4" />
                  <div className="text-sm text-muted-foreground">
                    <p className="text-center">
                      Xác thực hai lớp giúp bảo vệ tài khoản của bạn khỏi truy
                      cập trái phép. Ngay cả khi mật khẩu bị lộ, kẻ tấn công vẫn
                      cần mã xác thực từ thiết bị của bạn.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </FadeInWhenVisible>
          <FadeInWhenVisible>
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-primary" />
                  <CardTitle>Đổi mật khẩu</CardTitle>
                </div>
                <CardDescription>
                  Cập nhật mật khẩu của bạn để bảo vệ tài khoản
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        className="pl-10"
                        value={passwords.current}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            current: e.target.value,
                          })
                        }
                      />
                    </div>
                    {errors.current && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.current}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mật khẩu mới</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        className="pl-10"
                        value={passwords.new}
                        onChange={(e) =>
                          setPasswords({ ...passwords, new: e.target.value })
                        }
                      />
                    </div>
                    {errors.new && (
                      <p className="text-sm text-red-500 mt-1">{errors.new}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        className="pl-10"
                        value={passwords.confirm}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            confirm: e.target.value,
                          })
                        }
                      />
                    </div>
                    {errors.confirm && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.confirm}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang cập nhật...
                        </>
                      ) : (
                        "Cập nhật mật khẩu"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </FadeInWhenVisible>
        </>
      )}
    </div>
  );
};

export default Security;
