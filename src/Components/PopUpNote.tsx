// src/Components/PopUpNote.tsx
import { useEffect } from "react";
import { RiCheckboxCircleLine } from "react-icons/ri";

interface PopUpNoteProps {
  message: string;
  onClose: () => void;
  date?: string; // formato YYYY-MM-DD (opcional)
  onEdit?: () => void; // callback opcional para "Editar"
}

function formatDateISOToBR(d?: string) {
  if (!d) return null;
  try {
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("pt-BR");
  } catch {
    return d;
  }
}

const PopUpNote = ({ message, onClose, date, onEdit }: PopUpNoteProps) => {
  // Auto-fechar depois de 3s
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const formatted = formatDateISOToBR(date);

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-in">
      <div className="bg-slate-900 border border-slate-700 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
        <RiCheckboxCircleLine className="text-green-500" size={24} />
        <div className="min-w-0">
          <h4 className="font-bold text-sm">Sucesso!</h4>
          <p className="text-xs text-gray-200">{message}</p>
          {formatted && <p className="text-[11px] text-gray-300 mt-1">Lembrete em: <span className="font-medium">{formatted}</span></p>}
        </div>

        <div className="ml-4 flex items-center gap-2">
          {onEdit && (
            <button onClick={onEdit} className="text-sm px-3 py-1 bg-white text-black rounded-md hover:opacity-90">
              Editar
            </button>
          )}
          <button onClick={onClose} className="text-xs px-2 py-1 border rounded-md bg-transparent hover:bg-white/10">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpNote;
