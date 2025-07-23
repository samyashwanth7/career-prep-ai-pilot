
import React from "react";
import Sidebar from "./Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Force dark mode on mount
  React.useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="flex min-h-screen bg-background font-sans transition-main">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-background transition-main">
        {/* Header */}
        <header className="flex items-center justify-between px-8 h-16 border-b border-sidebar-border bg-sidebar transition-main">
          <div className="text-xl font-bold tracking-tight text-sidebar-foreground select-none transition-main">
            AceInterview AI
          </div>
        </header>
        <main className="p-8 flex-1 flex flex-col animate-fade-in transition-main">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
