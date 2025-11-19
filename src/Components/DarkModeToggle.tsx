import { IoMoon, IoSunny } from "react-icons/io5";
import { useTheme } from "../context/ThemeContext";

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-md border
                 border-gray-700/50 text-gray-400
                 hover:text-white hover:bg-gray-100/10 transition-colors"
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