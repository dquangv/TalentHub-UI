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
                    <Languages className=" w-4" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => setLanguage('vi')}
                    className={language === 'vi' ? 'bg-primary-50' : ''}
                >
                    <img
                        src="https://flagcdn.com/w40/vn.png"
                        alt="Vietnam Flag"
                        className="w-4 h-4 mr-2"
                    />
                    Tiếng Việt
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLanguage('en')}
                    className={language === 'en' ? 'bg-primary-50' : ''}
                >
                    <img
                        src="https://flagcdn.com/w40/us.png"
                        alt="English Flag"
                        className="w-4  mr-2"
                    />
                    English
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLanguage('ko')}
                    className={language === 'ko' ? 'bg-primary-50' : ''}
                >
                    <img
                        src="https://flagcdn.com/w40/kr.png"
                        alt="Korean Flag"
                        className="w-4  mr-2"
                    />
                    한국인
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLanguage('ja')}
                    className={language === 'ja' ? 'bg-primary-50' : ''}
                >
                    <img
                        src="https://flagcdn.com/w40/jp.png"
                        alt="Japanese Flag"
                        className="w-4  mr-2"
                    />
                    日本語
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLanguage('zhcn')}
                    className={language === 'zhcn' ? 'bg-primary-50' : ''}
                >
                    <img
                        src="https://flagcdn.com/w40/cn.png"
                        alt="Chinese Flag"
                        className="w-4  mr-2"
                    />
                    中国人
                </DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>
    );
}