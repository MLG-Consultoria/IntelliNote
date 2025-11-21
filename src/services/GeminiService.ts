import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ""; 
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const GeminiService = {

  analyzeUpskilling: async (currentSkills: string): Promise<string> => {
    try {
      const prompt = `
        Aja como um mentor de carreira sênior em tecnologia.
        O usuário quer fazer UPSKILLING. Habilidades atuais: "${currentSkills}".
        
        (Crie um plano em Markdown retire qualquer * ou #) (Português Brasil):
        1. Análise breve.
        2. O que aprender a Curto Prazo.
        3. O que aprender a Médio Prazo.
        4. Ideia de projeto prático.
        Use emojis e tópicos.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
      
    } catch (error) {
      console.error("Erro Upskilling:", error);
      return "Erro ao gerar resposta. Verifique a chave de API.";
    }
  },

  analyzeReskilling: async (currentProfession: string, skills: string): Promise<string> => {
    try {
      const prompt = `
        Aja como especialista em transição de carreira tech.
        Profissão Atual: "${currentProfession}". Habilidades: "${skills}".
        
        (Gere uma resposta em Markdown retire qualquer * ou #) (Português Brasil):
        1. Soft skills aproveitáveis.
        2. 2-3 cargos tech recomendados.
        3. Roteiro de estudos inicial.
        Use emojis e seja acolhedor.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error("Erro Reskilling:", error);
      return "Erro ao gerar resposta. Verifique a chave de API.";
    }
  }
};