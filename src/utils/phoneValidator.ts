/**
 * PhoneValidator - Tiện ích xác thực số điện thoại
 * Hỗ trợ xác thực số điện thoại Việt Nam và quốc tế
 */

/**
 * Kết quả xác thực số điện thoại
 */
export interface PhoneValidationResult {
  isValid: boolean;
  message: string;
  phoneNumber: string;
}

/**
 * Tùy chọn xác thực số điện thoại
 */
export interface PhoneValidationOptions {
  acceptInternational?: boolean;
  onlyVietnam?: boolean;
  mode?: "strict" | "loose";
}

/**
 * Loại bỏ tất cả ký tự không phải số từ chuỗi đầu vào
 * @param {string} phoneNumber - Chuỗi số điện thoại đầu vào
 * @returns {string} - Chuỗi chỉ chứa các chữ số
 */
const stripNonDigits = (phoneNumber: string): string => {
  if (!phoneNumber) return "";
  return phoneNumber.replace(/\D/g, "");
};

/**
 * Kiểm tra số điện thoại Việt Nam
 * @param {string} phoneNumber - Số điện thoại cần kiểm tra
 * @returns {boolean} - true nếu là số điện thoại Việt Nam hợp lệ
 */
const isVietnamesePhoneNumber = (phoneNumber: string): boolean => {
  const stripped = stripNonDigits(phoneNumber);

  // Đầu số Việt Nam hợp lệ (cập nhật tháng 4/2025)
  const validPrefixes = [
    // Viettel
    "032",
    "033",
    "034",
    "035",
    "036",
    "037",
    "038",
    "039", // 03x
    "086",
    "096",
    "097",
    "098", // 08x, 09x

    // Vinaphone
    "081",
    "082",
    "083",
    "084",
    "085", // 08x
    "088",
    "091",
    "094", // 08x, 09x

    // Mobifone
    "070",
    "076",
    "077",
    "078",
    "079", // 07x
    "089",
    "090",
    "093", // 08x, 09x

    // Vietnamobile
    "056",
    "058",
    "092", // 05x, 09x

    // GMobile
    "059",
    "099", // 05x, 09x

    // iTelecom
    "087", // 08x
  ];

  // Kiểm tra độ dài (10 chữ số) và đầu số hợp lệ
  if (stripped.length === 10) {
    const prefix = stripped.substring(0, 3);
    return validPrefixes.includes(prefix);
  }

  // Hỗ trợ định dạng có thêm mã quốc gia +84
  if (stripped.length === 11 && stripped.startsWith("84")) {
    const prefix = stripped.substring(2, 5);
    return validPrefixes.includes(prefix);
  }

  return false;
};

/**
 * Kiểm tra số điện thoại quốc tế
 * @param {string} phoneNumber - Số điện thoại cần kiểm tra
 * @returns {boolean} - true nếu là số điện thoại quốc tế hợp lệ
 */
const isInternationalPhoneNumber = (phoneNumber: string): boolean => {
  // Quy tắc cơ bản cho số điện thoại quốc tế
  // - Phải bắt đầu bằng dấu + và ít nhất 7 chữ số
  // - Không chứa ký tự đặc biệt ngoại trừ +, -, (, ), dấu cách
  const cleanedNumber = phoneNumber.replace(/[-\s()]/g, "");
  const pattern = /^\+[0-9]{7,15}$/;

  return pattern.test(cleanedNumber);
};

/**
 * Hàm xác thực tổng hợp cho số điện thoại
 * @param {string} phoneNumber - Số điện thoại cần xác thực
 * @param {PhoneValidationOptions} options - Tùy chọn xác thực
 * @returns {PhoneValidationResult} - Kết quả xác thực
 */
const validatePhoneNumber = (
  phoneNumber: string,
  options: PhoneValidationOptions = {}
): PhoneValidationResult => {
  const {
    acceptInternational = true,
    onlyVietnam = false,
  } = options;

  // Trường hợp không có số điện thoại
  if (!phoneNumber || phoneNumber.trim() === "") {
    return {
      isValid: false,
      message: "Số điện thoại không được để trống",
      phoneNumber: "",
    };
  }

  // Xử lý số trong nước
  const isVNPhone = isVietnamesePhoneNumber(phoneNumber);

  // Xử lý số quốc tế nếu được chấp nhận
  const isIntlPhone =
    acceptInternational && !onlyVietnam
      ? isInternationalPhoneNumber(phoneNumber)
      : false;

  // Số điện thoại hợp lệ nếu là số Việt Nam hoặc số quốc tế được chấp nhận
  const isValid = isVNPhone || isIntlPhone;

  // Định dạng lại số điện thoại
  let formattedNumber = "";
  let message = "";

  if (isValid) {
    const stripped = stripNonDigits(phoneNumber);

    if (isVNPhone) {
      // Định dạng số Việt Nam
      if (stripped.length === 10) {
        formattedNumber = stripped.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
      } else if (stripped.length === 11 && stripped.startsWith("84")) {
        formattedNumber =
          "+" + stripped.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4");
      }
      message = "Số điện thoại hợp lệ";
    } else if (isIntlPhone) {
      // Giữ nguyên định dạng quốc tế
      formattedNumber = phoneNumber.trim();
      message = "Số điện thoại quốc tế hợp lệ";
    }
  } else {
    if (onlyVietnam) {
      message = "Số điện thoại không hợp lệ";
    } else {
      message = "Số điện thoại không hợp lệ";
    }
  }

  return {
    isValid,
    message,
    phoneNumber: formattedNumber,
  };
};

/**
 * Kiểm tra nhanh số điện thoại Việt Nam
 * @param {string} phoneNumber - Số điện thoại cần kiểm tra
 * @returns {boolean} - Kết quả xác thực
 */
const isValidVietnamesePhone = (phoneNumber: string): boolean => {
  return isVietnamesePhoneNumber(phoneNumber);
};

export {
  validatePhoneNumber,
  isValidVietnamesePhone,
  isVietnamesePhoneNumber,
  isInternationalPhoneNumber,
  stripNonDigits,
};

// Sử dụng mặc định
export default validatePhoneNumber;
