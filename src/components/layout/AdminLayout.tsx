import { ReactNode, useState } from "react";
import { ThemeProvider } from "../theme-provider";
import { Sidebar } from "../admin/layout/sidebar";
import AdminHeader from "./AdminHeader";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    return (
        <ThemeProvider defaultTheme="light">
            <div className="min-h-screen bg-background flex flex-col">
                <AdminHeader onToggleSidebar={toggleSidebar} />

                <div className="flex flex-1 overflow-hidden">
                    <div
                        className={cn(
                            "border-r bg-background z-30 transition-all duration-300",
                            "md:w-64 md:static md:block md:h-auto",
                            sidebarOpen
                                ? "fixed inset-y-0 left-0 w-64 h-[calc(100vh-57px)] mt-[57px]"
                                : "fixed inset-y-0 -left-64 w-64 h-screen"
                        )}
                    >
                        <Sidebar />
                    </div>

                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-20 md:hidden"
                            onClick={toggleSidebar}
                        />
                    )}

                    <main className="flex-1 overflow-auto p-4 md:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
}