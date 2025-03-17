import { ThemeProvider } from "../theme-provider";
import { Sidebar } from "../admin/layout/sidebar";
import { ReactNode } from "react";

interface MainLayoutProps {
    children: ReactNode;
}
export default function AdminLayout({ children }: MainLayoutProps) {
    return (
        <ThemeProvider defaultTheme="light">
            <div className="min-h-screen bg-background">
                <div className="flex">
                    {/* Sidebar */}
                    <div className="hidden md:block w-64 border-r">
                        <Sidebar />
                    </div>
                    <div className="flex-1">
                        <main className="p-8">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}
