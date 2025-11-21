import BotaoVoltar from '../../Components/BotaoVoltar';

const SobreNos = () => { 
    return (
        <main className="flex-1 text-neutral-900 dark:text-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto ">
                <header className="text-start mb-12">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Sobre Nós
                    </h1>
                    <p className="mt-4 text-xl text-gray-400">
                        Conheça mais sobre o Projeto IntelliNote
                    </p>
                </header>

                <section className="flex flex-col gap-8 animate-fade-in-slide-down">
                    <div className="bg-neutral-100 dark:bg-gray-800 border border-neutral-300 dark:border-gray-700 p-8 rounded-xl shadow-lg animate-fade-in-slide-down">
                        <h2 className="text-2xl font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
                            Nossa Missão
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            Transformar a forma como as pessoas organizam e interagem com suas ideias, utilizando o poder da Inteligência Artificial para aumentar a produtividade e criatividade.
                        </p>
                    </div>

                    <div className="bg-neutral-100 dark:bg-gray-800 border border-neutral-300 dark:border-gray-700 p-8 rounded-xl shadow-lg animate-fade-in-slide-down [animation-delay:100ms]">
                        <h2 className="text-2xl font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
                            Nossa Solução
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            O IntelliNote nasceu da necessidade de criar um sistema de anotações que não apenas armazena informações, mas também ajuda os usuários a melhorá-las e organizá-las de forma inteligente. Combinamos design moderno com tecnologia de ponta para criar uma experiência única.
                        </p>
                    </div>

                    <div className="bg-neutral-100 dark:bg-gray-800 border border-neutral-300 dark:border-gray-700 p-8 rounded-xl shadow-lg animate-fade-in-slide-down [animation-delay:400ms]">
                        <h2 className="text-2xl font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
                            A Experiência
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            Utilizamos as mais recentes tecnologias em desenvolvimento web e IA, incluindo React, TypeScript e modelos avançados de processamento de linguagem natural para oferecer uma experiência rápida, segura e inteligente.
                        </p>
                    </div>

                <BotaoVoltar variant="button" label="Voltar para a página anterior"/>
                </section>
            </div>
        </main>
    );
}

export default SobreNos;