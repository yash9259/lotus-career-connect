import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/jobs", label: "Browse Jobs" },
  { to: "/post-job", label: "Post a Job" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    navigate(term ? `/jobs?keyword=${encodeURIComponent(term)}` : "/jobs");
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setMobileOpen(false);
    navigate("/");
  };

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close on Escape for keyboard users
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-plum-deep/95 text-white backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "border-white/15 shadow-[0_12px_30px_-18px_hsl(0_0%_0%/0.8)]" : "border-white/10"
      }`}
    >
      <div className="container flex h-[72px] items-center justify-between gap-4">
        <Link to="/" className="group flex min-w-0 items-center gap-3 rounded-lg" aria-label="Hare Krishna Job Placement - home">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white p-1 sm:h-12 sm:w-12">
            <img src="/logo-192.webp" width={48} height={48} alt="" className="h-full w-full object-contain" />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate font-display text-lg font-medium tracking-tight text-white sm:text-xl">
              Hare Krishna
            </span>
            <span className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-gold sm:text-[11px]">
              Job Placement
            </span>
          </span>
        </Link>

        {/* Job search, as on LinkedIn */}
        <form onSubmit={handleSearch} role="search" className="hidden max-w-xs flex-1 xl:block">
          <label className="relative block">
            <span className="sr-only">Search jobs</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search jobs"
              className="h-10 w-full rounded-md border border-white/15 bg-white/10 pl-9 pr-3 text-sm text-white placeholder:text-white/55 focus:border-gold focus:outline-none"
            />
          </label>
        </form>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? "page" : undefined}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  active ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
                {active && <span className="absolute inset-x-3 -bottom-[13px] h-0.5 bg-gold" aria-hidden="true" />}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link to={user.role === "admin" ? "/admin" : "/dashboard"}>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">
                  {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                </Button>
              </Link>
              <Button size="sm" className="border-0 bg-gold text-plum-deep shadow-none hover:bg-gold/80" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="border-0 bg-gold text-plum-deep shadow-none hover:bg-gold/80">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <div className="brand-ribbon" aria-hidden="true" />

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/10 bg-plum-deep md:hidden"
          >
            <nav className="container flex flex-col gap-1 py-4" aria-label="Mobile">
              {navLinks.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-md px-4 py-3 text-base font-medium transition-colors ${
                      active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-3 flex gap-3 px-1">
                {user ? (
                  <>
                    <Link
                      to={user.role === "admin" ? "/admin" : "/dashboard"}
                      className="flex-1"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button variant="outline" className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                        {user.role === "admin" ? "Admin" : "Dashboard"}
                      </Button>
                    </Link>
                    <Button className="w-full flex-1 border-0 bg-gold text-plum-deep shadow-none hover:bg-gold/80" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">Login</Button>
                    </Link>
                    <Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full border-0 bg-gold text-plum-deep shadow-none hover:bg-gold/80">Register</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
