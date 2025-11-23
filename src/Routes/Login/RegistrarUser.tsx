import { FaRegEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingCircle from "../../Components/LoadingCircle";
import { apiFetch } from "../../lib/api";
import { saveSession } from "../../lib/storage";

interface FormData { name: string; email: string; senha: string; }
interface FormErrors { name?: string; email?: string; senha?: string; }

const RegistrarUser: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", senha: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (formData.name.trim().length < 2) newErrors.name = "O nome parece curto demais.";
    if (!emailRegex.test(formData.email)) newErrors.email = "Por favor, insira um email válido.";
    if (formData.senha.trim().length < 6) newErrors.senha = "A senha deve ter pelo menos 6 caracteres.";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length !== 0) return;

    try {
      setLoading(true);

      // usa `noAuth: true` para não enviar header Authorization (evita enviar token antigo)
      // apiFetch já retorna JSON parseado (ou lança erro com mensagem do backend)
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          nome: formData.name,
          email: formData.email.toLowerCase(),
          senha: formData.senha
        }),
        // @ts-ignore - seu apiFetch pode aceitar noAuth flag
        noAuth: true
      } as any);

      // Se o backend retornou token -> auto-login
      if (data && data.token) {
        saveSession(data.token, { userId: data.userId, nome: data.nome, email: data.email });
        navigate("/MenuPrincipal");
        return;
      }

      // se backend não enviar token (fluxo sem auto-login), informar o usuário
      alert("Registrado com sucesso. Faça login.");
      navigate("/");

    } catch (err: any) {
      // apiFetch já tenta extrair body.error e coloca em err.message
      console.error("Registro falhou:", err);
      const msg = err?.message || (err?.body && (err.body.error || JSON.stringify(err.body))) || "Erro ao registrar";
      setErrors({ email: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add("hide-layout");
    return () => {
      document.body.classList.remove("hide-layout");
      document.body.style.overflow = "auto";
    };
  }, []);

  const isValid = formData.name.trim().length >= 2 && emailRegex.test(formData.email) && formData.senha.trim().length >= 6;

  return (
    <main className="border border-gray-200 dark:border-gray-800 p-4 mt-30 sm:mt-30 lg:mt-40 rounded-lg shadow-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-fit mx-auto sm:w-full sm:max-w-md transition-colors duration-300">
      <div className="text-center flex flex-col justify-center items-center mt-3">
        <div className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-2xl w-12 h-12 border border-transparent rounded-xl flex items-center justify-center font-bold mb-5 transition-colors"><p>IN</p></div>
        <h1 className="text-2xl font-bold">IntelliNote</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Crie a sua Conta</p>

        <form onSubmit={handleSubmit} className="flex flex-col mt-5 w-full text-left">
          <div className="w-full flex flex-col">
            <p className="mb-2 font-medium">Nome</p>
            <input type="text" id="name" name="name" placeholder="Seu Nome" value={formData.name} onChange={handleChange}
              className="mb-4 p-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-white" required />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="w-full flex flex-col">
            <p className="mb-2 font-medium">Email</p>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com"
              className="mb-4 p-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-white" required />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="w-full flex flex-col">
            <p className="mb-2 font-medium">Senha</p>
            <div className="relative w-full mb-4">
              <input type={showPassword ? "text" : "password"} id="senha" name="senha" value={formData.senha} onChange={handleChange} placeholder="Senha"
                className="w-full p-2 pr-10 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-white" required />
              <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-gray-500 dark:text-gray-400">
                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </button>
            </div>
            {errors.senha && <p className="mt-1 text-sm text-red-500">{errors.senha}</p>}
          </div>

          <button type="submit" disabled={!isValid || loading} className={`p-2 rounded-md transition-all font-medium ${(!isValid || loading) ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600" : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 hover:scale-[0.98]"}`}>
            {loading ? (<div className="flex items-center gap-2"><LoadingCircle /> Registrando...</div>) : "Cadastrar"}
          </button>
        </form>

        <hr className="mt-4 border-gray-200 dark:border-gray-700 w-full" />
        <button className="mt-4 border border-gray-300 dark:border-gray-600 bg-white text-gray-900 dark:bg-gray-950 dark:text-white p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full flex items-center justify-center gap-3 cursor-pointer">
          <FaRegEnvelope /> Continuar com Google
        </button>
        <p className="text-sm text-gray-400 mt-2">Apenas uma opção visual - Em Desenvolvimento</p>

        <div className="mt-4">
          <p className="text-gray-600 dark:text-gray-400">Ja tem uma conta? <a href="/" className="text-gray-900 dark:text-white font-medium hover:underline">Entre</a></p>
        </div>
      </div>
    </main>
  );
};

export default RegistrarUser;
