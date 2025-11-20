interface ExcludeNoteConfirmProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const ExcludeNoteConfirm = ({ onConfirm, onCancel }: ExcludeNoteConfirmProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            {/* Card do Modal */}
            <div className="bg-white dark:bg-[#0B1121] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                
                <div className="flex flex-col gap-2 mb-6">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Confirmar exclusão
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita.
                    </p>
                </div>

                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                    >
                        Excluir
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ExcludeNoteConfirm;