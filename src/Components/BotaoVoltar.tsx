import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

interface BackButtonProps {
  variant?: 'arrow' | 'button'; 
  label?: string;
  className?: string;
}

const BotaoVoltar = ({ 
  variant = 'arrow', 
  label = 'Voltar', 
  className = '' 
}: BackButtonProps) => {
  
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  // --- VARIANTE 1: Seta Flutuante (Top Left) ---
  if (variant === 'arrow') {
    return (
      <button
        onClick={handleGoBack}
        className={`absolute flex flex-row items-center gap-2 top-20 left-4 md:top-24 md:left-8 z-40
                   p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white
                   hover:bg-gray-100 dark:hover:bg-gray-800 transition-all 
                   focus:outline-none focus:ring-2 focus:ring-gray-400 ${className}`}
        aria-label="Voltar"
      >
        <FaArrowLeft className="h-5 w-5 md:h-6 md:w-6" /> Voltar
      </button>
    );
  }

  // --- VARIANTE 2: Botão Padrão (Bottom/Inline) ---
  return (
    <button
      onClick={handleGoBack}
      className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg
                 bg-white border border-gray-300 text-gray-700 font-medium
                 hover:bg-gray-50 hover:text-black
                 dark:bg-transparent dark:hover:bg-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:text-white dark:hover:border-gray-400
                 transition-all shadow-sm ${className}`}
    >
      <FaArrowLeft className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
};

export default BotaoVoltar;