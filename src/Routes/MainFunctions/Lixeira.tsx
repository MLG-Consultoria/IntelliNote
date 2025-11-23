import { useEffect, useState } from "react";
// Importando funções individuais do novo storage.ts
import { getTrashNotes, restoreFromTrash, deletePermanently, type Note } from "../../lib/storage"; 
import { FaTrashRestore, FaTrashAlt } from "react-icons/fa";
import ExcludeNoteConfirm from "../../Components/ExcludeNoteConfirmProps"
import BotaoVoltar from "../../Components/BotaoVoltar";

const Lixeira = () => {
    const [trashNotes, setTrashNotes] = useState<Note[]>([]);
    const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

    useEffect(() => {
        // Carrega notas da lixeira usando a nova função exportada
        setTrashNotes(getTrashNotes());
    }, []);

    // Ação: Restaurar
    const handleRestore = async (id: string) => {
        await restoreFromTrash(id);
        setTrashNotes(getTrashNotes()); // Atualiza lista
    };

    // Ação: Excluir de vez (Abre modal)
    const requestDeleteForever = (id: string) => {
        setNoteToDelete(id);
    };

    // Confirmação Exclusão Permanente
    const confirmDeleteForever = () => {
        if (noteToDelete) {
            deletePermanently(noteToDelete);
            setTrashNotes(getTrashNotes());
            setNoteToDelete(null);
        }
    };

    return (
        <div className="flex flex-col">
            
            <main className="flex-1 flex flex-col pt-10 px-6 sm:px-10 pb-10 text-gray-900 dark:text-gray-100 relative container mx-auto max-w-7xl">
                <BotaoVoltar variant="arrow" className="static md:static md:-left-12 md:top-10 w-20" />
                
                {noteToDelete && (
                    <ExcludeNoteConfirm 
                        variant="permanent"
                        onConfirm={confirmDeleteForever} 
                        onCancel={() => setNoteToDelete(null)} 
                    />
                )}

                <div className="flex flex-col mb-8 mt-4">
                    <h1 className="font-bold text-3xl text-red-600 dark:text-red-500 flex items-center gap-2">
                        <FaTrashAlt /> Lixeira
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Notas aqui serão excluídas permanentemente se você deletar novamente.
                    </p>
                </div>

                {trashNotes.length === 0 ? (
                    <article className="border border-gray-200 dark:border-gray-800 rounded-lg mt-10 w-full p-10 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-[#09090B]">
                        <FaTrashAlt className="text-4xl text-gray-300 mb-4" />
                        <h2 className="font-bold text-xl text-gray-400">A lixeira está vazia</h2>
                        <p className="text-gray-500 mt-2">As notas que você excluir aparecerão aqui.</p>
                    </article>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {trashNotes.map((note) => (
                            <article key={note.id} className="relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col justify-between h-[250px] opacity-80 hover:opacity-100 transition-opacity">
                                
                                <div className="absolute top-4 right-4 flex gap-2 z-10">
                                    <button 
                                        onClick={() => handleRestore(note.id)}
                                        className="text-gray-400 hover:text-green-500 transition-colors p-1 bg-gray-100 dark:bg-gray-800 rounded-md"
                                        title="Restaurar nota"
                                    >
                                        <FaTrashRestore size={16} />
                                    </button>
                                    <button 
                                        onClick={() => requestDeleteForever(note.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors p-1 bg-gray-100 dark:bg-gray-800 rounded-md"
                                        title="Excluir permanentemente"
                                    >
                                        <FaTrashAlt size={16} />
                                    </button>
                                </div>

                                <div>
                                    <h2 className="font-bold text-xl dark:text-white text-neutral-900 pr-16 mb-1 truncate decoration-wavy decoration-red-500/30">
                                        {note.title}
                                    </h2>
                                    <span className="text-xs text-red-400 block mb-4">Deletada</span>
                                    
                                    <p className="text-gray-500 text-sm line-clamp-3 italic">
                                        {note.content}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-4 opacity-60">
                                    {note.tags.slice(0, 3).map((tag, i) => (
                                        <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Lixeira;