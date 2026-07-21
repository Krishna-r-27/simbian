import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Monitor, Laptop, Server, HardDrive, Network, Printer, Zap, Shield,
    ArrowRight, X, ShieldCheck, CheckCircle2, FileText
} from "lucide-react";
import { PRODUCT_CATEGORIES, PRODUCT_SECTION_TEXT } from "../data/productData";

// Dynamic Icon Resolver
function ProductIcon({ name, className = "w-5 h-5" }) {
    const icons = {
        Monitor: <Monitor className={className} />,
        Laptop: <Laptop className={className} />,
        Server: <Server className={className} />,
        HardDrive: <HardDrive className={className} />,
        Network: <Network className={className} />,
        Printer: <Printer className={className} />,
        Zap: <Zap className={className} />,
        Shield: <Shield className={className} />
    };
    return icons[name] || <Monitor className={className} />;
}

export default function ProductsSection({ onTriggerQuoteForCategory }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <section
            id="products"
            className="py-100 bg-neutral-bg border-b border-border-light relative"
        >
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Block */}
                <div className="max-w-3xl mb-10 space-y-3">
                    <div className="inline-flex items-center space-x-2 text-accent">
                        <span className="w-8 h-[1.5px] bg-accent" />
                        <span className="font-sans font-extrabold text-xs uppercase tracking-widest">
                            {PRODUCT_SECTION_TEXT.badge}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl">
                        {PRODUCT_SECTION_TEXT.title}
                    </h2>
                </div>

                {/* 8-Category Card Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="product-cards-grid">
                    {PRODUCT_CATEGORIES.map((category, idx) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: idx * 0.08 }}
                            className="group bg-white rounded-xl border border-slate-300 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#2F8F83] hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
                            onClick={() => setSelectedCategory(category)}
                            id={`product-card-${category.id}`}
                        >
                            {/* Product Image Panel */}
                            <div className="relative h-48 overflow-hidden bg-primary/5">
                                <div className="w-full h-48 bg-slate-50 relative flex items-center justify-center overflow-hidden">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                                <div className="absolute top-4 left-4 bg-primary/20 text-white p-2.5 rounded-lg shadow-md z-10">
                                    <ProductIcon name={category.iconName} className="w-5 h-5 text-accent" />
                                </div>
                            </div>

                            {/* Product Content Panel */}
                            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                    <h3 className="font-display font-extrabold text-lg text-primary group-hover:text-secondary transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="lead-text text-base leading-relaxed line-clamp-3">
                                        {category.description}
                                    </p>
                                </div>

                                <div className="pt-2 border-t border-border-light/60 flex items-center justify-between text-sm font-sans font-bold text-primary group-hover:text-accent transition-colors">
                                    <span>{PRODUCT_SECTION_TEXT.viewAction}</span>
                                    <div className="w-7 h-7 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Slide-out Technical Specifications Drawer */}
            <AnimatePresence>
                {selectedCategory && (
                    <div className="fixed inset-0 z-50 flex justify-end" id="products-spec-drawer-backdrop">
                        {/* Backdrop overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-primary/45 backdrop-blur-sm"
                            onClick={() => setSelectedCategory(null)}
                        />

                        {/* Drawer sheet */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 180 }}
                            className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 border-l border-border-light"
                            id="products-spec-drawer-content"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-border-light bg-primary text-white flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2.5 bg-white/10 rounded-lg text-accent">
                                        <ProductIcon name={selectedCategory.iconName} className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-bold text-lg leading-none !text-white">{selectedCategory.name}</h3>
                                        <p className="text-[10px] text-slate-300 font-sans tracking-wide uppercase mt-1">
                                            {PRODUCT_SECTION_TEXT.drawerSubtitle}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                                    aria-label="Close drawer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Drawer Body */}
                            <div className="p-6 flex-grow space-y-6">
                                <div className="rounded-xl overflow-hidden h-48 relative border border-border-light">
                                    <img
                                        src={selectedCategory.image}
                                        alt={selectedCategory.name}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-4">
                                        <span className="text-white font-sans font-bold text-xs flex items-center space-x-1">
                                            <ShieldCheck className="w-4 h-4 text-accent" />
                                            <span>{PRODUCT_SECTION_TEXT.drawerMeta}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-display font-bold text-sm text-primary uppercase tracking-wider">
                                        {PRODUCT_SECTION_TEXT.drawerSummaryTitle}
                                    </h4>
                                    <p className="text-sm text-gray-500 font-sans leading-relaxed">
                                        {selectedCategory.description}
                                    </p>
                                </div>

                                {/* Sub-product Specifications list */}
                                <div className="space-y-4">
                                    <h4 className="font-display font-bold text-sm text-primary uppercase tracking-wider border-b border-border-light pb-2">
                                        {PRODUCT_SECTION_TEXT.drawerOfferingsTitle}
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedCategory.items.map((sub, sIdx) => (
                                            <div
                                                key={sIdx}
                                                className="bg-neutral-bg border border-border-light/60 p-4 rounded-lg space-y-1.5 hover:border-accent/40 transition-colors"
                                            >
                                                <h5 className="font-display font-extrabold text-sm text-primary flex items-center space-x-2">
                                                    <CheckCircle2 className="w-4 h-4 text-accent" />
                                                    <span>{sub.name}</span>
                                                </h5>
                                                <p className="text-xs text-gray-400 font-sans leading-relaxed pl-6">
                                                    {sub.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Guarantee block */}
                                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start space-x-3">
                                    <FileText className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <h5 className="font-display font-bold text-xs text-primary">
                                            {PRODUCT_SECTION_TEXT.slaTitle}
                                        </h5>
                                        <p className="text-[11px] text-gray-500 font-sans leading-normal">
                                            {PRODUCT_SECTION_TEXT.slaDescription}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Drawer Footer CTA */}
                            <div className="p-6 border-t border-border-light bg-neutral-bg flex items-center justify-between gap-4">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="px-4 py-2.5 border border-border-light hover:bg-gray-100 text-gray-600 font-sans font-bold text-xs rounded-lg transition-colors cursor-pointer"
                                >
                                    {PRODUCT_SECTION_TEXT.closeButton}
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        onTriggerQuoteForCategory(selectedCategory.name);
                                    }}
                                    className="px-6 py-2.5 bg-primary hover:bg-accent text-white font-sans font-bold text-xs rounded-lg transition-colors shadow-md flex-grow text-center flex items-center justify-center space-x-2 cursor-pointer"
                                >
                                    <span>{PRODUCT_SECTION_TEXT.ctaPrefix}{selectedCategory.name}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}