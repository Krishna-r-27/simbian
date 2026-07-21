import React from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { motion } from "motion/react";
import {
    Monitor, Laptop, Server, HardDrive, Network, Printer, Zap, Shield,
    ArrowRight
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

export default function ProductsSection() {
    const navigate = useNavigate(); // 2. Initialize the navigate function

    const handleCardClick = (category) => {
        // Option A: Navigate to the general products page
        navigate("/products");

        // Option B: Navigate with the specific category ID (e.g. /products/laptops or /products?category=laptops)
        // navigate(`/products?category=${category.id}`);
        // OR
        // navigate("/products", { state: { selectedCategory: category } });
    };

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
                            onClick={() => handleCardClick(category)} // 3. Call handleCardClick on click
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
        </section>
    );
}