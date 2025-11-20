import { Link } from 'react-router-dom'; 
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { IntegrantesDataGeral } from '../../../data/IntegrantesData';

const Integrantes = () => {
  return (
    <main className="flex-1 container py-8 mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold">Nossa Equipe</h1>
        <p className="mb-8">
          Conheça as pessoas por trás do NotesAI
        </p>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mx-3 sm:mx-8 lg:mx-10">
        
        {IntegrantesDataGeral.map((integrante, index) => {
          const delayClass = `delay-${(index + 1) * 100}`;
          
          return (
          <div 
            key={integrante.id} 
            className={`animate-fade-in-slide-left ${delayClass} flex flex-col sm:flex-col md:flex-row lg:flex-col border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-neutral-900 my-3 p-6 rounded-2xl items-center md:items-start text-center md:text-left lg:text-center shadow-[2px_5px_10px_rgba(0,0,0,0.3)] lg:items-center`}
            >
            <div className="w-32 h-32 md:h-45 md:w-60 lg:w-45 md:mt-4 lg:mt-2 rounded-2xl border-2 border-gray-300 dark:border-neutral-700 overflow-hidden mb-5 md:mb-4 lg:mr-0">
                <img 
                src={integrante.imgSrc} 
                alt={`Foto de ${integrante.nome}`}
                className="w-full h-full object-cover"
                />
            </div>

            <div className="flex flex-col justify-between w-full lg:items-center md:items-center md:ml-8 lg:ml-0 md:text-center">
                <div>
                    <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 md:text-xl">{integrante.nome}</h2>
                    <p className="mt-1 text-sm md:text-base">{integrante.rm}</p>
                    <p className="text-sm md:text-base mb-3">{integrante.turma}</p>
                </div>

                <div className="flex justify-center md:ml-12 lg:ml-0 gap-8 my-4">
                <a 
                    href={integrante.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-gray-700 dark:hover:text-gray-400 transition hover:scale-110"
                >
                    <FaGithub size={48} />
                </a>
                <a 
                    href={integrante.linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-700 hover:text-blue-900 transition hover:scale-110"
                >
                    <FaLinkedin size={48} />
                </a>
                </div>

                <Link 
                to={integrante.linkMais}
                className="w-full md:w-auto bg-gray-900 dark:bg-white text-gray-100 dark:text-gray-800 py-2 px-6 rounded-lg font-semibold transition hover:bg-gray-800 dark:hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 hover:scale-105 md:ml-10 lg:ml-0 text-center block"
                >
                Conheça mais
                </Link>
            </div>
            </div>
          );
          })}
      </section>
    </main>
  );
}

export default Integrantes;