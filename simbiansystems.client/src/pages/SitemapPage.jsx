import React from "react";
import { Link } from "react-router-dom";
import {
    FiHome,
    FiBox,
    FiLayers,
    FiTool,
    FiUsers,
    FiMail,
    FiArrowRight,
} from "react-icons/fi";
import { MAIN_NAV_ITEMS, MEGA_MENU_CATEGORIES, BUTTON_TEXT } from "../data/navbarData";

const iconForNav = {
    "/": FiHome,
    "/products": FiBox,
    "/solutions": FiLayers,
    "/services-portfolio": FiTool,
    "/about-us": FiUsers,
};

const COMPANY_LINKS = [
    { name: "About Simbian Systems", path: "/about-us" },
    { name: "Solutions", path: "/solutions" },
    { name: "Services (FMS & Maintenance)", path: "/services-portfolio" },
];

const SUPPORT_LINKS = [
    { name: "Contact Us", path: "/contact-us" },
    { name: "Request a Quote", path: "/#request-quote" },
];

export default function SitemapPage({ onRequestQuote }) {
    return (
        <div className="bg-white">
            {/* Header Band */}
            <section className="bg-primary text-white pt-28 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="h-px w-8 bg-accent" />
                        <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-accent">
                            Full Site Directory
                        </span>
                    </div>
                    <h1 className="!text-white text-3xl sm:text-4xl font-bold">
                        Sitemap
                    </h1>
                    <p className="font-sans text-sm sm:text-base text-slate-300 mt-3 max-w-2xl">
                        Every page and product category on Simbian Systems, organized in
                        one place so you can find what you're looking for fast.
                    </p>
                </div>
            </section>

            {/* Body */}
            <section className="bg-slate-50 py-14 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Main Navigation */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <SectionHeading label="Main Navigation" />
                        <ul className="space-y-3 font-sans text-sm text-slate-600">
                            {MAIN_NAV_ITEMS.map((item) => {
                                const Icon = iconForNav[item.id] || FiArrowRight;
                                return (
                                    <li key={item.id}>
                                        <Link
                                            to={item.id}
                                            className="flex items-center gap-2.5 hover:text-accent transition-colors"
                                        >
                                            <Icon className="w-4 h-4 text-accent shrink-0" />
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Product Categories */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm lg:col-span-2">
                        <SectionHeading label="Product Categories" />
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 font-sans text-sm text-slate-600">
                            {MEGA_MENU_CATEGORIES.flatMap((cat) => cat.items).map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className="flex items-center gap-2.5 hover:text-accent transition-colors"
                                    >
                                        <FiArrowRight className="w-3.5 h-3.5 text-accent shrink-0" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <SectionHeading label="Company" />
                        <ul className="space-y-3 font-sans text-sm text-slate-600">
                            {COMPANY_LINKS.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="flex items-center gap-2.5 hover:text-accent transition-colors"
                                    >
                                        <FiArrowRight className="w-3.5 h-3.5 text-accent shrink-0" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Get in Touch */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <SectionHeading label="Get in Touch" />
                        <ul className="space-y-3 font-sans text-sm text-slate-600">
                            {SUPPORT_LINKS.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="flex items-center gap-2.5 hover:text-accent transition-colors"
                                    >
                                        <FiMail className="w-4 h-4 text-accent shrink-0" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* This Page */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <SectionHeading label="This Page" />
                        <ul className="space-y-3 font-sans text-sm text-slate-600">
                            <li>
                                <Link
                                    to="/sitemap"
                                    className="flex items-center gap-2.5 text-accent font-medium"
                                >
                                    <FiArrowRight className="w-3.5 h-3.5 shrink-0" />
                                    Sitemap
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* CTA */}
                {onRequestQuote && (
                    <div className="max-w-7xl mx-auto mt-10 bg-primary rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-display text-lg font-bold !text-white">
                                Can't find what you're looking for?
                            </h3>
                            <p className="font-sans text-sm !text-slate-300 mt-1">
                                Reach out to our team and we'll point you in the right
                                direction.
                            </p>
                        </div>
                        <button
                            onClick={onRequestQuote}
                            className="shrink-0 bg-accent hover:bg-accent/90 text-white font-sans text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            {BUTTON_TEXT.requestQuote}
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}

function SectionHeading({ label }) {
    return (
        <div className="flex items-center gap-2 mb-5">
            <span className="h-px w-6 bg-accent" />
            <h2 className="font-display text-xs font-bold uppercase tracking-widest text-primary">
                {label}
            </h2>
        </div>
    );
}