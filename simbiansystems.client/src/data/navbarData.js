// data.js

export const CONTACT_RIBBON = {
    phones: [
        { display: "+91 99784 40060", value: "+919978440060" },
        { display: "+91 98984 48590", value: "+919898448590" }
    ],
    email: { display: "info@simbiansystems.com", value: "mailto:info@simbiansystems.com" }
};

export const ACCESSIBILITY_LABELS = {
    logoHome: "Simbian Systems Home",
    toggleMenu: "Toggle menu",
    brandName: "Simbian Systems",
    brandAbbr: "S"
};

export const BUTTON_TEXT = {
    requestQuote: "Request a Quote",
    viewAllProducts: "View all product sections"
};

export const MAIN_NAV_ITEMS = [
    { id: "/", label: "Home", hasDropdown: false },
    { id: "/products", label: "Products", hasDropdown: true },
    { id: "/solutions", label: "Solutions", hasDropdown: false },
    { id: "/services-portfolio", label: "Services", hasDropdown: false },
    { id: "/about-us", label: "About Us", hasDropdown: false },
];

export const MEGA_MENU_HEADER = {
    title: "Enterprise Product Portfolio",
    subtitle: "Authorized Sales & Support for Tier-1 Brands"
};

// Category links are loaded from GET /api/public/categories at runtime.
