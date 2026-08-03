import React from "react";
import { ArrowLeft } from "lucide-react";
import heroBg from "../assets/images/simbian-home-bg.png";
import { solutionsHeroData } from "../data/solutionsData";

export default function SolutionsHero({ onBackHome }) {
    return (
        <section
            style={{ backgroundImage: `url(${heroBg})` }}
            className="bg-cover bg-center bg-no-repeat text-white py-16 lg:py-16 lg:pb-10 sm:py-20 border-b border-white/10 relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                {/* Back to Main Site Navigation Button */}
                {onBackHome && (
                    <button
                        onClick={onBackHome}
                        className="inline-flex items-center space-x-2 text-[#2BA84A] hover:text-white font-sans text-xs font-bold uppercase tracking-widest mb-6 transition-all cursor-pointer bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-[#2BA84A]/50 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 text-[#2BA84A] group-hover:text-white transition-transform group-hover:-translate-x-1 duration-200" />
                        <span>{solutionsHeroData.backButtonText}</span>
                    </button>
                )}

                {/* 2-Column Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="lg:col-span-7 space-y-4">
                        {/* Horizontal Accent Line & Badge */}
                        <div className="inline-flex items-center space-x-2 text-[#2BA84A]">
                            <span className="w-8 h-[1.5px] bg-[#2BA84A]" />
                            <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#2BA84A]">
                                {solutionsHeroData.badgeText}
                            </span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                            {solutionsHeroData.title}
                        </h1>

                        {/* Lead Description */}
                        <p className="font-sans text-sm sm:text-base lead-text leading-relaxed pt-1 text-white/90">
                            {solutionsHeroData.description}
                        </p>
                    </div>

                    {/* Right Column: Hero Graphic Image */}
                    {solutionsHeroData.image && (
                        <div className="lg:col-span-5 flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-lg lg:max-w-none">
                                <img
                                    src={solutionsHeroData.image}
                                    alt={solutionsHeroData.title}
                                    className="w-full h-auto object-contain max-h-[320px] rounded-xl drop-shadow-xl"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}