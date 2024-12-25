import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Languages className="h-4 w-4" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => setLanguage('vi')}
                    className={language === 'vi' ? 'bg-primary-50' : ''}
                >
                    Tiếng Việt
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLanguage('en')}
                    className={language === 'en' ? 'bg-primary-50' : ''}
                >
                    English
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLanguage('ko')}
                    className={language === 'ko' ? 'bg-primary-50' : ''}
                >
                    한국인
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLanguage('ja')}
                    className={language === 'ja' ? 'bg-primary-50' : ''}
                >
                    日本語
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLanguage('zhcn')}
                    className={language === 'zhcn' ? 'bg-primary-50' : ''}
                >
                    中国人
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}