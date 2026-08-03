import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { bankingEducationData } from "../data/solutionsData";

export default function BankingEducationSection() {
    return (
        <section
            id="banking-education"
            className="py-16 sm:py-20 bg-neutral-bg border-b border-border-light/60 scroll-mt-24 relative"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-full mb-5 space-y-3">
                    <div className="inline-flex items-center space-x-2 text-accent">
                        <span className="w-8 h-[1.5px] bg-accent" />
                        <span className="font-sans font-bold text-xs uppercase tracking-widest text-accent">
                            {bankingEducationData.badgeText}
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl text-primary font-bold tracking-tight">
                        {bankingEducationData.title}
                    </h2>
                </div>

                {/* Description Subtitle + Global Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
                    <p className="lead-text max-w-7xl">
                        {bankingEducationData.description}
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bankingEducationData.cards.map((card, idx) => {
                        const IconComp = card.icon;
                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.35, delay: idx * 0.05 }}
                                className="p-6 lg:py-4 sm:p-7 rounded-xl bg-white border border-border-light/60 hover:border-accent/40 hover:shadow-md transition-all duration-300 group relative flex items-center space-x-4"
                            >
                                {/* Icon Badge */}
                                <div className="w-10 h-10 rounded-full bg-[#2F8F83]/10 text-[#2F8F83] flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#2BA84A] group-hover:text-white transition-colors duration-300">
                                    <IconComp className="w-5 h-5 transition-colors duration-300" />
                                </div>

                                {/* Title on the Same Line */}
                                <h3 className="font-sans font-extrabold text-base text-primary leading-snug">
                                    {card.title}
                                </h3>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}