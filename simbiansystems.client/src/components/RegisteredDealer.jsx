import React, { useState } from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { registeredDealerData } from "../data/aboutData";

export default function RegisteredDealerSection({ hpLogoUrl }) {
    const [imgError, setImgError] = useState(false);

    return (
        <section className="py-16 sm:py-20 border-b border-border-light/60 relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Main Card */}
                <div className="relative rounded-2xl bg-primary text-white p-8 sm:p-12 border border-white/10 shadow-xl overflow-hidden group">

                    {/* Ambient Glow Accent */}
                    <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">

                        {/* Left Column */}
                        <div className="lg:col-span-8 space-y-5">
                            <div className="inline-flex items-center space-x-2 text-[#2BA84A]">
                                <span className="w-8 h-[1.5px] bg-[#2BA84A]" />
                                <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#2BA84A]">
                                    {registeredDealerData.badgeText}
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight !text-white/90 leading-tight">
                                {registeredDealerData.title}
                            </h2>

                            <p className="font-sans text-sm sm:text-base text-white/80 leading-relaxed font-normal max-w-2xl">
                                {registeredDealerData.description}
                            </p>

                            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {registeredDealerData.hardwareOfferings.map((item, index) => (
                                    <div
                                        key={index}
                                        className="inline-flex items-center justify-start space-x-2.5 text-xs font-medium text-white bg-white/10 hover:bg-white/15 px-3.5 py-2.5 rounded-lg border border-white/15 transition-colors w-full"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2BA84A] shrink-0" />
                                        <span className="truncate">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-4 flex justify-start lg:justify-end">
                            <div className="w-full lg:w-auto flex items-center space-x-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 shadow-md group-hover:border-[#2BA84A]/40 transition-all duration-300">

                                <div className="w-14 h-14 rounded-xl bg-[#007DB8] p-2 flex items-center justify-center shrink-0 shadow-sm border border-white/20">
                                    {hpLogoUrl && !imgError ? (
                                        <img
                                            src={hpLogoUrl}
                                            alt="HP Logo"
                                            className="w-10 h-10 object-contain select-none pointer-events-none"
                                            onError={() => setImgError(true)}
                                        />
                                    ) : (
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="w-10 h-10 fill-white"
                                        >
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2.4 17.5L8 17.5l2.4-11h1.6l-2.4 11zm5.2 0h-1.6l1.2-5.5h1.8c1.3 0 2.2-.7 2.5-2 .3-1.3-.3-2.5-1.6-2.5h-3.1l-2 9zm2.7-8.8c.4 0 .7.3.6.8-.2.6-.7 1-1.2 1h-1l.8-3.8h1c.4 0 .7.3.8.8z" />
                                        </svg>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center space-x-1.5">
                                        <ShieldCheck className="w-4 h-4 text-[#2BA84A] shrink-0" />
                                        <span className="font-sans font-bold text-xs uppercase tracking-wider text-white">
                                            {registeredDealerData.partnerTitle}
                                        </span>
                                    </div>
                                    <p className="font-sans text-xs text-white/70 font-normal leading-snug">
                                        {registeredDealerData.partnerSubtitle}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}