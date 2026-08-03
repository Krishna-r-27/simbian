import React from "react";
import { Server } from "lucide-react";
import { systemsProjectsData } from "../data/aboutData";

export default function SystemsProjectsSection() {
    return (
        <section className="py-16 sm:py-20 bg-neutral-bg border-b border-border-light/60 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-3xl space-y-3 mb-8">
                    <div className="inline-flex items-center space-x-2 text-accent">
                        <span className="w-8 h-[1.5px] bg-accent" />
                        <span className="font-sans font-bold text-xs uppercase tracking-widest text-accent">
                            {systemsProjectsData.badgeText}
                        </span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl text-primary font-bold tracking-tight">
                        {systemsProjectsData.title}
                    </h2>
                </div>

                {/* Enterprise Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-border-light/60 relative group overflow-hidden hover:shadow-md hover:border-accent/40 transition-all duration-300">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-[#2F8F83]/10 text-[#2F8F83] flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#2BA84A] group-hover:text-white transition-colors duration-300">
                                <Server className="w-6 h-6 transition-colors duration-300" />
                            </div>
                            <h3 className="font-sans font-extrabold text-lg sm:text-xl text-primary leading-snug">
                                {systemsProjectsData.cardTitle}
                            </h3>
                        </div>

 
                    </div>

                    <p className="text-base leading-relaxed text-gray-600 sm:pl-16">
                        {systemsProjectsData.cardDescription}
                    </p>
                </div>
            </div>
        </section>
    );
}