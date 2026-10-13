import server from "../assets/images/server.jpg";
import storage from "../assets/images/storage.jpg";
import dekstop from "../assets/images/dekstop.jpg";
import laptop from "../assets/images/laptop.png";
import printer from "../assets/images/printer.png";

export const PRODUCT_SECTION_TEXT = {
    badge: "AUTHORIZED HARDWARE PORTFOLIO",
    title: "Our Products",
    tierBadge: "Tier-1 Partner",
    viewAction: "View Products",
    drawerSubtitle: "Simbian Technical Specifications",
    drawerMeta: "Original OEM Spares & Warranty Supported",
    drawerSummaryTitle: "Executive Summary",
    drawerOfferingsTitle: "Systems Subcategories & Offerings",
    slaTitle: "SLA & Deployment Support",
    slaDescription:
        "All hardware deployments are supplied with official factory warranties. Turnkey installations include network configuration, software system loads, and local power testing overseen by our 40-engineer strong FMS team.",
    closeButton: "Close Specs",
    ctaPrefix: "Request Quote for ",
};

/** Marketing copy + images keyed by DB category slug. */
export const CATEGORY_MARKETING = {
    "desktop-computers": {
        description:
            "Enterprise workstations, HP & Dell corporate business desktops, and bespoke high-performance custom PCs designed for continuous uptime.",
        image: dekstop,
        items: [
            { name: "Business Desktops", description: "Energy efficient, secure, and expandable B2B systems." },
            { name: "High-End Workstations", description: "Intel Xeon & Core i9 workstations for CAD, 3D modeling, and GIS." },
            { name: "Custom PCs", description: "Optimized configurations tailored to engineering, dev-ops, and architecture." },
        ],
    },
    "business-laptops": {
        description:
            "Premium corporate laptops of various brands with robust security features, durable casings, and long battery life for corporate professionals.",
        image: laptop,
        items: [
            { name: "Executive Ultrabooks", description: "Ultra-thin, lightweight laptops with biometric login." },
            { name: "Business Workhorse Laptops", description: "HP ProBook/EliteBook and Lenovo ThinkPad certified systems." },
            { name: "Mobile Workstations", description: "Heavy-duty discrete graphics systems for complex processing on the go." },
        ],
    },
    "enterprise-servers": {
        description:
            "Rack-mount, tower, and blade servers optimized for high computational throughput, virtualization, database servers, and multi-tenant hosting.",
        image: server,
        items: [
            { name: "Tower Servers", description: "Expandable dual & quad CPU tower units for SMB database and storage." },
            { name: "Rack Servers", description: "1U, 2U, and 4U systems designed for enterprise high-density rack-mount arrays." },
            { name: "Blade & Storage Servers", description: "Modular SAN/NAS storage servers powered by Intel Xeon processing units." },
        ],
    },
    "storage-solutions": {
        description:
            "Network Attached Storage (NAS), Storage Area Networks (SAN), enterprise Solid State Drives (SSDs), and secure backup equipment to safeguard data.",
        image: storage,
        items: [
            { name: "SAN & NAS Systems", description: "High-capacity network storage arrays with real-time replication." },
            { name: "Solid State Arrays & SSDs", description: "Lightning-fast read/write arrays with intelligent controller caches." },
            { name: "Backup & Recovery Solutions", description: "Automated tape, cloud, and local backup systems with failover." },
        ],
    },
    "networking-equipment": {
        description:
            "Enterprise-grade switches, high-throughput routers, corporate wireless APs, secure network cabling, and robust point-to-point wireless links.",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
        items: [
            { name: "Managed Switches", description: "Layer 2/3 enterprise switches supporting high-density PoE and VLANs." },
            { name: "Enterprise Routers", description: "High-throughput edge routing solutions with hardware firewall integration." },
            { name: "Corporate Wireless", description: "Secure high-density Wi-Fi networks and point-to-point link systems." },
        ],
    },
    "printers-scanners": {
        description:
            "Laser, inkjet, and multi-function printers, workgroup flatbed scanners, high-resolution business monitors, and professional LCD/DLP projectors.",
        image: printer,
        items: [
            { name: "Multi-Function Printers (MFP)", description: "Enterprise-grade heavy duty print, copy, scan, and fax units." },
            { name: "High-Speed Document Scanners", description: "High-throughput page scanners with OCR automation compatibility." },
            { name: "Monitors & Projectors", description: "High-definition corporate displays and conference room DLP projection." },
        ],
    },
    "ups-power-backup": {
        description:
            "Uninterruptible Power Supplies (UPS) with high ratings, static stabilizers, and isolation transformers to prevent business interruption.",
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        items: [
            { name: "Enterprise UPS Systems", description: "Wide-range ratings UPS systems with intelligent battery managers." },
            { name: "Voltage Stabilizers", description: "Heavy-duty industrial static stabilizers for computer centers." },
            { name: "Isolation Transformers", description: "High attenuation shielding to eliminate power spikes and noise harmonics." },
        ],
    },
    "security-surveillance": {
        description:
            "Comprehensive Wi-Fi setups, CCTV dome/bullet cameras, biometric access control, fire systems, and building management system (BMS) integration.",
        image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
        items: [
            { name: "Biometric Access Control", description: "Time-attendance systems, facial/fingerprint scanners, and smart locks." },
            { name: "HD CCTV Systems", description: "IP-based high-definition surveillance cameras with automated AI tracking." },
            { name: "Building Management (BMS)", description: "Integrated smart monitoring, alarm systems, and environmental controllers." },
        ],
    },
};

const PLACEHOLDER_IMAGE =
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80";

export function getCategoryMarketing(slug) {
    return (
        CATEGORY_MARKETING[slug] || {
            description: "Enterprise IT hardware and solutions from Simbian Systems.",
            image: PLACEHOLDER_IMAGE,
            items: [],
        }
    );
}
