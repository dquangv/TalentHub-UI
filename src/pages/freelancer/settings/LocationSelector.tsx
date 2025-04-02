import React, { useState, useEffect, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import countryService, { Country, Province } from '@/api/countryService';
import { Check, ChevronsUpDown, Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationSelectorProps {
    countryId: string | null;
    provinceId: string | null;
    onCountryChange: (country: string | null) => void;
    onProvinceChange: (province: string | null) => void;
    disabled?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
    countryId,
    provinceId,
    onCountryChange,
    onProvinceChange,
    disabled = false
}) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [countryOpen, setCountryOpen] = useState(false);
    const [provinceOpen, setProvinceOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(countryId);
    const [selectedProvince, setSelectedProvince] = useState<string | null>(provinceId);
    const [loadingCountries, setLoadingCountries] = useState<boolean>(false);
    const [loadingProvinces, setLoadingProvinces] = useState<boolean>(false);
    const [countrySearchValue, setCountrySearchValue] = useState('');
    const [provinceSearchValue, setProvinceSearchValue] = useState('');

    useEffect(() => {
        const fetchCountries = async () => {
            if (loadingCountries) return;

            setLoadingCountries(true);
            try {
                const countriesList = await countryService.getAllCountries();
                setCountries(Array.isArray(countriesList) ? countriesList : []);

                if (countryId && Array.isArray(countriesList)) {
                    setSelectedCountry(countryId);
                    const country = countriesList.find(c => c.name === countryId);
                    if (country) {
                        fetchProvincesByCountryId(country.id);
                    }
                }
            } catch (error) {
                console.error('Error fetching countries:', error);
                setCountries([]);
            } finally {
                setLoadingCountries(false);
            }
        };

        fetchCountries();
    }, []);

    const fetchProvincesByCountryId = async (countryId: string) => {
        if (!countryId || loadingProvinces) return;

        setLoadingProvinces(true);
        try {
            const provincesList = await countryService.getProvincesByCountry(countryId);
            setProvinces(Array.isArray(provincesList) ? provincesList : []);

            if (provinceId) {
                setSelectedProvince(provinceId);
            }
        } catch (error) {
            console.error(`Error fetching provinces for country ${countryId}:`, error);
            setProvinces([]);
        } finally {
            setLoadingProvinces(false);
        }
    };

    useEffect(() => {
        if (countryId !== selectedCountry) {
            setSelectedCountry(countryId);
        }
        if (provinceId !== selectedProvince) {
            setSelectedProvince(provinceId);
        }
    }, [countryId, provinceId]);

    const handleCountrySelect = (name: string, id: string) => {
        setSelectedCountry(name);
        onCountryChange(name);
        setCountryOpen(false);
        setCountrySearchValue('');

        setSelectedProvince(null);
        onProvinceChange(null);
        setProvinces([]);

        fetchProvincesByCountryId(id);
    };

    const handleProvinceSelect = (name: string) => {
        setSelectedProvince(name);
        onProvinceChange(name);
        setProvinceOpen(false);
        setProvinceSearchValue('');
    };

    const filteredCountries = React.useMemo(() => {
        if (!Array.isArray(countries)) return [];

        return countrySearchValue.trim() === ''
            ? countries
            : countries.filter(country =>
                country &&
                country.name &&
                country.name.toLowerCase().includes(countrySearchValue.toLowerCase())
            );
    }, [countries, countrySearchValue]);

    const filteredProvinces = React.useMemo(() => {
        if (!Array.isArray(provinces)) return [];

        return provinceSearchValue.trim() === ''
            ? provinces
            : provinces.filter(province =>
                province &&
                province.name &&
                province.name.toLowerCase().includes(provinceSearchValue.toLowerCase())
            );
    }, [provinces, provinceSearchValue]);

    return (
        <div className="space-y-3">
            {/* Country Selector */}
            <div className="relative">
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={countryOpen}
                            className="w-full justify-between"
                            disabled={disabled || loadingCountries}
                        >
                            {loadingCountries ? (
                                <div className="flex items-center">
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang tải...
                                </div>
                            ) : (
                                selectedCountry || "Chọn quốc gia"
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <div className="p-2">
                            <div className="relative mb-2">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm quốc gia..."
                                    className="pl-8"
                                    value={countrySearchValue}
                                    onChange={(e) => setCountrySearchValue(e.target.value)}
                                />
                            </div>

                            {loadingCountries ? (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            ) : filteredCountries.length > 0 ? (
                                <div className="max-h-60 overflow-y-auto">
                                    {filteredCountries.map((country) => (
                                        <div
                                            key={country.id}
                                            className={cn(
                                                "flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded hover:bg-muted",
                                                selectedCountry === country.name && "bg-muted"
                                            )}
                                            onClick={() => handleCountrySelect(country.name, country.id)}
                                        >
                                            <div className="flex-shrink-0">
                                                {selectedCountry === country.name && (
                                                    <Check className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div className="flex items-center">
                                                {country.flag && (
                                                    <img
                                                        src={country.flag}
                                                        alt={country.name}
                                                        className="w-4 h-3 mr-2 object-cover"
                                                    />
                                                )}
                                                {country.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center py-4 text-sm text-muted-foreground">
                                    Không tìm thấy quốc gia
                                </p>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Province Selector */}
            <div className="relative">
                <Popover open={provinceOpen} onOpenChange={setProvinceOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={provinceOpen}
                            className="w-full justify-between"
                            disabled={disabled || loadingProvinces || !selectedCountry}
                        >
                            {loadingProvinces ? (
                                <div className="flex items-center">
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang tải...
                                </div>
                            ) : (
                                selectedProvince || "Chọn tỉnh/thành phố"
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
                                    className="pl-8"
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
                                            key={province.id}
                                            className={cn(
                                                "flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded hover:bg-muted",
                                                selectedProvince === province.name && "bg-muted"
                                            )}
                                            onClick={() => handleProvinceSelect(province.name)}
                                        >
                                            <div className="flex-shrink-0">
                                                {selectedProvince === province.name && (
                                                    <Check className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div>
                                                {province.name}
                                            </div>
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
        </div>
    );
};

export default LocationSelector;
