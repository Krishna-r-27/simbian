import React from "react";
import { ArrowRight } from "lucide-react";
import { SOLUTIONS_SECTION_TEXT } from "../data/solutionsData";
import { Link } from "react-router-dom";

export default function SolutionsSection({ onTriggerQuote, onNavigate }) {
    return (
        <section
            id="solutions"
            className="py-100 bg-white border-b border-border-light relative"
        >
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center space-x-2 text-accent">
                        <span className="w-8 h-[1.5px] bg-accent" />
                        <span className="font-sans font-extrabold text-xs uppercase tracking-widest">
                            {SOLUTIONS_SECTION_TEXT.badge}
                        </span>
                       
                    </div>
                    <h2 className="text-3xl md:text-4xl mb-5">
                        {SOLUTIONS_SECTION_TEXT.title}
                    </h2>
                    <p className="lead-text text-md max-w-2xl mx-auto">
                        {SOLUTIONS_SECTION_TEXT.description}
                    </p>

                    {/* Centered Dual CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        {/* Link to Contact Us Page */}
                        <Link
                            to="/contact-us"
                            className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-accent text-white font-sans font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg cursor-pointer"
                            id="solutions-blueprint-btn"
                        >
                            <span>{SOLUTIONS_SECTION_TEXT.primaryCta}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        {/* Link to Solutions Page */}
                        <Link
                            to="/solutions"
                            className="w-full sm:w-auto px-8 py-3.5 bg-white border border-primary/20 text-primary hover:bg-primary/5 font-sans font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                            id="solutions-architecture-btn"
                        >
                            <span>{SOLUTIONS_SECTION_TEXT.secondaryCta}</span>
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}