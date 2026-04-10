import { Link, useLocation, Outlet } from "react-router-dom";
import { Film, Compass, BarChart2 } from "lucide-react";

const TABS = [
  { path: "/", label: "Catálogo", icon: Film },
  { path: "/discover", label: "Descobrir", icon: Compass },
  { path: "/stats", label: "Estatísticas", icon: BarChart2 },
];

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Film className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm tracking-tight">CineLog</span>
          </div>
          <nav className="hidden sm:flex items-center gap-1">
            {TABS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  pathname === path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Bottom Tab Bar (Mobile) */}
      <nav className="sm:hidden sticky bottom-0 border-t border-border/50 bg-card/90 backdrop-blur-md flex">
        {TABS.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all ${
              pathname === path ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <Icon className={`w-5 h-5 ${pathname === path ? "text-primary" : ""}`} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}