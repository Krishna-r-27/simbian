import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { PRODUCTS } from "../data/productsData";

export default function ProductDetailsPage() {
    const { productId, categorySlug } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const previousPage = searchParams.get("page") || 1;

    // Merge all product arrays into one
    const allProducts = Object.values(PRODUCTS).flat();

    const product = allProducts.find((p) => p.id === productId);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-primary">
                        Product Not Found
                    </h1>

                    <button
                        onClick={() => navigate("/products")}
                        className="mt-4 px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-accent transition cursor-pointer text-sm font-medium"
                    >
                        Back 
                    </button>
                </div>
            </div>
        );
    }

    const handleInquire = () => {
        navigate("/contact-us", {
            state: { selectedProduct: product.name },
        });
    };

    // Gallery Images
    const galleryImages =
        Array.isArray(product.images) && product.images.length > 0
            ? product.images
            : [product.image];

    const [selectedImage, setSelectedImage] = useState(galleryImages[0]);

    useEffect(() => {
        setSelectedImage(galleryImages[0]);
    }, [productId]);

    const specsList = [
        { label: "Processor", value: product.processor },
        { label: "Memory", value: product.ram },
        { label: "Storage", value: product.storage },
        { label: "Graphics", value: product.graphics },
        { label: "Operating System", value: product.os },
        { label: "Display", value: product.display },
        { label: "Category", value: product.category },
        { label: "SKU", value: product.sku },
    ].filter((spec) => spec.value);

    return (
        <section className="bg-slate-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 mt-4 flex items-center gap-1.5 text-primary text-sm font-semibold hover:text-accent transition cursor-pointer"
                >
                    ← Back
                </button>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">

                    <div className="grid md:grid-cols-2 gap-6 p-6">

                        {/* LEFT */}
                        <div className="flex flex-col justify-center">

                            <div className="bg-slate-50 border border-slate-200 rounded-xl h-[380px] flex items-center justify-center p-4">
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain transition-all duration-300"
                                />
                            </div>

                            {galleryImages.length > 1 && (
                                <div className="flex justify-center gap-2 mt-4 flex-wrap">
                                    {galleryImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(img)}
                                            className={`w-14 h-14 rounded-md border overflow-hidden transition cursor-pointer ${selectedImage === img
                                                ? "border-primary"
                                                : "border-slate-200 hover:border-primary"
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`View ${index + 1}`}
                                                className="w-full h-full object-contain bg-white p-1"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-col justify-between">

                            <div>

                                {product.badge && (
                                    <span className="w-fit px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                                        {product.badge}
                                    </span>
                                )}

                                <h1 className="text-xl md:text-2xl font-bold text-primary mt-2 leading-snug">
                                    {product.name}
                                </h1>

                                <p className="mt-2 text-sm md:text-lg lead-text leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="mt-5">
                                    <h2 className="text-sm md:text-lg font-bold text-primary mb-2">
                                        Technical Specifications
                                    </h2>

                                    <ul className="space-y-1.5 text-sm md:text-lg lead-text">
                                        {specsList.map((spec) => (
                                            <li
                                                key={spec.label}
                                                className="flex items-start gap-2"
                                            >
                                                <span className="text-primary font-bold mt-0.5">
                                                    •
                                                </span>

                                                <div>
                                                    <span className="font-semibold text-slate-900">
                                                        {spec.label}:{" "}
                                                    </span>

                                                    <span className="text-slate-600">
                                                        {spec.value}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>

                            <div className="mt-6 border-t border-slate-100 pt-4">

                                <p className="text-sm text-slate-500 mb-3">
                                    Need enterprise pricing or custom
                                    configurations?
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