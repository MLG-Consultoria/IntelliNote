import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import LoadingCircle from "../../Components/LoadingCircle";

const Contato = () => {

    const navigate = useNavigate(); 

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = e.target.name as keyof typeof formData;
        const value = e.target.value;
        
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        let tempErrors = { name: '', email: '', message: '' };
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

        if (!formData.name.trim()) {
            tempErrors.name = 'O nome é obrigatório.';
            isValid = false;
        }
        if (!formData.email.trim()) {
            tempErrors.email = 'O email é obrigatório.';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            tempErrors.email = 'Por favor, insira um email válido.';
            isValid = false;
        }
        if (!formData.message.trim()) {
            tempErrors.message = 'A mensagem não pode ficar em branco.';
            isValid = false;
        }

        setErrors(tempErrors); 
        return isValid; 
    };

    useEffect(() => {
        let navigationTimer: number | undefined;
        if (isSubmitted) {
            navigationTimer = setTimeout(() => {
                navigate('/MenuPrincipal'); 
            }, 1500); 
        }

        return () => {
            if (navigationTimer) {
                clearTimeout(navigationTimer);
            }
        };
    }, [isSubmitted, navigate]); 


    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault(); 
        setIsSubmitted(false);

        if (validateForm()) {
            setIsLoading(true);
            console.log("Formulário válido! Enviando dados:", formData);

            setTimeout(() => {
                setIsLoading(false);
                setIsSubmitted(true); 
                setFormData({ name: '', email: '', message: '' }); 
            }, 2000); 

        } else {
            console.log("Formulário com erros.");
        }
    };
    
    return (
        <main className="flex-1 flex flex-col justify-center px-4 py-8 p-10 sm:py-10 lg:px-10 lg:py-10 xl:px-32 2xl:px-48">
            <article className="gap-1 flex flex-col">
                <h1 className="font-bold text-3xl">Contato e Feedback</h1>
                <p className="text-gray-400">Envie suas dúvidas, sugestões ou feedback</p>
            </article>

            <section className="mt-6 border border-gray-300 dark:border-gray-700 p-5 rounded-lg ">
                <h2 className="font-medium text-2xl">Entre em Contato</h2>
                <p className="text-gray-400">Preencha o formulário abaixo e retornaremos em breve</p>
                
                {isSubmitted && (
                    <div className="mt-4 p-3 text-green-800 bg-green-200 border border-green-300 rounded-lg">
                        Mensagem enviada com sucesso! Redirecionando...
                    </div>
                )}

                <form className="mt-4" onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col gap-4 mt-6">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="name" className="font-medium">Nome</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name"
                                placeholder="Nome completo"
                                value={formData.name}
                                onChange={handleChange}
                                className={`p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-gray-200 dark:bg-gray-800 text-black dark:text-white`} 
                            />
                            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="font-medium">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="seu@email.com"
                                value={formData.email}
                                onChange={handleChange} 
                                className={`p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-gray-200 dark:bg-gray-800 text-black dark:text-white`}
                            />
                            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="message" className="font-medium">Mensagem</label>
                            <textarea 
                                id="message" 
                                name="message" 
                                rows={5} 
                                value={formData.message}
                                onChange={handleChange}
                                className={`p-2 border ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-gray-200 dark:bg-gray-800 text-neutral-900 dark:text-white`}
                            ></textarea>
                            {errors.message && <span className="text-red-500 text-sm">{errors.message}</span>}
                        </div>

                        <button 
                            type="submit" 
                            className="bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-gray-300 transition-colors text-neutral-100 dark:text-gray-800 font-medium py-2 px-4 rounded-lg cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center" 
                            disabled={isLoading}
                        >
                            {isLoading ? <LoadingCircle /> : 'Enviar'}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default Contato;