import React from "react";
import { motion } from "motion/react";
import heroBg from "../assets/images/simbian-home-bg.png";
import {
    Server, Laptop, Monitor, Network, ArrowRight, ShieldCheck,
    Cpu, HardDrive, Settings, Zap
} from "lucide-react";
// Import HERO_BUTTONS alongside STATS_DATA and HERO_COPY
import { STATS_DATA, HERO_COPY, HERO_BUTTONS } from "../data/heroData";

// Lookup map using the "iconName" string values provided in your STATS_DATA array
const ICON_MAP = {
    Server: Server,
    Laptop: Laptop,
    Monitor: Monitor,
    Network: Network,
    ShieldCheck: ShieldCheck,
    Cpu: Cpu,
    HardDrive: HardDrive,
    Settings: Settings,
    Zap: Zap
};

export default function Hero({ onExploreProducts, onContactSales }) {
    return (
        <section
            id="hero"
            className="relative min-h-screen lg:pt-0 pt-30 flex items-center overflow-hidden bg-cover bg-center bg-no-repeat"
        >
            {/* Subtle background technical grid pattern */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                            <circle cx="40" cy="0" r="1.5" fill="#CBD5E1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Ambient gradient blobs */}
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center relative z-10 w-full">
                {/* Left Copy Column */}
                <motion.div
                    className="lg:col-span-6 space-y-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    id="hero-content-left"
                >
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-5xl font-bold leading-[1.2]">
                            {/* Corrected nested object paths */}
                            <span className="block lg:whitespace-nowrap">{HERO_COPY.title.line1}</span>
                            <span className="text-accent font-extrabold block lg:whitespace-nowrap">{HERO_COPY.title.line2}</span>
                        </h1>
                        <p className="lead-text max-w-xl">
                            {HERO_COPY.description}
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <button
                            onClick={onExploreProducts}
                            className="px-8 py-4 bg-primary hover:bg-accent text-white font-sans font-bold text-sm rounded-lg shadow-xl shadow-primary/10 hover:shadow-accent/15 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer group"
                            id="hero-primary-cta"
                        >
                            {/* Corrected to HERO_BUTTONS object */}
                            <span>{HERO_BUTTONS.primary}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={onContactSales}
                            className="px-8 py-4 border border-primary/20 text-primary hover:bg-primary/5 font-sans font-bold text-sm rounded-lg transition-all text-center cursor-pointer"
                            id="hero-secondary-cta"
                        >
                            {/* Corrected to HERO_BUTTONS object */}
                            {HERO_BUTTONS.secondary}
                        </button>
                    </div>
                </motion.div>

                {/* Right Column: Modern Stats Grid */}
                <motion.div
                    className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:gap-4 max-w-lg mx-auto lg:ml-auto lg:mr-0 w-full"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    id="hero-stats-right"
                >
                    {STATS_DATA.map((stat, index) => {
                        // Updated to dynamically match stat.iconName directly from data file
                        const IconComponent = ICON_MAP[stat.iconName] || Monitor;

                        return (
                            <motion.div
                                key={stat.id}
                                className="bg-white border border-border-light hover:border-accent/30 rounded-xl px-4 py-3 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group max-w-xs w-full mx-auto"
                                whileHover={{ y: -3 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-primary/5 text-primary group-hover:bg-accent/10 group-hover:text-accent rounded-lg transition-colors duration-300">
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-mono text-gray-400 font-bold">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>
                                <div className="space-y-0.5">
                                    <div className="font-display font-black text-2xl text-primary tracking-tight mt-2">
                                        {stat.value}
                                    </div>
                                    <h4 className="font-sans font-bold text-sm text-gray-800 tracking-tight leading-snug mt-1">
                                        {stat.label}
                                    </h4>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}