import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import SidebarFilter from "../components/SidebarFilter.jsx";
import heroBg from "../assets/images/simbian-home-bg.png";
import { PRODUCTS } from "../data/productsData";

// Brand-specific badge styling so HP / Dell (or any other brand) are visually distinct
const BRAND_BADGE_STYLES = {
    hp: "bg-sky-50 text-sky-700 border-sky-200",
    dell: "bg-blue-50 text-blue-700 border-blue-200",
};

export const getBrandBadgeClasses = (brand) =>
    BRAND_BADGE_STYLES[brand?.toLowerCase()] || "bg-slate-100 text-slate-700 border-slate-200";

export const SIDEBAR_CATEGORIES = [
    { label: "All", slug: "" },
    { label: "Desktop Computers", slug: "desktops" },
    { label: "Business Laptops", slug: "laptops" },
    { label: "Workstations", slug: "workstations" },
    { label: "Enterprise Servers & Storage", slug: "servers-storage" },
    { label: "Networking & Security", slug: "networking-security" },
    { label: "Printers & Scanners", slug: "printers-scanners" },
    { label: "UPS & Power Backup", slug: "ups-power-backup" },
    { label: "Security & Surveillance", slug: "security-surveillance" },
];

export default function ProductsPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Derive the category slug directly from the URL, e.g.
    // "/products/laptops" -> categorySlug "laptops"
    const pathSegments = location.pathname
        .replace(/^\/products\/?/, "")
        .split("/")
        .filter(Boolean);

    const categorySlug = pathSegments[0] || undefined;
    const fullPathSlug = pathSegments.join("/");

    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const itemsPerPage = 6;

    const goToPage = (page) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("page", String(page));
            return next;
        });
    };

    const selectedCategory = useMemo(() => {
        if (!categorySlug) return "All";

        const found = SIDEBAR_CATEGORIES.find(
            (category) => category.slug === categorySlug || category.slug === fullPathSlug
        );

        return found ? found.label : "Business Laptops";
    }, [categorySlug, fullPathSlug]);

    const handleCategoryChange = (categoryLabel) => {
        const found = SIDEBAR_CATEGORIES.find(
            (category) => category.label === categoryLabel
        );

        if (found && found.slug) {
            navigate(`/products/${found.slug}?page=1`);
        } else {
            navigate("/products?page=1");
        }
    };

    const filteredProducts = useMemo(() => {
        if (!categorySlug) {
            return Object.values(PRODUCTS).flat();
        }
        return PRODUCTS[categorySlug] || [];
    }, [categorySlug]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(
            startIndex,
            startIndex + itemsPerPage
        );
    }, [filteredProducts, currentPage]);

    // Dynamic visible pages calculation for small screens
    const getVisiblePageNumbers = () => {
        const pages = [];
        const maxVisible = 3; // Max page number buttons visible on extra-small mobile viewports

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 1);
            let end = Math.min(totalPages, currentPage + 1);

            if (currentPage === 1) {
                end = Math.min(totalPages, 3);
            } else if (currentPage === totalPages) {
                start = Math.max(1, totalPages - 2);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }
        return pages;
    };

    const getProductSlug = (product) => {
        switch (product.category) {
            case "Business Laptop":
                return "laptops";
            case "Workstation":
                return "workstations";
            case "Tower":
            case "All-in-One":
            case "Mini":
            case "Small Form Factor":
                return "desktops";
            default:
                return "desktops";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">

            {/* Hero */}
            <section
                style={{ backgroundImage: `url(${heroBg})` }}
                className="bg-cover bg-center bg-no-repeat text-white py-14 lg:py-16 border-b border-white/10"
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-3xl space-y-3">

                        <div className="inline-flex items-center gap-2">
                            <span className="w-8 h-[1.5px] bg-[#2BA84A]" />
                            <span className="text-[#2BA84A] text-xs font-bold uppercase tracking-widest">
                                Enterprise IT Solutions
                            </span>
                        </div>

                        <h1 className="text-primary text-3xl lg:text-5xl">
                            {selectedCategory === "All" ? "Products" : selectedCategory}
                        </h1>

                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

                {/* Mobile Filter */}
                <div className="lg:hidden flex justify-between items-center bg-white rounded-xl border border-slate-200 p-4 mb-6">
                    <span className="text-xs font-bold text-primary">
                        Showing {filteredProducts.length} Models
                    </span>

                    <button
                        onClick={() =>
                            setMobileFilterOpen(!mobileFilterOpen)
                        }
                        className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
                    >
                        Filter Categories
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">

                    <SidebarFilter
                        categories={SIDEBAR_CATEGORIES}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                        isOpenMobile={mobileFilterOpen}
                    />

                    <main className="lg:col-span-9">

                        <div className="hidden lg:flex justify-between mb-6">
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Showing{" "}
                                <span className="text-primary font-bold">
                                    {paginatedProducts.length}
                                </span>{" "}
                                of{" "}
                                <span className="text-primary font-bold">
                                    {filteredProducts.length}
                                </span>{" "}
                                Models
                            </p>
                        </div>

                        {paginatedProducts.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center">
                                <h3 className="font-bold">
                                    Products will be added soon
                                </h3>

                                <Link
                                    to="/contact-us"
                                    className="mt-4 inline-block bg-primary text-white px-5 py-2 rounded-lg cursor-pointer"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">

                                {paginatedProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() =>
                                            navigate(
                                                `/products/${getProductSlug(product)}/details/${product.id}?page=${currentPage}`
                                            )
                                        }
                                        className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col"
                                    >
                                        <div className="p-5">

                                            <div className="relative h-48 rounded-xl flex justify-center items-center p-4">
                                                {product.brand && (
                                                    <span
                                                        className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getBrandBadgeClasses(product.brand)}`}
                                                    >
                                                        {product.brand}
                                                    </span>
                                                )}
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="max-h-full object-contain"
                                                />
                                            </div>

                                            <h3 className="mt-4 font-bold text-primary line-clamp-2 h-12">
                                                {product.name}
                                            </h3>

                                        </div>

                                        <div className="p-5 pt-0">

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                    navigate(
                                                        `/products/${getProductSlug(product)}/details/${product.id}?page=${currentPage}`
                                                    );
                                                }}
                                                className="w-full py-2.5 bg-primary/5 hover:bg-primary text-primary hover:text-white border border-primary/20 rounded-lg text-xs font-bold transition cursor-pointer"
                                            >
                                                Know More
                                            </button>

                                        </div>

                                    </div>
                                ))}

                            </div>
                        )}

                        {/* Responsive Pagination Section */}
                        {totalPages > 1 && (
                            <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mt-10 pt-6">

                                <button
                                    onClick={() =>
                                        goToPage(Math.max(currentPage - 1, 1))
                                    }
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 border border-primary hover:bg-primary hover:text-white text-primary rounded-lg text-xs font-bold disabled:opacity-40 cursor-pointer shrink-0"
                                >
                                    Previous
                                </button>

                                {/* Desktop View: Displays all page numbers */}
                                <div className="hidden sm:flex items-center gap-2">
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`w-9 h-9 rounded-lg text-xs font-bold cursor-pointer ${currentPage === page
                                                ? "bg-primary text-white"
                                                : "border border-slate-300"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                {/* Mobile View: Displays focused window around active page */}
                                <div className="flex sm:hidden items-center gap-1.5">
                                    {getVisiblePageNumbers().map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`w-8 h-8 rounded-lg text-xs font-bold cursor-pointer ${currentPage === page
                                                ? "bg-primary text-white"
                                                : "border border-slate-300"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() =>
                                        goToPage(Math.min(currentPage + 1, totalPages))
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 border border-primary hover:bg-primary hover:text-white text-primary rounded-lg text-xs font-bold disabled:opacity-40 cursor-pointer shrink-0"
                                >
                                    Next
                                </button>

                            </div>
                        )}

                    </main>
                </div>
            </section>
        </div>
    );
}