import { useParams } from 'react-router-dom';
import { IntegrantesDataUnico } from "../../../data/IntegrantesData"; 
import { FaGithub, FaLinkedin } from 'react-icons/fa'; 
import BotaoVoltar from '../../../Components/BotaoVoltar';

const IntegrantesSolo = () => {
  const { nome } = useParams();

  const integrante = IntegrantesDataUnico.find(
    p => p.nome.split(' ')[0] === nome
  );


  if (!integrante) {
    return (
      <div className="flex flex-col items-center justify-center text-white mt-80">
        <h1 className="text-3xl font-bold mb-4">Ops! Integrante não encontrado.</h1>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 flex flex-col items-center justify-center">
      <div className="border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-neutral-900 rounded-3xl shadow-2xl p-6 md:p-10 shadow-gray-700/30 max-w-4xl w-full">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          
          <div className="shrink-0 mb-6 md:mb-0 md:mr-8">
            <img 
              src={integrante.imgSrc} 
              alt={`Foto de ${integrante.nome}`} 
              className="w-70 h-65 md:w-80 md:h-80 object-cover" 
            />
          </div>

          <div className="grow text-center md:text-left transition-colors">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-neutral-100">{integrante.nome}</h1>
            
            {integrante.titulo && ( 
              <p className="text-xl mt-1">
                {integrante.titulo}
                {integrante.id === 0 && "Desenvolvedor Full Stack Junior"}
              </p>
            )}
            
            {integrante.formacao && ( 
              <>
              <p className="text-lg  text-gray-600 dark:text-neutral-200 font-semibold mt-4">
                {integrante.formacao}

                {integrante.id === 0 && "Estudante de Análise e Desenvolvimento de Sistemas - FIAP"}
              </p>
              <p className="text-md mt-2">{integrante.rm}</p>
              <p className="text-md">{integrante.turma}</p></>
            )}
            </div>
        </div>

        <hr className="border-t-2 border-neutral-800 my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl shadow-lg shadow-gray-500/30 p-6 border border-neutral-300 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-3 text-neutral-900 dark:text-neutral-100">Sobre Mim</h2>
            <p className="text-neutral-900 dark:text-neutral-200 text-sm">
              {integrante.descricao}
            </p>
          </div>

          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex flex-col items-center shadow-lg shadow-gray-500/20 p-6 border border-neutral-300 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Entre em contato</h2>
            <div className="space-y-5 text-center">
              
              <p className="text-neutral-900 dark:text-neutral-200">
                  <strong>Email: </strong> 
                  <span className={integrante.id === 2 ? 'text-sm break-all' : ''}>
                    {integrante.email}
                  </span>
                </p>

              <div className="flex items-center space-x-20 sm:space-x-35">
                <a 
                  href={integrante.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex flex-col items-center hover:text-neutral-600 dark:hover:text-neutral-400 transition duration-300"
                >
                  <FaGithub size={36} />
                  <span className="mt-1 text-lg">Github</span>
                </a>
                
                <a 
                  href={integrante.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex flex-col items-center text-blue-600 hover:text-blue-800 transition duration-300"
                >
                  <FaLinkedin size={36} />
                  <span className="mt-1 text-lg">LinkedIn</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <BotaoVoltar 
          variant="button" 
          label="Voltar para a página anterior" 
        />
    </div>
    </div>
  );
}

export default IntegrantesSolo;