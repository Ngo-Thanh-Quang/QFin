import { Settings } from "lucide-react";

type SettingsToggleButtonProps = {
  isTextSettingsOpen: boolean
  onToggleText: () => void
  onToggleSidebar: () => void
}

export function SettingsToggleButton({ isTextSettingsOpen, onToggleText, onToggleSidebar }: SettingsToggleButtonProps) {
    return (
        <button
                onClick={onToggleText}
                className="bg-white fixed top-1/6 right-0 z-20 rounded-l-full shadow-lg hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center gap-2 px-4 py-3">
                    <span
                        onClick={onToggleSidebar}
                        className={`
                            text-sm lg:text-base font-semibold text-blue-600
                            whitespace-nowrap overflow-hidden
                            transition-all duration-300 hover:text-blue-400
                            ${isTextSettingsOpen ? "max-w-[80px] opacity-100 mr-1" : "max-w-0 opacity-0 mr-0"}
                        `}
                    >
                        Thiết lập
                    </span>

                    <Settings
                        className={`
                            w-6 h-6 text-blue-500
                            transform transition-transform duration-500
                            ${isTextSettingsOpen ? "rotate-180" : "rotate-0"}
                        `}
                    />
                </div>
            </button>
    );
}