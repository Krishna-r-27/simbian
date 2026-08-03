import React from "react";
import { companyOverviewData } from "../data/aboutData";

export default function CompanyOverviewSection() {
    return (
        <section className="py-16 lg:py-16 sm:py-20 bg-white border-b border-border-light/60 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

                    {/* Change lg:col-span-7 to lg:col-span-12 */}
                    <div className="lg:col-span-12 w-full space-y-6">
                        <div className="space-y-3">
                            <div className="inline-flex items-center space-x-2 text-accent">
                                <span className="w-8 h-[2px] bg-accent" />
                                <span className="font-sans font-extrabold text-xs uppercase tracking-widest text-accent">
                                    {companyOverviewData.badgeText}
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-4xl text-primary leading-tight">
                                {companyOverviewData.title}
                            </h2>
                        </div>

                        {/* Removed max-w-prose */}
                        <div className="text-base sm:text-lg leading-relaxed lead-text space-y-4 w-full">
                            {companyOverviewData.paragraphs.map((pText, idx) => (
                                <p key={idx}>{pText}</p>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}