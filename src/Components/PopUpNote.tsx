import { useEffect } from "react";
import { RiCheckboxCircleLine } from "react-icons/ri";

interface PopUpNoteProps {
    message: string;
    onClose: () => void;
}

const PopUpNote = ({ message, onClose }: PopUpNoteProps) => {
    // Auto-fechar depois de 3 segundos
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce-in">
            <div className="bg-slate-900 border border-slate-700 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
                <RiCheckboxCircleLine className="text-green-500" size={24} />
                <div>
                    <h4 className="font-bold text-sm">Sucesso!</h4>
                    <p className="text-xs text-gray-400">{message}</p>
                </div>
            </div>
        </div>
    );
}

export default PopUpNote;