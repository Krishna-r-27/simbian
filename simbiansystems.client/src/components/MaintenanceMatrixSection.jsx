import React from "react";
import { CheckCircle2 } from "lucide-react";
import { maintenanceMatrixHeader, maintenanceCategories as defaultCategories } from "../data/servicesData";

export default function MaintenanceMatrixSection({ maintenanceCategories = defaultCategories }) {
    return (
        <section className="py-12 sm:py-16 bg-neutral-bg border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="max-w-full mb-10 space-y-2">
                    <div className="inline-flex items-center space-x-2 text-accent">
                        <span className="w-8 h-[1.5px] bg-accent" />
                        <span className="font-sans font-bold text-xs uppercase tracking-widest">
                            {maintenanceMatrixHeader.badgeText}
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl mt-1">
                        {maintenanceMatrixHeader.title}
                    </h2>

                    <p className="text-sm lg:mt-4 sm:text-base text-slate-600 lead-text font-normal">
                        {maintenanceMatrixHeader.description}
                    </p>
                </div>

                {/* Clean 2-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {maintenanceCategories.map((cat, idx) => {
                        const IconComp = cat.icon;
                        return (
                            <div
                                key={idx}
                                className="group bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 flex flex-col justify-between hover:border-accent/40 hover:shadow-md transition-all duration-300"
                            >
                                {/* Card Header */}
                                <div className="flex items-center space-x-3.5 mb-5 border-b border-slate-200/60 pb-4">
                                    {/* Icon Badge Container */}
                                    <div className="w-10 h-10 rounded-xl bg-[#004A7C]/10 text-[#004A7C] group-hover:bg-[#2BA84A] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-300">
                                        <IconComp className="w-5 h-5 transition-colors duration-300" />
                                    </div>
                                    <h3 className="font-display text-base sm:text-lg font-bold text-[#004A7C] uppercase tracking-wide">
                                        {cat.title}
                                    </h3>
                                </div>

                                {/* Items List */}
                                <div className="space-y-3 flex-grow">
                                    {cat.items.map((item, itemIdx) => (
                                        <div key={itemIdx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 leading-normal">
                                            <CheckCircle2 className="w-4 h-4 text-[#2BA84A] shrink-0 mt-0.5" />
                                            <span className="font-medium lead-text">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}