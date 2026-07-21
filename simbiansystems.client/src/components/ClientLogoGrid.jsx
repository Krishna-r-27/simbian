import React, { useState, useEffect } from "react";
import { CLIENT_LOGOS, CLIENT_SECTION_TEXT } from "../data/clientData";
import { Building, Landmark, GraduationCap, HeartPulse, ChevronLeft, ChevronRight } from "lucide-react";

function ClientIndustryIcon({ industry, className = "w-5 h-5" }) {
    switch (industry) {
        case "Banking": return <Landmark className={className} />;
        case "Education": return <GraduationCap className={className} />;
        case "Healthcare": return <HeartPulse className={className} />;
        default: return <Building className={className} />;
    }
}

export default function ClientLogoGrid() {
    const [startIndex, setStartIndex] = useState(0);

    // Automated progression every 5.5 seconds for top carousel
    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 5500);
        return () => clearInterval(interval);
    }, [startIndex]);

    const handlePrev = () => {
        setStartIndex((prevIndex) => {
            if (prevIndex === 0) {
                return CLIENT_LOGOS.length - 1;
            }
            return prevIndex - 1;
        });
    };

    const handleNext = () => {
        setStartIndex((prevIndex) => {
            if (prevIndex >= CLIENT_LOGOS.length - 1) {
                return 0;
            }
            return prevIndex + 1;
        });
    };

    // Get active items wrapping around the array cyclically to never show empty slots
    const getVisibleItems = () => {
        const items = [];
        for (let i = 0; i < 4; i++) {
            const targetIndex = (startIndex + i) % CLIENT_LOGOS.length;
            items.push(CLIENT_LOGOS[targetIndex]);
        }
        return items;
    };

    const carouselItems = getVisibleItems();

    return (
        <section
            id="clients"
            className="py-100 pb-20 bg-neutral-bg relative scroll-mt-20"
        >
            <div className="max-w-7xl mx-auto px-6 space-y-12">

                {/* Header Block */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-3xl space-y-4 text-left">
                        <div className="inline-flex items-center space-x-2 text-accent">
                            <span className="w-8 h-[1.5px] bg-accent" />
                            <span className="font-sans font-bold text-xs uppercase tracking-widest">
                                {CLIENT_SECTION_TEXT.badge}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl">
                            {CLIENT_SECTION_TEXT.title}
                        </h2>
                        <p className="lead-text mt-6">
                            {CLIENT_SECTION_TEXT.description}
                        </p>
                    </div>

                    {/* Slider Controls */}
                    <div className="flex items-center space-x-3 self-start md:self-end">
                        <button
                            onClick={handlePrev}
                            className="p-3 rounded-xl bg-[#f4f8fc] border border-black/10 text-primary hover:bg-neutral-bg hover:border-accent transition-all duration-200 cursor-pointer"
                            aria-label="Previous client slide"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="p-3 rounded-xl bg-primary text-white hover:bg-accent transition-all duration-200 shadow-md cursor-pointer"
                            aria-label="Next client slide"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Carousel Slider Cards Layout */}
                <div
                    className="relative overflow-hidden py-2"
                    id="interactive-client-slider"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {carouselItems.map((client, idx) => (
                            <div
                                key={`${client.id}-${idx}`}
                                className="group cursor-default rounded-2xl border border-[#d9e3ef] bg-[#f4f8fc] p-6 flex flex-col items-center justify-between space-y-5 transition-all duration-300 hover:bg-white hover:border-accent hover:-translate-y-1 hover:shadow-2xl"  >
                                {/* Logo Container */}
                                <div className="flex h-24 w-full items-center justify-center">
                                    <img
                                        src={client.logo}
                                        alt={client.name}
                                        className={`${client.logoClass} w-auto max-w-full object-contain select-none pointer-events-none transition-transform duration-300 group-hover:scale-105`}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                client.name
                                            )}&background=1E3A8A&color=fff&size=128&bold=true`;
                                        }}
                                        referrerPolicy="no-referrer"
                                    />
                                </div>

                                {/* Client Details */}
                                <div className="space-y-2 text-center">
                                    <h4 className="font-display text-base font-extrabold text-primary leading-tight line-clamp-2 transition-colors duration-300 group-hover:text-secondary">
                                        {client.label}
                                    </h4>

                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="text-accent">
                                            <ClientIndustryIcon industry={client.industry} className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-sans text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                                            {client.industry} {CLIENT_SECTION_TEXT.activeServiceSuffix}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}