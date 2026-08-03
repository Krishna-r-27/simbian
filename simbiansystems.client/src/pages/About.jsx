import React, { useEffect } from "react";
import AboutHero from "../components/AboutHero.jsx";
import CompanyOverviewSection from "../components/CompanyOverviewSection.jsx";
import SystemsProjectsSection from "../components/SystemsProjectionSection.jsx";
import RegisteredDealerSection from "../components/RegisteredDealer.jsx";

export default function AboutPage({ onBackHome }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const hpLogoUrl = "https://cdn.simpleicons.org/hp/FFFFFF";

    return (
        <div className="min-h-screen bg-white">
            {/* 1. Hero Section */}
            <AboutHero onBackHome={onBackHome} />

            {/* 2. Company Overview & Credentials */}
            <CompanyOverviewSection />

            {/* 3. Systems & Turnkey Projects */}
            <SystemsProjectsSection />

        </div>
    );
}