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
import EditarNota from './Routes/MainFunctions/EditarNota'; 
import Calendario from './Routes/MainFunctions/Calendario';
import ReSkilling from './Routes/MainFunctions/ReSkilling';
import UpSkilling from './Routes/MainFunctions/UpSkilling';
import Lixeira from './Routes/MainFunctions/Lixeira'; 

import ProtectedRoute from "./context/ProtectedRoute";

function App() {
  const location = useLocation();

  // Correção: Removi a variável showLayout que estava causando o erro.
  // Usamos direto a verificação abaixo para saber se é pagina de login/registro
  const isAuthPage = location.pathname === "/" || location.pathname === "/Registro";

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

            <Route path="/editar/:id" element={
              <ProtectedRoute><EditarNota /></ProtectedRoute>} />

            <Route path="/Calendario" element={
              <ProtectedRoute><Calendario /></ProtectedRoute>} />
            
            <Route path="/ReSkilling" element={
              <ProtectedRoute><ReSkilling /></ProtectedRoute>} />
            
            <Route path="/UpSkilling" element={
              <ProtectedRoute><UpSkilling /></ProtectedRoute>} />

            <Route path="/Lixeira" element={
              <ProtectedRoute><Lixeira /></ProtectedRoute>} />

            {/* Redirecionamento padrão */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        
        {/* Renderiza Footer se não for página de login/registro */}
        {!isAuthPage && <Footer />}
      </main>
    </ThemeProvider>
  );
}

export default App;