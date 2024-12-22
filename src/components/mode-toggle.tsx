import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { motion, AnimatePresence } from "framer-motion"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-10 h-10 rounded-full bg-primary-50/80 hover:bg-primary-100 dark:bg-primary-950/50 dark:hover:bg-primary-900/80 backdrop-blur-sm transition-colors"
        >
          <AnimatePresence mode="wait">
            {theme === 'light' ? (
              <motion.div
                key="sun"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: 180 }}
                exit={{ scale: 0, opacity: 0, rotate: -180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Sun className="h-5 w-5 text-primary-600" />
              </motion.div>
            ) : theme === 'dark' ? (
              <motion.div
                key="moon"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: 180 }}
                exit={{ scale: 0, opacity: 0, rotate: -180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Moon className="h-5 w-5 text-primary-200" />
              </motion.div>
            ) : (
              <motion.div
                key="system"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: 180 }}
                exit={{ scale: 0, opacity: 0, rotate: -180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Monitor className="h-5 w-5 text-primary-600 dark:text-primary-200" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="mt-2 min-w-[150px] rounded-xl bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg border border-primary-100/30 dark:border-primary-800/30"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 rounded-lg hover:bg-primary-50/80 dark:hover:bg-primary-900/50 focus:bg-primary-50/80 dark:focus:bg-primary-900/50"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Sun className="h-4 w-4 text-primary-600" />
          </motion.div>
          <span className="text-primary-700 dark:text-primary-200">
            Sáng
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 rounded-lg hover:bg-primary-50/80 dark:hover:bg-primary-900/50 focus:bg-primary-50/80 dark:focus:bg-primary-900/50"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Moon className="h-4 w-4 text-primary-600 dark:text-primary-200" />
          </motion.div>
          <span className="text-primary-700 dark:text-primary-200">
            Tối
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 rounded-lg hover:bg-primary-50/80 dark:hover:bg-primary-900/50 focus:bg-primary-50/80 dark:focus:bg-primary-900/50"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Monitor className="h-4 w-4 text-primary-600 dark:text-primary-200" />
          </motion.div>
          <span className="text-primary-700 dark:text-primary-200">
            Hệ thống
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}