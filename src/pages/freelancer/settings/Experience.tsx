import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Plus, Briefcase, Trash2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import experienceService, { Experience } from '@/api/experienceService';
import { notification } from 'antd';
import { Checkbox } from '@/components/ui/checkbox';

const ExperienceComponent = () => {
  const { t } = useLanguage();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [originalExperiences, setOriginalExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [savingIds, setSavingIds] = useState<number[]>([]);
  const [currentlyWorking, setCurrentlyWorking] = useState<Record<number, boolean>>({});

  const freelancerId = JSON.parse(localStorage.getItem('userInfo') || '{}').freelancerId;

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setInitialLoading(true);
      const response = await experienceService.getFreelancerExperiences(freelancerId);
      if (response.status === 200 && response.data) {
        setExperiences(response.data);
        setOriginalExperiences(JSON.parse(JSON.stringify(response.data)));

        const workingState: Record<number, boolean> = {};
        response.data.forEach((exp: Experience) => {
          workingState[exp.id || 0] = exp.endDate === null;
        });
        setCurrentlyWorking(workingState);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải danh sách kinh nghiệm làm việc. Vui lòng thử lại sau.',
      });
    } finally {
      setInitialLoading(false);
    }
  };
  const formatDateForDisplay = (dateString: string | null) => {
    if (!dateString) return 'Hiện tại';
    return dateString;
  };

  const isExperienceModified = (experience: Experience): boolean => {
    if (!experience.id) return true;

    const original = originalExperiences.find(exp => exp.id === experience.id);
    if (!original) return true;

    return (
      experience.companyName !== original.companyName ||
      experience.position !== original.position ||
      experience.startDate !== original.startDate ||
      experience.endDate !== original.endDate ||
      experience.description !== original.description
    );
  };

  const addExperience = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const newId = -Date.now();

    const newExperience: Experience = {
      id: newId,
      companyName: 'Công ty mới',
      position: 'Vị trí mới',
      startDate: currentDate,
      endDate: currentDate,
      description: '',
      status: 'active',
      freelancerId: freelancerId
    };

    setExperiences([...experiences, newExperience]);
  };

  const removeExperience = async (id: number) => {
    if (id < 0) {
      setExperiences(experiences.filter((exp) => exp.id !== id));
      return;
    }

    try {
      setSavingIds(prev => [...prev, id]);
      const response = await experienceService.deleteExperience(id);
      if (response.status === 200 && response.data) {
        setExperiences(experiences.filter((exp) => exp.id !== id));
        setOriginalExperiences(originalExperiences.filter((exp) => exp.id !== id));
        notification.success({
          message: 'Thành công',
          description: 'Xóa kinh nghiệm làm việc thành công.',
        });
      }
    } catch (error) {
      console.error('Error removing experience:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể xóa kinh nghiệm làm việc. Vui lòng thử lại sau.',
      });
    } finally {
      setSavingIds(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const updateExperienceField = (id: number, field: string, value: string | null) => {
    if (value === '' && ['companyName', 'position', 'startDate'].includes(field)) {
      notification.warning({
        message: 'Cảnh báo',
        description: 'Trường này không được để trống',
      });
      return;
    }

    const updatedExperiences = experiences.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );

    setExperiences(updatedExperiences);
  };



  const saveExperience = async (id: number) => {
    const experience = experiences.find(exp => exp.id === id);
    if (!experience) return;

    if (!experience.companyName || !experience.position || !experience.startDate) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc: Tên công ty, Vị trí, Ngày bắt đầu.',
      });
      return;
    }

    try {
      setSavingIds(prev => [...prev, id]);
      let response;
      if (id < 0) {
        const newExperienceData = {
          companyName: experience.companyName,
          position: experience.position,
          startDate: experience.startDate,
          endDate: experience.endDate,
          description: experience.description,
          status: experience.status,
          freelancerId: freelancerId
        };

        response = await experienceService.createExperience(newExperienceData);

        if (response.status === 201 && response.data) {
          setExperiences(prev =>
            prev.map(exp => exp.id === id ? response.data : exp)
          );
          setOriginalExperiences(prev => [...prev, response.data]);

          notification.success({
            message: 'Thành công',
            description: 'Thêm kinh nghiệm làm việc thành công.',
          });
        }
      } else {
        const updateData = {
          companyName: experience.companyName,
          position: experience.position,
          startDate: experience.startDate,
          endDate: experience.endDate,
          description: experience.description,
          status: experience.status
        };

        response = await experienceService.updateExperience(id, updateData);

        if (response.status === 200 && response.data) {
          setOriginalExperiences(prev =>
            prev.map(exp => exp.id === id ? response.data : exp)
          );

          notification.success({
            message: 'Thành công',
            description: 'Cập nhật kinh nghiệm làm việc thành công.',
          });
        }
      }
    } catch (error) {
      console.error('Error saving experience:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể lưu kinh nghiệm làm việc. Vui lòng thử lại sau.',
      });
    } finally {
      setSavingIds(prev => prev.filter(itemId => itemId !== id));
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {experiences.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Chưa có kinh nghiệm làm việc</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Bạn chưa có thông tin kinh nghiệm làm việc nào. Hãy thêm kinh nghiệm làm việc để nhà tuyển dụng có thể đánh giá tốt hơn.
          </p>
        </div>
      )}
      {experiences.map((experience, index) => {
        const isSaving = savingIds.includes(experience.id || 0);
        const isModified = isExperienceModified(experience);

        return (
          <FadeInWhenVisible key={experience.id} delay={index * 0.1}>
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">{t('Workexperience')}</h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => saveExperience(experience.id || 0)}
                    disabled={isSaving || !isModified}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      'Lưu'
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => experience.id && removeExperience(experience.id)}
                    disabled={isSaving}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('Company')}</label>
                  <Input
                    value={experience.companyName}
                    onChange={(e) =>
                      experience.id && updateExperienceField(experience.id, 'companyName', e.target.value)
                    }
                    placeholder="Tên công ty"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('Position')}</label>
                  <Input
                    value={experience.position}
                    onChange={(e) =>
                      experience.id && updateExperienceField(experience.id, 'position', e.target.value)
                    }
                    placeholder="Vị trí công việc"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('Startdate')}</label>
                  <Input
                    type="date"
                    value={experience.startDate}
                    onChange={(e) =>
                      experience.id && updateExperienceField(experience.id, 'startDate', e.target.value)
                    }
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('Enddate')}</label>
                  <Input
                    type="date"
                    value={experience.endDate || ''}
                    onChange={(e) =>
                      experience.id && updateExperienceField(experience.id, 'endDate', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">{t('Jobdescription')}</label>
                  <Textarea
                    value={experience.description}
                    onChange={(e) =>
                      experience.id && updateExperienceField(experience.id, 'description', e.target.value)
                    }
                    placeholder="Mô tả chi tiết về công việc và thành tựu của bạn"
                    rows={4}
                    disabled={isSaving}
                  />
                </div>
              </div>
            </Card>
          </FadeInWhenVisible>
        );
      })}

      <FadeInWhenVisible delay={experiences.length * 0.1}>
        <Button
          variant="outline"
          className="w-full"
          onClick={addExperience}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Đang xử lý...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              {t('Moreworkexperience')}
            </>
          )}
        </Button>
      </FadeInWhenVisible>
    </div>
  );
};

export default ExperienceComponent;