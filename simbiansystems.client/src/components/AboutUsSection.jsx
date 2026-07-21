import React from "react";
import enterpriseServerRack from "/src/assets/images/enterprise_server_rack_1784269262214.jpg";
import { ABOUT_SECTION_TEXT } from "../data/aboutData";

export default function AboutUsSection() {
    return (
        <section
            id="about"
            className="py-24 bg-neutral-bg relative overflow-hidden"
        >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* Text Column */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center space-x-2 text-accent justify-start">
                                <span className="w-8 h-[1.5px] bg-accent" />
                                <span className="font-sans font-extrabold text-xs uppercase tracking-widest">
                                    {ABOUT_SECTION_TEXT.badge}
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-4xl mb-5">
                                {ABOUT_SECTION_TEXT.title}
                            </h2>

                            <p className="lead-text leading-relaxed">
                                {ABOUT_SECTION_TEXT.paragraph1}
                            </p>
                            <p className="lead-text leading-relaxed">
                                {ABOUT_SECTION_TEXT.paragraph2}
                            </p>
                        </div>

                    </div>

                    {/* Image Column */}
                    <div className="lg:col-span-5">
                        <div className="relative group">
                            {/* Outer decorative border block */}
                            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-accent to-primary opacity-20 blur-lg group-hover:opacity-30 transition-opacity duration-500" />

                            {/* Main Image frame */}
                            <div className="relative rounded-2xl overflow-hidden border-2 border-white shadow-2xl bg-white aspect-[4/3]">
                                <img
                                    src={enterpriseServerRack}
                                    alt={ABOUT_SECTION_TEXT.imgAlt}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 ease-in-out will-change-transform group-hover:scale-110"
                                />
                            </div>

                            {/* Decorative small overlay badge */}
                            <div className="absolute -bottom-4 -left-4 bg-primary text-white p-4 rounded-xl shadow-xl flex items-center space-x-3 border border-white/10 hidden sm:flex">
                                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center font-display font-black text-sm">
                                    {ABOUT_SECTION_TEXT.overlayLogo}
                                </div>
                                <div>
                                    <p className="font-sans font-bold text-sm">
                                        {ABOUT_SECTION_TEXT.overlayTitle}
                                    </p>
                                    <p className="font-sans text-sm text-white/70 mt-1">
                                        {ABOUT_SECTION_TEXT.overlaySubtitle}
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