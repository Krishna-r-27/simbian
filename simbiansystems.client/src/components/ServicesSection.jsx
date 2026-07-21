import React from "react";
import { motion } from "motion/react";
import { SERVICES_SECTION_TEXT, FMS_HIGHLIGHTS } from "../data/servicesData";

export default function ServicesSection() {
    return (
        <section
            id="services"
            className="py-100 bg-white border-b border-border-light/60 scroll-mt-24 relative"
        >
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="max-w-3xl mb-5 space-y-3">
                    <div className="inline-flex items-center space-x-2 text-accent">
                        <span className="w-8 h-[1.5px] bg-accent" />
                        <span className="font-sans font-bold text-xs uppercase tracking-widest">
                            {SERVICES_SECTION_TEXT.badge}         </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl">
                        {SERVICES_SECTION_TEXT.title}
                    </h2>
                   
                </div>
                <p className="lead-text mb-12 ">
                    {SERVICES_SECTION_TEXT.description}
                </p>
                {/* 3-Column Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {FMS_HIGHLIGHTS.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.35, delay: index * 0.05 }}
                            className="flex items-start space-x-4 p-5 rounded-xl bg-neutral-bg/40 border border-border-light/60 hover:border-accent/40 hover:bg-neutral-bg/60 transition-all duration-300 group"
                        >
                            {/* Sharp, clean green/teal checkmark/tick icon inside circular background */}
                            <div className="w-9 h-9 rounded-full bg-[#2F8F83]/10 text-[#2F8F83] flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#2BA84A] group-hover:text-white transition-colors duration-300">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.5"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>

                            {/* Service title and a quick benefit */}
                            <div className="pt-1.5">
                                <p className="font-sans font-extrabold text-base text-primary leading-relaxed">
                                    {item.title}: <span className="font-normal lead-text">{item.benefit}</span>
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}