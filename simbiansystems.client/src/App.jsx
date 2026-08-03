/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import QuoteModal from "./components/QuoteModal";
import UnderConstruction from "./components/UnderConstruction";
import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ServicesPage from "./pages/Services";
import SolutionsPage from "./pages/Solutions";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";

export default function App() {
    const [quoteModalOpen, setQuoteModalOpen] = useState(false);
    const [selectedCategoryForQuote, setSelectedCategoryForQuote] = useState("");

    const handleOpenQuoteWithCategory = (categoryName) => {
        setSelectedCategoryForQuote(categoryName);
        setQuoteModalOpen(true);
    };

    const handleOpenGeneralQuote = () => {
        setSelectedCategoryForQuote("");
        setQuoteModalOpen(true);
    };

    return (
        <>
            <ScrollToTop />

            <Routes>
                <Route
                    path="/"
                    element={
                        <Layout
                            handleOpenGeneralQuote={handleOpenGeneralQuote}
                        />
                    }
                >
                    {/* Home */}
                    <Route
                        index
                        element={
                            <Home
                                handleOpenQuoteWithCategory={handleOpenQuoteWithCategory}
                                handleOpenGeneralQuote={handleOpenGeneralQuote}
                            />
                        }
                    />

                    {/* Products Base */}
                    <Route
                        path="products"
                        element={
                            <ProductsPage
                                onInquire={(product) =>
                                    handleOpenQuoteWithCategory(
                                        `Inquiry: ${product?.name || "Product Inquiry"}`
                                    )
                                }
                            />
                        }
                    />

                    {/* Product Details (canonical form, with /details/) */}
                    <Route
                        path="products/:categorySlug/details/:productId"
                        element={
                            <ProductDetailsPage
                                onInquire={(product) =>
                                    handleOpenQuoteWithCategory(
                                        `Inquiry: ${product?.name || "Product Inquiry"}`
                                    )
                                }
                            />
                        }
                    />

                    {/* Category + Brand routes (e.g. /products/laptops/dell) */}
                    <Route
                        path="products/:categorySlug/*"
                        element={
                            <ProductsPage
                                onInquire={(product) =>
                                    handleOpenQuoteWithCategory(
                                        `Inquiry: ${product?.name || "Product Inquiry"}`
                                    )
                                }
                            />
                        }
                    />

                    {/* Other Pages */}
                    <Route
                        path="services-portfolio"
                        element={<ServicesPage />}
                    />
                    <Route
                        path="solutions"
                        element={<SolutionsPage />}
                    />
                    <Route
                        path="about-us"
                        element={<AboutPage />}
                    />
                    <Route
                        path="contact-us"
                        element={<ContactPage />}
                    />
                </Route>

                <Route
                    path="/under-construction"
                    element={<UnderConstruction />}
                />
            </Routes>

            <QuoteModal
                isOpen={quoteModalOpen}
                onClose={() => setQuoteModalOpen(false)}
                initialCategory={selectedCategoryForQuote}
            />
        </>
    );
}