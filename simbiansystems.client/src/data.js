import server from "./assets/images/server.jpg";
import storage from "./assets/images/storage.jpg";
import dekstop from "./assets/images/dekstop.png";
import laptop from "./assets/images/laptop.png";
import printer from "./assets/images/printer.png";
import bccp from "./assets/images/bccp.png"
import fern from "./assets/images/fern.png"
import sndt from "./assets/images/sndt.png"
import cogent from "./assets/images/cogent.png"
import sabic from "./assets/images/sabic.png"
import parul from "./assets/images/parul.png"
import nbank from "./assets/images/n-bank.png"
import kemrock from "./assets/images/kemrock.png"

export const BRAND_LOGOS = [
  { name: "HP", url: "https://cdn.simpleicons.org/hp/0096D6" },
  { name: "Dell", url: "https://cdn.simpleicons.org/dell/007DBA" },
  { name: "Lenovo", url: "https://cdn.simpleicons.org/lenovo/E22630" },
  { name: "Cisco", url: "https://cdn.simpleicons.org/cisco/1BA0D7" },
  { name: "ASUS", url: "https://cdn.simpleicons.org/asus/00539B" },
  { name: "Intel", url: "https://cdn.simpleicons.org/intel/0071C5" },
  { name: "Microsoft", url: "https://cdn.simpleicons.org/microsoft/F25022" },
  { name: "APC", url: "https://cdn.simpleicons.org/schneiderelectric/3D9E35" },
  { name: "D-Link", url: "https://cdn.simpleicons.org/dlink/005B94" },
];


