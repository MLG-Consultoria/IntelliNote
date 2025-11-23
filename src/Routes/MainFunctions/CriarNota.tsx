// src/Routes/MainFunctions/CriarNota.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiSparkleBold } from "react-icons/pi";
import { RiSave3Line } from "react-icons/ri";
import { saveNote, addReminder } from "../../lib/storage";
import PopUpNote from "../../Components/PopUpNote";
import BotaoVoltar from "../../Components/BotaoVoltar";

const CriarNota = () => {
  const navigate = useNavigate();

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date().toISOString().split("T")[0]);
  const [showPopup, setShowPopup] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastCreatedNoteId, setLastCreatedNoteId] = useState<string | null>(null);

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (t !== "" && !tags.includes(t)) {
      setTags((s) => [...s, t]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (indexToRemove: number) => setTags(tags.filter((_, i) => i !== indexToRemove));

  const handleSave = async () => {
    if (!titulo || !conteudo) {
      alert("Escreva um título e conteúdo para a nota.");
      return;
    }

    setSaving(true);
    try {
      // saveNote é async -> await aqui
      const newNoteId = await saveNote({ title: titulo, content: conteudo, tags });
      if (addToCalendar) addReminder(titulo, conteudo, calendarDate, newNoteId);

      setLastCreatedNoteId(newNoteId);
      setTitulo("");
      setConteudo("");
      setTags([]);
      setAddToCalendar(false);
      setShowPopup(true);
    } catch (err: any) {
      console.error("Erro ao salvar nota:", err);
      alert("Erro ao salvar (verifique sua conexão ou autenticação).");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex flex-col w-full text-gray-900 dark:text-gray-100 p-4 sm:p-8 relative">
      {showPopup && (
        <PopUpNote
          message={addToCalendar ? "Nota salva e adicionada ao calendário!" : "Sua nota foi salva com sucesso."}
          onClose={() => {
            setShowPopup(false);
            setLastCreatedNoteId(null);
          }}
          date={addToCalendar ? calendarDate : undefined}
          onEdit={lastCreatedNoteId ? () => navigate(`/editar/${encodeURIComponent(lastCreatedNoteId)}`) : undefined}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-2" />
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 items-end sm:items-center">
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800/50 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAddToCalendar((v) => !v)}>
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${addToCalendar ? "bg-blue-600 border-blue-600" : "border-gray-400"}`}>{addToCalendar && <span className="text-white text-xs">✓</span>}</div>
              <span className="text-sm font-medium select-none">Add ao Calendário</span>
            </div>
            {addToCalendar && <input type="date" value={calendarDate} onChange={(e) => setCalendarDate(e.target.value)} className="bg-white dark:neutral-300 border border-gray-300 dark:border-gray-600 text-xs rounded px-2 py-1 text-gray-900 dark:text-black focus:outline-none" />}
          </div>

          <button className="flex-1 sm:flex-none justify-center items-center font-medium gap-2 border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden text-gray-700 dark:text-gray-300">
            <PiSparkleBold size={16} /> Melhorar Com IA
          </button>

          <button onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none justify-center bg-white text-black font-medium flex items-center gap-2 rounded-md px-4 py-2 text-sm hover:bg-gray-200 transition-colors shadow-sm disabled:opacity-60">
            <RiSave3Line size={16} /> {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="titulo" className="font-semibold text-sm">Título da Nota</label>
          <input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Digite o título da sua nota..." className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-gray-500 transition-colors placeholder-gray-500" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="tags" className="font-semibold text-sm">Tags</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input id="tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Adicionar tag..." className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-gray-500 transition-colors placeholder-gray-500" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())} />
            </div>
            <button onClick={handleAddTag} className="bg-black dark:bg-white text-neutral-100 dark:text-black font-medium px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">Adicionar</button>
          </div>

          {tags.length > 0 && <div className="flex flex-wrap gap-2 mt-2">{tags.map((tag, idx) => <span key={idx} className="bg-gray-800 text-xs px-2 py-1 rounded-md flex items-center gap-1 text-gray-300 border border-gray-700">{tag}<button onClick={() => handleRemoveTag(idx)} className="hover:text-red-500 ml-1">×</button></span>)}</div>}
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <label htmlFor="conteudo" className="font-semibold text-sm">Conteúdo</label>
          <textarea id="conteudo" value={conteudo} onChange={(e) => setConteudo(e.target.value)} placeholder="Escreva o conteúdo da sua nota aqui..." className="w-full h-[400px] bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-sm focus:outline-none focus:border-gray-500 transition-colors placeholder-gray-500 resize-none font-mono" />
        </div>

        <BotaoVoltar variant="button" label="Voltar para a página anterior" />
      </div>
    </main>
  );
};

export default CriarNota;
