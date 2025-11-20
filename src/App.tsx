import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';


import Header from './Components/Header'
import MenuPrincipal from './Routes/Outros/MenuPrincipal';
import PagLogin from './Routes/Login/PagLogin';
import RegistrarUser from './Routes/Login/RegistrarUser';
import Integrantes from './Routes/Outros/Integrantes/Intergrantes';
import IntegrantesSolo from './Routes/Outros/Integrantes/IntegrantesSolo';
import SobreNos from './Routes/Outros/SobreNos';
import Faq from './Routes/Outros/Faq';
import Contato from './Routes/Outros/Contato';
import VerNota from './Routes/MainFunctions/VerNota';
import CriarNota from './Routes/MainFunctions/CriarNota';
import Calendario from './Routes/MainFunctions/Calendario';
import ReSkilling from './Routes/MainFunctions/ReSkilling';
import UpSkilling from './Routes/MainFunctions/UpSkilling';

import Footer from './Components/Footer'


function App() {
  return (
    <ThemeProvider>   
      <main className="flex flex-col min-h-screen transition-colors duration-300 bg-gray-100 dark:bg-linear-to-br from-gray-900 to-gray-950 text-gray-900 dark:text-gray-100">
        <Header />

        <div>
          <Routes>
            <Route path="/" element={<PagLogin />} />
            <Route path="/Registro" element={<RegistrarUser />} />
            <Route path="/MenuPrincipal" element={<MenuPrincipal />} />
            <Route path="/Integrantes" element={<Integrantes />} />
            <Route path="/Integrantes/:nome" element={<IntegrantesSolo />} />
            <Route path="/Faq" element={<Faq />} />
            <Route path="/SobreNos" element={<SobreNos />} />
            <Route path="/Contato" element={<Contato />} />
            <Route path="/VerNota" element={<VerNota />} />
            <Route path="/CriarNota" element={<CriarNota />} />
            <Route path="/Calendario" element={<Calendario />} />
            <Route path="/ReSkilling" element={<ReSkilling />} />
            <Route path="/UpSkilling" element={<UpSkilling />} />
          </Routes>
        </div>
        <Footer />
      </main>
    </ThemeProvider>
  )
}

export default App