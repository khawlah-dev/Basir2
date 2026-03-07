import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden bg-background/50 hover:bg-accent hover:text-accent-foreground border-border/50"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="تغيير الألوان"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-blue-400" />
            <span className="sr-only">تبديل السمة</span>
        </Button>
    )
}
