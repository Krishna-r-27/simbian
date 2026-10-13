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
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/poweradmin/Login";
import ForgotPassword from "./pages/poweradmin/ForgotPassword";
import ResetPassword from "./pages/poweradmin/ResetPassword";
import Dashboard from "./pages/poweradmin/Dashboard";
import ProductList from "./pages/poweradmin/products/ProductList";
import ProductForm from "./pages/poweradmin/products/ProductForm";
import SpecTemplates from "./pages/poweradmin/products/SpecTemplates";
import ProductQuotes from "./pages/poweradmin/products/ProductQuotes";
import EnquiryList from "./pages/poweradmin/enquiries/EnquiryList";
import Profile from "./pages/poweradmin/profile/Profile";
import ChangePassword from "./pages/poweradmin/profile/ChangePassword";
import SitemapPage from "./pages/SitemapPage";
import PageNotFound from "./pages/PageNotFound";


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
                    <Route path="products" element={<ProductsPage />} />

                    {/* Product detail: /products/:categorySlug/:productSlug */}
                    <Route
                        path="products/:categorySlug/:productSlug"
                        element={<ProductDetailsPage />}
                    />

                    {/* Category listing: /products/:categorySlug */}
                    <Route path="products/:categorySlug" element={<ProductsPage />} />

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
                <Route path="/poweradmin/login" element={<Login />} />
                <Route path="/poweradmin/forgot-password" element={<ForgotPassword />} />
                <Route path="/poweradmin/reset-password" element={<ResetPassword />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/poweradmin" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="products" element={<ProductList />} />
                        <Route path="products/new" element={<ProductForm />} />
                        <Route path="products/specs" element={<SpecTemplates />} />
                        <Route path="products/quotes" element={<ProductQuotes />} />
                        <Route path="products/:id/edit" element={<ProductForm />} />
                        <Route path="products/:id" element={<ProductForm />} />
                        <Route path="spec-templates" element={<SpecTemplates />} />
                        <Route path="product-quotes" element={<ProductQuotes />} />
                        <Route path="enquiries" element={<EnquiryList />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="change-password" element={<ChangePassword />} />
                    </Route>
                </Route>

                <Route path="*" element={<PageNotFound />} />

                <Route
                    path="sitemap"
                    element={
                        <SitemapPage
                            onRequestQuote={handleOpenGeneralQuote}
                        />
                    }
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