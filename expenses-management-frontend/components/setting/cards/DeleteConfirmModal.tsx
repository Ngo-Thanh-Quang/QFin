type DeleteConfirmModalProps = {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
};

export function DeleteConfirmModal({
    open,
    onCancel,
    onConfirm,
    isDeleting,
}: DeleteConfirmModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onCancel}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in overflow-hidden">
                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 text-center">Xác nhận xóa thẻ</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Bạn có chắc muốn xóa thẻ này? Hành động này không thể hoàn tác.
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-70"
                        >
                            {isDeleting ? "Đang xóa..." : "Xóa"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
