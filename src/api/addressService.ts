import axios from 'axios';

export interface Province {
    code: number | string;
    name: string;
    division_type: string;
    codename: string;
    phone_code: number | string;
    districts?: District[];
}

export interface District {
    code: number | string;
    name: string;
    division_type: string;
    codename: string;
    province_code: number | string;
    wards?: Ward[];
}

export interface Ward {
    code: number | string;
    name: string;
    division_type: string;
    codename: string;
    district_code: number | string;
}

export interface AddressData {
    province: Province | null;
    district: District | null;
    ward: Ward | null;
    streetAddress: string;
}

const API_URL = 'https://provinces.open-api.vn/api';

const addressService = {
    getProvinces: async (): Promise<Province[]> => {
        try {
            const response = await axios.get(`${API_URL}/p`);
            return response.data;
        } catch (error) {
            console.error('Error fetching provinces:', error);
            return [];
        }
    },

    getProvinceDetails: async (provinceCode: string | number): Promise<Province | null> => {
        try {
            const response = await axios.get(`${API_URL}/p/${provinceCode}?depth=2`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching province details for ${provinceCode}:`, error);
            return null;
        }
    },

    getDistrictDetails: async (districtCode: string | number): Promise<District | null> => {
        try {
            const response = await axios.get(`${API_URL}/d/${districtCode}?depth=2`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching district details for ${districtCode}:`, error);
            return null;
        }
    },

    formatFullAddress: (addressData: AddressData): string => {
        const parts = [];

        if (addressData.streetAddress) {
            parts.push(addressData.streetAddress);
        }

        if (addressData.ward) {
            parts.push(addressData.ward.name);
        }

        if (addressData.district) {
            parts.push(addressData.district.name);
        }

        if (addressData.province) {
            parts.push(addressData.province.name);
        }

        return parts.join(', ');
    },

    parseAddress: (fullAddress: string): { streetAddress: string, otherParts: string } => {
        if (!fullAddress) return { streetAddress: '', otherParts: '' };

        const parts = fullAddress.split(',');

        if (parts.length <= 1) {
            return {
                streetAddress: fullAddress.trim(),
                otherParts: ''
            };
        }

        return {
            streetAddress: parts[0].trim(),
            otherParts: parts.slice(1).join(',').trim()
        };
    }
};

export default addressService;