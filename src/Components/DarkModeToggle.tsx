import { IoMoon, IoSunny } from "react-icons/io5";
import { useTheme } from "../context/ThemeContext";

export const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-md border
                 border-gray-700/50 text-gray-400
                 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-100/10 transition-colors cursor-pointer"
      aria-label="Mudar tema"
    >
      {theme === 'light' ? (
        <IoMoon className="h-5 w-5" /> 
      ) : (
        <IoSunny className="h-5 w-5" /> 
      )}
    </button>
  );
};

export default ThemeToggleButton;