import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicCatalogService } from "../services/publicCatalogService";
import PictureImage from "../components/ui/PictureImage";
import { imagePath } from "../utils/imagePath";
import SeoHead, {
    formatBrandModel,
    formatProductInquiryLabel,
    buildProductMetaDescription,
} from "../components/SeoHead.jsx";

export default function ProductDetailsPage() {
    const { categorySlug, productSlug } = useParams();
    const navigate = useNavigate();

    const {
        data: product,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["public-product", productSlug],
        queryFn: () => publicCatalogService.getBySlug(productSlug),
        enabled: Boolean(productSlug),
        retry: false,
    });

    const galleryImages = useMemo(() => {
        if (!product) return [];
        const imgs = [];
        if (product.featuredImage) imgs.push(product.featuredImage);
        if (Array.isArray(product.galleryImages)) {
            for (const img of product.galleryImages) {
                if (img && !imgs.includes(img)) imgs.push(img);
            }
        }
        return imgs;
    }, [product]);

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        setSelectedImage(galleryImages[0] || null);
    }, [galleryImages]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500 text-sm font-medium">Loading…</p>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <SeoHead
                    title="Product Not Found | Simbian Systems"
                    description="The requested product could not be found."
                    path={`/products/${categorySlug || ""}/${productSlug || ""}`}
                />
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-primary">Product Not Found</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        {error?.response?.data?.message ||
                            "This product is unavailable or unpublished."}
                    </p>
                    <button
                        onClick={() => navigate("/products")}
                        className="mt-4 px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-accent transition cursor-pointer text-sm font-medium"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    if (categorySlug && product.categorySlug && categorySlug !== product.categorySlug) {
        return (
            <Navigate
                to={`/products/${product.categorySlug}/${product.slug}`}
                replace
            />
        );
    }

    const brandModel = formatBrandModel(product.brand, product.modelNumber);
    const specsList = (product.specifications || [])
        .filter((s) => s.value)
        .map((s) => ({
            label: s.definitionName || "Spec",
            value: s.value,
        }));

    const title = `${product.seoTitle?.trim() || product.name} | Simbian Systems`;
    const description = buildProductMetaDescription(product);
    const canonicalPath = `/products/${product.categorySlug}/${product.slug}`;

    const handleInquire = () => {
        navigate("/contact-us", {
            state: { selectedProduct: formatProductInquiryLabel(product) },
        });
    };

    return (
        <section className="bg-slate-50 min-h-screen py-8">
            <SeoHead
                title={title}
                description={description}
                keywords={product.seoKeywords || undefined}
                path={canonicalPath}
                image={imagePath(product.featuredImage)}
                type="product"
            />

            <div className="max-w-6xl mx-auto px-4">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 mt-4 flex items-center gap-1.5 text-primary text-sm font-semibold hover:text-accent transition cursor-pointer"
                >
                    ← Back
                </button>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-6 p-6">
                        <div className="flex flex-col justify-start">
                            <div className="w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-start justify-center p-4">
                                <PictureImage
                                    imageBasePath={selectedImage}
                                    alt={product.name}
                                    priority
                                    className="max-w-full"
                                    imgClassName="block w-auto h-auto max-w-full max-h-[380px] md:max-h-[560px] object-contain object-top transition-all duration-300"
                                />
                            </div>

                            {galleryImages.length > 1 && (
                                <div className="flex justify-center gap-2 mt-4 flex-wrap">
                                    {galleryImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(img)}
                                            className={`w-14 h-14 rounded-md border overflow-hidden transition cursor-pointer ${
                                                selectedImage === img
                                                    ? "border-primary"
                                                    : "border-slate-200 hover:border-primary"
                                            }`}
                                        >
                                            <PictureImage
                                                imageBasePath={img}
                                                alt={`View ${index + 1}`}
                                                className="h-full w-full bg-white p-1"
                                                imgClassName="h-full w-full object-contain"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col justify-between">
                            <div>
                                {product.categoryName && (
                                    <Link
                                        to={`/products/${product.categorySlug}`}
                                        className="w-fit px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold hover:bg-primary/15"
                                    >
                                        {product.categoryName}
                                    </Link>
                                )}

                                <h1 className="text-xl md:text-2xl font-bold text-primary mt-2 leading-snug">
                                    {product.name}
                                </h1>

                                {brandModel && (
                                    <p className="mt-1 text-sm text-slate-500 font-medium">
                                        {brandModel}
                                    </p>
                                )}

                                {product.warranty && (
                                    <p className="mt-2 text-xs text-slate-600">
                                        <span className="font-semibold text-slate-800">
                                            Warranty:{" "}
                                        </span>
                                        {product.warranty}
                                    </p>
                                )}

                                {product.description && (
                                    <div
                                        className="rich-text mt-4 text-sm md:text-base lead-text leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                            __html: product.description,
                                        }}
                                    />
                                )}

                                {specsList.length > 0 && (
                                    <div className="mt-5">
                                        <h2 className="text-sm md:text-lg font-bold text-primary mb-2">
                                            Technical Specifications
                                        </h2>
                                        <ul className="list-disc space-y-1.5 pl-5 text-sm md:text-base lead-text marker:text-primary">
                                            {specsList.map((spec, idx) => (
                                                <li key={`${spec.label}-${idx}`}>
                                                    <span className="font-semibold text-slate-900">
                                                        {spec.label}:{" "}
                                                    </span>
                                                    <span className="text-slate-600">
                                                        {spec.value}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {product.brochure && (
                                    <a
                                        href={product.brochure}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex text-sm font-semibold text-accent hover:underline"
                                    >
                                        Download Brochure
                                    </a>
                                )}
                            </div>

                            <div className="mt-6 border-t border-slate-100 pt-4">
                                <p className="text-sm text-slate-500 mb-3">
                                    Need enterprise pricing or custom configurations?
                                </p>
                                <button
                                    onClick={handleInquire}
                                    className="w-full sm:w-auto bg-primary hover:bg-accent transition text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm cursor-pointer"
                                >
                                    Inquire Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
