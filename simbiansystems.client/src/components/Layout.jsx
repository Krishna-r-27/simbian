import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ handleOpenGeneralQuote }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleScrollToSection = (sectionId) => {
        // If already on the Home page, scroll directly
        if (location.pathname === "/") {
            const element = document.getElementById(sectionId);

            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }

            return;
        }

        // If on another page, go Home first and then scroll
        navigate("/", {
            state: {
                scrollTo: sectionId,
            },
        });
    };

    const handleNavigation = (target) => {
        if (!target) return;

        if (target === "/" || target === "/home" || target === "/hero") {
            navigate("/");
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
            return;
        }

        const cleanPath = target.startsWith("/")
            ? target
            : `/${target}`;

        navigate(cleanPath);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar
                activeSection={location.pathname}
                onNavigate={handleScrollToSection}
                onRequestQuote={handleOpenGeneralQuote}
            />

            <main className="flex-grow pt-20">
                <Outlet
                    context={{
                        handleScrollToSection,
                    }}
                />
            </main>

            <Footer
                onNavigate={handleScrollToSection}
                onRequestQuote={handleOpenGeneralQuote}
            />
        </div>
    );
}