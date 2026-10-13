import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, SlidersHorizontal, ChevronLeft, ChevronRight
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

// Import hero background image
import heroBg from "../assets/images/simbian-home-bg.png";

// Import data array and overall navigation/category options
import { DESKTOP_PRODUCTS } from "../data/dekstopsData.js";

// Import custom Sidebar component
import SidebarFilter from "../components/SidebarFilter.jsx";

// Global Product Categories for the main Sidebar Filter
const CATALOG_CATEGORIES = [
    "All Products",
    "Desktops",
    "Laptops",
    "Workstations",
    "Servers & Storage",
    "Networking & Security"
];

export default function DesktopsPage({ onInquire }) {
    const [searchParams, setSearchParams] = useSearchParams();

    // Read initial product type/category from URL query parameter (e.g. ?type=Desktops)
    const activeCategoryParam = searchParams.get("type") || "Desktops";

    // Filter States
    const [selectedCatalogCategory, setSelectedCatalogCategory] = useState(activeCategoryParam);
    const [selectedUsage, setSelectedUsage] = useState("All");
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Modal State for "Know More"
    const [activeProduct, setActiveProduct] = useState(null);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Sync state when URL search parameters change
    useEffect(() => {
        const typeParam = searchParams.get("type") || "Desktops";
        setSelectedCatalogCategory(typeParam);
        setCurrentPage(1);
    }, [searchParams]);

    // Update filter selection via UI
    const handleCategoryChange = (category) => {
        setSelectedCatalogCategory(category);
        if (category === "All Products") {
            setSearchParams({});
        } else {
            setSearchParams({ type: category });
        }
    };

    // Filtering logic
    const filteredProducts = useMemo(() => {
        return DESKTOP_PRODUCTS.filter((item) => {
            const matchesCategory =
                selectedCatalogCategory === "All Products" ||
                item.category.toLowerCase().includes(selectedCatalogCategory.toLowerCase()) ||
                selectedCatalogCategory === "Desktops"; // Fallback mapping
            const matchesUsage = selectedUsage === "All" || item.usage === selectedUsage;
            return matchesCategory && matchesUsage;
        });
    }, [selectedCatalogCategory, selectedUsage]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage, itemsPerPage]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">

            {/* ----------------- HERO SECTION ----------------- */}
            <section
                style={{ backgroundImage: `url(${heroBg})` }}
                className="bg-cover bg-center bg-no-repeat text-white lg:py-16 lg:pb-10 sm:py-20 border-b border-white/10 relative overflow-hidden"
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl space-y-4">
                        {/* Accent Line & Label */}
                        <div className="inline-flex items-center space-x-2 text-[#2BA84A]">
                            <span className="w-8 h-[1.5px] bg-[#2BA84A]" />
                            <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#2BA84A]">
                                Enterprise IT Solutions
                            </span>
                        </div>

                        {/* Static Uniform Heading */}
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                            Products
                        </h1>
                    </div>
                </div>
            </section>

            {/* ----------------- MAIN CONTENT SECTION ----------------- */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">

                {/* Mobile Filter Toggle */}
                <div className="flex items-center justify-between lg:hidden mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <span className="font-bold text-sm text-primary">
                        Showing {filteredProducts.length} Products
                    </span>
                    <button
                        onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Filter Categories</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* ----------------- REUSABLE SIDEBAR FILTER ----------------- */}
                    <SidebarFilter
                        categories={CATALOG_CATEGORIES}
                        selectedCategory={selectedCatalogCategory}
                        onCategoryChange={handleCategoryChange}
                        selectedUsage={selectedUsage}
                        onUsageReset={setSelectedUsage}
                        isOpenMobile={mobileFilterOpen}
                    />

                    {/* ----------------- PRODUCT GRID ----------------- */}
                    <main className="lg:col-span-9 flex flex-col justify-between">
                        <div>
                            <div className="hidden lg:flex items-center justify-between mb-6">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Showing <span className="text-primary">{paginatedProducts.length}</span> of <span className="text-primary">{filteredProducts.length}</span> Models
                                </p>
                            </div>

                            {paginatedProducts.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                                    <h3 className="font-bold text-base text-slate-700">No matching products found</h3>
                                    <p className="text-xs text-slate-500">Try selecting a different category from the sidebar menu.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {paginatedProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                                        >
                                            <div className="p-5 space-y-4">
                                                <div className="h-44 w-full rounded-xl overflow-hidden relative flex items-center justify-center p-4 bg-white">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300 select-none pointer-events-none"
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <h3 className="font-bold text-base text-primary group-hover:text-accent transition-colors leading-snug line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                </div>

                                                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="truncate">{product.processor}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span>{product.ram} | {product.storage}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-5 pt-0">
                                                <button
                                                    onClick={() => setActiveProduct(product)}
                                                    className="w-full py-2.5 bg-primary/5 hover:bg-primary text-primary hover:text-white border border-primary/20 text-xs font-bold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:border-primary cursor-pointer"
                                                >
                                                    <span>Know More</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ----------------- PAGINATION CONTROLS ----------------- */}
                        {totalPages > 1 && (
                            <div className="mt-10 flex items-center justify-center space-x-2 border-t border-slate-200 pt-6">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`p-2.5 rounded-lg border text-xs font-bold transition-all flex items-center space-x-1 ${currentPage === 1
                                        ? "border-slate-200 text-slate-300 cursor-not-allowed"
                                        : "border-slate-300 text-primary hover:bg-slate-100 cursor-pointer"
                                        }`}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Previous</span>
                                </button>

                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-9 h-9 text-xs font-bold rounded-lg transition-all cursor-pointer ${currentPage === pageNum
                                            ? "bg-primary text-white shadow-md"
                                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`p-2.5 rounded-lg border text-xs font-bold transition-all flex items-center space-x-1 ${currentPage === totalPages
                                        ? "border-slate-200 text-slate-300 cursor-not-allowed"
                                        : "border-slate-300 text-primary hover:bg-slate-100 cursor-pointer"
                                        }`}
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </main>

                </div>
            </section>

            {/* ----------------- DETAILS MODAL ----------------- */}
            <AnimatePresence>
                {activeProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setActiveProduct(null)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-primary rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex flex-col sm:flex-row gap-6 items-center border-b border-slate-100 pb-6">
                                <div className="w-36 h-36 bg-white rounded-xl p-3 shrink-0 flex items-center justify-center border border-slate-100">
                                    <img src={activeProduct.image} alt={activeProduct.name} className="max-h-full object-contain select-none" />
                                </div>
                                <div className="space-y-2 text-center sm:text-left">
                                    <h2 className="text-xl font-black text-primary leading-snug">
                                        {activeProduct.name}
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Official HP Enterprise Series Model
                                    </p>
                                </div>
                            </div>

                            <div className="py-6 space-y-6">
                                <div className="space-y-2">
                                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                                        Overview
                                    </h4>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                        {activeProduct.description}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                                        Technical Specifications
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <span className="text-slate-400 block font-semibold text-[10px] uppercase">Processor</span>
                                            <span className="font-bold text-primary">{activeProduct.processor}</span>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <span className="text-slate-400 block font-semibold text-[10px] uppercase">Memory</span>
                                            <span className="font-bold text-primary">{activeProduct.ram}</span>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <span className="text-slate-400 block font-semibold text-[10px] uppercase">Storage</span>
                                            <span className="font-bold text-primary">{activeProduct.storage}</span>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <span className="text-slate-400 block font-semibold text-[10px] uppercase">Graphics</span>
                                            <span className="font-bold text-primary">{activeProduct.graphics}</span>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <span className="text-slate-400 block font-semibold text-[10px] uppercase">Operating System</span>
                                            <span className="font-bold text-primary">{activeProduct.os}</span>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <span className="text-slate-400 block font-semibold text-[10px] uppercase">Category</span>
                                            <span className="font-bold text-primary">{activeProduct.category}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
                                <span className="text-xs text-slate-500 font-medium">
                                    Need custom configurations or bulk pricing?
                                </span>
                                <Link
                                    to="/contact-us"
                                    state={{ product: activeProduct }}
                                    onClick={() => setActiveProduct(null)}
                                    className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-accent text-white font-bold text-xs rounded-lg shadow-lg shadow-primary/10 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                                >
                                    <span>Inquire Now</span>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}