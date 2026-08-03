import React, { useEffect } from "react";
import SolutionsHero from "../components/SolutionsHero";
import TurnkeyManagementSection from "../components/TurnkeyManagementSection";
import BankingEducationSection from "../components/BankingEducationSection";
import GlobalTradingSection from "../components/GlobalTradingSection";
import SolutionsCTA from "../components/SolutionsCta";

export default function SolutionsPage({ onBackHome, onRequestQuote }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            {/* 1. Hero Section */}
            <SolutionsHero onBackHome={onBackHome} />

            {/* 2. Section 1: Turnkey Information Management Solutions */}
            <TurnkeyManagementSection />

            {/* 3. Section 2: Banking & Educational Infrastructure Solutions */}
            <BankingEducationSection />

            {/* 4. Section 3: Global Trading & Technical Support */}

            {/* 5. Section 4: Call to Action Banner */}
            <SolutionsCTA
                onRequestQuote={onRequestQuote}
                onBackHome={onBackHome}
            />
        </div>
    );
}
