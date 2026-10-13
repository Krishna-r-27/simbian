import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <HelmetProvider>
            <BrowserRouter basename="/">
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <App />
                        <Toaster position="top-right" />
                    </AuthProvider>
                </QueryClientProvider>
            </BrowserRouter>
        </HelmetProvider>
    </StrictMode>
);