import { ThemeProvider } from "../theme-provider";
import { Sidebar } from "../admin/layout/sidebar";
import { ThemeToggle } from "../theme/theme-toggle";
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

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Header */}
                            <header className="border-b">
                                <div className="flex h-16 items-center px-4 justify-between flex">
                                    <div className="flex-1"></div>
                                    <ThemeToggle />
                                </div>
                            </header>

                            {/* Page Content */}
                            <main className="p-8">
                                {children}
                            </main>
                        </div>
                    </div>
                </div>
        </ThemeProvider>
    );
}
