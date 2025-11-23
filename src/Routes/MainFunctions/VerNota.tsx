// src/Routes/MainFunctions/VerNota.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getUserNotes, deleteNote, type Note } from "../../lib/storage";
import { RiDeleteBinLine } from "react-icons/ri";
import ExcludeNoteConfirm from "../../Components/ExcludeNoteConfirmProps";
import BotaoVoltar from "../../Components/BotaoVoltar";

const VerNota = () => {
  const navigate = useNavigate();

  const [notes, setNotes] = useState<Note[]>([]);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") || "";

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const fetched = await getUserNotes();
        setNotes(fetched);
      } catch (err) {
        console.error("Erro ao carregar notas:", err);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const requestDelete = (id: string) => setNoteToDelete(id);

  const confirmDelete = async () => {
    if (noteToDelete) {
      try {
        await deleteNote(noteToDelete);
        const updated = await getUserNotes();
        setNotes(updated);
      } catch (err) {
        console.error("Erro ao deletar nota:", err);
        // opcional: mostrar toast/alert
      } finally {
        setNoteToDelete(null);
      }
    }
  };

  const cancelDelete = () => setNoteToDelete(null);

  const displayedNotes = notes.filter(note => {
    const matchesSearch = searchTerm === "" ||
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = filterTag === null || note.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  if (loading) return <div className="p-10 text-white">Carregando...</div>;

  return (
    <main className="flex-1 flex flex-col pt-10 px-6 sm:px-10 pb-10 text-gray-900 dark:text-gray-100 relative">
      <BotaoVoltar variant="arrow" className="static -mt-4 -mb-3 w-23" />

      {noteToDelete && <ExcludeNoteConfirm onConfirm={confirmDelete} onCancel={cancelDelete} />}

      <div className="flex justify-between items-center mb-6 mt-4 sm:mt-10">
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl text-neutral-900 dark:text-white">Minhas Notas</h1>
          {searchTerm && <p className="text-sm text-gray-500 mt-1">Exibindo resultados para: <span className="font-bold text-primary">{searchTerm}</span></p>}
        </div>
        <span className="text-sm text-gray-500">{displayedNotes.length} notas</span>
      </div>

      {allTags.length > 0 && (
        <div className="mb-8">
          <p className="text-gray-400 text-sm mb-2">Filtrar por tags:</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilterTag(null)} className={`px-3 py-1 border rounded-full text-sm transition-colors ${!filterTag ? 'bg-neutral-900 dark:bg-white text-neutral-100 dark:text-black' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>Todas</button>
            {allTags.map(tag => (
              <button key={tag} onClick={() => setFilterTag(tag === filterTag ? null : tag)} className={`px-3 py-1 border rounded-full text-sm transition-colors ${filterTag === tag ? 'bg-neutral-900 dark:bg-white text-neutral-100 dark:text-black border-white' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>{tag}</button>
            ))}
          </div>
        </div>
      )}

      {notes.length === 0 ? (
        <article className="border border-gray-800 rounded-lg mt-10 w-full p-10 flex flex-col items-center justify-center text-center">
          <h2 className="font-bold text-xl text-gray-300">Nenhuma nota encontrada</h2>
          <p className="text-gray-500 mt-2">Comece criando sua primeira nota no menu "Criar Nota"!</p>
        </article>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedNotes.map(note => (
            <article key={note.id} className="group relative bg-neutral-100 dark:bg-neutral-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-all hover:shadow-lg flex flex-col justify-between h-[250px]">
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button onClick={() => navigate(`/editar/${encodeURIComponent(note.id)}`)} title="Editar nota" className="text-gray-400 hover:text-white p-1">
                  {/* simples ícone de lápis inline para não depender de outro import */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>

                <button onClick={() => requestDelete(note.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Deletar nota">
                  <RiDeleteBinLine size={18} />
                </button>
              </div>

              <div>
                <h2 className="font-bold text-xl dark:text-white text-neutral-900 pr-8 mb-1 truncate">{note.title}</h2>
                <span className="text-xs text-gray-500 block mb-4">{note.createdAt}</span>
                <p className="text-gray-500 text-sm line-clamp-3">{note.content}</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {note.tags.slice(0, 3).map((tag, i) => <span key={i} className="text-xs bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700">{tag}</span>)}
                {note.tags.length > 3 && <span className="text-xs text-gray-500 py-1">+{note.tags.length - 3}</span>}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default VerNota;
