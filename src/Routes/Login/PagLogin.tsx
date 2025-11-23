// src/Routes/Login/PagLogin.tsx
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingCircle from "../../Components/LoadingCircle";
import { apiFetch } from "../../lib/api";
import { saveSession } from "../../lib/storage";

interface FormData {
  email: string;
  senha: string;
}

const PagLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({ email: "", senha: "" });
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setAuthError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailRegex.test(formData.email) || formData.senha.length < 6) {
      setAuthError("Email ou senha inválidos.");
      return;
    }

    setLoading(true);
    setAuthError("");

    try {
      // IMPORTANT: usamos noAuth para não enviar header Authorization com token antigo
      // @ts-ignore (apiFetch aceita flag noAuth conforme instruções anteriores)
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          senha: formData.senha,
        }),
        // @ts-ignore
        noAuth: true,
      } as any);

      // apiFetch retorna JSON já parseado (ou lança)
      if (data && data.token) {
        // salva token + user no localStorage (saveSession leva token + user object)
        saveSession(data.token, { userId: data.userId, nome: data.nome, email: data.email });
        navigate("/MenuPrincipal");
        return;
      }

      // caso o backend responda sem token
      setAuthError("Resposta inesperada do servidor.");
    } catch (err: any) {
      console.error("Login error:", err);
      // apiFetch lança Error com message já contendo body.error quando disponível
      const msg = err?.message || "Erro ao conectar ao servidor.";
      // mensagens comuns: "Email ou senha inválidos" (backend), "Token inválido", etc.
      setAuthError(msg);
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

  const isValid =
    emailRegex.test(formData.email) && formData.senha.trim().length >= 6;

  return (
    <main className="border border-gray-200 dark:border-gray-800 p-4 mt-30 sm:mt-30 lg:mt-40 rounded-lg shadow-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-fit mx-auto sm:w-full sm:max-w-md transition-colors duration-300">
      <div className="text-center flex flex-col justify-center items-center mt-3">
        <div className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-2xl w-12 h-12 border border-transparent rounded-xl flex items-center justify-center font-bold mb-5 transition-colors">
          <p>IN</p>
        </div>

        <h1 className="text-2xl font-bold">IntelliNote</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Entre na sua Conta
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col mt-5 w-full text-left">
          <div className="w-full flex flex-col">
            <p className="mb-2 font-medium">Email</p>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className="mb-4 p-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-white"
              required
            />
          </div>

          <div className="w-full flex flex-col">
            <p className="mb-2 font-medium">Senha</p>

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Senha"
                className="w-full p-2 pr-10 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-white"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-gray-500 dark:text-gray-400"
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {authError && (
            <div className="mb-4 p-3 text-red-800 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || loading}
            className={`p-2 rounded-md transition-all font-medium
              ${
                !isValid || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                  : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 hover:scale-[0.98]"
              }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingCircle /> Entrando...
              </div>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        {/* Link claro para registro */}
        <div className="mt-4 w-full text-center">
          <p className="text-sm text-gray-400">
            Não possui uma conta?{" "}
            <Link to="/Registro" className="text-gray-900 dark:text-white font-medium hover:underline">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default PagLogin;
