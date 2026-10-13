import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Monitor, Laptop, Server, HardDrive, Network, Printer, Zap, Shield,
    ChevronDown, Menu, X, Mail, Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    CONTACT_RIBBON,
    ACCESSIBILITY_LABELS,
    BUTTON_TEXT,
    MAIN_NAV_ITEMS
} from "../data/navbarData.js";
import { publicCatalogService } from "../services/publicCatalogService";
import logo from "../assets/images/simbian-logo.png";

export function CategoryIcon({ name, className = "w-5 h-5" }) {
    switch (name) {
        case "Monitor": return <Monitor className={className} />;
        case "Laptop": return <Laptop className={className} />;
        case "Server": return <Server className={className} />;
        case "HardDrive": return <HardDrive className={className} />;
        case "Network": return <Network className={className} />;
        case "Printer": return <Printer className={className} />;
        case "Zap": return <Zap className={className} />;
        case "Shield": return <Shield className={className} />;
        default: return <Monitor className={className} />;
    }
}

export default function Navbar({ onRequestQuote, onNavigate, activeSection = "hero" }) {
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

    const navigate = useNavigate();

    const { data: categories = [] } = useQuery({
        queryKey: ["public-categories"],
        queryFn: () => publicCatalogService.categories(),
    });

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const isScrolled = window.scrollY > 20;
                    setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        setScrolled(window.scrollY > 20);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLinkClick = useCallback((path) => {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
        navigate(path);
    }, [navigate]);

    const handleCategoryClick = useCallback((cat) => {
        handleLinkClick(`/products/${cat.slug}`);
    }, [handleLinkClick]);

    const handleQuoteClick = useCallback(() => {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
        navigate("/contact-us");
    }, [navigate]);

    return (
        <>
            <header
                id="main-navbar"
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/95 backdrop-blur-md shadow-md border-b border-border-light"
                    : "bg-white/90 backdrop-blur-sm border-b border-border-light/20"
                    }`}
            >
                {!scrolled && (
                    <div className="hidden lg:block bg-neutral-bg text-primary py-2.5 text-xs font-sans border-b border-border-light/50">
                        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                            <div className="flex items-center space-x-1.5">
                                <Phone className="w-3.5 h-3.5 text-primary" />
                                {CONTACT_RIBBON.phones.map((phone, index) => (
                                    <React.Fragment key={phone.value}>
                                        <a href={`tel:${phone.value}`} className="hover:text-accent text-sm transition-colors">
                                            {phone.display}
                                        </a>
                                        {index < CONTACT_RIBBON.phones.length - 1 && (
                                            <span className="text-primary/20 mx-3 font-normal font-sans">|</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <Mail className="w-3.5 h-3.5 text-primary" />
                                <a href={`mailto:${CONTACT_RIBBON.email.value}`} className="font-medium text-primary text-sm hover:text-accent transition-colors">
                                    {CONTACT_RIBBON.email.display}
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300 py-4">
                    <button
                        onClick={() => handleLinkClick(MAIN_NAV_ITEMS[0].id)}
                        className="flex items-center space-x-2 group focus:outline-hidden cursor-pointer"
                        id="nav-logo-link"
                        aria-label={ACCESSIBILITY_LABELS.logoHome}
                    >
                        <img
                            src={logo}
                            alt={ACCESSIBILITY_LABELS.brandName}
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            style={{ color: "transparent", fontSize: 0 }}
                            className="w-42 h-12 object-contain flex-shrink-0 drop-shadow-xs transition-transform group-hover:scale-105 duration-300"
                        />
                    </button>

                    <div className="hidden lg:flex items-center space-x-10">
                        <nav className="flex items-center space-x-8" id="desktop-nav">
                            {MAIN_NAV_ITEMS.map((item) => {
                                const isActive = activeSection === item.id;

                                if (item.hasDropdown) {
                                    return (
                                        <div
                                            key={item.id}
                                            className="relative py-2"
                                            onMouseEnter={() => setActiveDropdown(item.id)}
                                            onMouseLeave={() => setActiveDropdown(null)}
                                        >
                                            <button
                                                onClick={() => handleLinkClick(item.id)}
                                                className={`flex items-center space-x-1 font-display font-semibold text-lg tracking-tight transition-colors cursor-pointer ${isActive ? "text-[#2F8F83]" : "text-primary hover:text-[#2F8F83]"
                                                    }`}
                                                aria-expanded={activeDropdown === item.id}
                                                aria-haspopup="true"
                                            >
                                                <span>{item.label}</span>
                                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.id ? "rotate-180" : ""}`} />
                                            </button>

                                            <AnimatePresence>
                                                {activeDropdown === item.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 15 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        transition={{ duration: 0.15, ease: "easeOut" }}
                                                        className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-border-light p-3 z-50 flex flex-col space-y-1 font-normal"
                                                    >
                                                        {categories.map((cat) => (
                                                            <button
                                                                key={cat.id}
                                                                onClick={() => handleCategoryClick(cat)}
                                                                className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left cursor-pointer group w-full"
                                                            >
                                                                <div className="p-1.5 rounded-md bg-slate-100 group-hover:bg-[#2F8F83]/10 text-[#2F8F83] transition-colors">
                                                                    <CategoryIcon name={cat.icon} className="w-4 h-4" />
                                                                </div>
                                                                <span className="font-display font-semibold text-sm text-primary group-hover:text-[#2F8F83] transition-colors">
                                                                    {cat.name}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={item.id} className="relative py-2">
                                        <button
                                            onClick={() => handleLinkClick(item.id)}
                                            className={`font-display font-semibold text-lg tracking-tight transition-colors cursor-pointer ${isActive ? "text-[#2F8F83]" : "text-primary hover:text-[#2F8F83]"
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeUnderline"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2F8F83]"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </nav>

                        <div className="flex items-center">
                            <button
                                onClick={handleQuoteClick}
                                className="px-8 py-2.5 bg-primary hover:bg-accent text-white font-display font-bold text-sm rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg cursor-pointer"
                            >
                                {BUTTON_TEXT.requestQuote}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 text-primary hover:text-accent transition-colors cursor-pointer"
                        aria-label={ACCESSIBILITY_LABELS.toggleMenu}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                            className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-border-light">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                                            <span className="text-white font-display font-extrabold text-sm">
                                                {ACCESSIBILITY_LABELS.brandAbbr}
                                            </span>
                                        </div>
                                        <span className="font-display font-bold text-base text-primary">
                                            {ACCESSIBILITY_LABELS.brandName}
                                        </span>
                                    </div>
                                    <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-primary cursor-pointer">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <nav className="space-y-4">
                                    {MAIN_NAV_ITEMS.map((item) => {
                                        if (item.hasDropdown) {
                                            return (
                                                <div key={item.id}>
                                                    <button
                                                        onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                                                        className="w-full flex items-center justify-between font-sans font-bold text-base text-primary hover:text-accent py-1 text-left cursor-pointer"
                                                    >
                                                        <span>{item.label}</span>
                                                        <ChevronDown className={`w-4 h-4 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`} />
                                                    </button>
                                                    {mobileProductsOpen && (
                                                        <div className="mt-2 pl-4 border-l border-border-light space-y-2">
                                                            {categories.map((cat) => (
                                                                <button
                                                                    key={cat.id}
                                                                    onClick={() => handleCategoryClick(cat)}
                                                                    className="block w-full text-left font-sans text-xs text-gray-600 hover:text-accent py-1 cursor-pointer"
                                                                >
                                                                    {cat.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }

                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => handleLinkClick(item.id)}
                                                className="block w-full text-left font-sans font-bold text-base text-primary hover:text-accent py-1 cursor-pointer"
                                            >
                                                {item.label}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            <button
                                onClick={handleQuoteClick}
                                className="w-full mt-6 px-6 py-3 bg-primary hover:bg-accent text-white font-display font-bold text-sm rounded-lg transition-colors"
                            >
                                {BUTTON_TEXT.requestQuote}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
