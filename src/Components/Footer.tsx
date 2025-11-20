import { Link } from "react-router-dom";

export const Footer = () => {
  const linkClasses = "text-sm text-gray-400 hover:text-gray-700 hover:dark:hover:text-gray-500 transition-colors cursor-pointer";

  return (
    <footer className="w-full border-t border-gray-300 dark:border-gray-700/50 bg-white dark:bg-[#111113] sm:bottom-0 mt-auto sm:static">
      <div className="container mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6"
      >
                
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-400">
            © 2025 IntelliNote. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-500">
            Desenvolvido por Giovane Amato, Lucas Vieira e Matheus Roque
          </p>
        </div>

        <nav className="flex flex-wrap gap-4 md:gap-6">
          <Link to="/SobreNos" className={linkClasses}>
            Sobre Nós
          </Link>
          <Link to="/Contato" className={linkClasses}>
            Contato/Feedback
          </Link>
          <Link to="/Integrantes" className={linkClasses}>
            Integrantes
          </Link>
          <Link to="/Faq" className={linkClasses}>
            FAQ
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;