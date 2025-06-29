import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Briefcase,
  BarChart2,
  User,
  File,
  Circle,
  SunMedium,
  PenTool,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: <Home /> },
  { label: "CV Builder", path: "/cv-builder", icon: <PenTool /> },
  { label: "Jobs", path: "/jobs", icon: <Briefcase /> },
  { label: "Analytics", path: "/analytics", icon: <BarChart2 /> },
  { label: "Profile", path: "/profile", icon: <User /> },
  { label: "Resume Analyzer", path: "/resume-analyzer", icon: <File /> },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border duration-200 transition-all ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex items-center justify-between px-6 py-6 mb-4">
        {/* Logo or Icon only when collapsed */}
        <span className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <Circle className="w-6 h-6 text-indigo-400" />
          {!collapsed && <span className="font-bold font-sans">AceInterviewAi</span>}
        </span>
        <button
          className="ml-auto text-gray-400 hover:text-gray-100"
          aria-label="Collapse Sidebar"
          onClick={() => setCollapsed((c) => !c)}
        >
          <SunMedium className={`h-6 w-6 ${collapsed ? "rotate-180" : ""} transition-transform`} />
        </button>
      </div>
      <nav className="flex-1">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 rounded-r-full font-semibold gap-3 text-base transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-purple-400 text-white shadow"
                      : "text-sidebar-foreground hover:bg-sidebar-border/70 hover:text-white"
                  } ${collapsed ? "justify-center px-2" : ""}`
                }
                end
              >
                <span className="w-6 h-6">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-col mb-4 mt-auto items-center px-2">
        <a
          href="https://lovable.dev"
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full rounded-md bg-secondary hover:bg-accent text-primary px-3 py-2 text-xs mb-2 mt-auto transition-all text-center font-medium ${
            collapsed ? "hidden" : ""
          }`}
        >
          Powered by Lovable
        </a>
        <div className="text-xs text-muted-foreground mt-2 select-none">
          {!collapsed && <>v1.0</>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;