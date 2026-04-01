import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Sparkles,
  MessageCircle,
  ClipboardList,
  Lightbulb,
  PartyPopper,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Главная", icon: PartyPopper, exact: true },
  { to: "/chat", label: "ИИ Агент", icon: MessageCircle },
  { to: "/planner", label: "Планировщик", icon: ClipboardList },
  { to: "/ideas", label: "Идеи", icon: Lightbulb },
];

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}>
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ background: "rgba(15,12,41,0.85)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold text-lg hidden sm:block">
                Birthday<span style={{ color: "#f857a6" }}>AI</span>
              </span>
            </NavLink>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                    style={isActive ? { background: "linear-gradient(135deg, #f857a6, #ff5858)" } : {}}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                  style={isActive ? { background: "linear-gradient(135deg, #f857a6, #ff5858)" } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        )}
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}