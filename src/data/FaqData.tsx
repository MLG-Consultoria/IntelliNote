export const ConjuntoPerguntas = [
    {
      pergunta: "Como funciona a integração com IA?",
      resposta: "Nossa IA analisa o conteúdo das suas notas e oferece sugestões de melhoria, formatação e organização automática.",
    },
    {
      pergunta: "Meus dados estão seguros?",
      resposta: "Sim! Utilizamos criptografia de ponta a ponta e armazenamento local seguro para proteger suas informações.",
    },
    {
      pergunta: "Posso acessar minhas notas offline?",
      resposta: "Sim. Como suas notas são armazenadas localmente, você pode ler e editar seu conteúdo offline. Apenas as funcionalidades de IA (como sugestões) precisarão de conexão no momento.",
    },
    {
      pergunta: "Como funciona o sistema de tags?",
      resposta: "Você pode adicionar tags personalizadas às suas notas para organizá-las e encontrá-las mais facilmente.",
    },
    {
      pergunta: "O que é Reskilling e Upskilling?",
      resposta: "Reskilling ajuda em transições de carreira, enquanto Upskilling sugere próximos passos para evoluir suas habilidades atuais.",
    },
    {
      pergunta: "O NotesAI é gratuito?",
      resposta: "Sim, o NotesAI é totalmente gratuito.",
    },
    {
      pergunta: "Minhas notas são usadas para treinar a IA?",
      resposta: "Não, suas notas são privadas e não são usadas para treinar a IA.",
    },
    {
      pergunta: "Em quais dispositivos posso usar o NotesAI?",
      resposta: "Por enquanto, o NotesAI está disponível apenas para web, mas com planos para expandir para outras plataformas em breve.",
    },
    {
      pergunta: "Qual o objetivo do NotesAI?",
      resposta: "O objetivo do NotesAI é ajudar você a organizar suas notas de forma inteligente, usando IA para melhorar sua produtividade e aprendizado. Além disso, o app foca em Reskilling e Upskilling, te apoiando na evolução da sua carreira.",
    }
];

export interface FaqItemProps {
  pergunta: string;
  resposta: string;
  isOpen: boolean;
  onClick: () => void;
}