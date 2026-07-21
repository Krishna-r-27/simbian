import bccp from "../assets/images/bccp.png"
import fern from "../assets/images/fern.png"
import sndt from "../assets/images/sndt.png"
import cogent from "../assets/images/cogent.png"
import sabic from "../assets/images/sabic.png"
import parul from "../assets/images/parul.png"
import nbank from "../assets/images/n-bank.png"
import kemrock from "../assets/images/kemrock.png"

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
export const CLIENT_SECTION_TEXT = {
    badge: "VALUED CLIENT PORTFOLIO",
    title: "Trusted by 60+ Leading Organizations",
    description: "We serve as the primary computing and systems integration partner for high-compliance banking networks, medical institutions, and industrial corporations.",
    activeServiceSuffix: "Service Active"
};

export const CLIENT_INDUSTRIES = [
    "All",
    "Banking",
    "Manufacturing",
    "Education",
    "Healthcare",
    "Corporate",
    "Hospitality",
    "Real Estate"
];