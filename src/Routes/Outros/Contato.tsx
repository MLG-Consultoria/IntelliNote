import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingCircle from "../../Components/LoadingCircle";
import BotaoVoltar from '../../Components/BotaoVoltar';
import { apiFetch } from '../../lib/api';

interface FormData {
  nome: string;
  email: string;
  mensagem: string;
}

const Contato: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    mensagem: ''
  });

  const [errors, setErrors] = useState<{ nome?: string; email?: string; mensagem?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as keyof FormData;
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if ((errors as any)[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const temp: { nome?: string; email?: string; mensagem?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let ok = true;

    if (!formData.nome.trim()) { temp.nome = 'O nome é obrigatório.'; ok = false; }
    if (!formData.email.trim()) { temp.email = 'O email é obrigatório.'; ok = false; }
    else if (!emailRegex.test(formData.email)) { temp.email = 'Por favor, insira um email válido.'; ok = false; }
    if (!formData.mensagem.trim()) { temp.mensagem = 'A mensagem não pode ficar em branco.'; ok = false; }

    setErrors(temp);
    return ok;
  };

  useEffect(() => {
    let timer: number | undefined;
    if (isSubmitted) {
      timer = window.setTimeout(() => navigate('/MenuPrincipal'), 1500);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [isSubmitted, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setIsSubmitted(false);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        nome: formData.nome,
        email: formData.email,
        mensagem: formData.mensagem
      };

      // chama backend (usa getBaseUrl dentro de apiFetch)
      await apiFetch('/contato', {
        method: 'POST',
        noAuth: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setIsSubmitted(true);
      setFormData({ nome: '', email: '', mensagem: '' });
    } catch (err: any) {
      console.error('Erro ao enviar contato:', err);
      // apiFetch lança Error com .body possivelmente
      let msg = 'Erro ao enviar a mensagem. Tente novamente mais tarde.';
      if (err && (err as any).body) {
        const body = (err as any).body;
        if (typeof body === 'string') msg = body;
        else if (body.error) msg = String(body.error);
        else if (body.message) msg = String(body.message);
        else msg = JSON.stringify(body);
      } else if (err && err.message) {
        msg = err.message;
      }
      setServerError(msg);
    } finally {
      setIsLoading(false);
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

        {serverError && (
          <div className="mt-4 p-3 text-red-800 bg-red-200 border border-red-300 rounded-lg">
            {serverError}
          </div>
        )}

        <form className="mt-4" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col gap-1">
              <label htmlFor="nome" className="font-medium">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Nome completo"
                value={formData.nome}
                onChange={handleChange}
                className={`p-2 border ${errors.nome ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-gray-200 dark:bg-gray-800 text-black dark:text-white`}
              />
              {errors.nome && <span className="text-red-500 text-sm">{errors.nome}</span>}
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
              <label htmlFor="mensagem" className="font-medium">Mensagem</label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows={5}
                value={formData.mensagem}
                onChange={handleChange}
                className={`p-2 border ${errors.mensagem ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-gray-200 dark:bg-gray-800 text-neutral-900 dark:text-white`}
              />
              {errors.mensagem && <span className="text-red-500 text-sm">{errors.mensagem}</span>}
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

      <BotaoVoltar variant="button" label="Voltar para a página anterior" className="mt-5" />
    </main>
  );
};

export default Contato;
