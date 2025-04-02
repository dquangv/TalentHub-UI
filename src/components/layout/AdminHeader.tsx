import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AdminNotificationDropdown from '@/pages/admin/AdminNotificationDropdown';
import { ThemeToggle } from '../theme/theme-toggle';

interface AdminHeaderProps {
    onToggleSidebar: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
    const { userInfo } = useAuth();

    return (
        <header className="border-b bg-background px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
                <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onToggleSidebar} asChild>
                    <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold">TalentHub Admin</h1>
            </div>

            <div className="flex items-center space-x-3">
                <AdminNotificationDropdown />
                <ThemeToggle />
                <div className="text-sm hidden md:block">
                    {userInfo?.email || 'Admin'}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;