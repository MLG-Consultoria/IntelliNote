import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ThemeToggleButton } from '../Components/DarkModeToggle';
import { IoCalendarClearOutline } from "react-icons/io5";
import { FaSearch, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { HiUser } from "react-icons/hi";
import { storage } from "../lib/storage";

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const user = storage.getCurrentUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/notes?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    storage.logout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  const navLinkClasses = "text-sm text-gray-400 hover:text-white transition-colors";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700/50 bg-white dark:bg-[#111113]">
      <div className="container mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">

        <Link to="/MenuPrincipal" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
            <span className="text-lg font-bold">IN</span>
          </div>
          <span className="hidden font-bold text-black dark:text-white sm:inline-block">
            IntelliNote
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm ml-4">
          <Link to="/Integrantes" className={navLinkClasses}> Integrantes </Link>
          <Link to="/Faq" className={navLinkClasses}> FAQ </Link>
          <Link to="/reskilling" className={navLinkClasses}> Reskilling </Link>
          <Link to="/upskilling" className={navLinkClasses}> Upskilling </Link>
          <Link to="/Calendario" className={navLinkClasses}>
            <IoCalendarClearOutline className="h-5 w-5" />
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">

          <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Buscar notas..."
                className="h-9 w-[200px] lg:w-[300px] rounded-md border border-gray-700/50 bg-gray-100/10
                           pl-9 pr-3 text-sm text-white placeholder:text-gray-400
                           focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <Link to="/CriarNota">
            <button
              className="flex h-9 items-center gap-2 rounded-md bg-white px-3
                         text-sm font-medium text-black
                         hover:bg-gray-200 transition-colors"
            >
              <FaPlus className="h-3 w-3" />
              Nova Nota
            </button>
          </Link>

          <ThemeToggleButton />

          {user && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full
                           bg-gray-700 text-gray-400
                           hover:text-white hover:bg-gray-600 transition-colors"
              >
                <HiUser className="h-5 w-5" />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute right-0 top-11 w-48
                             rounded-md border border-gray-700/50
                             bg-white dark:bg-[#1C1C1E] shadow-lg"
                >
                  <div className="p-1">
                    <div className="px-2 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-400 opacity-70">
                      {user.name} {/* Mostra o nome real do usuário */}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-sm px-2
                                   py-1.5 text-sm text-left text-gray-900 dark:text-white
                                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FaSignOutAlt className="mr-2 h-4 w-4" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;