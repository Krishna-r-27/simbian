import React, { useEffect } from "react";
import ContactHero from "../components/ContactHero";
import ContactSection from "../components/ContactSection";

export default function ContactPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <ContactHero />
            <ContactSection />
        </>
    );
}