// src/Routes/MainFunctions/EditarNota.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PopUpNote from "../../Components/PopUpNote";
import BotaoVoltar from "../../Components/BotaoVoltar";
import { updateNote as storageUpdateNote, getUserNotes } from "../../lib/storage";
import { fetchNoteByIdApi } from "../../lib/backend";

type NoteShape = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt?: string; // human readable or ISO
};

const toISODateInput = (value?: string): string => {
  if (!value) return new Date().toISOString().split("T")[0];
  // tenta reconhecer formatos comuns; se falhar, retorna hoje
  const d = new Date(value);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }
  // tentar parse pt-BR "dd/mm/yyyy hh:mm" (heurística)
  const parts = value.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (parts) {
    return `${parts[3]}-${parts[2]}-${parts[1]}`;
  }
  return new Date().toISOString().split("T")[0];
};

const fromDateInputToDisplay = (isoDate: string) => {
  try {
    const d = new Date(isoDate + "T00:00:00");
    return d.toLocaleString("pt-BR");
  } catch {
    return isoDate;
  }
};

const EditarNota: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [note, setNote] = useState<NoteShape | null>(null);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [dateInput, setDateInput] = useState<string>(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      setLoading(true);
      // tenta buscar do backend
      try {
        const raw = await fetchNoteByIdApi(id);
        if (!mounted) return;
        if (raw) {
          const mapped: NoteShape = {
            id: String(raw.id ?? raw.id_note ?? raw.idNote),
            title: raw.title ?? raw.TITLE ?? "",
            content: raw.content ?? raw.CONTENT ?? "",
            tags: Array.isArray(raw.tags) ? raw.tags.map((t: any) => (typeof t === "string" ? t : t.nome ?? t.name ?? String(t))) : [],
            createdAt: raw.createdAt ?? raw.created_at ?? raw.createdAtString ?? undefined
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
        console.error("Falha ao buscar/atualizar:", err);
        if (err?.status === 401) {
          // aviso claro para o usuário e redireciona; limpeza da sessão é opcional e deliberada.
          alert("Sua sessão expirou. Faça login novamente.");
          // opcionalmente: clearSession() aqui ao invés de dentro do apiFetch
          // clearSession();
          navigate("/");
          return;
        }
        alert("Erro ao carregar a nota. Verifique sua conexão.");
      }
      // fallback: localStorage
      try {
        const local = getUserNotes().find(n => n.id === id);
        if (local && mounted) {
          setNote(local);
          setTitulo(local.title);
          setConteudo(local.content);
          setTags(local.tags || []);
          setDateInput(toISODateInput(local.createdAt));
        } else {
          if (mounted) {
            // nota não encontrada
            alert("Nota não encontrada.");
            navigate("/VerNota");
          }
        }
      } catch (err) {
        console.error("Erro no fallback local:", err);
        if (mounted) {
          alert("Erro ao carregar a nota.");
          navigate("/VerNota");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [id, navigate]);

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput("");
  };

  const handleRemoveTag = (idx: number) => {
    setTags(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!note) return;
    if (!titulo.trim() || !conteudo.trim()) {
      alert("Título e conteúdo são obrigatórios.");
      return;
    }

    setSaving(true);
    try {
      // update via storage (pode usar backend via storageUpdateNote internamente)
      // enviamos createdAt como ISO para o backend se ele suportar, senão o storage pode adequar
      const payload = {
        title: titulo,
        content: conteudo,
        tags,
        createdAt: dateInput // backend/repository pode interpretar; se não, será ignorado
      } as any;

      // assumindo que storageUpdateNote aceita (id, payload) e retorna algo awaitable
      await storageUpdateNote(note.id, payload);

      // mostrar popup com a data selecionada
      const displayDate = fromDateInputToDisplay(dateInput);
      setPopupMessage(`Nota salva para ${displayDate}`);
      setShowPopup(true);

      // atualizar local state e cache
      const updatedNote: NoteShape = { ...note, title: titulo, content: conteudo, tags, createdAt: displayDate };
      setNote(updatedNote);

      // volta para lista depois de curto delay
      setTimeout(() => {
        setShowPopup(false);
        navigate("/VerNota");
      }, 1200);
    } catch (err: any) {
      console.error("Erro ao atualizar nota:", err);
      if (err?.status === 401) {
        alert("Sessão inválida. Faça login novamente.");
        navigate("/");
        return;
      }
      alert("Erro ao salvar a nota. Verifique a conexão.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Carregando...</div>;
  if (!note) return <div className="p-8 text-gray-500">Nota não encontrada.</div>;

  return (
    <main className="flex flex-col w-full text-gray-900 dark:text-gray-100 p-4 sm:p-8 relative">
      {showPopup && <PopUpNote message={popupMessage || "Nota atualizada com sucesso."} onClose={() => setShowPopup(false)} />}

      <BotaoVoltar variant="button" label="Voltar" />
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 mt-6">
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Título da Nota</label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-3 border rounded bg-transparent"
            placeholder="Título"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Tags</label>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              className="flex-1 p-2 border rounded bg-transparent"
              placeholder="Adicionar tag..."
            />
            <button onClick={handleAddTag} className="px-4 py-2 bg-gray-900 text-white rounded">Adicionar</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((t, i) => (
              <span key={i} className="bg-gray-800 text-xs px-2 py-1 rounded-md text-gray-300 border border-gray-700 flex items-center gap-2">
                <span className="truncate max-w-[8rem]">{t}</span>
                <button onClick={() => handleRemoveTag(i)} className="ml-2 text-sm text-red-400">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Data (para calendário)</label>
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="p-2 border rounded bg-transparent w-56"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Conteúdo</label>
          <textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            className="w-full h-80 p-4 border rounded bg-transparent"
            placeholder="Escreva o conteúdo da nota..."
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
          <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancelar</button>
        </div>
      </div>
    </main>
  );
};

export default EditarNota;
