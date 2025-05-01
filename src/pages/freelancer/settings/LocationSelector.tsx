import React, { useState, useEffect, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import addressService, { Province, District } from "@/api/addressService";
import { notification } from "antd";
import LoadingEffect from "@/components/ui/LoadingEffect";

interface LocationSelectorProps {
  countryId: string | null; // Mặc dù UI hiển thị là Province/City nhưng vẫn giữ tên countryId
  provinceId: string | null; // Mặc dù UI hiển thị là District nhưng vẫn giữ tên provinceId
  onCountryChange: (country: string | null) => void; // Vẫn giữ tên để tương thích với code hiện tại
  onProvinceChange: (province: string | null) => void; // Vẫn giữ tên để tương thích với code hiện tại
  disabled?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  countryId,
  provinceId,
  onCountryChange,
  onProvinceChange,
  disabled = false,
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );
  const [loadingProvinces, setLoadingProvinces] = useState<boolean>(false);
  const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);
  const [provinceSearchValue, setProvinceSearchValue] = useState("");
  const [districtSearchValue, setDistrictSearchValue] = useState("");

  // Lấy danh sách tỉnh/thành phố khi component được tạo
  useEffect(() => {
    const fetchProvinces = async () => {
      if (loadingProvinces) return;

      setLoadingProvinces(true);
      try {
        const provincesData = await addressService.getProvinces();
        setProvinces(provincesData);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        notification.error({
          message: "Lỗi",
          description:
            "Không thể tải danh sách tỉnh/thành phố. Vui lòng thử lại sau.",
        });
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  // Khôi phục dữ liệu từ các giá trị đã lưu
  useEffect(() => {
    const loadSavedLocation = async () => {
      // Nếu có countryId (tương ứng với tỉnh/thành phố)
      if (countryId) {
        // Tìm tỉnh/thành phố trong danh sách đã tải
        const province = provinces.find((p) => p.name === countryId);

        if (province) {
          setSelectedProvince(province);

          // Tải danh sách quận/huyện
          if (province.code) {
            try {
              setLoadingDistricts(true);
              const provinceDetails = await addressService.getProvinceDetails(
                province.code.toString()
              );
              if (provinceDetails && provinceDetails.districts) {
                setDistricts(provinceDetails.districts);

                // Nếu có provinceId (tương ứng với quận/huyện)
                if (provinceId) {
                  const district = provinceDetails.districts.find(
                    (d) => d.name === provinceId
                  );
                  if (district) {
                    setSelectedDistrict(district);
                  }
                }
              }
            } catch (error) {
              console.error("Error fetching districts:", error);
            } finally {
              setLoadingDistricts(false);
            }
          }
        }
      }
    };

    if (provinces.length > 0) {
      loadSavedLocation();
    }
  }, [countryId, provinceId, provinces]);

  // Tải danh sách quận/huyện khi chọn tỉnh/thành phố
  const fetchDistrictsByProvinceCode = async (
    provinceCode: string | number
  ) => {
    if (!provinceCode || loadingDistricts) return;

    setLoadingDistricts(true);
    try {
      const provinceDetails = await addressService.getProvinceDetails(
        provinceCode.toString()
      );
      if (provinceDetails && provinceDetails.districts) {
        setDistricts(provinceDetails.districts);
      }
    } catch (error) {
      console.error(
        `Error fetching districts for province ${provinceCode}:`,
        error
      );
      notification.error({
        message: "Lỗi",
        description:
          "Không thể tải danh sách quận/huyện. Vui lòng thử lại sau.",
      });
      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  };

  // Xử lý khi chọn tỉnh/thành phố
  const handleProvinceSelect = (province: Province) => {
    setSelectedProvince(province);
    onCountryChange(province.name); // Lưu ý: Vẫn gọi onCountryChange nhưng giá trị là tên tỉnh/thành phố
    setProvinceOpen(false);
    setProvinceSearchValue("");

    // Reset quận/huyện
    setSelectedDistrict(null);
    onProvinceChange(null);
    setDistricts([]);

    if (province.code) {
      fetchDistrictsByProvinceCode(province.code);
    }
  };

  // Xử lý khi chọn quận/huyện
  const handleDistrictSelect = (district: District) => {
    setSelectedDistrict(district);
    onProvinceChange(district.name); // Lưu ý: Vẫn gọi onProvinceChange nhưng giá trị là tên quận/huyện
    setDistrictOpen(false);
    setDistrictSearchValue("");
  };

  // Lọc danh sách tỉnh/thành phố theo từ khóa tìm kiếm
  const filteredProvinces = React.useMemo(() => {
    return provinceSearchValue.trim() === ""
      ? provinces
      : provinces.filter((province) =>
          province.name
            .toLowerCase()
            .includes(provinceSearchValue.toLowerCase())
        );
  }, [provinces, provinceSearchValue]);

  // Lọc danh sách quận/huyện theo từ khóa tìm kiếm
  const filteredDistricts = React.useMemo(() => {
    return districtSearchValue.trim() === ""
      ? districts
      : districts.filter((district) =>
          district.name
            .toLowerCase()
            .includes(districtSearchValue.toLowerCase())
        );
  }, [districts, districtSearchValue]);

  return (
    <div className="space-y-3">
      {/* Tỉnh/Thành phố Selector (Province/City) */}
      <div className="relative">
        <Popover open={provinceOpen} onOpenChange={setProvinceOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={provinceOpen}
              className="w-full justify-between"
              disabled={disabled || loadingProvinces}
            >
              {loadingProvinces ? (
                <LoadingEffect />
              ) : (
                selectedProvince?.name || "Chọn Tỉnh/Thành phố"
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <div className="p-2">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm tỉnh/thành phố..."
                  className="pl-8 w-full"
                  value={provinceSearchValue}
                  onChange={(e) => setProvinceSearchValue(e.target.value)}
                />
              </div>

              {loadingProvinces ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : filteredProvinces.length > 0 ? (
                <div className="max-h-60 overflow-y-auto">
                  {filteredProvinces.map((province) => (
                    <div
                      key={province.code}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded hover:bg-muted",
                        selectedProvince?.code === province.code && "bg-muted"
                      )}
                      onClick={() => handleProvinceSelect(province)}
                    >
                      <div className="flex-shrink-0">
                        {selectedProvince?.code === province.code && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                      <div>{province.name}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-sm text-muted-foreground">
                  Không tìm thấy tỉnh/thành phố
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Quận/Huyện Selector (District) */}
      <div className="relative">
        <Popover open={districtOpen} onOpenChange={setDistrictOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={districtOpen}
              className="w-full justify-between"
              disabled={disabled || loadingDistricts || !selectedProvince}
            >
              {loadingDistricts ? (
                <LoadingEffect />
              ) : (
                selectedDistrict?.name || "Chọn Quận/Huyện"
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <div className="p-2">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm quận/huyện..."
                  className="pl-8 w-full"
                  value={districtSearchValue}
                  onChange={(e) => setDistrictSearchValue(e.target.value)}
                />
              </div>

              {loadingDistricts ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : filteredDistricts.length > 0 ? (
                <div className="max-h-60 overflow-y-auto">
                  {filteredDistricts.map((district) => (
                    <div
                      key={district.code}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded hover:bg-muted",
                        selectedDistrict?.code === district.code && "bg-muted"
                      )}
                      onClick={() => handleDistrictSelect(district)}
                    >
                      <div className="flex-shrink-0">
                        {selectedDistrict?.code === district.code && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                      <div>{district.name}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-sm text-muted-foreground">
                  {selectedProvince
                    ? "Không tìm thấy quận/huyện"
                    : "Vui lòng chọn tỉnh/thành phố trước"}
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default LocationSelector;