const logoFromDomain = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
const initialsFallback = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E3A8A&color=fff&size=128&bold=true`;

export const CLIENT_LOGOS = [
    {
        id: "1",
        name: "Panasonic Battery",
        industry: "Manufacturing",
        label: "Panasonic Battery India Company Ltd.",
        logo: logoFromDomain("panasonic.com"),
        logoClass: "h-20",
    },
    {
        id: "2",
        name: "Alembic Pharma",
        industry: "Healthcare",
        label: "Alembic Pharmaceuticals Ltd.",
        logo: logoFromDomain("alembicpharmaceuticals.com"),
        logoClass: "h-20",
    },
    {
        id: "3",
        name: "SABIC",
        industry: "Research & Tech",
        label: "SABIC Research & Technology Pvt. Ltd.",
        logo: sabic,
        logoClass: "h-20",
    },
    {
        id: "4",
        name: "PAUSHAK",
        industry: "Manufacturing",
        label: "PAUSHAK Ltd.",
        logo: logoFromDomain("alembicpharmaceuticals.com"),
        logoClass: "h-20",
    },
    {
        id: "5",
        name: "Parul University",
        industry: "Education",
        label: "Parul University",
        logo: parul,
        logoClass: "h-20",
    },
    {
        id: "6",
        name: "Sumandeep University",
        industry: "Education",
        label: "Sumandeep Vidyapeeth University",
        logo: logoFromDomain("sumandeepvidyapeethdu.edu.in"),
        logoClass: "h-20",
    },
    {
        id: "7",
        name: "Navrachna University",
        industry: "Education",
        label: "Navrachna University Vadodara",
        logo: logoFromDomain("nuv.ac.in"),
        logoClass: "h-20",
    },
    {
        id: "8",
        name: "Grand Mercure",
        industry: "Hospitality",
        label: "Grand MERCURE Vadodara Surya Palace",
        logo: logoFromDomain("suryapalace.com"),
        logoClass: "h-20",
    },
    {
        id: "9",
        name: "Sayaji",
        industry: "Hospitality",
        label: "Hotel Sayaji Vadodara",
        logo: logoFromDomain("sayajihotels.com"),
        logoClass: "h-20",
    },
    {
        id: "10",
        name: "The Fern",
        industry: "Hospitality",
        label: "The Fern Residency Vadodara",
        logo: fern,
        logoClass: "h-20",
    },
    {
        id: "11",
        name: "VCCI",
        industry: "Corporate",
        label: "Vadodara Chamber of Commerce & Industries",
        logo: logoFromDomain("vccivadodara.org"),
        logoClass: "h-20",
    },
    {
        id: "12",
        name: "Alembic Vidhyalaya",
        industry: "Education",
        label: "Alembic Vidhyalya",
        logo: logoFromDomain("alembicvidyalaya.org"),
        logoClass: "h-20",
    },
    {
        id: "13",
        name: "Baroda City Bank",
        industry: "Banking",
        label: "Baroda City Co-op. Bank Ltd.",
        logo: bccp,
        logoClass: "h-20",
    },
    {
        id: "14",
        name: "Nadiad People's Bank",
        industry: "Banking",
        label: "Nadiad People’s Co-op. Bank Ltd.",
        // No active official website found for this bank — using a generated badge instead.
        logo: nbank,
        logoClass: "h-20",
    },
    {
        id: "15",
        name: "Navrachna International",
        industry: "Education",
        label: "Navrachna International School Bhaili",
        logo: logoFromDomain("nisvcbse.in"),
        logoClass: "h-30",
    },
    {
        id: "16",
        name: "SNDT",
        industry: "Education",
        label: "SNDT College Vadodara",
        logo: sndt,
        logoClass: "h-30",
    },
    {
        id: "17",
        name: "Alembic Real Estate",
        industry: "Real Estate",
        label: "Alembic Real Estate Vadodara",
        logo: logoFromDomain("alembicpharmaceuticals.com"),
        logoClass: "h-30",
    },
    {
        id: "18",
        name: "Cogent",
        industry: "Corporate",
        label: "Cogent E Services Private Limited",
        logo: cogent,
        logoClass: "h-30",
    },
    {
        id: "19",
        name: "Kemrock",
        industry: "Manufacturing",
        label: "Kemrock Industries & Exports Ltd.",
        // Acquired by Reliance Industries in 2017; no active standalone website remains.
        logo: kemrock,
        logoClass: "h-30",
    },
];

export const CLIENT_LOGOSS = [
  { id: "1", name: "Panasonic Battery", industry: "Manufacturing", label: "Panasonic Battery India Company Ltd." },
  { id: "2", name: "Alembic Pharma", industry: "Healthcare", label: "Alembic Pharmaceuticals Ltd." },
  { id: "3", name: "Alembic Glass", industry: "Manufacturing", label: "Alembic Glass Industries Ltd." },
  { id: "4", name: "SABIC Research", industry: "Research & Tech", label: "SABIC Research & Technology Pvt. Ltd." },
  { id: "5", name: "PAUSHAK", industry: "Manufacturing", label: "PAUSHAK’ Ltd." },
  { id: "6", name: "Nirayu", industry: "Manufacturing", label: "Nirayu Pvt. Ltd." },
  { id: "7", name: "Aleor Dermaceuticals", industry: "Healthcare", label: "Aleor Dermaceuticals Ltd." },
  { id: "8", name: "Shreno", industry: "Manufacturing", label: "Shreno Ltd." },
  { id: "9", name: "Zenith Tins", industry: "Manufacturing", label: "Zenith Tins Ltd." },
  { id: "10", name: "Parul University", industry: "Education", label: "Parul University" },
  { id: "11", name: "Sumandeep University", industry: "Education", label: "Sumandeep Vidyapeeth University" },
  { id: "12", name: "Navrachna University", industry: "Education", label: "Navrachna University Vadodara" },
  { id: "13", name: "Grand MERCURE", industry: "Hospitality", label: "Grand MERCURE Vadodara Surya Palace" },
  { id: "14", name: "Hotel Sayaji", industry: "Hospitality", label: "Hotel Sayaji Vadodara" },
  { id: "15", name: "Fern Residency", industry: "Hospitality", label: "The Fern Residency Vadodara" },
  { id: "16", name: "Jewel Brushes", industry: "Manufacturing", label: "Jewel Brushes Pvt. Ltd." },
  { id: "17", name: "Amigo Brushes", industry: "Manufacturing", label: "Amigo Brushes Pvt. Ltd." },
  { id: "18", name: "Unident Brushes", industry: "Manufacturing", label: "Unident Brushes Ltd." },
  { id: "19", name: "VCCI", industry: "Corporate", label: "Vadodara Chamber of Commerce & Industries" },
  { id: "20", name: "Gibraltar Glass", industry: "Manufacturing", label: "Gibraltar Glass & Ceramics Ltd." },
  { id: "21", name: "Prime Ceramics", industry: "Manufacturing", label: "Prime Ceramics" },
  { id: "22", name: "Alavi Co-op Bank", industry: "Banking", label: "Alavi Co-op. Bank Ltd. HO + 2" },
  { id: "23", name: "Unnati Co-op Bank", industry: "Banking", label: "Unnati Co-op. Bank Ltd." },
  { id: "24", name: "Makarpura Ind. Estate", industry: "Banking", label: "Makarpura Ind. Estate Co-op. Ltd. HO + 2" },
  { id: "25", name: "Baroda City Co-op", industry: "Banking", label: "Baroda City Co-op. Bank Ltd. HO + 9" },
  { id: "26", name: "Nadiad People's Bank", industry: "Banking", label: "Nadiad People’s Co-op. Bank Ltd." },
  { id: "27", name: "Shree Bharat Bank", industry: "Banking", label: "Shree Bharat Co-op. Bank Ltd. HO + 2" },
  { id: "28", name: "Baroda Central Bank", industry: "Banking", label: "Baroda Central Co-op. Bank Ltd. HO + 12" },
  { id: "29", name: "Bharuch Dist Bank", industry: "Banking", label: "Bharuch Dist. Co-op. Bank Ltd. HO + 7" },
  { id: "30", name: "Sulemani Co-op Bank", industry: "Banking", label: "Sulemani Co-op. Bank Ltd. HO + 2" },
  { id: "31", name: "Islamic Study Centre", industry: "Education", label: "Islamic Study Centre" },
  { id: "32", name: "Zenith High School", industry: "Education", label: "Zenith High School" },
  { id: "33", name: "St. Joseph School", industry: "Education", label: "St. Joseph High School" },
  { id: "34", name: "Shantiniketan Computers", industry: "Corporate", label: "Shantiniketan Computers Bharuch" },
  { id: "35", name: "St. Xavier Surat", industry: "Education", label: "St. Xavier High School Surat" },
  { id: "36", name: "Amity School Bharuch", industry: "Education", label: "Amity High School Bharuch" },
  { id: "37", name: "Alembic Vidhyalya", industry: "Education", label: "Alembic Vidhyalya" },
  { id: "38", name: "Utkarsh Vidhyalya", industry: "Education", label: "Utkarsh Vidhyalya" },
  { id: "39", name: "Diamond Silencers", industry: "Manufacturing", label: "Diamond Silencers" },
  { id: "40", name: "Mascon Multiservice", industry: "Corporate", label: "Mascon Multiservice Pvt. Ltd." },
  { id: "41", name: "Jindal Agro", industry: "Manufacturing", label: "Jindal Agro Processing Pvt. Ltd." },
  { id: "42", name: "Jewel Consumer Care", industry: "Manufacturing", label: "Jewal Consumer Care Pvt. Ltd." },
  { id: "43", name: "Mahila Co-op Bank", industry: "Banking", label: "Mahila Co-op. Bank Ltd. Bharuch" },
  { id: "44", name: "Navrachna Intl School", industry: "Education", label: "Navrachna International School Bhaili" },
  { id: "45", name: "Hanifa School", industry: "Education", label: "Hanifa School Borsad" },
  { id: "46", name: "Adarsh School Napa", industry: "Education", label: "Adarsh School Napa" },
  { id: "47", name: "SNDT College", industry: "Education", label: "SNDT Colege (Woman Girls Colege) Vadodara" },
  { id: "48", name: "Jaydeep Auto", industry: "Manufacturing", label: "Jaydeep Auto Vadodara" },
  { id: "49", name: "Hotel Aditi", industry: "Hospitality", label: "Hotel Aditi Vadodara" },
  { id: "50", name: "Hotel Apex", industry: "Hospitality", label: "Hotel Apex International Vadodara" },
  { id: "51", name: "Shri Sad Vidya Mandal", industry: "Education", label: "Shri Sad Vidya Mandal Institute of Technology Bharuch" },
  { id: "52", name: "Bit 01 Consultants", industry: "Corporate", label: "Bit 01 Consultants Ahmadabad" },
  { id: "53", name: "Alembic Real Estate", industry: "Real Estate", label: "Alembic Real Estate Vadodara" },
  { id: "54", name: "Cogent E Services", industry: "Corporate", label: "Cogent E Services Private Limited Noida – U.P." },
  { id: "55", name: "Jamia Islamia", industry: "Education", label: "Jamia Islamia Isha’Atul Uloom Akkalkuwa M.H." },
  { id: "56", name: "Global Gourmet", industry: "Manufacturing", label: "Global Gourmet Pvt. Ltd. Jambusar" },
  { id: "57", name: "Rajbai Premjibhai", industry: "Education", label: "Rajbai Premjibhai Bhavani Vidya Mandir Surat" },
  { id: "58", name: "Aakar Hotel", industry: "Hospitality", label: "Aakar Hotel Pvt. Ltd. Saputara" },
  { id: "59", name: "Kemrock Industries", industry: "Manufacturing", label: "Kemrock Industries and Exports Limited Asoj - Vadodara" },
  { id: "60", name: "S. Dave Group", industry: "Corporate", label: "S. Dave Group of Companies" },
];

export const PRODUCT_CATEGORIES = [
  {
    id: "desktops",
    name: "Desktop Computers",
    description: "Enterprise workstations, HP & Dell corporate business desktops, and bespoke high-performance custom PCs designed for continuous uptime.",
        iconName: "Monitor",
        image: dekstop,
    items: [
      { name: "Business Desktops", description: "Energy efficient, secure, and expandable B2B systems." },
      { name: "High-End Workstations", description: "Intel Xeon & Core i9 workstations for CAD, 3D modeling, and GIS." },
      { name: "Custom PCs", description: "Optimized configurations tailored to engineering, dev-ops, and architecture." },
    ],
  },
  {
    id: "laptops",
    name: "Business Laptops",
    description: "Premium corporate laptops of various brands with robust security features, durable casings, and long battery life for corporate professionals.",
    iconName: "Laptop",
    image: laptop,
    items: [
      { name: "Executive Ultrabooks", description: "Ultra-thin, lightweight laptops with biometric login." },
      { name: "Business Workhorse Laptops", description: "HP ProBook/EliteBook and Lenovo ThinkPad certified systems." },
      { name: "Mobile Workstations", description: "Heavy-duty discrete graphics systems for complex processing on the go." },
    ],
  },
  {
    id: "servers",
    name: "Enterprise Servers",
    description: "Rack-mount, tower, and blade servers optimized for high computational throughput, virtualization, database servers, and multi-tenant hosting.",
    iconName: "Server",
    image: server,
    items: [
      { name: "Tower Servers", description: "Expandable dual & quad CPU tower units for SMB database and storage." },
      { name: "Rack Servers", description: "1U, 2U, and 4U systems designed for enterprise high-density rack-mount arrays." },
      { name: "Blade & Storage Servers", description: "Modular SAN/NAS storage servers powered by Intel Xeon processing units." },
    ],
  },
  {
    id: "storage",
    name: "Storage Solutions",
    description: "Network Attached Storage (NAS), Storage Area Networks (SAN), enterprise Solid State Drives (SSDs), and secure backup equipment to safeguard data.",
    iconName: "HardDrive",
    image: storage,
    items: [
      { name: "SAN & NAS Systems", description: "High-capacity network storage arrays with real-time replication." },
      { name: "Solid State Arrays & SSDs", description: "Lightning-fast read/write arrays with intelligent controller caches." },
      { name: "Backup & Recovery Solutions", description: "Automated tape, cloud, and local backup systems with failover." },
    ],
  },
  {
    id: "networking",
    name: "Networking Equipment",
    description: "Enterprise-grade switches, high-throughput routers, corporate wireless APs, secure network cabling, and robust point-to-point wireless links.",
    iconName: "Network",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    items: [
      { name: "Managed Switches", description: "Layer 2/3 enterprise switches supporting high-density PoE and VLANs." },
      { name: "Enterprise Routers", description: "High-throughput edge routing solutions with hardware firewall integration." },
      { name: "Corporate Wireless", description: "Secure high-density Wi-Fi networks and point-to-point link systems." },
    ],
  },
  {
    id: "peripherals",
    name: "Printers & Scanners",
    description: "Laser, inkjet, and multi-function printers, workgroup flatbed scanners, high-resolution business monitors, and professional LCD/DLP projectors.",
    iconName: "Printer",
    image: printer,
    items: [
      { name: "Multi-Function Printers (MFP)", description: "Enterprise-grade heavy duty print, copy, scan, and fax units." },
      { name: "High-Speed Document Scanners", description: "High-throughput page scanners with OCR automation compatibility." },
      { name: "Monitors & Projectors", description: "High-definition corporate displays and conference room DLP projection." },
    ],
  },
  {
    id: "power",
    name: "UPS & Power Backup",
    description: "Uninterruptible Power Supplies (UPS) with high ratings, static stabilizers, and isolation transformers to prevent business interruption.",
    iconName: "Zap",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    items: [
      { name: "Enterprise UPS Systems", description: "Wide-range ratings UPS systems with intelligent battery managers." },
      { name: "Voltage Stabilizers", description: "Heavy-duty industrial static stabilizers for computer centers." },
      { name: "Isolation Transformers", description: "High attenuation shielding to eliminate power spikes and noise harmonics." },
    ],
  },
  {
    id: "security",
    name: "Security & Surveillance",
    description: "Comprehensive Wi-Fi setups, CCTV dome/bullet cameras, biometric access control, fire systems, and building management system (BMS) integration.",
    iconName: "Shield",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
    items: [
      { name: "Biometric Access Control", description: "Time-attendance systems, facial/fingerprint scanners, and smart locks." },
      { name: "HD CCTV Systems", description: "IP-based high-definition surveillance cameras with automated AI tracking." },
      { name: "Building Management (BMS)", description: "Integrated smart monitoring, alarm systems, and environmental controllers." },
    ],
  },
];

export const SOLUTION_ITEMS = [
  {
    id: "it-infra",
    title: "IT Infrastructure",
    description: "Strategic planning, design, and deployment of reliable computing clusters, server racks, server-room planning, and user hardware distribution.",
    iconName: "Cpu",
    details: ["Data Center Planning", "Active/Passive Cabling", "Hardware Lifespan Planning", "Software Audit & Compliance"],
  },
  {
    id: "fms",
    title: "Facility Management (FMS)",
    description: "Comprehensive on-site support with dedicated residential engineers (365 days/year), proprietary call tracking software, and robust spares inventory.",
    iconName: "Settings",
    details: ["365 Days On-Site Residential Support", "Call Logging & SLM Software", "Hardware & OS Spares Inventory", "Proactive Maintenance Scheduling"],
  },
  {
    id: "networking",
    title: "Networking Solutions",
    description: "Secure, robust local networks and long-distance wireless links. High-performance topologies designed for zero-packet loss and absolute uptime.",
    iconName: "Network",
    details: ["Structured Fiber & Copper Cabling", "High-Density Wi-Fi Solutions", "Point-to-Point Wireless Links", "VLAN & Security Routing Control"],
  },
  {
    id: "security",
    title: "Security Systems",
    description: "Safeguard access points, assets, and personnel. Professional-grade surveillance networks, biometric access management, and hazard alert networks.",
    iconName: "ShieldAlert",
    details: ["IP CCTV Dome & Bullet Surveillance", "Biometric and Time Attendance Loggers", "Building Management Systems (BMS)", "Fire Alarm and PA Systems"],
  },
  {
    id: "storage",
    title: "Storage Solutions",
    description: "Advanced storage tiering, data redundancy, and automated multi-site tape/cloud back-ups ensuring perfect data safety and compliance.",
    iconName: "HardDrive",
    details: ["SAN & NAS Deployment", "Disaster Recovery Orchestration", "Continuous Data Protection (CDP)", "Data Compression & Deduplication"],
  },
  {
    id: "turnkey",
    title: "Turnkey IT Projects",
    description: "Full end-to-end execution of large IT setups including planning, furniture coordination, electrical work, server-room build, and software configurations.",
    iconName: "Workflow",
    details: ["Planning & Computer Center Design", "Electrification & HVAC Integration", "Subcontractor Coordination", "Commissioning & Final Testing"],
  },
];

export const INDUSTRIES_SERVED = [
  {
    id: "banking",
    name: "Co-operative Banking",
    description: "Serving the banking sector with secure workstations, high-security networking, backup arrays, and compliance-ready power backups.",
    iconName: "Building",
    bgImage: "https://images.unsplash.com/photo-1541354451421-4743594040e6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "education",
    name: "Higher Education",
    description: "Powering computer labs, research wings, and campuses with top-grade workstations, heavy duty servers, and campus-wide Wi-Fi networks.",
    iconName: "GraduationCap",
    bgImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "healthcare",
    name: "Healthcare & Hospitals",
    description: "Supplying medical desks, diagnostic monitors, secure patient database storage, and zero-fluctuation isolation power transformers.",
    iconName: "HeartPulse",
    bgImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Industrial",
    description: "Deploying rugged industrial computers, localized switches, security enclosures, and 24/7 power systems for continuous assembly lines.",
    iconName: "Factory",
    bgImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "hospitality",
    name: "Corporate Hospitality",
    description: "Providing high-speed guest Wi-Fi routing, digital projectors, video conferencing facilities, and electronic key integrations.",
    iconName: "Hotel",
    bgImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "government",
    name: "Government & PSU",
    description: "Delivering fully audited IT hardware, bulk workstation deployments, high-performance computing systems, and multi-tenant secure storage.",
    iconName: "Briefcase",
    bgImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
  },
];

export const STATS_DATA = [
  {
    id: "installations",
    value: "50,000+",
    label: "Computer Installations",
    description: "Robust business desktop systems configured, delivered, and actively maintained across Gujarat.",
  },
  {
    id: "engineers",
    value: "40+",
    label: "On-Site Support Engineers",
    description: "Highly trained corporate support technicians delivering rapid-response Facility Management (FMS).",
  },
  {
    id: "ups",
    value: "1,500+",
    label: "UPS Deployments",
    description: "High-capacity uninterruptible power setups safeguarding critical enterprise systems from outages.",
  },
  {
    id: "partners",
    value: "100%",
    label: "Authorized OEM Partner",
    description: "Direct elite reseller and service dealer for HP, Dell, Lenovo, and major power and security brands.",
  },
];

// Mega Menu Specific Structured Hierarchy
export const MEGA_MENU_CATEGORIES = [
  {
    title: "Computer Systems",
    icon: "Monitor",
    items: [
      { name: "Business Desktops", href: "#desktops", desc: "Energy efficient corporate towers & mini PCs." },
      { name: "Workstations", href: "#desktops", desc: "Multi-core processor rigs for heavy simulation." },
      { name: "Laptops", href: "#laptops", desc: "Ultrabooks & secure business-grade notebooks." },
      { name: "Custom PCs", href: "#desktops", desc: "Custom designed assemblies with specific components." }
    ]
  },
  {
    title: "Servers",
    icon: "Server",
    items: [
      { name: "Tower Servers", href: "#servers", desc: "Ideal for branch office compute and SMB databases." },
      { name: "Rack Servers", href: "#servers", desc: "Industry-standard 1U/2U/4U virtualization hosts." },
      { name: "Blade Servers", href: "#servers", desc: "Dense, modular scale-out infrastructure modules." },
      { name: "Storage Servers", href: "#servers", desc: "Custom arrays with high disk capacities." }
    ]
  },
  {
    title: "Storage",
    icon: "HardDrive",
    items: [
      { name: "NAS", href: "#storage", desc: "Network-Attached Storage for shared file systems." },
      { name: "SAN", href: "#storage", desc: "Storage Area Networks for low-latency block access." },
      { name: "SSD", href: "#storage", desc: "Enterprise solid state disk arrays." },
      { name: "Backup Solutions", href: "#storage", desc: "Automated tape and replication vaults." }
    ]
  },
  {
    title: "Networking",
    icon: "Network",
    items: [
      { name: "Switches", href: "#networking", desc: "High density Layer-2 and Layer-3 managed switches." },
      { name: "Routers", href: "#networking", desc: "High throughput secure edge routing equipment." },
      { name: "Wireless Networking", href: "#networking", desc: "Enterprise controller-based Wi-Fi access points." },
      { name: "Network Accessories", href: "#networking", desc: "Patch panels, transceivers, and secure cabling." }
    ]
  },
  {
    title: "Peripherals",
    icon: "Printer",
    items: [
      { name: "Printers", href: "#peripherals", desc: "Heavy duty laserjets and inkjets for offices." },
      { name: "Scanners", href: "#peripherals", desc: "Flatbed, barcode, and document scanners." },
      { name: "Monitors", href: "#peripherals", desc: "IPS, 4K, and ultra-wide workplace displays." },
      { name: "Projectors", href: "#peripherals", desc: "Corporate presentation projection units." }
    ]
  },
  {
    title: "Power Solutions",
    icon: "Zap",
    items: [
      { name: "UPS", href: "#power", desc: "High-capacity backup battery configurations." },
      { name: "Stabilizers", href: "#power", desc: "Industrial solid state voltage stabilizers." },
      { name: "Isolation Transformers", href: "#power", desc: "Shields delicate computer centers from noise." }
    ]
  }
];
