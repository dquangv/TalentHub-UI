import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Camera, Mail, Phone, MapPin, Building2, Factory, Wallet } from 'lucide-react';

const ClientProfile = () => {
    const [profile, setProfile] = useState({
        // User information
        firstName: 'Nguyễn',
        lastName: 'Văn B',
        email: 'nguyenvanb@company.com',
        phoneNumber: '0987654321',
        address: 'TP. Hồ Chí Minh',
        title: 'Project Manager',
        introduction: 'Project Manager với hơn 8 năm kinh nghiệm quản lý dự án phần mềm...',

        // Company information
        companyName: 'Tech Solutions Corp',
        phoneContact: '02838123456',
        companyAddress: 'Quận 1, TP. HCM',
        industry: 'Công nghệ thông tin',

        // Client specific
        fromPrice: 500,
        toPrice: 2000,
        typePrice: 'USD',
        avatar: 'https://github.com/shadcn.png',
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(profile);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="p-6">
                <FadeInWhenVisible>
                    <div className="flex items-center gap-6 mb-8">
                        <div className="relative">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} />
                                <AvatarFallback>{profile.firstName[0]}{profile.lastName[0]}</AvatarFallback>
                            </Avatar>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="absolute bottom-0 right-0 rounded-full"
                            >
                                <Camera className="w-4 h-4" />
                            </Button>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{`${profile.firstName} ${profile.lastName}`}</h2>
                            <p className="text-muted-foreground">{profile.title}</p>
                            <p className="text-sm text-muted-foreground">{profile.companyName}</p>
                        </div>
                    </div>
                </FadeInWhenVisible>

                <div className="space-y-8">
                    {/* Personal Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Thông tin cá nhân</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FadeInWhenVisible delay={0.1}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Họ</label>
                                    <Input
                                        value={profile.firstName}
                                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                    />
                                </div>
                            </FadeInWhenVisible>

                            <FadeInWhenVisible delay={0.2}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tên</label>
                                    <Input
                                        value={profile.lastName}
                                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                    />
                                </div>
                            </FadeInWhenVisible>

                            <FadeInWhenVisible delay={0.3}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            className="pl-10"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        />
                                    </div>
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
                                            onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </FadeInWhenVisible>

                            <FadeInWhenVisible delay={0.5}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Chức danh</label>
                                    <Input
                                        value={profile.title}
                                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                    />
                                </div>
                            </FadeInWhenVisible>

                            <FadeInWhenVisible delay={0.6}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Địa chỉ</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-10"
                                            value={profile.address}
                                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </FadeInWhenVisible>
                        </div>
                    </div>

                    {/* Company Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Thông tin công ty</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FadeInWhenVisible delay={0.7}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tên công ty</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-10"
                                            value={profile.companyName}
                                            onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </FadeInWhenVisible>

                            <FadeInWhenVisible delay={0.8}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Số điện thoại công ty</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="tel"
                                            className="pl-10"
                                            value={profile.phoneContact}
                                            onChange={(e) => setProfile({ ...profile, phoneContact: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </FadeInWhenVisible>

                            <FadeInWhenVisible delay={0.9}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Địa chỉ công ty</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-10"
                                            value={profile.companyAddress}
                                            onChange={(e) => setProfile({ ...profile, companyAddress: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </FadeInWhenVisible>

                            <FadeInWhenVisible delay={1.0}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Ngành nghề</label>
                                    <div className="relative">
                                        <Factory className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-10"
                                            value={profile.industry}
                                            onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </FadeInWhenVisible>
                        </div>
                    </div>

                    {/* Budget Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Ngân sách dự án</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FadeInWhenVisible delay={1.1}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Từ</label>
                                    <div className="relative">
                                        <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            className="pl-10"
                                            value={profile.fromPrice}
                                            onChange={(e) => setProfile({ ...profile, fromPrice: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </FadeInWhenVisible>

                            <FadeInWhenVisible delay={1.2}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Đến</label>
                                    <div className="relative">
                                        <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            className="pl-10"
                                            value={profile.toPrice}
                                            onChange={(e) => setProfile({ ...profile, toPrice: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </FadeInWhenVisible>

                            <FadeInWhenVisible delay={1.3}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Đơn vị tiền tệ</label>
                                    <Select
                                        value={profile.typePrice}
                                        onValueChange={(value) => setProfile({ ...profile, typePrice: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="VND">VND</SelectItem>
                                            <SelectItem value="EUR">EUR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </FadeInWhenVisible>
                        </div>
                    </div>

                    {/* Introduction */}
                    <FadeInWhenVisible delay={1.4}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Giới thiệu</label>
                            <Textarea
                                value={profile.introduction}
                                onChange={(e) => setProfile({ ...profile, introduction: e.target.value })}
                                rows={4}
                            />
                        </div>
                    </FadeInWhenVisible>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button type="submit">Lưu thay đổi</Button>
                </div>
            </Card>
        </form>
    );
};

export default ClientProfile;