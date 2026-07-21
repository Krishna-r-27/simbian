// ../data/quoteModalData.js

export const MODAL_COPY = {
    header: {
        title: "B2B Procurement Request",
        subtitle: "Simbian Systems Enterprise Sales & Consultation",
        closeLabel: "Close modal"
    },
    fields: {
        fullName: {
            label: "Full Name *",
            placeholder: "e.g. Rajesh Shah"
        },
        company: {
            label: "Company / Organization *",
            placeholder: "e.g. Alembic Pharmaceuticals"
        },
        email: {
            label: "Business Email *",
            placeholder: "name@company.com"
        },
        phone: {
            label: "Phone Number *",
            placeholder: "e.g. +91 98250 XXXXX"
        },
        infrastructure: {
            label: "IT Infrastructure Need"
        },
        urgency: {
            label: "Project Urgency"
        },
        requirements: {
            label: "Detailed Requirements / Scope of Supply",
            placeholder: "Describe specific quantities, branding preferences (HP, Dell, Lenovo), or desired services..."
        }
    },
    success: {
        title: "Procurement Request Received",
        referenceLabel: "Reference:",
        etaLabel: "Response ETA:",
        etaCritical: "Within 1 Hour",
        etaStandard: "Within 4 Hours",
        btnReset: "Submit Another Request",
        btnHome: "Back to Homepage"
    },
    buttons: {
        cancel: "Cancel",
        submit: "Submit Procurement Request"
    }
};

export const INFRASTRUCTURE_OPTIONS = [
    { value: "desktops", label: "Desktop Computers & Workstations" },
    { value: "laptops", label: "Business Laptops / Notebooks" },
    { value: "servers", label: "Enterprise Servers (Rack/Tower)" },
    { value: "storage", label: "Storage Solutions (NAS & SAN)" },
    { value: "networking", label: "Networking Equipment & Cabling" },
    { value: "power", label: "UPS & Power Backup Conditioning" },
    { value: "security", label: "CCTV & Biometric Security Systems" },
    { value: "turnkey", label: "Turnkey IT / Facility Management Services" }
];

export const URGENCY_LEVELS = ["standard", "high", "critical"];

export const TRUST_BADGES = [
    { id: "secure", iconName: "Shield", description: "Secure, authorized corporate channels" },
    { id: "speed", iconName: "Clock", description: "Response from B2B engineer within 4 hours" },
    { id: "clients", iconName: "Users", description: "Trusted by 2,000+ corporate clients" }
];