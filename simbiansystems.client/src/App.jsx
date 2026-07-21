/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import UnderConstruction from "./components/UnderConstruction";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import QuoteModal from "./components/QuoteModal";

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
            <Routes>
                <Route
                    path="/"
                    element={
                        <Layout
                            handleOpenGeneralQuote={handleOpenGeneralQuote}
                        />
                    }
                >
                    <Route
                        index
                        element={
                            <Home
                                handleOpenQuoteWithCategory={handleOpenQuoteWithCategory}
                                handleOpenGeneralQuote={handleOpenGeneralQuote}
                            />
                        }
                    />
                    
                </Route>
                <Route path="/products" element={<UnderConstruction />} />
                <Route path="/solutions" element={<UnderConstruction />} />
                <Route path="/services" element={<UnderConstruction />} />
                <Route path="/about-us" element={<UnderConstruction />} />
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