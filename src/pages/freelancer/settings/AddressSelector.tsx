import React, { useState, useEffect, useRef } from "react";
import { Edit, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import addressService, {
  Province,
  District,
  Ward,
  AddressData,
} from "@/api/addressService";
import { Empty } from "antd";
import LoadingEffect from "@/components/ui/LoadingEffect";

interface AddressSelectorProps {
  value: string;
  onChange: (address: string) => void;
  className?: string;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [addressData, setAddressData] = useState<AddressData>({
    province: null,
    district: null,
    ward: null,
    streetAddress: "",
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const [provinceSearch, setProvinceSearch] = useState<string>("");
  const [districtSearch, setDistrictSearch] = useState<string>("");
  const [wardSearch, setWardSearch] = useState<string>("");

  const [isLoadingProvinces, setIsLoadingProvinces] = useState<boolean>(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState<boolean>(false);
  const [isLoadingWards, setIsLoadingWards] = useState<boolean>(false);

  const [initialLoadComplete, setInitialLoadComplete] =
    useState<boolean>(false);

  // Refs for search inputs to maintain focus
  const provinceSearchRef = useRef<HTMLInputElement>(null);
  const districtSearchRef = useRef<HTMLInputElement>(null);
  const wardSearchRef = useRef<HTMLInputElement>(null);

  // Load provinces on first render
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const provincesData = await addressService.getProvinces();
        setProvinces(provincesData);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  // Parse initial address when component mounts
  useEffect(() => {
    const loadInitialAddress = async () => {
      if (value && !initialLoadComplete) {
        setLoading(true);
        try {
          // Assume addressService.parseAddress returns a more complete analysis
          // with provinceCode, districtCode, wardCode
          const parsedAddress = addressService.parseAddress(value);

          // Set street address immediately
          setAddressData((prev) => ({
            ...prev,
            streetAddress: parsedAddress.streetAddress || "",
          }));

          // Load provinces if not already loaded
          if (provinces.length === 0) {
            const provincesData = await addressService.getProvinces();
            setProvinces(provincesData);
          }

          // If we have province code from parsed address
          if (parsedAddress.provinceCode) {
            const province =
              provinces.find(
                (p) => p.code.toString() === parsedAddress.provinceCode
              ) || null;

            if (province) {
              // Set province
              setAddressData((prev) => ({
                ...prev,
                province,
              }));

              // Load districts for this province
              const provinceDetails = await addressService.getProvinceDetails(
                province.code.toString()
              );
              if (provinceDetails && provinceDetails.districts) {
                setDistricts(provinceDetails.districts);

                // If we have district code
                if (parsedAddress.districtCode) {
                  const district =
                    provinceDetails.districts.find(
                      (d) => d.code.toString() === parsedAddress.districtCode
                    ) || null;

                  if (district) {
                    // Set district
                    setAddressData((prev) => ({
                      ...prev,
                      district,
                    }));

                    // Load wards for this district
                    const districtDetails =
                      await addressService.getDistrictDetails(
                        district.code.toString()
                      );
                    if (districtDetails && districtDetails.wards) {
                      setWards(districtDetails.wards);

                      // If we have ward code
                      if (parsedAddress.wardCode) {
                        const ward =
                          districtDetails.wards.find(
                            (w) => w.code.toString() === parsedAddress.wardCode
                          ) || null;

                        if (ward) {
                          // Set ward
                          setAddressData((prev) => ({
                            ...prev,
                            ward,
                          }));
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("Error loading initial address:", error);
        } finally {
          setLoading(false);
          setInitialLoadComplete(true);
        }
      }
    };

    loadInitialAddress();
  }, [value, provinces, initialLoadComplete]);

  // Debounced update function to prevent too many rerenders
  const debouncedUpdateAddress = useRef<NodeJS.Timeout | null>(null);

  const updateFullAddress = (data: AddressData) => {
    // Clear any pending update
    if (debouncedUpdateAddress.current) {
      clearTimeout(debouncedUpdateAddress.current);
    }

    // Debounce the actual update to reduce UI jitter
    debouncedUpdateAddress.current = setTimeout(() => {
      const fullAddress = addressService.formatFullAddress(data);
      onChange(fullAddress);
    }, 300);
  };

  const handleProvinceChange = async (provinceCode: string) => {
    setIsLoadingDistricts(true);
    setLoading(true);

    try {
      const province =
        provinces.find((p) => p.code.toString() === provinceCode) || null;

      // Update state
      setAddressData((prev) => ({
        ...prev,
        province,
        district: null,
        ward: null,
      }));

      setDistricts([]);
      setWards([]);

      if (province) {
        const provinceDetails = await addressService.getProvinceDetails(
          provinceCode
        );

        if (provinceDetails && provinceDetails.districts) {
          setDistricts(provinceDetails.districts);
        }

        // Update address
        updateFullAddress({
          ...addressData,
          province,
          district: null,
          ward: null,
        });
      }
    } catch (error) {
      console.error(`Error handling province change:`, error);
    } finally {
      setIsLoadingDistricts(false);
      setLoading(false);
    }
  };

  const handleDistrictChange = async (districtCode: string) => {
    setIsLoadingWards(true);
    setLoading(true);

    try {
      const district =
        districts.find((d) => d.code.toString() === districtCode) || null;

      // Update state
      setAddressData((prev) => ({
        ...prev,
        district,
        ward: null,
      }));

      setWards([]);

      if (district) {
        const districtDetails = await addressService.getDistrictDetails(
          districtCode
        );

        if (districtDetails && districtDetails.wards) {
          setWards(districtDetails.wards);
        }

        // Update address
        updateFullAddress({
          ...addressData,
          district,
          ward: null,
        });
      }
    } catch (error) {
      console.error(`Error handling district change:`, error);
    } finally {
      setIsLoadingWards(false);
      setLoading(false);
    }
  };

  const handleWardChange = (wardCode: string) => {
    const ward = wards.find((w) => w.code.toString() === wardCode) || null;

    const updatedAddressData = {
      ...addressData,
      ward,
    };

    setAddressData(updatedAddressData);
    updateFullAddress(updatedAddressData);
  };

  const handleStreetAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const streetAddress = e.target.value;

    const updatedAddressData = {
      ...addressData,
      streetAddress,
    };

    setAddressData(updatedAddressData);
    updateFullAddress(updatedAddressData);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Memoize filtered lists to prevent unnecessary calculations
  const filteredProvinces = React.useMemo(
    () =>
      provinces.filter((province) =>
        province.name.toLowerCase().includes(provinceSearch.toLowerCase())
      ),
    [provinces, provinceSearch]
  );

  const filteredDistricts = React.useMemo(
    () =>
      districts.filter((district) =>
        district.name.toLowerCase().includes(districtSearch.toLowerCase())
      ),
    [districts, districtSearch]
  );

  const filteredWards = React.useMemo(
    () =>
      wards.filter((ward) =>
        ward.name.toLowerCase().includes(wardSearch.toLowerCase())
      ),
    [wards, wardSearch]
  );

  // Handle input focus with proper event stopping
  const handleProvinceSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProvinceSearch(e.target.value);
  };

  const handleDistrictSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDistrictSearch(e.target.value);
  };

  const handleWardSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWardSearch(e.target.value);
  };

  // Prevent event bubbling for input interaction
  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    // Prevent select dropdown from closing on certain keys
    if (["Escape", "Tab", "Enter"].includes(e.key)) {
      return; // Let default behavior handle these
    }
    e.stopPropagation();
  };

  const renderLoadingSpinner = () => (
    <div className="flex items-center justify-center py-2 text-primary">
      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <LoadingEffect />
    </div>
  );

  return (
    <div className={`space-y-2 ${className}`}>
      {!isExpanded ? (
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10 pr-24"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Nhập địa chỉ đầy đủ"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="absolute right-2 top-1"
            onClick={toggleExpanded}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-3 border rounded-md p-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Chi tiết địa chỉ</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleExpanded}
            >
              Thu gọn
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Số nhà, tên đường
              </label>
              <Input
                value={addressData.streetAddress}
                onChange={handleStreetAddressChange}
                placeholder="Số nhà, tên đường"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Tỉnh/Thành phố
              </label>
              <Select
                value={
                  addressData.province
                    ? addressData.province.code.toString()
                    : ""
                }
                onValueChange={handleProvinceChange}
                disabled={isLoadingProvinces}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <div className="px-2 pb-2">
                    <Input
                      ref={provinceSearchRef}
                      placeholder="Tìm kiếm tỉnh/thành phố"
                      className="mb-2"
                      value={provinceSearch}
                      onChange={handleProvinceSearchChange}
                      onClick={handleInputClick}
                      onKeyDown={handleInputKeyDown}
                      onMouseDown={handleInputClick}
                    />
                  </div>
                  {isLoadingProvinces ? (
                    <div className="p-2 text-center">Đang tải...</div>
                  ) : filteredProvinces.length === 0 ? (
                    <div className="p-2 text-center text-muted-foreground">
                      Không tìm thấy kết quả
                    </div>
                  ) : (
                    filteredProvinces.map((province) => (
                      <SelectItem
                        key={province.code}
                        value={province.code.toString()}
                      >
                        {province.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {isLoadingProvinces && (
                <div className="text-xs text-muted-foreground mt-1">
                  Đang tải danh sách tỉnh/thành phố...
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Quận/Huyện
              </label>
              <Select
                value={
                  addressData.district
                    ? addressData.district.code.toString()
                    : ""
                }
                onValueChange={handleDistrictChange}
                disabled={isLoadingDistricts || !addressData.province}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <div className="px-2 pb-2">
                    <Input
                      ref={districtSearchRef}
                      placeholder="Tìm kiếm quận/huyện"
                      className="mb-2"
                      value={districtSearch}
                      onChange={handleDistrictSearchChange}
                      onClick={handleInputClick}
                      onKeyDown={handleInputKeyDown}
                      onMouseDown={handleInputClick}
                    />
                  </div>
                  {isLoadingDistricts ? (
                    <div className="p-2 text-center">Đang tải...</div>
                  ) : districts.length === 0 ? (
                    <div className="p-2 text-center text-muted-foreground">
                      {addressData.province
                        ? "Không có quận/huyện"
                        : "Vui lòng chọn tỉnh/thành phố trước"}
                    </div>
                  ) : filteredDistricts.length === 0 ? (
                    <Empty description="Không tìm thấy kết quả" />
                  ) : (
                    filteredDistricts.map((district) => (
                      <SelectItem
                        key={district.code}
                        value={district.code.toString()}
                      >
                        {district.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {isLoadingDistricts && (
                <div className="text-xs text-muted-foreground mt-1">
                  Đang tải danh sách quận/huyện...
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Phường/Xã
              </label>
              <Select
                value={addressData.ward ? addressData.ward.code.toString() : ""}
                onValueChange={handleWardChange}
                disabled={isLoadingWards || !addressData.district}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phường/xã" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <div className="px-2 pb-2">
                    <Input
                      ref={wardSearchRef}
                      placeholder="Tìm kiếm phường/xã"
                      className="mb-2"
                      value={wardSearch}
                      onChange={handleWardSearchChange}
                      onClick={handleInputClick}
                      onKeyDown={handleInputKeyDown}
                      onMouseDown={handleInputClick}
                    />
                  </div>
                  {isLoadingWards ? (
                    <div className="p-2 text-center">Đang tải...</div>
                  ) : wards.length === 0 ? (
                    <div className="p-2 text-center text-muted-foreground">
                      {addressData.district
                        ? "Không có phường/xã"
                        : "Vui lòng chọn quận/huyện trước"}
                    </div>
                  ) : filteredWards.length === 0 ? (
                    <div className="p-2 text-center text-muted-foreground">
                      Không tìm thấy kết quả
                    </div>
                  ) : (
                    filteredWards.map((ward) => (
                      <SelectItem key={ward.code} value={ward.code.toString()}>
                        {ward.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {isLoadingWards && (
                <div className="text-xs text-muted-foreground mt-1">
                  Đang tải danh sách phường/xã...
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs text-muted-foreground mb-1">
              Địa chỉ đầy đủ:
            </div>
            <div className="text-sm p-2 bg-muted rounded-md">
              {value || "Chưa có địa chỉ"}
            </div>

            {(loading ||
              isLoadingProvinces ||
              isLoadingDistricts ||
              isLoadingWards) &&
              renderLoadingSpinner()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
