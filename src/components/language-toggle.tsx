import { Button } from "antd";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
type Language = 'vi' | 'en' | 'ko' | 'ja' | 'zhcn';

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    const languages = [
        { code: 'vi', name: 'Tiếng Việt', flag: 'https://flagcdn.com/w40/vn.png' },
        { code: 'en', name: 'English', flag: 'https://flagcdn.com/w40/us.png' },
        { code: 'ko', name: '한국인', flag: 'https://flagcdn.com/w40/kr.png' },
        { code: 'ja', name: '日本語', flag: 'https://flagcdn.com/w40/jp.png' },
        { code: 'zhcn', name: '中国人', flag: 'https://flagcdn.com/w40/cn.png' }
    ] as const;

    // Get current language flag
    const getCurrentFlag = (currentCode: Language) => {
        return languages.find(lang => lang.code === currentCode)?.flag;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button >
                    <img
                        src={getCurrentFlag(language)}
                        alt={`Current language flag`}
                        className="w-full"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={language === lang.code ? 'bg-primary-50' : ''}
                    >
                        <img
                            src={lang.flag}
                            alt={`${lang.name} Flag`}
                            className="w-4 h-4 mr-2"
                        />
                        {lang.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}