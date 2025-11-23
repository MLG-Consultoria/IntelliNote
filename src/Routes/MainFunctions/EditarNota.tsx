// src/Routes/MainFunctions/EditarNota.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RiSave3Line } from "react-icons/ri";
import PopUpNote from "../../Components/PopUpNote";
import BotaoVoltar from "../../Components/BotaoVoltar";
// Imports da lógica NOVA
import { updateNote as storageUpdateNote, getUserNotes } from "../../lib/storage";
import { fetchNoteByIdApi } from "../../lib/backend";

type NoteShape = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt?: string;
};

// Auxiliares de data
const toISODateInput = (value?: string): string => {
  if (!value) return new Date().toISOString().split("T")[0];
  const d = new Date(value);
  if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  const parts = value.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (parts) return `${parts[3]}-${parts[2]}-${parts[1]}`;
  return new Date().toISOString().split("T")[0];
};

const EditarNota: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [note, setNote] = useState<NoteShape | null>(null);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [dateInput, setDateInput] = useState<string>(new Date().toISOString().split("T")[0]);
  
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  // Lógica de carregar nota (Idêntica ao NOVO)
  useEffect(() => {
    if (!id) { setLoading(false); return; }
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const raw = await fetchNoteByIdApi(id);
        if (!mounted) return;
        if (raw) {
          const mapped: NoteShape = {
            id: String(raw.id ?? raw.idNote),
            title: raw.title ?? "",
            content: raw.content ?? "",
            tags: Array.isArray(raw.tags) ? raw.tags.map((t: any) => (typeof t === "string" ? t : t.nome ?? String(t))) : [],
            createdAt: raw.createdAt
          };
          setNote(mapped);
          setTitulo(mapped.title);
          setConteudo(mapped.content);
          setTags(mapped.tags);
          setDateInput(toISODateInput(mapped.createdAt));
          setLoading(false);
          return;
        }
      } catch (err: any) {
        if (err?.status === 401) { navigate("/"); return; }
        console.error(err);
      }
      // Fallback local
      const local = getUserNotes().find(n => n.id === id);
      if (local && mounted) {
        setNote(local);
        setTitulo(local.title);
        setConteudo(local.content);
        setTags(local.tags || []);
        setDateInput(toISODateInput(local.createdAt));
      } else if (mounted) {
        alert("Nota não encontrada.");
        navigate("/VerNota");
      }
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, [id, navigate]);

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags(prev => [...prev, t]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (idx: number) => {
    setTags(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!note || !titulo.trim() || !conteudo.trim()) {
      alert("Título e conteúdo são obrigatórios.");
      return;
    }
    setSaving(true);
    try {
      const payload = { title: titulo, content: conteudo, tags, createdAt: dateInput } as any;
      await storageUpdateNote(note.id, payload);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/VerNota");
      }, 1200);
    } catch (err) {
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 dark:text-white">Carregando...</div>;

  // VISUAL: Aqui usei exatamente a estrutura HTML/CSS do CriarNota ANTIGO
  return (
    <main className="flex flex-col w-full text-gray-900 dark:text-gray-100 p-4 sm:p-8 relative">
      {showPopup && <PopUpNote message="Nota atualizada com sucesso!" onClose={() => setShowPopup(false)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-2">
           <h1 className="font-bold text-2xl">Editar Nota</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 items-end sm:items-center">
             {/* Campo de data estilo "Add Calendar" mas estático para edição */}
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800/50 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700">
                 <span className="text-sm font-medium select-none text-gray-500">Data de Criação:</span>
                 <input 
                    type="date" 
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="bg-white dark:neutral-300 border border-gray-300 dark:border-gray-600 text-xs rounded px-2 py-1 text-gray-900 dark:text-black focus:outline-none"
                />
            </div>

            <button 
                onClick={handleSave}
                disabled={saving}
                className="flex-1 sm:flex-none justify-center bg-white text-black font-medium flex items-center gap-2 rounded-md px-4 py-2 text-sm hover:bg-gray-200 transition-colors shadow-sm disabled:opacity-60"
            >
                <RiSave3Line size={16} />
                {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm">Título da Nota</label>
            <input 
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título"
                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-gray-500 transition-colors placeholder-gray-500"
            />
        </div>

        <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm">Tags</label>
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <input 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                        placeholder="Adicionar tag..." 
                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-gray-500 transition-colors placeholder-gray-500"
                    />
                </div>
                <button onClick={handleAddTag} className="bg-black dark:bg-white text-neutral-100 dark:text-black font-medium px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                    Adicionar
                </button>
            </div>
            
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                        <span key={index} className="bg-gray-800 text-xs px-2 py-1 rounded-md flex items-center gap-1 text-gray-300 border border-gray-700">
                            {tag}
                            <button onClick={() => handleRemoveTag(index)} className="hover:text-red-500 ml-1">×</button>
                        </span>
                    ))}
                </div>
            )}
        </div>

        <div className="flex flex-col gap-2 flex-1">
            <label className="font-semibold text-sm">Conteúdo</label>
            <textarea 
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                placeholder="Conteúdo..."
                className="w-full h-[400px] bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-sm focus:outline-none focus:border-gray-500 transition-colors placeholder-gray-500 resize-none font-mono"
            />
        </div>
        <BotaoVoltar variant="button" label="Cancelar e Voltar" />
      </div>
    </main>
  );
};

export default EditarNota;