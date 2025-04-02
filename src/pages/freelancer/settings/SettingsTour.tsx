import React, { useEffect, useState } from 'react';
import { Tour } from 'antd';
import type { TourProps } from 'antd';

interface SettingsTourProps {
    refs: {
        tabsRef1: React.RefObject<HTMLDivElement>;
        tabsRef: React.RefObject<HTMLDivElement>;
        profileRef: React.RefObject<HTMLButtonElement>;
        experienceRef: React.RefObject<HTMLButtonElement>;
        educationRef: React.RefObject<HTMLButtonElement>;
        portfolioRef: React.RefObject<HTMLButtonElement>;
        securityRef: React.RefObject<HTMLButtonElement>;
    };
    open: boolean;
    setOpen: (open: boolean) => void;
}

const TOUR_KEY = 'settings_tour_completed';

const SettingsTour: React.FC<SettingsTourProps> = ({ refs, open, setOpen }) => {
    const [showTourButton, setShowTourButton] = useState<boolean>(true);

    useEffect(() => {
        const tourCompleted = localStorage.getItem(TOUR_KEY);

        if (!tourCompleted) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [setOpen]);

    const getTarget = (ref: React.RefObject<HTMLElement>) => {
        return () => ref.current as HTMLElement;
    };

    const handleCloseTour = () => {
        setOpen(false);
        localStorage.setItem(TOUR_KEY, 'true');
    };

    const steps: TourProps['steps'] = [
        {
            title: 'Chào mừng đến với Cài đặt tài khoản',
            description: 'Hãy cùng tìm hiểu các tính năng chính của trang cài đặt.',
            target: getTarget(refs.tabsRef1),
        },
        {
            title: 'Menu điều hướng',
            description: 'Sử dụng menu này để chuyển đổi giữa các phần cài đặt khác nhau.',
            target: getTarget(refs.tabsRef),
        },
        {
            title: 'Hồ sơ cá nhân',
            description: 'Cập nhật thông tin cá nhân và ảnh đại diện của bạn.',
            target: getTarget(refs.profileRef),
        },
        {
            title: 'Kinh nghiệm làm việc',
            description: 'Quản lý thông tin về kinh nghiệm làm việc của bạn.',
            target: getTarget(refs.experienceRef),
        },
        {
            title: 'Học vấn',
            description: 'Thêm và cập nhật thông tin về trình độ học vấn.',
            target: getTarget(refs.educationRef),
        },
        {
            title: 'Portfolio',
            description: 'Quản lý và trình bày các dự án, thành tích của bạn.',
            target: getTarget(refs.portfolioRef),
        },
        {
            title: 'Bảo mật',
            description: 'Thiết lập các tùy chọn bảo mật cho tài khoản của bạn.',
            target: getTarget(refs.securityRef),
        }
    ];

    return (
        <>
            <Tour
                open={open}
                onClose={handleCloseTour}
                steps={steps}
                placement="bottom"
            />
            {showTourButton && (
                <div className="fixed bottom-4 right-4">
                    <button
                        onClick={() => setOpen(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Xem hướng dẫn
                    </button>
                </div>
            )}
        </>
    );
};

export default SettingsTour;