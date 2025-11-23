// src/Components/Header.tsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ThemeToggleButton } from "./DarkModeToggle";
import { IoCalendarClearOutline } from "react-icons/io5";
import { FaSearch, FaPlus, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { HiUser } from "react-icons/hi";
import { clearSession, getCurrentUser } from "../lib/storage";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/VerNota?q=${encodeURIComponent(searchQuery)}`);
    else navigate(`/VerNota`);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    clearSession();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinkClasses = "text-sm text-gray-400 hover:text-gray-700 transition-colors";
  const mobileLinkClasses = "text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors py-2";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-300 dark:border-gray-700/50 bg-white dark:bg-[#111113]">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 md:gap-4 px-4 md:px-6">
        <Link to="/MenuPrincipal" className="flex items-center gap-2 z-50">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 dark:bg-white dark:text-black text-white">
            <span className="text-lg font-bold">IN</span>
          </div>
          <span className="font-bold text-black dark:text-white sm:inline-block">IntelliNote</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm ml-2 lg:ml-4">
          <Link to="/Integrantes" className={navLinkClasses}>Integrantes</Link>
          <Link to="/Faq" className={navLinkClasses}>FAQ</Link>
          <Link to="/reskilling" className={navLinkClasses}>Reskilling</Link>
          <Link to="/upskilling" className={navLinkClasses}>Upskilling</Link>
          <Link to="/Calendario" className={navLinkClasses}><IoCalendarClearOutline className="h-5 w-5" /></Link>
        </nav>

        <div className="hidden md:flex ml-auto items-center gap-2">
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Buscar..."
                className="h-9 w-[120px] lg:w-[300px] rounded-md border border-gray-700/50 bg-gray-100/10 pl-9 pr-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <Link to="/CriarNota">
            <button className="flex h-9 items-center justify-center gap-2 rounded-md bg-neutral-900 dark:bg-white px-2 lg:px-3 text-sm font-medium text-gray-300 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors cursor-pointer" title="Nova Nota">
              <FaPlus className="h-3 w-3" /><span className="hidden lg:inline">Nova Nota</span>
            </button>
          </Link>

          <ThemeToggleButton />

          {user && (
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(s => !s)} className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600 transition-colors cursor-pointer">
                <HiUser className="h-5 w-5" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-11 w-48 rounded-md border border-gray-700/50 bg-white dark:bg-[#1C1C1E] shadow-lg">
                  <div className="p-1">
                    <div className="px-2 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-400 opacity-70">{user.nome}</div>
                    <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <FaSignOutAlt className="mr-2 h-4 w-4" />Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex md:hidden ml-auto items-center gap-4">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600 dark:text-gray-300"><FaSearch className="h-5 w-5" /></button>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-900 dark:text-white p-2 focus:outline-none"><FaBars className="h-6 w-6" /></button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-60 flex justify-end">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative h-full w-full sm:w-[350px] bg-white dark:bg-[#09090B] border-l border-gray-200 dark:border-gray-800 p-6 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 dark:bg-white dark:text-black text-white">
                  <span className="text-md font-bold">IN</span>
                </div>
                <span className="font-bold text-lg text-black dark:text-white">NotesAI</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"><FaTimes className="h-6 w-6" /></button>
            </div>

            <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
              <form onSubmit={handleSearch} className="relative w-full">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input type="search" placeholder="Buscar notas..." className="h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1C1C1E] pl-9 pr-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </form>

              <Link to="/CriarNota" onClick={closeMenu}>
                <button className="flex w-full items-center gap-2 rounded-md bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-gray-800 px-4 py-3 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <FaPlus className="h-4 w-4" />Nova Nota
                </button>
              </Link>

              <nav className="flex flex-col gap-2 mt-2">
                <Link to="/VerNota" onClick={closeMenu} className={mobileLinkClasses}>Minhas Notas</Link>
                <Link to="/Integrantes" onClick={closeMenu} className={mobileLinkClasses}>Integrantes</Link>
                <Link to="/Faq" onClick={closeMenu} className={mobileLinkClasses}>FAQ</Link>
                <Link to="/reskilling" onClick={closeMenu} className={mobileLinkClasses}>Reskilling</Link>
                <Link to="/upskilling" onClick={closeMenu} className={mobileLinkClasses}>Upskilling</Link>
                <Link to="/Calendario" onClick={closeMenu} className={`${mobileLinkClasses} flex items-center gap-2`}><IoCalendarClearOutline className="h-5 w-5" />Calendário</Link>
              </nav>

              <div className="mt-auto flex flex-col gap-4 border-t border-gray-200 dark:border-gray-800 pt-6">
                <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Alterar Tema</span>
                  <ThemeToggleButton />
                </div>

                {user && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Logado como: <span className="font-bold text-gray-900 dark:text-white">{user.nome}</span></p>
                    <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-md bg-red-900/90 px-4 py-3 text-sm font-medium text-white hover:bg-red-800 transition-colors">
                      <FaSignOutAlt className="h-4 w-4" />Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
