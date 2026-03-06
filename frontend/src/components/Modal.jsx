export default function Modal({ isOpen, onConfirm, onCancel, title, message, confirmText = 'Confirmer', confirmColor = 'bg-[#7bdff2] text-[#1a1a2e]' }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            
            <div className="absolute inset-0 bg-[#1a1a2e] opacity-50" onClick={onCancel} />

            <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-gray-100 w-full max-w-sm mx-4">
                <h3 className="text-base font-bold text-[#1a1a2e] mb-2">{title}</h3>
                <p className="text-sm text-gray-500 mb-6">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onConfirm}
                        className={`flex-1 py-2.5 rounded-xl font-semibold text-sm ${confirmColor} hover:opacity-90 transition-all`}>
                        {confirmText}
                    </button>
                    <button onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    )
}