import React from "react";
import { motion } from "framer-motion";
import { turnkeyGlobalData } from "../data/solutionsData";

export default function TurnkeyGlobalSection({ turnkeyItems = turnkeyGlobalData.items }) {
    return (
        <section
            id="turnkey-services"
            className="py-16 sm:py-20 bg-white border-b border-border-light/60 scroll-mt-24 relative"
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-full mb-5 space-y-3">
                    <div className="inline-flex items-center space-x-2 text-accent">
                        <span className="w-8 h-[1.5px] bg-accent" />
                        <span className="font-sans font-bold text-xs uppercase tracking-widest">
                            {turnkeyGlobalData.badgeText}
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl text-primary font-bold">
                        {turnkeyGlobalData.title}
                    </h2>
                </div>

                <p className="lead-text mb-12">{turnkeyGlobalData.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {turnkeyItems.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.35, delay: idx * 0.05 }}
                            className="flex items-start space-x-4 p-5 rounded-xl bg-neutral-bg/40 border border-border-light/60 hover:border-accent/40 hover:bg-neutral-bg/60 transition-all duration-300 group"
                        >
                            <div className="w-9 h-9 rounded-full bg-[#2F8F83]/10 text-[#2F8F83] font-bold text-xs flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#2BA84A] group-hover:text-white transition-colors duration-300">
                                0{idx + 1}
                            </div>

                            <div className="space-y-1 pt-0.5">
                                <h4 className="font-sans font-extrabold text-base text-primary">
                                    {item.title}
                                </h4>
                                <p className="font-sans lead-text mt-2 leading-relaxed font-normal">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}