import React from "react";
import {
    Filter,
    Check,
    Grid2X2,
    Monitor,
    Laptop,
    HardDrive,
    Server,
    Network,
    Printer,
    Zap,
    ShieldCheck,
} from "lucide-react";

const CATEGORY_ICONS = {
    All: Grid2X2,
    "Desktop Computers": Monitor,
    "Business Laptops": Laptop,
    "Enterprise Servers": Server,
    "Storage Solutions": HardDrive,
    "Networking Equipment": Network,
    "Printers & Scanners": Printer,
    "UPS & Power Backup": Zap,
    "Security & Surveillance": ShieldCheck,
};

export default function SidebarFilter({
    categories,
    selectedCategory,
    onCategoryChange,
    onUsageReset,
    isOpenMobile,
}) {
    const isFiltered = selectedCategory !== "All";

    const handleReset = () => {
        onCategoryChange("All");
        if (onUsageReset) onUsageReset("All");
    };

    return (
        <aside
            className={`lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 ${
                isOpenMobile ? "block" : "hidden lg:block"
            }`}
        >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-bold text-base text-primary flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-accent" />
                    <span>Product Categories</span>
                </h3>
                {isFiltered && (
                    <button
                        onClick={handleReset}
                        className="text-xs text-accent font-semibold hover:underline cursor-pointer"
                    >
                        Reset
                    </button>
                )}
            </div>

            <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Categories
                </h4>
                <div className="space-y-1.5">
                    {categories.map((cat) => {
                        const label = typeof cat === "object" ? cat.label : cat;
                        const isActive = selectedCategory === label;
                        const IconComponent = CATEGORY_ICONS[label] || Monitor;

                        return (
                            <button
                                key={label}
                                onClick={() => onCategoryChange(label)}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                                    isActive
                                        ? "bg-primary text-white border-primary shadow-sm"
                                        : "bg-slate-50/50 hover:bg-slate-100 text-slate-700 border-transparent"
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`p-1.5 rounded-lg ${
                                            isActive
                                                ? "bg-white/20 text-white"
                                                : "bg-emerald-50 text-emerald-600"
                                        }`}
                                    >
                                        <IconComponent className="w-4 h-4" />
                                    </div>
                                    <span className="text-left">{label}</span>
                                </div>
                                {isActive && (
                                    <Check className="w-4 h-4 text-accent shrink-0 ml-2" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}
