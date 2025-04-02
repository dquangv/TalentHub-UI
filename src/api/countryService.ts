import { getProvincesByCountryCode } from './provinceData';
import axios from 'axios';

export interface Country {
    id: string;
    name: string;
    code: string;
    flag?: string;
}

export interface Province {
    id: string;
    name: string;
    countryCode: string;
    countryId: string;
}

export interface LocationData {
    country: Country | null;
    province: Province | null;
}

const COUNTRIES_API_URL = 'https://restcountries.com/v3.1';

const countryService = {
    getAllCountries: async (): Promise<Country[]> => {
        try {
            const response = await axios.get(`${COUNTRIES_API_URL}/all?fields=name,cca2,flags`);

            return response.data.map((country: any) => ({
                id: country.cca2,
                name: country.name.common,
                code: country.cca2,
                flag: country.flags.svg
            })).sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        } catch (error) {
            console.error('Error fetching countries:', error);
            return [];
        }
    },

    getProvincesByCountry: async (countryId: string): Promise<Province[]> => {
        try {
            const staticProvinces = getProvincesByCountryCode(countryId);

            if (staticProvinces && staticProvinces.length > 0) {
                return staticProvinces.map(province => ({
                    id: province.id,
                    name: province.name,
                    countryCode: province.countryCode,
                    countryId: countryId
                }));
            }

            const response = await axios.get(`${COUNTRIES_API_URL}/alpha/${countryId}`);
            const country = response.data[0];

            const provinces: Province[] = [];

            if (country && country.capital && country.capital.length > 0) {
                provinces.push({
                    id: `${countryId}-capital`,
                    name: country.capital[0],
                    countryCode: countryId,
                    countryId: countryId
                });
            }

            return provinces;
        } catch (error) {
            console.error(`Error fetching provinces for country ${countryId}:`, error);
            return [];
        }
    },

    getCountryById: async (countryId: string): Promise<Country | null> => {
        try {
            const response = await axios.get(`${COUNTRIES_API_URL}/alpha/${countryId}`);
            const country = response.data[0];

            return {
                id: country.cca2,
                name: country.name.common,
                code: country.cca2,
                flag: country.flags.svg
            };
        } catch (error) {
            console.error(`Error fetching country details for ${countryId}:`, error);
            return null;
        }
    },

    getProvinceById: async (provinceId: string, countryId: string): Promise<Province | null> => {
        try {
            const provinces = await countryService.getProvincesByCountry(countryId);
            return provinces.find(province => province.id === provinceId) || null;
        } catch (error) {
            console.error(`Error fetching province details for ${provinceId}:`, error);
            return null;
        }
    },

    formatLocationDisplay: (countryName: string | null | undefined, provinceName: string | null | undefined): string => {
        const parts = [];

        if (provinceName) {
            parts.push(provinceName);
        }

        if (countryName) {
            parts.push(countryName);
        }

        return parts.join(', ');
    },


    findCountryIdByName: async (countryName: string | null): Promise<string | null> => {
        if (!countryName) return null;

        try {
            const countries = await countryService.getAllCountries();
            const country = countries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
            return country ? country.id : null;
        } catch (error) {
            console.error(`Error finding country ID for name ${countryName}:`, error);
            return null;
        }
    },

    findProvinceIdByName: async (provinceName: string | null, countryId: string | null): Promise<string | null> => {
        if (!provinceName || !countryId) return null;

        try {
            const provinces = await countryService.getProvincesByCountry(countryId);
            const province = provinces.find(p => p.name.toLowerCase() === provinceName.toLowerCase());
            return province ? province.id : null;
        } catch (error) {
            console.error(`Error finding province ID for name ${provinceName} in country ${countryId}:`, error);
            return null;
        }
    },

    getCountryByName: async (countryName: string | null): Promise<Country | null> => {
        if (!countryName) return null;

        try {
            const countries = await countryService.getAllCountries();
            return countries.find(c => c.name.toLowerCase() === countryName.toLowerCase()) || null;
        } catch (error) {
            console.error(`Error getting country by name ${countryName}:`, error);
            return null;
        }
    },

    getProvinceByName: async (provinceName: string | null, countryName: string | null): Promise<Province | null> => {
        if (!provinceName || !countryName) return null;

        try {
            const countryId = await countryService.findCountryIdByName(countryName);
            if (!countryId) return null;

            const provinces = await countryService.getProvincesByCountry(countryId);
            return provinces.find(p => p.name.toLowerCase() === provinceName.toLowerCase()) || null;
        } catch (error) {
            console.error(`Error getting province by name ${provinceName} in country ${countryName}:`, error);
            return null;
        }
    },

    getLocationInfo: async (countryName: string | null, provinceName: string | null): Promise<LocationData> => {
        const locationData: LocationData = {
            country: null,
            province: null
        };

        if (countryName) {
            locationData.country = await countryService.getCountryByName(countryName);
        }

        if (countryName && provinceName && locationData.country) {
            locationData.province = await countryService.getProvinceByName(provinceName, countryName);
        }

        return locationData;
    },

    getFullLocationDisplay: async (countryName: string | null, provinceName: string | null): Promise<string> => {
        return countryService.formatLocationDisplay(countryName, provinceName);
    }
};

export default countryService;