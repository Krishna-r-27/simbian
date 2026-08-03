import { Monitor, Wrench, Network, Cpu, Globe2, ShieldCheck } from "lucide-react";

import hero from "../assets/images/solutions_hero.png"

export const SOLUTIONS_SECTION_TEXT = {
    badge: "ENTERPRISE SERVICES & INTEGRATIONS",
    title: "Comprehensive Turnkey IT Solutions",
    description: "From initial network architecture design to 24/7 on-site maintenance. We assemble complete technology ecosystems that guarantee business continuity.",
    primaryCta: "Talk to an Expert",
    secondaryCta: "View Architecture Details"
};



export const solutionsHeroData = {
    backButtonText: "Back to Main Site",
    image:hero,
    badgeText: "ENTERPRISE IT INFRASTRUCTURE & TURNKEY DEPLOYMENTS",
    title: "Solutions",
    description:
        "Turnkey solutions for information management, banking & educational infrastructure, global trading, and OEM technical support.",
};

export const turnkeyGlobalData = {
    badgeText: "TURNKEY & GLOBAL SERVICES",
    title: "Turnkey Information Management & Global Support",
    description:
        "Putting together sets of products and specialized services for banking, educational institutions, corporate computer centers, and international trading partners.",
    items: [
        {
            title: "Turnkey Information Management",
            desc: "Comprehensive integration of software, hardware, and networking solutions tailored to corporate data strategies.",
        },
        {
            title: "Global Supply Chain & Trading",
            desc: "Robust international supply channels serving diverse markets across Middle East, Africa, and Europe.",
        },
    ],
};

export const bankingEducationData = {
    badgeText: "SPECIALIZED INFRASTRUCTURE",
    title: "Banking & Educational Infrastructure Solutions",
    description:
        "Our solutions in banking have enjoyed tremendous market response, particularly within the co-operative banking sector. We also specialize in the education field, providing turnkey infrastructure setups:",
    footerText: "Customized for Co-operative Banks & Educational Institutions",
    cards: [
        {
            id: "design-planning",
            icon: Monitor,
            title: "Designing & Planning of Computer Center",
            content:
                "Complete layout design, electrification, furniture coordination, painting, and climate control supervision.",
            num: "01",
            highlight: "Computer Labs & Server Rooms",
        },
        {
            id: "supervising-coordinating",
            icon: Wrench,
            title: "Supervising & Coordinating Infrastructure Work",
            content:
                "Supervising, assisting, and coordinating with multiple vendor agencies (furniture, painting, electrification, cabling) for seamless execution.",
            num: "02",
            highlight: "Turnkey Site Supervision",
        },
        {
            id: "setting-up-lan",
            icon: Network,
            title: "Local Area Network Setup",
            content:
                "Deployment using modern network topologies, structured Fiber/Cat6 cabling, and high-speed enterprise switching.",
            num: "03",
            highlight: "High-Speed Campus LAN",
        },
        {
            id: "installation-systems",
            icon: Cpu,
            title: "Installation of Systems & Peripherals",
            content:
                "Turnkey installation, staging, and stress-testing of workstations, servers, and multi-function peripherals.",
            num: "04",
            highlight: "Hardware Deployment & Staging",
        },
    ],
};

export const globalTradingData = {
    badgeText: "GLOBAL TRADING & OEM SUPPORT",
    title: "Global Trading & Technical Support",
    description:
        "Extending our reach beyond national borders through global supply networks, OEM coordination, and international trading channels:",
    cards: [
        {
            id: "international-trading",
            icon: Globe2,
            title: "International Trading",
            content:
                "International trading channels serving clients across Middle East, Africa, and European regions.",
            tag: "Global Supply Reach",
            regions: ["Middle East", "Africa", "European Countries"],
        },
        {
            id: "oem-sourcing",
            icon: ShieldCheck,
            title: "OEM Sourcing Support",
            content:
                "Sourcing support and coordination for Indian OEMs in technical know-how, sub-systems, and electronics components.",
            tag: "OEM Technical Support",
            regions: ["Indian OEMs", "Sub-Systems", "Electronics Components"],
        },
    ],
};