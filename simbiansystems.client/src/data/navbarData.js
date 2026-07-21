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
    { id: "/about-us", label: "About Us", hasDropdown: false }
];

export const MEGA_MENU_HEADER = {
    title: "Enterprise Product Portfolio",
    subtitle: "Authorized Sales & Support for Tier-1 Brands"
};

export const MEGA_MENU_CATEGORIES = [
    {
        title: "Computing & Workspace",
        icon: "Laptop",
        items: [
            { name: "Laptops & Desktops", desc: "Commercial workstations & ultrabooks", href: "#products-computing" },
            { name: "Monitors & Displays", desc: "4K, ultra-wide, and ergonomic setups", href: "#products-displays" },
            { name: "Workstation Accessories", desc: "Docking stations, keyboards & mice", href: "#products-accessories" }
        ]
    },
    {
        title: "Enterprise Infrastructure",
        icon: "Server",
        items: [
            { name: "Rack & Tower Servers", desc: "High-performance data center processing", href: "#products-servers" },
            { name: "NAS & SAN Storage", desc: "Scalable enterprise backup arrays", href: "#products-storage" },
            { name: "Network Switches", desc: "Managed L2/L3 structural switches", href: "#products-networking" }
        ]
    },
    {
        title: "Power & Security",
        icon: "Shield",
        items: [
            { name: "Smart UPS Systems", desc: "Uninterrupted backup power & regulation", href: "#products-ups" },
            { name: "Firewalls & Gateways", desc: "Next-gen threat protection hardware", href: "#products-security" },
            { name: "Surveillance Systems", desc: "IP cameras & network video recorders", href: "#products-surveillance" }
        ]
    }
];