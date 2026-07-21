import React, { useEffect } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import Hero from "../components/Hero";
import BrandSlider from "../components/BrandSlider";
import ProductsSection from "../components/ProductsSection";
import SolutionsSection from "../components/SolutionsSection";
import AboutUsSection from "../components/AboutUsSection";
import ServicesSection from "../components/ServicesSection";
import ClientLogoGrid from "../components/ClientLogoGrid";
import ContactSection from "../components/ContactSection";

export default function Home({ handleOpenQuoteWithCategory, handleOpenGeneralQuote }) {
    const { handleScrollToSection } = useOutletContext();
    const location = useLocation();

    useEffect(() => {
        // Scroll to section if redirected from an external page
        if (location.state?.scrollTo) {
            setTimeout(() => {
                handleScrollToSection(location.state.scrollTo);
            }, 100);
        }
    }, [location, handleScrollToSection]);

    return (
        <>
            <div id="hero">
                <Hero
                    onExploreProducts={() => handleScrollToSection("products")}
                    onContactSales={() => handleScrollToSection("contact")}
                />
            </div>

            <BrandSlider />

            <div id="products">
                <ProductsSection onTriggerQuoteForCategory={handleOpenQuoteWithCategory} />
            </div>

            <div id="solutions">
                <SolutionsSection onTriggerQuote={handleOpenGeneralQuote} />
            </div>

            <div id="about">
                <AboutUsSection />
            </div>

            <div id="services">
                <ServicesSection />
            </div>

            <ClientLogoGrid />

            <div id="contact">
                <ContactSection />
            </div>
        </>
    );
}