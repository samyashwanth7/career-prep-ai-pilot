import React from "react";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useLocation } from "react-router-dom";

function useThemeToggle() {
  const [theme, setTheme] = React.useState(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  React.useEffect(() => {
    // Init theme from storage on mount
    const saved = localStorage.getItem("theme");
    if (saved && saved !== theme) setTheme(saved);
  }, []);
  return { theme, setTheme };
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useThemeToggle();
  const location = useLocation();
  
  // Hide sidebar on landing page
  const shouldShowSidebar = location.pathname !== '/';

  return (
    <div className={`flex min-h-screen bg-background font-sans transition-main`}>
      {shouldShowSidebar && <Sidebar />}
      <div className="flex-1 flex flex-col min-h-screen bg-background transition-main">
        {/* Header */}
        <header className="flex items-center justify-between px-8 h-16 border-b border-sidebar-border bg-secondary dark:bg-sidebar transition-main">
          <div className="text-xl font-bold tracking-tight text-foreground select-none transition-main">
            AceInterviewAI
          </div>
          <div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400 transition-main" />
              ) : (
                <Moon className="w-5 h-5 text-foreground transition-main" />
              )}
            </Button>
          </div>
        </header>
        <main className="p-8 flex-1 flex flex-col animate-fade-in transition-main">{children}</main>
      </div>
    </div>
  );
};

export default Layout;