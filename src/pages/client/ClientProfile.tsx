import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Camera, Phone, MapPin, Loader2, Building, Trash2, Plus, User2 } from 'lucide-react';
import { notification } from 'antd';
import userService, { User } from '@/api/userService';
import clientService, { Company } from '@/api/clientService';
import LocationSelector from '../freelancer/settings/LocationSelector';
import { Progress } from '@/components/ui/progress';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { CircleCheck, CircleAlert } from 'lucide-react';
const ClientProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState<User & {
        fromPrice: number;
        toPrice: number;
        typePrice: string;
    }>({
        id: 0,
        firstName: '',
        lastName: '',
        phoneNumber: '',
        country: null,
        province: null,
        title: '',
        introduction: '',
        image: '',
        role: 'CLIENT',
        fromPrice: 0,
        toPrice: 0,
        typePrice: '',
    });

    const [company, setCompany] = useState<Company>({
        companyName: '',
        address: '',
        phoneContact: '',
        industry: '',
    });
    const [completionPercentage, setCompletionPercentage] = useState<number>(0);
    const [incompleteFields, setIncompleteFields] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [companyLoading, setCompanyLoading] = useState<boolean>(false);
    const [uploadingImage, setUploadingImage] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(true);
    const [hasCompany, setHasCompany] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const isCompanyFormValid = () => {
        return (
            company.companyName.trim() !== '' &&
            company.industry.trim() !== '' &&
            company.phoneContact.trim() !== '' &&
            company.address.trim() !== ''
        );
    };
    const userId = JSON.parse(localStorage.getItem('userInfo') || '{}').userId;
    const clientId = JSON.parse(localStorage.getItem('userInfo') || '{}').clientId;
    const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setFetching(true);
                const userResponse = await userService.getUserById(userId);

                const clientResponse = await clientService.getClientById(clientId);
                console.log(clientResponse);

                if (userResponse.status === 200 && userResponse.data && clientResponse.status === 200) {
                    setProfile({
                        ...userResponse.data,
                        fromPrice: clientResponse.data.fromPrice || 0,
                        toPrice: clientResponse.data.toPrice || 0,
                        typePrice: clientResponse.data.typePrice || '',
                    });
                }

                // Fetch company data
                const companyResponse = await clientService.getClientCompanies(clientId);
                if (companyResponse.status === 200 && companyResponse.data && companyResponse.data.length > 0) {
                    setCompany(companyResponse.data[0]);
                    setHasCompany(true);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.',
                });
            } finally {
                setFetching(false);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId, clientId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            const userUpdateData = {
                firstName: profile.firstName,
                lastName: profile.lastName,
                phoneNumber: profile.phoneNumber,
                country: profile.country,
                province: profile.province,
                title: profile.title,
                introduction: profile.introduction,
                image: profile.image,
            };

            const userResponse = await userService.updateUser(userId, userUpdateData);

            const budgetUpdateData = {
                clientId: clientId,
                fromPrice: profile.fromPrice,
                toPrice: profile.toPrice,
                typePrice: profile.typePrice
            };

            const budgetResponse = await clientService.updateClientPrice(budgetUpdateData);

            if (userResponse.status === 200 && budgetResponse.status === 200) {
                notification.success({
                    message: 'Thành công',
                    description: 'Cập nhật thông tin và ngân sách thành công!',
                });
            }
        } catch (error) {
            console.error('Error updating user data or budget:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể cập nhật thông tin. Vui lòng thử lại sau.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCompanySubmit = async () => {
        try {
            setCompanyLoading(true);

            if (hasCompany && company.id) {
                // Update existing company
                const { companyName, address, phoneContact, industry } = company;
                const updateResponse = await clientService.updateCompany(company.id, {
                    companyName,
                    address,
                    phoneContact,
                    industry
                });

                if (updateResponse.status === 200) {
                    notification.success({
                        message: 'Thành công',
                        description: 'Cập nhật thông tin công ty thành công!',
                    });
                }
            } else {
                // Create new company
                const createResponse = await clientService.createCompany({
                    ...company,
                    clientId
                });

                if (createResponse.status === 201 && createResponse.data) {
                    setCompany(createResponse.data);
                    setHasCompany(true);
                    notification.success({
                        message: 'Thành công',
                        description: 'Thêm mới công ty thành công!',
                    });
                }
            }
        } catch (error) {
            console.error('Error saving company data:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể lưu thông tin công ty. Vui lòng thử lại sau.',
            });
        } finally {
            setCompanyLoading(false);
        }
    };

    const handleDeleteCompany = async () => {
        if (!company.id) return;

        try {
            setCompanyLoading(true);
            const deleteResponse = await clientService.deleteCompany(company.id);

            if (deleteResponse.status === 204) {
                setCompany({
                    companyName: '',
                    address: '',
                    phoneContact: '',
                    industry: ''
                });
                setHasCompany(false);
                notification.success({
                    message: 'Thành công',
                    description: 'Xóa thông tin công ty thành công!',
                });
            }
        } catch (error) {
            console.error('Error deleting company:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể xóa thông tin công ty. Vui lòng thử lại sau.',
            });
        } finally {
            setCompanyLoading(false);
        }
    };

    const handleAvatarButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];

        if (!file.type.startsWith('image/')) {
            notification.error({
                message: 'Lỗi',
                description: 'Vui lòng chọn tệp hình ảnh hợp lệ.',
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            notification.error({
                message: 'Lỗi',
                description: 'Kích thước ảnh không được vượt quá 5MB.',
            });
            return;
        }

        try {
            setUploadingImage(true);
            const imageUrl = await userService.uploadImage(file);
            const updateResponse = await userService.updateUserImage(userId, imageUrl);

            if (updateResponse.status === 200) {
                setProfile((prev) => ({ ...prev, image: imageUrl }));
                notification.success({
                    message: 'Thành công',
                    description: 'Cập nhật ảnh đại diện thành công!',
                });
            } else {
                throw new Error('Failed to update user profile with new image');
            }
        } catch (error) {
            console.error('Error uploading/updating image:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau.',
            });
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-64 ">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2">Đang tải thông tin...</span>
            </div>
        );
    }

    return (
        <div className='max-w-4xl mx-auto'>
            <form onSubmit={handleSubmit}>
                <Card className="p-6 mb-6">
                    <FadeInWhenVisible>
                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative">
                                <Avatar className="w-24 h-24">
                                    {uploadingImage ? (
                                        <div className="flex items-center justify-center w-full h-full bg-muted">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                        </div>
                                    ) : (
                                        <>
                                            <AvatarImage
                                                src={profile.image || '/placeholder-avatar.png'}
                                                alt={fullName}
                                            />
                                            <AvatarFallback>
                                                {profile.firstName?.charAt(0) || ''}{profile.lastName?.charAt(0) || ''}
                                            </AvatarFallback>
                                        </>
                                    )}
                                </Avatar>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={uploadingImage}
                                />

                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="absolute bottom-0 right-0 rounded-full"
                                    type="button"
                                    onClick={handleAvatarButtonClick}
                                    disabled={uploadingImage}
                                >
                                    {uploadingImage ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Camera className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{fullName}</h2>
                                <p className="text-muted-foreground">{profile.title}</p>
                            </div>
                        </div>
                    </FadeInWhenVisible>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FadeInWhenVisible delay={0.1}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Họ</label>
                                <Input
                                    value={profile.firstName}
                                    onChange={(e) =>
                                        setProfile({ ...profile, firstName: e.target.value })
                                    }
                                />
                            </div>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.2}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tên</label>
                                <Input
                                    value={profile.lastName}
                                    onChange={(e) =>
                                        setProfile({ ...profile, lastName: e.target.value })
                                    }
                                />
                            </div>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.3}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Chức danh</label>
                                <Input
                                    value={profile.title}
                                    onChange={(e) =>
                                        setProfile({ ...profile, title: e.target.value })
                                    }
                                />
                            </div>
                        </FadeInWhenVisible>
                        <FadeInWhenVisible delay={0.7}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Ngân sách từ</label>
                                <Input
                                    type="number"
                                    value={profile.fromPrice}
                                    onChange={(e) =>
                                        setProfile({ ...profile, fromPrice: Number(e.target.value) })
                                    }
                                    placeholder="Nhập ngân sách tối thiểu"
                                />
                            </div>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.8}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Ngân sách đến</label>
                                <Input
                                    type="number"
                                    value={profile.toPrice}
                                    onChange={(e) =>
                                        setProfile({ ...profile, toPrice: Number(e.target.value) })
                                    }
                                    placeholder="Nhập ngân sách tối đa"
                                />
                            </div>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.9}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hình thức thanh toán</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={profile.typePrice}
                                    onChange={(e) =>
                                        setProfile({ ...profile, typePrice: e.target.value })
                                    }
                                >
                                    <option value="">Chọn hình thức</option>
                                    <option value="HOURLY">Theo giờ</option>
                                    <option value="FULL">Theo dự án</option>
                                </select>
                            </div>
                        </FadeInWhenVisible>
                        <FadeInWhenVisible delay={0.4}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Số điện thoại</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="tel"
                                        className="pl-10"
                                        value={profile.phoneNumber}
                                        onChange={(e) =>
                                            setProfile({ ...profile, phoneNumber: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.5}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Vị trí</label>
                                <LocationSelector
                                    countryId={profile.country}
                                    provinceId={profile.province}
                                    onCountryChange={(countryId) => {
                                        console.log("Country selected:", countryId);
                                        setProfile((prev) => ({ ...prev, country: countryId }));
                                    }}
                                    onProvinceChange={(provinceId) => {
                                        console.log("Province selected:", provinceId);
                                        setProfile((prev) => ({ ...prev, province: provinceId }));
                                    }}
                                    disabled={loading}
                                />
                            </div>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.6}>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Giới thiệu</label>
                                <Textarea
                                    value={profile.introduction}
                                    onChange={(e) =>
                                        setProfile({ ...profile, introduction: e.target.value })
                                    }
                                    rows={4}
                                />
                            </div>
                        </FadeInWhenVisible>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button
                            type="submit"
                            disabled={loading || uploadingImage}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                'Lưu thay đổi'
                            )}
                        </Button>
                    </div>
                </Card>
            </form>

            {/* Company Information Section */}
            <Card className="p-6">
                <FadeInWhenVisible>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <Building className="h-5 w-5 mr-2" />
                            <h3 className="text-xl font-bold">Thông tin công ty</h3>
                        </div>
                        {hasCompany && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteCompany}
                                disabled={companyLoading}
                            >
                                {companyLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Xóa
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </FadeInWhenVisible>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FadeInWhenVisible delay={0.1}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tên công ty</label>
                            <Input
                                value={company.companyName}
                                onChange={(e) =>
                                    setCompany({ ...company, companyName: e.target.value })
                                }
                                placeholder="Nhập tên công ty"
                            />
                        </div>
                    </FadeInWhenVisible>

                    <FadeInWhenVisible delay={0.2}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ngành nghề</label>
                            <Input
                                value={company.industry}
                                onChange={(e) =>
                                    setCompany({ ...company, industry: e.target.value })
                                }
                                placeholder="Nhập ngành nghề kinh doanh"
                            />
                        </div>
                    </FadeInWhenVisible>

                    <FadeInWhenVisible delay={0.3}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Số điện thoại liên hệ</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="tel"
                                    className="pl-10"
                                    value={company.phoneContact}
                                    onChange={(e) =>
                                        setCompany({ ...company, phoneContact: e.target.value })
                                    }
                                    placeholder="Nhập số điện thoại liên hệ"
                                />
                            </div>
                        </div>
                    </FadeInWhenVisible>

                    <FadeInWhenVisible delay={0.4}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Địa chỉ công ty</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-10"
                                    value={company.address}
                                    onChange={(e) =>
                                        setCompany({ ...company, address: e.target.value })
                                    }
                                    placeholder="Nhập địa chỉ công ty"
                                />
                            </div>
                        </div>
                    </FadeInWhenVisible>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button
                        type="button"
                        onClick={handleCompanySubmit}
                        disabled={companyLoading || !isCompanyFormValid()}
                    >
                        {companyLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang lưu...
                            </>
                        ) : hasCompany ? (
                            'Cập nhật thông tin công ty'
                        ) : (
                            <>
                                <Plus className="h-4 w-4 mr-1" />
                                Thêm công ty
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ClientProfile;