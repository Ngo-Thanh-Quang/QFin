import type { ComponentType } from "react";
import { ChevronRight } from "lucide-react";

type MenuItem = {
    id: string;
    name: string;
    icon: ComponentType<{ className?: string }>;
    badge?: string | null | number;
};

type MenuCategory = {
    title: string;
    items: MenuItem[];
};

type SettingsSidebarMenuProps = {
    categories: MenuCategory[];
    onItemClick: (item: MenuItem) => void;
};

export function SettingsSidebarMenu({ categories, onItemClick }: SettingsSidebarMenuProps) {
    return (
        <nav className="p-4 space-y-1 pb-10">
            {categories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                        {category.title}
                    </h3>
                    <div className="space-y-1">
                        {category.items.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onItemClick(item)}
                                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group text-gray-700 hover:bg-gray-50"
                                >
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                        <Icon className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-600" />
                                        <span className="font-medium text-sm truncate">
                                            {item.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {item.badge && (
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${item.badge === "Pro"
                                                ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
                                                : "bg-indigo-100 text-indigo-700"
                                                }`}>
                                                {item.badge}
                                            </span>
                                        )}
                                        <ChevronRight className="h-4 w-4 transition-transform text-gray-400 opacity-0 group-hover:opacity-100" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );
}
