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
      <main className="border border-gray-800 p-4 mt-30 sm:mt-30 lg:mt-40 rounded-lg shadow-lg bg-white dark:bg-gray-950 text-gray-950 dark:text-gray-100 w-fit mx-auto sm:w-full sm:max-w-md">
        <div className="text-center flex flex-col justify-center items-center mt-3">
          
          <div className="bg-white text-2xl text-gray-800 w-12 h-12 border border-white rounded-xl flex items-center justify-center font-bold mb-5">
            <p>IN</p>
          </div>
          <h1 className="text-2xl">
            IntelliNote
          </h1>
          <p className="text-gray-400 text-sm">Entre na sua Conta</p>

          <form onSubmit={handleSubmit} className="flex flex-col mt-5 w-full text-left">
            <div className="w-full flex flex-col">
              <p className="mb-2">Email</p>
              <input 
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="mb-4 p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="w-full flex flex-col">
              <p className="mb-2">Senha</p>
              <div className="relative w-full mb-4">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className="w-full p-2 pr-10 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
                
                <button
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-gray-600 hover:text-white"
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
              <div className="mb-4 p-3 text-red-800 bg-red-200 border border-red-300 rounded-lg">
                {authError}
              </div>
            )}

            <button 
              type="submit"
              disabled={!isValid}
              className={`bg-white text-gray-950 p-2 rounded-md hover:bg-gray-300 transition-colors"
              ${!isValid ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'hover:bg-gray-400 transition-transform hover:scale-98 cursor-pointer'}`}
            >
              Entrar
            </button>
          </form>
          <hr className="mt-4 border-gray-700 w-full" />
          <button
            className="mt-4 border border-gray-600 bg-gray-950 text-white p-2 rounded-md hover:bg-gray-700 transition-colors w-full flex items-center justify-center gap-3 cursor-pointer"
          >
            <FaRegEnvelope  />
            Entrar com Google
          </button>
          <p className="text-sm text-gray-400">Apenas uma opção visual - Em Desenvolvimento</p>
          <div className="mt-4">
            <p className="text-gray-600">Não possui uma conta? <a href="/Registro" className="text-white hover:underline">Registre-se</a></p>
          </div>
          <div className="mt-4 justify-center flex flex-col items-center text-gray-600">
            <LoadingCircle />
            <p>Carregando Seus Dados...</p>
          </div>
        </div>      
      </main>
    );
}

export default PagLogin;