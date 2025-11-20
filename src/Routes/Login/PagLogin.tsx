import { FaRegEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingCircle from "../../Components/LoadingCircle";
import { storage } from "../../lib/storage";

interface FormData {
  email: string;
  senha: string;
}

interface FormErrors {
  email?: string;
  senha?: string;
}

const PagLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({ email: '', senha: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState<string>(''); 
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Por favor, insira um email válido.';
    }
    if (formData.senha.trim().length < 6) {
      newErrors.senha = 'A senha deve ter pelo menos 6 caracteres.';
    }
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setAuthError('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setAuthError('');

    if (Object.keys(validationErrors).length === 0) {
      try {
        storage.login(formData.email, formData.senha);
        navigate('/MenuPrincipal');

      } catch (error) {
        if (error instanceof Error) {
          setAuthError(error.message);
        } else {
          setAuthError('Ocorreu um erro desconhecido.');
        }
      }
    }
  };

  const isValid = emailRegex.test(formData.email) && formData.senha.trim().length >= 6;

    useEffect(() => {
    document.body.classList.add('hide-layout');
    return () => {
      document.body.classList.remove('hide-layout');
      document.body.style.overflow = 'auto';
    };
  }, []);

    return (
      <main className="border border-gray-200 dark:border-gray-800 p-4 mt-30 sm:mt-30 lg:mt-40 rounded-lg shadow-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-fit mx-auto sm:w-full sm:max-w-md transition-colors duration-300">
        <div className="text-center flex flex-col justify-center items-center mt-3">
          
          <div className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-2xl w-12 h-12 border border-transparent rounded-xl flex items-center justify-center font-bold mb-5 transition-colors">
            <p>IN</p>
          </div>
          <h1 className="text-2xl font-bold">
            IntelliNote
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Entre na sua Conta</p>

          <form onSubmit={handleSubmit} className="flex flex-col mt-5 w-full text-left">
            <div className="w-full flex flex-col">
              <p className="mb-2 font-medium">Email</p>
              <input 
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="mb-4 p-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-white transition-colors"
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="w-full flex flex-col">
              <p className="mb-2 font-medium">Senha</p>
              <div className="relative w-full mb-4">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className="w-full p-2 pr-10 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-white transition-colors"
                  required
                />
                
                <button
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  aria-label="Mostrar/esconder senha"
                >
                  {showPassword ? 
                  <FaEyeSlash className="h-5 w-5" /> : 
                  <FaEye className="h-5 w-5" />
                  }
                </button>
              </div>
            </div>

            {authError && (
              <div className="mb-4 p-3 text-red-800 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                {authError}
              </div>
            )}

            <button 
              type="submit"
              disabled={!isValid}
              className={`p-2 rounded-md transition-all font-medium
              ${!isValid 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600' 
                : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 cursor-pointer hover:scale-[0.98]'}`}
            >
              Entrar
            </button>
          </form>
          <hr className="mt-4 border-gray-200 dark:border-gray-700 w-full" />
          <button
            className="mt-4 border border-gray-300 dark:border-gray-600 bg-white text-gray-900 dark:bg-gray-950 dark:text-white p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full flex items-center justify-center gap-3 cursor-pointer"
          >
            <FaRegEnvelope  />
            Entrar com Google
          </button>
          <p className="text-sm text-gray-400 mt-2">Apenas uma opção visual - Em Desenvolvimento</p>
          <div className="mt-4">
            <p className="text-gray-600 dark:text-gray-400">Não possui uma conta? <a href="/Registro" className="text-gray-900 dark:text-white font-medium hover:underline">Registre-se</a></p>
          </div>
          <div className="mt-4 justify-center flex flex-col items-center text-gray-600 dark:text-gray-400">
            <LoadingCircle />
            <p className="mt-2">Carregando Seus Dados...</p>
          </div>
        </div>      
      </main>
    );
}

export default PagLogin;