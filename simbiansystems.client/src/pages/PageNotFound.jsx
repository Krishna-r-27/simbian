import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiHome, FiBox, FiMap } from "react-icons/fi";
import { MAIN_NAV_ITEMS } from "../data/navbarData";

const QUICK_LINKS = [
    { name: "Home", path: "/", icon: FiHome },
    { name: "Products", path: "/products", icon: FiBox },
    { name: "Sitemap", path: "/sitemap", icon: FiMap },
];

export default function PageNotFound() {
    return (
        <div className="bg-white min-h-[calc(100vh-4rem)] flex items-center">
            <section className="w-full py-24 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-5">
                        <span className="h-px w-8 bg-accent" />
                        <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-accent">
                            Error 404
                        </span>
                        <span className="h-px w-8 bg-accent" />
                    </div>

                    <h1 className="font-display text-6xl sm:text-8xl font-bold text-primary leading-none">
                        404
                    </h1>

                    <h2 className="font-display text-xl sm:text-2xl font-bold text-primary mt-6">
                        Page Not Found
                    </h2>
                    <p className="font-sans text-sm sm:text-base text-slate-500 mt-3 max-w-md mx-auto">
                        The page you're looking for doesn't exist or may have been
                        moved. Try one of the links below, or head back to the homepage.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
                        {QUICK_LINKS.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-200 hover:border-accent hover:text-accent text-slate-600 font-sans text-sm font-semibold px-5 py-3 rounded-lg transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 mt-10 font-sans text-sm font-semibold text-accent hover:text-primary transition-colors"
                    >
                        Back to Home
                        <FiArrowRight className="w-4 h-4" />
                    </Link>

                    {/* Explore other sections */}
                    <div className="mt-16 pt-10 border-t border-slate-100">
                        <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
                            Or explore
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {MAIN_NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.id}
                                    to={item.id}
                                    className="font-sans text-xs sm:text-sm text-slate-500 hover:text-accent bg-slate-50 hover:bg-accent/10 px-4 py-2 rounded-full transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}