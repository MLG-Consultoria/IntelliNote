import { Link } from "react-router-dom";
import { FiFileText } from "react-icons/fi";
import { LuBrain } from "react-icons/lu";
import { LuCalendar } from "react-icons/lu";
import { IoTrendingUp } from "react-icons/io5";


type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};
  

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 hover:transform hover:scale-102 hover:-translate-y-2 transition-transform duration-300 animate-fade-in-slide-left ">
      
      <div className="h-10 w-10 text-gray-900 dark:text-white">
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      
      <p className="text-sm text-gray-700 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};


const MenuPrincipal = () => {
  return (
    <main className="flex flex-col items-center animate-fade-in-slide-left">
      
      <article className="flex w-11/12 max-w-3xl flex-col items-center gap-6 pt-20 text-center md:pt-24">
        
        <h1 className="text-4xl font-bold text-black dark:text-white md:text-5xl">
          Suas ideias organizadas com Inteligência Artificial
        </h1>
        
        <p className="text-base text-gray-700 dark:text-gray-400 md:text-lg">
          Crie, organize e melhore suas anotações com o poder da IA. 
          Simplifique sua vida e impulsione sua produtividade.
        </p>
        
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link to="/CriarNota">
            <button className="w-full rounded-lg bg-gray-900 dark:bg-gray-100 px-6 py-3 font-medium text-neutral-100 dark:text-neutral-900 transition duration-300 hover:bg-gray-700 dark:hover:bg-neutral-300 sm:w-auto cursor-pointer"
            >
              Criar Nova Nota
            </button>
          </Link>
          
          <Link to="/VerNota">
            <button className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 px-6 py-3 font-medium text-gray-800 dark:text-gray-100 transition duration-300 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 sm:w-auto cursor-pointer"
            >
              Ver Minhas Notas
            </button>
          </Link>
        </div>
      </article>

      <section className="container mx-auto w-full max-w-7xl px-4 py-16 md:py-24">
        
        <div className="border-t border-gray-200 dark:border-gray-800">
          
          <h2 className="mb-6 pt-12 text-center text-2xl font-bold text-black 
                         dark:text-white md:mb-8 md:pt-16 md:text-3xl"
          >
            Recursos Principais
          </h2>
          
          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            <FeatureCard
              icon={<FiFileText className="h-full w-full" />}
              title="Anotações Inteligentes"
              description="Crie e organize suas notas com tags personalizadas"
            />
            
            <FeatureCard
              icon={<LuBrain className="h-full w-full" />}
              title="IA Integrada"
              description="Melhore suas notas automaticamente com sugestões de IA"
            />
            
            <FeatureCard
              icon={<LuCalendar className="h-full w-full" />}
              title="Calendário"
              description="Gerencie lembretes e compromissos em um só lugar"
            />
            
            <FeatureCard
              icon={<IoTrendingUp className="h-full w-full" />}
              title="Desenvolvimento"
              description="Ferramentas de reskilling e upskilling com IA"
            />
            
          </div>
        </div>
      </section>
    </main>
  );
};

export default MenuPrincipal;