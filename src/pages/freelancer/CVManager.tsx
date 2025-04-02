import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { notification } from 'antd';
import {
    Plus, FileText, Trash2, Loader2, Download, Eye, ExternalLink
} from 'lucide-react';
import cvService, { CV } from '@/api/cvService';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';

const CVManager = () => {
    const [cvs, setCVs] = useState<CV[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [deletingIds, setDeletingIds] = useState<number[]>([]);
    const [cvPreviews, setCvPreviews] = useState<Record<number, string>>({});

    const [previewVisible, setPreviewVisible] = useState(false);
    const [currentPdfUrl, setCurrentPdfUrl] = useState('');

    const freelancerId = JSON.parse(localStorage.getItem('userInfo') || '{}').freelancerId || 1;

    const fetchCVs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await cvService.getCVsByFreelancerId(freelancerId);
            if (response.data) {
                setCVs(response.data);
                const previewsObj: Record<number, string> = {};
                for (const cv of response.data) {
                    try {
                        const previewUrl = await cvService.previewCV(cv.url);
                        previewsObj[cv.id] = previewUrl;
                    } catch (error) {
                        console.error(`Error creating preview for CV ${cv.id}:`, error);
                    }
                }
                setCvPreviews(previewsObj);
            }
        } catch (error) {
            console.error('Error loading CV list:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể tải danh sách CV. Vui lòng thử lại sau.'
            });
        } finally {
            setLoading(false);
        }
    }, [freelancerId]);

    useEffect(() => {
        fetchCVs();
    }, [fetchCVs]);

    const handleUploadCV = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            notification.error({
                message: 'Lỗi',
                description: 'Chỉ cho phép upload file PDF'
            });
            return;
        }

        try {
            setUploading(true);
            await cvService.uploadCV(file, freelancerId);
            notification.success({
                message: 'Thành công',
                description: 'Upload CV thành công'
            });
            await fetchCVs();
        } catch (error) {
            console.error('Error uploading CV:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể upload CV. Vui lòng thử lại sau.'
            });
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    };

    const handleDeleteCV = async (cvId: number) => {
        const cv = cvs.find(cv => cv.id === cvId);
        if (cv?.jobs && cv.jobs.length > 0) {
            notification.error({
                message: 'Không thể xóa',
                description: 'CV này đã được sử dụng để ứng tuyển công việc và không thể xóa.'
            });
            return;
        }

        try {
            setDeletingIds(prev => [...prev, cvId]);
            await cvService.deleteCV(cvId);
            notification.success({
                message: 'Thành công',
                description: 'Xóa CV thành công'
            });
            setCVs(prev => prev.filter(cv => cv.id !== cvId));

            setCvPreviews(prev => {
                const newPreviews = { ...prev };
                if (newPreviews[cvId]) {
                    URL.revokeObjectURL(newPreviews[cvId]);
                    delete newPreviews[cvId];
                }
                return newPreviews;
            });
        } catch (error) {
            console.error('Error deleting CV:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể xóa CV. Vui lòng thử lại sau.'
            });
        } finally {
            setDeletingIds(prev => prev.filter(id => id !== cvId));
        }
    };

    const handleDownloadCV = async (cv: CV) => {
        try {
            const blob = await cvService.downloadCV(cv.url);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = cv.title || 'cv.pdf';
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading CV:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể tải xuống CV. Vui lòng thử lại sau.'
            });
        }
    };

    const handlePreviewCV = (cv: CV) => {
        setPreviewVisible(true);
        setCurrentPdfUrl(cvPreviews[cv.id] || '');
    };

    const handleClosePreview = () => {
        setPreviewVisible(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2">Đang tải thông tin CV...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {cvs.map((cv, index) => (
                <FadeInWhenVisible key={cv.id} delay={index * 0.1}>
                    <Card className="p-6">
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/3 lg:w-1/4 mb-4 md:mb-0 md:pr-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-primary" />
                                        <h3 className="text-lg font-semibold">{cv.title || 'CV không đặt tên'}</h3>
                                    </div>
                                </div>

                                {/* Danh sách công việc đã ứng tuyển */}
                                {cv.jobs && cv.jobs.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Công việc đã ứng tuyển:</h4>
                                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                                            {cv.jobs.map(job => (
                                                <li key={job.jobId}>
                                                    {job.jobTitle} - {job.companyName} ({job.status})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => handleDownloadCV(cv)}
                                            disabled={deletingIds.includes(cv.id)}
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Tải xuống
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="text-destructive"
                                            onClick={() => handleDeleteCV(cv.id)}
                                            disabled={deletingIds.includes(cv.id) || (cv.jobs && cv.jobs.length > 0)}
                                            title={cv.jobs && cv.jobs.length > 0 ? "Không thể xóa CV đã được sử dụng để ứng tuyển" : ""}
                                        >
                                            {deletingIds.includes(cv.id) ? (
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            ) : (
                                                <Trash2 className="w-4 h-4 mr-2" />
                                            )}
                                            {cv.jobs && cv.jobs.length > 0 ? "Không thể xóa" : "Xóa CV"}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-2/3 lg:w-3/4 bg-gray-50 rounded-lg overflow-hidden h-96 border border-gray-200">
                                {cvPreviews[cv.id] ? (
                                    <div className="relative h-full">
                                        <iframe
                                            src={cvPreviews[cv.id]}
                                            width="100%"
                                            height="100%"
                                            style={{
                                                border: 'none',
                                                borderRadius: '8px',
                                            }}
                                            title={`CV Preview: ${cv.title || 'Untitled'}`}
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="bg-white bg-opacity-70 hover:bg-opacity-100"
                                                onClick={() => handlePreviewCV(cv)}
                                            >
                                                <ExternalLink className="w-4 h-4 mr-1" />
                                                Phóng to
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center h-full">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                                        <span>Đang tải preview...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </FadeInWhenVisible>
            ))}

            {cvs.length === 0 && (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Chưa có CV nào</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Bạn chưa có CV nào trong hệ thống. Hãy tải lên CV đầu tiên để bắt đầu.
                    </p>
                </div>
            )}

            <FadeInWhenVisible delay={cvs.length * 0.1}>
                <input
                    type="file"
                    id="cv-upload"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleUploadCV}
                    disabled={uploading}
                />
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('cv-upload')?.click()}
                    disabled={uploading}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang tải lên...
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4 mr-2" />
                            Tải CV mới
                        </>
                    )}
                </Button>
            </FadeInWhenVisible>

            <Dialog open={previewVisible} onOpenChange={(open) => !open && handleClosePreview()}>
                <DialogContent className="max-w-5xl h-[90vh] p-0 sm:rounded-lg">
                    <div className="h-full w-full p-2 bg-gray-50">
                        {!currentPdfUrl ? (
                            <div className="flex flex-col justify-center items-center h-full">
                                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                                <span className="text-gray-500">Đang tải xem trước...</span>
                            </div>
                        ) : (
                            <iframe
                                src={currentPdfUrl}
                                width="100%"
                                height="100%"
                                style={{
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                                }}
                                title="PDF Preview"
                                onError={() => {
                                    notification.error({
                                        message: 'Lỗi',
                                        description: 'Không thể tải xem trước CV. Vui lòng thử lại sau.'
                                    });
                                    handleClosePreview();
                                }}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CVManager;