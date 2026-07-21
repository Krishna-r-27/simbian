import React from "react";
import { BRAND_LOGOS } from "../data";
import { ShieldCheck, Award } from "lucide-react";

export default function BrandSlider() {
    const brand = BRAND_LOGOS[0] || { name: "HP", url: "https://cdn.simpleicons.org/hp/FFFFFF" };
    // Let's use a nice white version or standard branding. Let's make sure it renders beautifully on the blue/dark background
    const logoUrl = "https://cdn.simpleicons.org/hp/FFFFFF";

    return (
        <section
            id="brand-slider"
            className="bg-white py-100 relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-6">
                {/* Ribbon Container */}
                <div className="relative rounded-2xl bg-gradient-to-r from-primary via-primary/95 to-[#1a365d] text-white p-8 md:p-10 shadow-xl border border-white/10 overflow-hidden group hover:shadow-2xl transition-all duration-500">

                    {/* Subtle light glow elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-accent/15 transition-colors duration-500" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -ml-32 -mb-32 pointer-events-none" />

                    {/* Top-Left Tagline */}
                    <div className="absolute top-4 left-6 flex items-center space-x-1.5 opacity-80">
                        <Award className="w-3.5 h-3.5 text-accent" />
                        <span className="font-sans text-[10px] font-black uppercase tracking-widest text-white/90">
                            HP AUTHORIZED PARTNER
                        </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">

                        {/* Left/Middle Content Column (Title & Description) */}
                        <div className="lg:col-span-8 space-y-3">
                            <h2 style={{ color: "#ffffff" }} className="font-sans text-2xl font-black tracking-tight text-white">
                                Authorized HP Sales & Service Partner
                            </h2>

                            <p className="font-sans lead-text text-white/100 leading-relaxed font-medium max-w-3xl" style={{ color: "#fff" }} >
                                Authorized supply and deployment of HP enterprise desktops, workstations, servers, storage, and printing solutions.
                            </p>
                        </div>

                        {/* Right Brand Badge Column */}
                        <div className="lg:col-span-4 flex justify-start lg:justify-end">
                            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 shadow-inner group-hover:border-white/25 transition-all duration-300">

                                {/* Brand Logo Container with soft glow */}
                                <div className="w-14 h-14 rounded-full bg-white/10 p-2.5 flex items-center justify-center shrink-0 shadow-md group-hover:shadow-accent/20 group-hover:bg-white/15 transition-all duration-300">
                                    <img
                                        src={logoUrl}
                                        alt="HP Logo"
                                        className="w-9 h-9 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] select-none pointer-events-none"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>

                                {/* Badge details */}
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-1.5">
                                        <ShieldCheck className="w-4 h-4 text-accent" />
                                        <span className="font-sans font-bold text-xs uppercase tracking-wider text-accent">
                                            Certified HP Partner
                                        </span>
                                    </div>
                                    <p className="font-sans text-xs text-white/80 leading-tight">
                                        Authorized Sales & SLA Service
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
