import React, { useState } from 'react';
import {ConjuntoPerguntas} from '../../data/FaqData';

interface FaqItemProps {
  pergunta: string;
  resposta: string;
  isOpen: boolean;
  onClick: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ pergunta, resposta, isOpen, onClick }) => {
  return (
    <div className="border-b border-neutral-700 w-full">
      <button
        className="flex justify-between items-center w-full text-left py-5 font-semibold text-gray-900 dark:text-gray-100 hover:text-neutral-700 dark:hover:text-neutral-300 focus:outline-none cursor-pointer"
        onClick={onClick}
      >
        <span className="text-lg hover:underline">{pergunta}</span>
        
        <span className={`transform transition-transform duration-300 hover:unde text-neutral-400 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      </button>

      <div
        className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isOpen ? 'max-h-screen pb-5' : 'max-h-0'}`}
      >
        <p className="text-neutral-400 leading-relaxed">{resposta}</p>
      </div>
    </div>
  );
};

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleItemClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="container py-8 text-gray-900 dark:text-gray-100 flex flex-col justify-center items-center min-w-screen w-full px-4">
      <div className="mx-auto max-w-3xl">
        
        <h1 className="mb-2 text-3xl font-bold">Perguntas Frequentes</h1>
        <p className="mb-8 text-neutral-400"> 
          Encontre respostas para as dúvidas mais comuns
        </p>

        <div className="animate-fade-in-slide-down w-full">
        {ConjuntoPerguntas.map((item, index) => {
          const delayClass = `delay-${(index + 1) * 100}`;
          return (
            <div key={index} className={`animate-fade-in-slide-down ${delayClass} w-full`}>
              <FaqItem
                pergunta={item.pergunta}
                resposta={item.resposta}
                isOpen={openIndex === index}
                onClick={() => handleItemClick(index)}
              />
            </div>
          );
        })}
        </div>
      </div>
    </main>
  );
};

export default Faq;