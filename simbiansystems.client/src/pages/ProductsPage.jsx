import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import SidebarFilter from "../components/SidebarFilter.jsx";
import SeoHead, { formatBrandModel } from "../components/SeoHead.jsx";
import PictureImage from "../components/ui/PictureImage";
import { publicCatalogService } from "../services/publicCatalogService";
import { publicRoutes } from "../seo/publicRoutes";
import heroBg from "../assets/images/simbian-home-bg.png";

const BRAND_BADGE_STYLES = {
    hp: "bg-sky-50 text-sky-700 border-sky-200",
    dell: "bg-blue-50 text-blue-700 border-blue-200",
};

export const getBrandBadgeClasses = (brand) =>
    BRAND_BADGE_STYLES[brand?.toLowerCase()] || "bg-slate-100 text-slate-700 border-slate-200";

const PAGE_SIZE = 6;
const productsSeo = publicRoutes.find((route) => route.path === "/products");
const GENERIC_LISTING_DESC = productsSeo.description;

export default function ProductsPage() {
    const navigate = useNavigate();
    const { categorySlug: routeCategorySlug } = useParams();
    const categorySlug = routeCategorySlug || undefined;

    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const { data: categories = [], isLoading: categoriesLoading } = useQuery({
        queryKey: ["public-categories"],
        queryFn: () => publicCatalogService.categories(),
    });

    const sidebarCategories = useMemo(
        () => [
            { label: "All", slug: "" },
            ...categories.map((c) => ({ label: c.name, slug: c.slug })),
        ],
        [categories]
    );

    const matchedCategory = useMemo(() => {
        if (!categorySlug) return null;
        return categories.find((c) => c.slug === categorySlug) || null;
    }, [categories, categorySlug]);

    const categoryNotFound =
        Boolean(categorySlug) && !categoriesLoading && categories.length > 0 && !matchedCategory;

    const selectedCategory = !categorySlug
        ? "All"
        : matchedCategory?.name || categorySlug;

    const {
        data: productPage,
        isLoading: productsLoading,
    } = useQuery({
        queryKey: ["public-products", categorySlug || "all", currentPage],
        queryFn: () =>
            publicCatalogService.list({
                page: currentPage,
                pageSize: PAGE_SIZE,
                ...(categorySlug ? { categorySlug } : {}),
            }),
        enabled: !categoryNotFound,
    });

    const products = productPage?.items ?? [];
    const totalCount = productPage?.totalCount ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    const goToPage = (page) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("page", String(page));
            return next;
        });
    };

    const handleCategoryChange = (categoryLabel) => {
        const found = sidebarCategories.find((c) => c.label === categoryLabel);
        if (found?.slug) {
            navigate(`/products/${found.slug}?page=1`);
        } else {
            navigate("/products?page=1");
        }
    };

    const getVisiblePageNumbers = () => {
        const pages = [];
        const maxVisible = 3;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 1);
            let end = Math.min(totalPages, currentPage + 1);
            if (currentPage === 1) end = Math.min(totalPages, 3);
            else if (currentPage === totalPages) start = Math.max(1, totalPages - 2);
            for (let i = start; i <= end; i++) pages.push(i);
        }
        return pages;
    };

    const listingTitle = categorySlug
        ? `${selectedCategory} | Simbian Systems`
        : productsSeo.title;
    const listingDescription =
        matchedCategory?.description?.trim() || GENERIC_LISTING_DESC;
    const listingPath = categorySlug ? `/products/${categorySlug}` : "/products";

    const loading = categoriesLoading || (productsLoading && !categoryNotFound);

    if (categoryNotFound) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <SeoHead
                    title="Category Not Found | Simbian Systems"
                    description="The requested product category could not be found."
                    path={listingPath}
                />
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-bold text-primary">Category not found</h1>
                    <p className="mt-2 text-slate-600 text-sm">
                        This category does not exist or is no longer available.
                    </p>
                    <Link
                        to="/products"
                        className="mt-6 inline-block px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-accent transition text-sm font-medium"
                    >
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <SeoHead
                title={listingTitle}
                description={listingDescription}
                keywords={categorySlug ? `${selectedCategory}, Simbian Systems, enterprise IT products` : productsSeo.keywords}
                path={listingPath}
            />

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
                <div className="lg:hidden flex justify-between items-center bg-white rounded-xl border border-slate-200 p-4 mb-6">
                    <span className="text-xs font-bold text-primary">
                        Showing {totalCount} Models
                    </span>
                    <button
                        onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
                    >
                        Filter Categories
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    <SidebarFilter
                        categories={sidebarCategories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                        isOpenMobile={mobileFilterOpen}
                    />

                    <main className="lg:col-span-9">
                        <div className="hidden lg:flex justify-between mb-6">
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Showing{" "}
                                <span className="text-primary font-bold">{products.length}</span> of{" "}
                                <span className="text-primary font-bold">{totalCount}</span> Models
                            </p>
                        </div>

                        {loading ? (
                            <div className="bg-white rounded-2xl p-12 text-center text-slate-500 text-sm font-medium">
                                Loading…
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center">
                                <h3 className="font-bold">Products will be added soon</h3>
                                <Link
                                    to="/contact-us"
                                    className="mt-4 inline-block bg-primary text-white px-5 py-2 rounded-lg cursor-pointer"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((product, index) => {
                                    const brandModel = formatBrandModel(
                                        product.brand,
                                        product.modelNumber
                                    );
                                    const detailPath = `/products/${product.categorySlug}/${product.slug}`;
                                    return (
                                        <div
                                            key={product.id}
                                            onClick={() =>
                                                navigate(`${detailPath}?page=${currentPage}`)
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
                                                    <PictureImage
                                                        imageBasePath={product.featuredImage}
                                                        alt={product.name}
                                                        priority={index === 0}
                                                        className="h-full w-full"
                                                        imgClassName="max-h-full w-full object-contain"
                                                    />
                                                </div>

                                                <h3 className="mt-4 font-bold text-primary">
                                                    {product.name}
                                                </h3>
                                                {brandModel && (
                                                    <p className="mt-1 text-xs text-slate-500 font-medium line-clamp-1">
                                                        {brandModel}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="p-5 pt-0 mt-auto">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(
                                                            `${detailPath}?page=${currentPage}`
                                                        );
                                                    }}
                                                    className="w-full py-2.5 bg-primary/5 hover:bg-primary text-primary hover:text-white border border-primary/20 rounded-lg text-xs font-bold transition cursor-pointer"
                                                >
                                                    Know More
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {!loading && totalPages > 1 && products.length > 0 && (
                            <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mt-10 pt-6">
                                <button
                                    onClick={() => goToPage(Math.max(currentPage - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 border border-primary hover:bg-primary hover:text-white text-primary rounded-lg text-xs font-bold disabled:opacity-40 cursor-pointer shrink-0"
                                >
                                    Previous
                                </button>

                                <div className="hidden sm:flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                        (page) => (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`w-9 h-9 rounded-lg text-xs font-bold cursor-pointer ${
                                                    currentPage === page
                                                        ? "bg-primary text-white"
                                                        : "border border-slate-300"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}
                                </div>

                                <div className="flex sm:hidden items-center gap-1.5">
                                    {getVisiblePageNumbers().map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`w-8 h-8 rounded-lg text-xs font-bold cursor-pointer ${
                                                currentPage === page
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
