import React from "react";
import ServicesHero from "../components/ServicesHero";
import MaintenanceMatrixSection from "../components/MaintenanceMatrixSection.jsx";
import TurnkeyGlobalSection from "../components/TurnkeyGlobalSection.jsx";
import ServicesCtaSection from "../components/ServicesCtaSection.jsx";
import ServicesSection from "../components/ServicesSection";
import { maintenanceCategories, turnkeyItems } from "../data/servicesData";

export default function ServicesPage({ onBackHome, onRequestQuote }) {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            {/* 1. Hero Banner */}
            <ServicesHero onBackHome={onBackHome} />

            {/* 2. Facility Management System (FMS) Deep-Dive */}
            <ServicesSection />

            {/* 3. Detailed Maintenance Scope Matrix */}
            <MaintenanceMatrixSection maintenanceCategories={maintenanceCategories} />

            {/* 5. Call To Action Banner */}
            <ServicesCtaSection onRequestQuote={onRequestQuote} onBackHome={onBackHome} />
        </div>
    );
}