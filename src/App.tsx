import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import DarkModeToggle from './Components/DarkModeToggle'
import Header from './Components/Header'
import MenuPrincipal from './Routes/MenuPrincipal';
import PagLogin from './Routes/PagLogin';
import Integrantes from './Routes/Intergrantes';
import SobreNos from './Routes/SobreNos';
import Faq from './Routes/Faq';
import VerNota from './Routes/VerNota';
import CriarNota from './Routes/CriarNota';

import Footer from './Components/Footer'


function App() {
  return (
    <>
      <main className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <DarkModeToggle /> 

        <div>
          <Routes>
            <Route path="/" element={<PagLogin />} />
            <Route path="/MenuPrincipal" element={<MenuPrincipal />} />
            <Route path="/Integrantes" element={<Integrantes />} />
              <Route path="/Faq" element={<Faq />} />
            <Route path="/SobreNos" element={<SobreNos />} />
            <Route path="/VerNota" element={<VerNota />} />
            <Route path="/CriarNota" element={<CriarNota />} />

          </Routes>
        </div>
        <Footer />
      </main>
    </>
  )
}

export default App
