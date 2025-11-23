import React, { useState } from 'react';
import LoadingCircle from "../../Components/LoadingCircle";
import { GeminiService } from '../../services/GeminiService';
import BotaoVoltar from "../../Components/BotaoVoltar";

const ReSkilling = () => {
    const [profession, setProfession] = useState('');
    const [skills, setSkills] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setAiResponse(null);

        if (!profession.trim() || !skills.trim()) {
            setError('Por favor, preencha sua profissão atual e suas habilidades.');
            return;
        }

        setIsLoading(true);

        try {
            const result = await GeminiService.analyzeReskilling(profession, skills);
            setAiResponse(result);
        } catch (err) {
            setError('Houve um erro ao gerar sua análise. Tente novamente.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setAiResponse(null);
        setProfession('');
        setSkills('');
        setError('');
    };

    return (
        <main className="flex-1 flex flex-col justify-center px-4 py-8 p-10 sm:py-10 lg:px-10 lg:py-10 xl:px-32 2xl:px-48">
            <article className="gap-1 mt-3 flex flex-col">
                <h1 className="font-bold text-3xl">Reskilling - Transição de Carreira</h1>
                <p className="text-gray-400">
                    Descubra as melhores opções para sua transição profissional com ajuda da IA.
                </p>
            </article>

            <section className="mt-6 border border-gray-300 dark:border-gray-700 p-5 rounded-lg">
                <h2 className="font-medium text-2xl">Suas Informações</h2>
                <p className="text-gray-400 mb-4">Compartilhe detalhes sobre sua profissão atual e habilidades.</p>
                
                <form onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col gap-4">
                        
                        <div className="flex flex-col gap-1">
                            <label htmlFor="profession" className="font-medium">Profissão Atual</label>
                            <input 
                                type="text" 
                                id="profession" 
                                name="profession"
                                placeholder="Ex: Professor, Vendedor, Contador..."
                                value={profession}
                                onChange={(e) => setProfession(e.target.value)}
                                className={`p-2 border ${error && !profession ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-gray-200 dark:bg-gray-800 text-black dark:text-white`} 
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="skills" className="font-medium">Principais Habilidades</label>
                            <textarea 
                                id="skills" 
                                name="skills" 
                                rows={5}
                                placeholder="Descreva suas principais habilidades (soft skills contam muito aqui!)..."
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className={`p-2 border ${error && !skills ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-gray-200 dark:bg-gray-800 text-neutral-900 dark:text-white`}
                            ></textarea>
                            
                            {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
                        </div>

                        <button 
                            type="submit" 
                            className="bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-gray-500 transition-colors text-neutral-100 dark:text-gray-800 font-medium py-2 px-4 rounded-lg cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center" 
                            disabled={isLoading}
                        >
                            {isLoading ? <LoadingCircle /> : 'Analisar Transição de Carreira'}
                        </button>
                    </div>
                </form>
            </section>

            {aiResponse && (
                <section className="mt-8 border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-gray-900 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="font-bold text-2xl mb-4 text-blue-800 dark:text-blue-400">Análise de Carreira 📊</h2>
                    
                    <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                        {aiResponse}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button 
                            onClick={handleReset}
                            className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white underline"
                        >
                            Pesquisar nova transição
                        </button>
                    </div>
                </section>
            )}
            <BotaoVoltar variant="button" label="Voltar para a página anterior" className="mt-5" />
        </main>
    );
}
export default ReSkilling;