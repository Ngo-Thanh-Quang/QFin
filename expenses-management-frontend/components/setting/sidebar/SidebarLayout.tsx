import { Settings, X } from "lucide-react";

type SidebarLayoutProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export function SidebarLayout({ open, onClose, children }: SidebarLayoutProps) {
    return (
        <aside
            className={`
                fixed right-0 top-0 h-full rounded-l-2xl w-80 overflow-y-auto bg-white shadow-xl border-r border-gray-200
                z-40 transform transition-transform duration-300
                ${open ? "translate-x-0" : "translate-x-full"}
                `}
        >
            <div className="h-full flex flex-col">
                <div className="p-6 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-indigo-600 to-cyan-600 p-2 rounded-lg">
                            <Settings className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-blue-950">Thiết lập</h2>
                            <p className="text-xs text-gray-500">Tùy chỉnh QFin</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-blue-950" />
                    </button>
                </div>

                <div className="flex-1">{children}</div>

                <div className="mt-auto px-4 py-3 border-t border-gray-200 text-xs text-gray-400">
                    QFin · Thiết lập nhanh
                </div>
            </div>
        </aside>
    );
}
