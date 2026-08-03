import React from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { globalTradingData } from "../data/solutionsData.js";

export default function GlobalTradingSection() {
    return (
        <section
            id="global-trading"
            className="py-16 sm:py-20 bg-white border-b border-border-light/60 scroll-mt-24 relative"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="max-w-full mb-5 space-y-3">
                    <div className="inline-flex items-center space-x-2 text-accent">
                        <span className="w-8 h-[1.5px] bg-accent" />
                        <span className="font-sans font-bold text-xs uppercase tracking-widest text-accent">
                            {globalTradingData.badgeText}
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl text-primary font-bold tracking-tight">
                        {globalTradingData.title}
                    </h2>
                </div>

                <p className="lead-text mb-12">{globalTradingData.description}</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {globalTradingData.cards.map((card, idx) => {
                        const IconComp = card.icon;
                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.35, delay: idx * 0.05 }}
                                className="flex flex-col justify-between p-6 sm:p-7 rounded-xl bg-neutral-bg/40 border border-border-light/60 hover:border-accent/40 hover:bg-neutral-bg/60 transition-all duration-300 group relative"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="w-10 h-10 rounded-full bg-[#2F8F83]/10 text-[#2F8F83] flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#2BA84A] group-hover:text-white transition-colors duration-300">
                                            <IconComp className="w-5 h-5 transition-colors duration-300" />
                                        </div>

                                        <span className="font-sans text-[10px] font-bold text-[#2F8F83] bg-[#2F8F83]/10 px-2.5 py-1 rounded-md uppercase tracking-wider group-hover:bg-[#2BA84A]/10 group-hover:text-[#2BA84A] transition-colors duration-300">
                                            {card.tag}
                                        </span>
                                    </div>

                                    <div className="space-y-1.5 pt-1">
                                        <h3 className="font-sans font-extrabold text-base text-primary">
                                            {card.title}
                                        </h3>
                                        <p className="font-sans text-sm lead-text">
                                            {card.content}
                                        </p>
                                    </div>

                                    <div className="pt-2 flex flex-wrap gap-2 mb-2">
                                        {card.regions.map((region, rIdx) => (
                                            <span
                                                key={rIdx}
                                                className="inline-flex items-center space-x-1.5 font-sans text-xs font-medium text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200/60 shadow-xs"
                                            >
                                                <Building2 className="w-3.5 h-3.5 text-accent shrink-0" />
                                                <span>{region}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}