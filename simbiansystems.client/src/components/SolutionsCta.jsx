import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom"

export default function SolutionsCTA({ onRequestQuote }) {
    return (
        <section className="py-16 sm:py-20 bg-white border-b border-border-light/60 relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.35 }}
                    className="relative rounded-2xl bg-neutral-bg/20 p-8 sm:p-12 border border-slate-200/80 shadow-sm hover:border-accent/40 transition-all duration-300 flex flex-col lg:flex-row items-center justify-between gap-8 group"
                >
                    {/* Content Left */}
                    <div className="space-y-3 max-w-5xl text-center lg:text-left relative z-10">
                        {/* Signature Horizontal Line Badge */}
                        <div className="inline-flex items-center space-x-2 text-accent">
                            <span className="w-8 h-[1.5px] bg-accent" />
                            <span className="font-sans font-bold text-xs uppercase tracking-widest text-accent">
                                READY TO IMPLEMENT TURNKEY IT SOLUTIONS?
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-3xl md:text-4xl text-primary font-bold tracking-tight">
                            Get a Customized Turnkey Solutions Proposal
                        </h3>

                        {/* Description */}
                        <p className="font-sans text-sm sm:text-base lead-text">
                            Connect with our IT infrastructure architects to discuss computer center design, LAN setup, banking software integration, or international sourcing.
                        </p>
                    </div>

                    {/* Single Action Right */}
                    <div className="shrink-0 w-full lg:w-auto relative z-10">
                        <Link
                            to="/contact-us"
                            className="w-full lg:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-4 bg-primary hover:bg-[#2BA84A] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group/btn"
                        >
                            <span>Request Custom Proposal</span>
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}