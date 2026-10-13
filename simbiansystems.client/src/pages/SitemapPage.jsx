import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    FiHome,
    FiBox,
    FiLayers,
    FiTool,
    FiUsers,
    FiMail,
    FiArrowRight,
} from "react-icons/fi";
import { MAIN_NAV_ITEMS, BUTTON_TEXT } from "../data/navbarData";
import { publicCatalogService } from "../services/publicCatalogService";
import CatalogSeo from "../components/CatalogSeo";

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
    const { data: categories = [] } = useQuery({
        queryKey: ["public-categories"],
        queryFn: () => publicCatalogService.categories(),
    });

    const { data: products = [], isLoading: productsLoading } = useQuery({
        queryKey: ["public-products", "sitemap"],
        queryFn: async () => {
            const items = [];
            let page = 1;
            let total = 0;
            do {
                const result = await publicCatalogService.list({ page, pageSize: 200 });
                const batch = result?.items ?? [];
                total = result?.totalCount ?? batch.length;
                items.push(...batch);
                page += 1;
                if (batch.length === 0) break;
            } while (items.length < total);
            return items;
        },
    });

    const productsByCategory = useMemo(() => {
        const bySlug = new Map();
        for (const product of products) {
            const key = product.categorySlug || "other";
            if (!bySlug.has(key)) bySlug.set(key, []);
            bySlug.get(key).push(product);
        }

        const ordered = categories
            .filter((category) => bySlug.has(category.slug))
            .map((category) => ({
                name: category.name,
                slug: category.slug,
                items: bySlug.get(category.slug),
            }));

        for (const [slug, items] of bySlug) {
            if (!ordered.some((group) => group.slug === slug)) {
                ordered.push({
                    name: items[0]?.categoryName || slug,
                    slug,
                    items,
                });
            }
        }

        return ordered;
    }, [categories, products]);

    return (
        <div className="bg-white">
            <CatalogSeo />
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
                        Every page, product category, and published product on Simbian Systems.
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
                            {categories.map((cat) => (
                                <li key={cat.slug}>
                                    <Link
                                        to={`/products/${cat.slug}`}
                                        className="flex items-center gap-2.5 hover:text-accent transition-colors"
                                    >
                                        <FiArrowRight className="w-3.5 h-3.5 text-accent shrink-0" />
                                        {cat.name}
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

                <div className="max-w-7xl mx-auto mt-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <SectionHeading label="Products" />
                    {productsLoading ? (
                        <p className="font-sans text-sm text-slate-500">Loading products…</p>
                    ) : products.length === 0 ? (
                        <p className="font-sans text-sm text-slate-500">No published products yet.</p>
                    ) : (
                        <div className="space-y-6">
                            {productsByCategory.map((group) => (
                                <div key={group.slug}>
                                    <h3 className="font-display text-sm font-bold text-primary mb-3">
                                        <Link to={`/products/${group.slug}`} className="hover:text-accent">
                                            {group.name}
                                        </Link>
                                    </h3>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 font-sans text-sm text-slate-600">
                                        {group.items.map((product) => (
                                            <li key={product.id}>
                                                <Link
                                                    to={`/products/${product.categorySlug}/${product.slug}`}
                                                    className="hover:text-accent transition-colors"
                                                >
                                                    {product.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
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