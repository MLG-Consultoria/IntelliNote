import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import Header from './Components/Header';
import Footer from './Components/Footer';

import MenuPrincipal from './Routes/Outros/MenuPrincipal';
import PagLogin from './Routes/Login/PagLogin';
import RegistrarUser from './Routes/Login/RegistrarUser';
import Integrantes from './Routes/Outros/Integrantes/Integrantes';
import IntegrantesSolo from './Routes/Outros/Integrantes/IntegrantesSolo';
import SobreNos from './Routes/Outros/SobreNos';
import Faq from './Routes/Outros/Faq';
import Contato from './Routes/Outros/Contato';

// Funções Principais
import VerNota from './Routes/MainFunctions/VerNota';
import CriarNota from './Routes/MainFunctions/CriarNota';
import EditarNota from './Routes/MainFunctions/EditarNota'; // ADICIONADO: Arquivo novo
import Calendario from './Routes/MainFunctions/Calendario';
import ReSkilling from './Routes/MainFunctions/ReSkilling';
import UpSkilling from './Routes/MainFunctions/UpSkilling';
import Lixeira from './Routes/MainFunctions/Lixeira'; // ADICIONADO: Mantido do antigo

import ProtectedRoute from "./context/ProtectedRoute";
import { isLogged } from "./lib/storage";

function App() {
  const location = useLocation();
  const logged = isLogged();

  // Lógica visual: O Header/Footer aparecem se estiver logado OU se não estiver nas páginas de login/registro
  // Isso evita que o Header suma logo após o login antes de um refresh
  const isAuthPage = location.pathname === "/" || location.pathname === "/Registro";
  const showLayout = logged || !isAuthPage; 

  return (
    <ThemeProvider>
      <main className="flex flex-col min-h-screen transition-colors duration-300 bg-gray-100 dark:bg-linear-to-br from-gray-900 to-gray-950 text-gray-900 dark:text-gray-100">
        
        {/* Renderiza Header se não for página de login/registro */}
        {!isAuthPage && <Header />}

        <div className='flex-1'>
          <Routes>
            
            {/* Rotas Públicas */}
            <Route path="/" element={<PagLogin />} />
            <Route path="/Registro" element={<RegistrarUser />} />

            {/* Rotas Protegidas (Exigem Login) */}
            <Route path="/MenuPrincipal" element={
              <ProtectedRoute><MenuPrincipal /></ProtectedRoute>} />

            <Route path="/Integrantes" element={
              <ProtectedRoute><Integrantes /></ProtectedRoute>} />
            <Route path="/Integrantes/:nome" element={
              <ProtectedRoute><IntegrantesSolo /></ProtectedRoute>} />

            <Route path="/Faq" element={
              <ProtectedRoute><Faq /></ProtectedRoute>} />
            <Route path="/SobreNos" element={
              <ProtectedRoute><SobreNos /></ProtectedRoute>} />
            <Route path="/Contato" element={
              <ProtectedRoute><Contato /></ProtectedRoute>} />

            <Route path="/VerNota" element={
              <ProtectedRoute><VerNota /></ProtectedRoute>} />

            <Route path="/CriarNota" element={
              <ProtectedRoute><CriarNota /></ProtectedRoute>} />

            {/* ADICIONADO: Rota para Editar Nota */}
            <Route path="/editar/:id" element={
              <ProtectedRoute><EditarNota /></ProtectedRoute>} />

            <Route path="/Calendario" element={
              <ProtectedRoute><Calendario /></ProtectedRoute>} />
            
            <Route path="/ReSkilling" element={
              <ProtectedRoute><ReSkilling /></ProtectedRoute>} />
            
            <Route path="/UpSkilling" element={
              <ProtectedRoute><UpSkilling /></ProtectedRoute>} />

            {/* ADICIONADO: Rota da Lixeira (Local) */}
            <Route path="/Lixeira" element={
              <ProtectedRoute><Lixeira /></ProtectedRoute>} />

            {/* Redirecionamento padrão */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        
        {!isAuthPage && <Footer />}
      </main>
    </ThemeProvider>
  );
}

export default App;