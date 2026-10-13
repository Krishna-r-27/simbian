import React from "react";
import { FiMail, FiPhone, FiMapPin, FiArrowUp, FiGlobe } from "react-icons/fi";
import { FaLinkedinIn, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import logo from "../assets/images/simbian_logo.png";
import { FOOTER_DATA } from "../data/footerData";
import { Link } from "react-router-dom";

export default function Footer({ onNavigate }) {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const renderSocialIcon = (iconName) => {
        switch (iconName) {
            case "linkedin": return <FaLinkedinIn className="w-4 h-4" />;
            case "facebook": return <FaFacebookF className="w-3.5 h-3.5" />;
            case "twitter": return <FaXTwitter className="w-3.5 h-3.5" />;
            case "globe": return <FiGlobe className="w-4 h-4" />;
            default: return null;
        }
    };

    const renderLink = (link) => {
        const isPath = Boolean(link.path);
        const hrefValue = isPath ? link.path : `#${link.targetId || ""}`;

        return (
            <a
                href={hrefValue}
                onClick={(e) => {
                    if (!isPath && link.targetId && link.targetId !== "#") {
                        e.preventDefault();
                        if (onNavigate) {
                            onNavigate(link.targetId);
                        }
                    }
                }}
                className="hover:text-accent transition-colors"
            >
                {link.name}
            </a>
        );
    };

    return (
        <footer
            id="main-footer"
            className="bg-primary text-white border-t border-white/5 pt-16 pb-8 relative"
        >
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-white/10">

                {/* Column 1: Logo & Info (Spans 4 columns) */}
                <div className="lg:col-span-4 space-y-5 pr-2">
                    <div className="inline-flex items-center justify-center rounded-xl bg-white p-3 shadow-md">
                        <img
                            src={logo}
                            alt="Simbian Systems"
                            loading="lazy"
                            decoding="async"
                            style={{ color: "transparent", fontSize: 0 }}
                            className="h-10 lg:h-12 w-auto object-contain"
                        />
                    </div>
                    <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {FOOTER_DATA.companyDescription}
                    </p>

                    {/* Social Channels */}
                    <div className="flex items-center space-x-3 pt-2">
                        {FOOTER_DATA.socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.url}
                                aria-label={social.label}
                                className="w-8 h-8 rounded bg-white/10 hover:bg-accent hover:text-white text-slate-300 flex items-center justify-center transition-colors"
                            >
                                {renderSocialIcon(social.icon)}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Column 2: Navigation Section 1 (Quick Links) */}
                <div className="lg:col-span-2 space-y-4 lg:pl-15">
                    <h4 className="font-display font-bold text-xs uppercase tracking-widest text-accent/90">
                        {FOOTER_DATA.navigationSections[0]?.title || "Quick Links"}
                    </h4>
                    <ul className="space-y-2.5 font-sans text-xs sm:text-sm text-slate-300">
                        {FOOTER_DATA.navigationSections[0]?.links.map((link) => (
                            <li key={link.name}>
                                {renderLink(link)}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Navigation Section 2 (Services / Offerings) */}
                <div className="lg:col-span-3 space-y-4 lg:pl-10">
                    <h4 className="font-display font-bold text-xs uppercase tracking-widest text-accent/90">
                        {FOOTER_DATA.navigationSections[1]?.title || "Our Services"}
                    </h4>
                    <ul className="space-y-2.5 font-sans text-xs sm:text-sm text-slate-300">
                        {FOOTER_DATA.navigationSections[1]?.links.map((link) => (
                            <li key={link.name}>
                                {renderLink(link)}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 4: Contact Info (Spans 3 columns) */}
                <div className="lg:col-span-3 space-y-4 lg:pl-5">
                    <h4 className="font-display font-bold text-xs uppercase tracking-widest text-accent/90">
                        Contact Us
                    </h4>
                    <ul className="space-y-3.5 font-sans text-xs sm:text-sm text-slate-300">
                        <li className="grid grid-cols-[18px_1fr] gap-3 items-start">
                            <FiMapPin className="w-4 h-4 text-accent mt-0.5" />
                            <span>{FOOTER_DATA.contactInfo.location}</span>
                        </li>

                        <li className="grid grid-cols-[18px_1fr] gap-3 items-start">
                            <FiPhone className="w-4 h-4 text-accent mt-0.5" />
                            <div className="space-y-1">
                                {FOOTER_DATA.contactInfo.phoneNumbers.map((phone) => (
                                    <a
                                        key={phone}
                                        href={`tel:${phone.replace(/\s+/g, "")}`}
                                        className="block font-semibold hover:text-accent transition-colors"
                                    >
                                        {phone}
                                    </a>
                                ))}
                            </div>
                        </li>

                        <li className="grid grid-cols-[18px_1fr] gap-3 items-start">
                            <FiMail className="w-4 h-4 text-accent mt-0.5" />
                            <div className="space-y-1 min-w-0">
                                {FOOTER_DATA.contactInfo.emails.map((email) => (
                                    <a
                                        key={email}
                                        href={`mailto:${email}`}
                                        className="block hover:text-accent transition-colors truncate"
                                    >
                                        {email}
                                    </a>
                                ))}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-slate-400">
                <div>
                    &copy; {new Date().getFullYear()} {FOOTER_DATA.copyrightText}
                </div>

                <div className="flex items-center gap-4 text-slate-300">
                    <a
                        href={FOOTER_DATA.designerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className=""
                    >
                        Website Designed by{" "}
                        <span className="font-semibold text-white hover:text-accent">
                            {FOOTER_DATA.designerName}
                        </span>
                    </a>

                    <span className="text-slate-500">|</span>

                    <Link
                        to="/sitemap"
                        className="hover:text-accent transition-colors"
                    >
                        Sitemap
                    </Link>

                    <span className="text-slate-500">|</span>

                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                    >
                        <span>Back to Top</span>
                        <FiArrowUp className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </footer>
    );
}