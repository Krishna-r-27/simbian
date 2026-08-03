import {
    Server,
    ShieldCheck,
    Wrench,
    Users,
    Clock,
    Database,
    Cpu,
    Lock,
    FileText
} from "lucide-react";

import hero from "../assets/images/services_hero.png"

export const SERVICES_SECTION_TEXT = {
    badge: "MANAGED IT & SUPPORT",
    title: "Facility Management Services (FMS)",
    description: "Enterprise-grade, on-site IT support, system administration, and infrastructure management. We keep your technology stack operational, responsive, and secure."
};

export const FMS_HIGHLIGHTS = [
    {
        title: "In-House Maintenance",
        benefit: "Full hardware, OS, and front-end care.",
    },
    {
        title: "Resident Engineers",
        benefit: "Deployed on-site for immediate 365-day support.",
    },
    {
        title: "Call Record Software",
        benefit: "Advanced ticket tracking and turnaround monitoring.",
    },
    {
        title: "On-Site Spare Management",
        benefit: "Immediate hot-swaps to eliminate downtime.",
    },
    {
        title: "40+ Support Engineers",
        benefit: "Certified experts providing rapid response.",
    },
    {
        title: "SLA-Driven Performance",
        benefit: "High-integrity corporate escalation paths.",
    }
];



export const servicesHeroData = {
    badgeText: "MANAGED IT SERVICES & FMS PORTFOLIO",
    title: "Services",
    image: hero,
    description:
        "We provide full IT support and facility management to keep your business running smoothly. Our team handles everything from on-site engineers and network security to database management and hardware maintenance."
};

export const servicesCtaData = {
    badgeText: "READY TO OPTIMIZE YOUR IT SLA?",
    title: "Get a Customized FMS & Maintenance Proposal",
    description:
        "Connect with our system architects to discuss resident engineer deployment, custom hardware maintenance, database administration, or turnkey computer center setups.",
    buttonText: "Request Custom SLA Quote",
    buttonLink: "/contact-us"
};

export const maintenanceMatrixHeader = {
    badgeText: "Comprehensive Maintenance",
    title: "Maintenance Capabilities & Support Matrix",
    description:
        "We provide annual maintenance contracts (AMC) and on-demand support covering all key hardware, operating systems, database engines, application suites, and security infrastructure."
};

export const fmsFeatures = [
    {
        icon: Wrench,
        title: "In-House System Maintenance",
        description:
            "Full-lifecycle maintenance of hardware, operating systems, and core front-end enterprise applications."
    },
    {
        icon: Users,
        title: "Resident On-Site Engineers",
        description:
            "Dedicated resident engineers deployed directly at client sites for 365 work days according to company rules."
    },
    {
        icon: Clock,
        title: "Call Record Tracking Software",
        description:
            "Proprietary software logging Call No., Employee Name, Tel Ext, Call-In time, Engineer Attendance, and Resolution time."
    },
    {
        icon: ShieldCheck,
        title: "On-Site Spares Management",
        description:
            "Immediate standby spares and peripherals maintained at the client site to eliminate operational downtime."
    },
    {
        icon: Cpu,
        title: "40+ System Support Engineers",
        description:
            "A robust internal workforce of 40+ certified systems support engineers providing rapid response."
    }
];

export const maintenanceCategories = [
    {
        title: "Hardware & Infrastructure Maintenance",
        icon: Cpu,
        color: "from-blue-600 to-indigo-700",
        items: [
            "Computer Systems",
            "DVD Writers, Scanners, Printers, Plotters & Zip Drives",
            "UPS & Power Conditioning, Modems, Projectors",
            "Networking Components: HUB, Switches, Routers, etc."
        ]
    },
    {
        title: "Operating Systems & Network OS",
        icon: Server,
        color: "from-emerald-600 to-teal-700",
        items: [
            "Desktop OS: DOS, Win XP, Win VISTA, Win 7, Win 8, Win 10",
            "Linux Distributions: RedHat, Ubuntu & Suse",
            "Network OS: Novell Netware, Win NT, Win 2000, Win 2003, Win 2008",
            "VMware Servers, Web Server, SharePoint Server, ISA Server"
        ]
    },
    {
        title: "Security & Network Solutions",
        icon: Lock,
        color: "from-rose-600 to-red-700",
        items: [
            "Complete Wi-Fi Solution & Network Cabling",
            "CCTV Cameras & Video Conferencing",
            "Point to Point and Point to Multi Point Network and Link Solutions",
            "Access Control & Biometric Systems",
            "Building Management System (BMS)",
            "Public Address System & Fire System"
        ]
    },
    {
        title: "Applications, ERP & Software",
        icon: FileText,
        color: "from-purple-600 to-violet-700",
        items: [
            "MS Office 97 / 2000 / XP / 2003 / 2007 / 2010 / 2013 / 2016 onwards",
            "Exchange 2003 & Exchange 2007",
            "Anti-Virus, CorelDraw, Adobe Collection",
            "Tally Configure Single & Multi-User",
            "ERP Solution: SAP Installation, BASIS, ABAP Support",
            "SAP Client & Oracle Front End"
        ]
    },
    {
        title: "Database Server Management",
        icon: Database,
        color: "from-amber-600 to-orange-700",
        items: [
            "Oracle Enterprise Edition: 8i, 9i, 10g & 11g",
            "MS SQL Servers: SQL 2000, SQL 2005 & SQL 2008 onwards"
        ]
    }
];

export const turnkeyItems = [
    {
        title: "Computer Center Design & Planning",
        desc: "Complete layout design, electrification, furniture coordination, painting, and climate control supervision."
    },
    {
        title: "Local Area Network (LAN) Setup",
        desc: "Deployment using latest topologies, structured Fiber/Cat6 cabling, and high-speed switching."
    },
    {
        title: "System & Peripheral Commissioning",
        desc: "Turnkey installation, staging, and stress-testing of workstations, servers, and multi-function peripherals."
    },
    {
        title: "International Trading & Sourcing",
        desc: "Export/import trading across Middle East, Africa, and European regions, along with OEM technical know-how support."
    }
];