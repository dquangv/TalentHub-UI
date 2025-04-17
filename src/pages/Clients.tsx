import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Star, MapPin, Search, Filter, X, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import clientsService, { ActiveClient } from '@/api/clientsService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FilterState {
    province: string;
    country: string;
    minBudget: number;
    maxBudget: number;
    industry: string;
    minRating: number;
    title: string;
}

const Clients = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [clients, setClients] = useState<ActiveClient[]>([]);
    const [filteredClients, setFilteredClients] = useState<ActiveClient[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [filters, setFilters] = useState<FilterState>({
        province: '',
        country: '',
        minBudget: 0,
        maxBudget: 50000000,
        industry: '',
        minRating: 0,
        title: '',
    });

    const uniqueProvinces: string[] = [];
    clients.forEach(client => {
        if (client.province && !uniqueProvinces.includes(client.province)) {
            uniqueProvinces.push(client.province);
        }
    });

    const uniqueCountries: string[] = [];
    clients.forEach(client => {
        if (client.country && !uniqueCountries.includes(client.country)) {
            uniqueCountries.push(client.country);
        }
    });

    const uniqueIndustries: string[] = [];
    clients.forEach(client => {
        client.companies.forEach(company => {
            if (company.industry && !uniqueIndustries.includes(company.industry)) {
                uniqueIndustries.push(company.industry);
            }
        });
    });

    const uniqueTitles: string[] = [];
    clients.forEach(client => {
        if (client.title && !uniqueTitles.includes(client.title)) {
            uniqueTitles.push(client.title);
        }
    });

    useEffect(() => {
        const loadClients = async () => {
            setLoading(true);
            try {
                const response = await clientsService.getActiveClients();
                setClients(response.data);
                setFilteredClients(response.data);
            } catch (error) {
                console.error('Error loading clients:', error);
            } finally {
                setLoading(false);
            }
        };

        loadClients();
    }, []);

    const applyFilters = () => {
        let filtered = [...clients];

        if (searchTerm) {
            filtered = filtered.filter(client =>
                client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.companies.some(company =>
                    company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        if (filters.province) {
            filtered = filtered.filter(client =>
                client.province === filters.province
            );
        }

        if (filters.country) {
            filtered = filtered.filter(client =>
                client.country === filters.country
            );
        }

        if (filters.title) {
            filtered = filtered.filter(client =>
                client.title === filters.title
            );
        }

        filtered = filtered.filter(client =>
            client.fromPrice >= filters.minBudget && client.toPrice <= filters.maxBudget
        );

        if (filters.industry) {
            filtered = filtered.filter(client =>
                client.companies.some(company =>
                    company.industry === filters.industry
                )
            );
        }

        if (filters.minRating > 0) {
            filtered = filtered.filter(client =>
                client.averageRating >= filters.minRating
            );
        }

        setFilteredClients(filtered);
        setIsFilterOpen(false);
    };

    const resetFilters = () => {
        setFilters({
            province: '',
            country: '',
            minBudget: 0,
            maxBudget: 50000000,
            industry: '',
            minRating: 0,
            title: '',
        });
        setFilteredClients(clients);
    };

    const getFullName = (client: ActiveClient) => {
        return `${client.firstName} ${client.lastName}`;
    };

    return (
        <div className="py-12">
            <div className="container mx-auto px-4">
                <div className="mb-12">
                    <FadeInWhenVisible>
                        <h1 className="text-3xl font-bold text-center mb-8">
                            {'Tìm kiếm nhà tuyển dụng'}
                        </h1>
                    </FadeInWhenVisible>
                    <div className="max-w-2xl mx-auto">
                        <FadeInWhenVisible delay={0.2}>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Tìm kiếm theo tên, ngành nghề, công ty..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <Button onClick={applyFilters}>
                                    <Search className="w-4 h-4 mr-2" />
                                    {t('Search') || 'Tìm kiếm'}
                                </Button>
                                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="outline">
                                            <Filter className="w-4 h-4" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent className="w-[400px] overflow-y-auto">
                                        <SheetHeader>
                                            <SheetTitle>Bộ lọc</SheetTitle>
                                        </SheetHeader>
                                        <div className="py-6 space-y-6">
                                            <div className="space-y-2">
                                                <div className="space-y-2">
                                                    <h3 className="text-sm font-medium">Tỉnh/Thành phố</h3>
                                                    <Select
                                                        value={filters.province}
                                                        onValueChange={(value) =>
                                                            setFilters(prev => ({ ...prev, province: value }))
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn tỉnh/thành phố" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {uniqueProvinces.map(province => (
                                                                <SelectItem key={province} value={province}>
                                                                    {province}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <h3 className="text-sm font-medium">Quốc gia</h3>
                                                    <Select
                                                        value={filters.country}
                                                        onValueChange={(value) =>
                                                            setFilters(prev => ({ ...prev, country: value }))
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn quốc gia" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {uniqueCountries.map(country => (
                                                                <SelectItem key={country} value={country}>
                                                                    {country}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Chức danh</h3>
                                                <Select
                                                    value={filters.title}
                                                    onValueChange={(value) =>
                                                        setFilters(prev => ({ ...prev, title: value }))
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn chức danh" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {uniqueTitles.map(title => (
                                                            <SelectItem key={title} value={title}>
                                                                {title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Ngành nghề</h3>
                                                <Select
                                                    value={filters.industry}
                                                    onValueChange={(value) =>
                                                        setFilters(prev => ({ ...prev, industry: value }))
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn ngành nghề" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {uniqueIndustries.map(industry => (
                                                            <SelectItem key={industry} value={industry}>
                                                                {industry}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Ngân sách (VND)</h3>
                                                <div className="flex items-center gap-4">
                                                    <Input
                                                        type="number"
                                                        value={filters.minBudget}
                                                        onChange={(e) => setFilters(prev => ({
                                                            ...prev,
                                                            minBudget: parseInt(e.target.value)
                                                        }))}
                                                        className="w-20"
                                                    />
                                                    <span>-</span>
                                                    <Input
                                                        type="number"
                                                        value={filters.maxBudget}
                                                        onChange={(e) => setFilters(prev => ({
                                                            ...prev,
                                                            maxBudget: parseInt(e.target.value)
                                                        }))}
                                                        className="w-20"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Đánh giá tối thiểu</h3>
                                                <Select
                                                    value={filters.minRating.toString()}
                                                    onValueChange={(value) =>
                                                        setFilters(prev => ({ ...prev, minRating: parseInt(value) }))
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn đánh giá" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[0, 1, 2, 3, 4, 5].map(rating => (
                                                            <SelectItem key={rating} value={rating.toString()}>
                                                                {rating} {rating > 0 && <Star className="inline w-4 h-4" />}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="flex gap-4 pt-4">
                                                <Button onClick={applyFilters} className="flex-1">
                                                    Áp dụng
                                                </Button>
                                                <Button variant="outline" onClick={resetFilters}>
                                                    Đặt lại
                                                </Button>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </FadeInWhenVisible>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-3 min-h-[200px] flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredClients.length === 0 ? (
                        <div className="col-span-3 text-center py-12 text-gray-500">
                            {t('No Clients Available') || 'Không có nhà tuyển dụng nào phù hợp với tìm kiếm của bạn'}
                        </div>
                    ) : (
                        filteredClients.map((client, index) => (
                            <FadeInWhenVisible key={client.clientId} delay={index * 0.1}>
                                <Card className="p-6 h-full hover:shadow-md transition-all">
                                    <div className="flex items-start gap-4 h-full">
                                        <Avatar className="w-16 h-16 rounded-full">
                                            <AvatarImage src={client.image} alt={getFullName(client)} />
                                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] md:text-xs">
                                                {client.firstName.slice(0, 1).toUpperCase()}{client.lastName.slice(0, 1).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 flex flex-col h-full">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold">{getFullName(client)}</h3>
                                                {client.averageRating > 0 && (
                                                    <div className="flex items-center">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                        <span className="ml-1">{client.averageRating.toFixed(1)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {client.title}
                                            </p>
                                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {client.province && client.country
                                                    ? `${client.province}, ${client.country}`
                                                    : client.province || client.country || 'Chưa cập nhật'}
                                            </div>
                                            <div className="mb-3">
                                                {client.companies.length > 0 && (
                                                    <div className="flex items-center text-sm text-primary">
                                                        <Briefcase className="w-4 h-4 mr-1" />
                                                        {client.companies[0].companyName}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                                {client.introduction}
                                            </p>
                                            <div className='flex-1'></div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    {client.fromPrice.toLocaleString()} - {client.toPrice.toLocaleString()} VND
                                                </span>
                                                <Button variant="outline" size="sm">
                                                    <Link to={`/clients/${client.clientId}`}>{t('Viewprofile') || 'Xem hồ sơ'}</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </FadeInWhenVisible>
                        ))
                    )}
                </div>

                <div className="text-center mt-12">
                    <Button variant="outline" size="lg">
                        {t('Seemore') || 'Xem thêm'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Clients;