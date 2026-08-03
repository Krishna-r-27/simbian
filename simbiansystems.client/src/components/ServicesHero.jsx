import React from "react";
import heroBg from "../assets/images/simbian-home-bg.png";
import { servicesHeroData } from "../data/servicesData";

export default function ServicesHero() {
    return (
        <section
            style={{ backgroundImage: `url(${heroBg})` }}
            className="bg-cover bg-center bg-no-repeat text-white lg:py-14 lg:pb-10  sm:py-20 border-b border-white/10 relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                {/* 2-Column Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                    {/* Left Column: Text Content */}
                    <div className="lg:col-span-7 space-y-4">
                        {/* Horizontal Accent Line & Badge */}
                        <div className="inline-flex items-center space-x-2 text-[#2BA84A]">
                            <span className="w-8 h-[1.5px] bg-[#2BA84A]" />
                            <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#2BA84A]">
                                {servicesHeroData.badgeText}
                            </span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                            {servicesHeroData.title}
                        </h1>

                        {/* Lead Description */}
                        <p className="font-sans text-sm sm:text-base lead-text leading-relaxed font-normal pt-1 text-white/90">
                            {servicesHeroData.description}
                        </p>
                    </div>

                    {/* Right Column: Hero Image */}
                    {servicesHeroData.image && (
                        <div className="lg:col-span-5 flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-lg lg:max-w-none">
                                <img
                                    src={servicesHeroData.image}
                                    alt={servicesHeroData.title}
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