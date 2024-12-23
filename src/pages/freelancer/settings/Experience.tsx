import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Plus, Briefcase, Trash2 } from 'lucide-react';

const Experience = () => {
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      company: 'Tech Solutions Inc.',
      position: 'Senior Frontend Developer',
      startDate: '2020-01',
      endDate: '2024-03',
      current: true,
      description: 'Phát triển và duy trì các ứng dụng web quy mô lớn...',
    },
    {
      id: 2,
      company: 'Digital Innovation Co.',
      position: 'Frontend Developer',
      startDate: '2018-03',
      endDate: '2019-12',
      current: false,
      description: 'Xây dựng giao diện người dùng cho các ứng dụng web...',
    },
  ]);

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setExperiences([...experiences, newExperience]);
  };

  const removeExperience = (id: number) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id: number, field: string, value: string | boolean) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  return (
    <div className="space-y-6">
      {experiences.map((experience, index) => (
        <FadeInWhenVisible key={experience.id} delay={index * 0.1}>
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Kinh nghiệm làm việc</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removeExperience(experience.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Công ty</label>
                <Input
                  value={experience.company}
                  onChange={(e) =>
                    updateExperience(experience.id, 'company', e.target.value)
                  }
                  placeholder="Tên công ty"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Vị trí</label>
                <Input
                  value={experience.position}
                  onChange={(e) =>
                    updateExperience(experience.id, 'position', e.target.value)
                  }
                  placeholder="Vị trí công việc"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ngày bắt đầu</label>
                <Input
                  type="month"
                  value={experience.startDate}
                  onChange={(e) =>
                    updateExperience(experience.id, 'startDate', e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ngày kết thúc</label>
                <Input
                  type="month"
                  value={experience.endDate}
                  onChange={(e) =>
                    updateExperience(experience.id, 'endDate', e.target.value)
                  }
                  disabled={experience.current}
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={experience.current}
                    onChange={(e) =>
                      updateExperience(experience.id, 'current', e.target.checked)
                    }
                    id={`current-${experience.id}`}
                  />
                  <label
                    htmlFor={`current-${experience.id}`}
                    className="text-sm text-muted-foreground"
                  >
                    Đang làm việc tại đây
                  </label>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Mô tả công việc</label>
                <Textarea
                  value={experience.description}
                  onChange={(e) =>
                    updateExperience(experience.id, 'description', e.target.value)
                  }
                  placeholder="Mô tả chi tiết về công việc và thành tựu của bạn"
                  rows={4}
                />
              </div>
            </div>
          </Card>
        </FadeInWhenVisible>
      ))}

      <FadeInWhenVisible delay={experiences.length * 0.1}>
        <Button
          variant="outline"
          className="w-full"
          onClick={addExperience}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm kinh nghiệm làm việc
        </Button>
      </FadeInWhenVisible>
    </div>
  );
};

export default Experience;