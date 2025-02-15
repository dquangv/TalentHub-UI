import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, DollarSign } from 'lucide-react';

// Enums cho các lựa chọn
enum TypePayment {
    HOURLY = 'HOURLY',
    FIXED = 'FIXED',
    MILESTONE = 'MILESTONE'
}

enum StatusJob {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    CLOSED = 'CLOSED'
}

interface Category {
    id: number;
    categoryTitle: string;
}

interface Skill {
    id: number;
    skillName: string;
}

const sampleCategories: Category[] = [
    { id: 1, categoryTitle: 'Lập trình web' },
    { id: 2, categoryTitle: 'Thiết kế đồ họa' },
    { id: 3, categoryTitle: 'Marketing' }
];

const sampleSkills: Skill[] = [
    { id: 1, skillName: 'React' },
    { id: 2, skillName: 'Node.js' },
    { id: 3, skillName: 'UI/UX Design' }
];

const PostJob = () => {
    const [jobData, setJobData] = useState({
        title: '',
        scope: '',
        hourWork: 0,
        jobOpportunity: false,
        fromPrice: 0,
        toPrice: 0,
        typePrice: '',
        typePayment: TypePayment.FIXED,
        status: StatusJob.DRAFT,
        categoryId: 0,
        skills: [] as number[]
    });

    const handleSkillToggle = (skillId: number) => {
        setJobData(prev => {
            const skills = prev.skills.includes(skillId)
                ? prev.skills.filter(id => id !== skillId)
                : [...prev.skills, skillId];
            return { ...prev, skills };
        });
    };

    const handleSubmit = (e: React.FormEvent, status: StatusJob) => {
        e.preventDefault();
        const submitData = { ...jobData, status };
        console.log('Submitting job data:', submitData);
    };

    return (
        <div className="p-6">
            <Card className="max-w-4xl mx-auto p-8">
                <form onSubmit={(e) => handleSubmit(e, StatusJob.PUBLISHED)} className="space-y-8">
                    {/* Thông tin cơ bản */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold">Thông tin cơ bản</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Tiêu đề công việc *
                                </label>
                                <Input
                                    placeholder="Nhập tiêu đề công việc"
                                    value={jobData.title}
                                    onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Danh mục *
                                </label>
                                <Select
                                    value={jobData.categoryId.toString()}
                                    onValueChange={(value) => setJobData({ ...jobData, categoryId: parseInt(value) })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sampleCategories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.categoryTitle}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Phạm vi công việc *
                                </label>
                                <Textarea
                                    placeholder="Mô tả chi tiết yêu cầu công việc"
                                    value={jobData.scope}
                                    onChange={(e) => setJobData({ ...jobData, scope: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Số giờ làm việc
                                    </label>
                                    <div className="flex items-center">
                                        <Clock className="w-5 h-5 text-muted-foreground mr-2" />
                                        <Input
                                            type="number"
                                            placeholder="40"
                                            value={jobData.hourWork || ''}
                                            onChange={(e) => setJobData({ ...jobData, hourWork: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Hình thức thanh toán *
                                    </label>
                                    <Select
                                        value={jobData.typePayment}
                                        onValueChange={(value: TypePayment) => setJobData({ ...jobData, typePayment: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn hình thức thanh toán" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={TypePayment.FIXED}>Trọn gói</SelectItem>
                                            <SelectItem value={TypePayment.HOURLY}>Theo giờ</SelectItem>
                                            <SelectItem value={TypePayment.MILESTONE}>Theo giai đoạn</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Ngân sách từ *
                                    </label>
                                    <div className="flex items-center">
                                        <DollarSign className="w-5 h-5 text-muted-foreground mr-2" />
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={jobData.fromPrice || ''}
                                            onChange={(e) => setJobData({ ...jobData, fromPrice: parseFloat(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Đến *
                                    </label>
                                    <div className="flex items-center">
                                        <DollarSign className="w-5 h-5 text-muted-foreground mr-2" />
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={jobData.toPrice || ''}
                                            onChange={(e) => setJobData({ ...jobData, toPrice: parseFloat(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="jobOpportunity"
                                    checked={jobData.jobOpportunity}
                                    onCheckedChange={(checked) =>
                                        setJobData({ ...jobData, jobOpportunity: checked as boolean })
                                    }
                                />
                                <label
                                    htmlFor="jobOpportunity"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Cơ hội việc làm dài hạn
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Kỹ năng yêu cầu */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold">Kỹ năng yêu cầu</h2>
                        <div className="flex flex-wrap gap-2">
                            {sampleSkills.map((skill) => (
                                <Badge
                                    key={skill.id}
                                    variant={jobData.skills.includes(skill.id) ? "default" : "outline"}
                                    className="cursor-pointer hover:bg-primary/20"
                                    onClick={() => handleSkillToggle(skill.id)}
                                >
                                    {skill.skillName}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Nút submit */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={(e) => handleSubmit(e, StatusJob.DRAFT)}
                        >
                            Lưu nháp
                        </Button>
                        <Button
                            type="submit"
                        >
                            Đăng tin
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default PostJob;