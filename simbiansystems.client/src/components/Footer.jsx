import React from "react";
import { FiMail, FiPhone, FiMapPin, FiArrowUp, FiGlobe } from "react-icons/fi";
import { FaLinkedinIn, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import logo from "../assets/images/simbian_logo.png";
import { FOOTER_DATA } from "../data/footerData";

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

    return (
        <footer
            id="main-footer"
            className="bg-primary text-white border-t border-white/5 pt-20 pb-8 relative"
        >
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-white/5">

                {/* Column 1: Company Logo & Info */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="inline-flex items-center justify-center rounded-xl bg-white p-3 shadow-md">
                        <img
                            src={logo}
                            alt="Simbian Systems"
                            className="h-12 lg:h-14 w-auto object-contain"
                        />
                    </div>
                    <p className="font-sans lg:text-sm text-xs text-slate-300 leading-relaxed max-w-sm">
                        {FOOTER_DATA.companyDescription}
                    </p>

                    {/* Social Channels */}
                    <div className="flex items-center space-x-3 pt-2">
                        {FOOTER_DATA.socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.url}
                                aria-label={social.label}
                                className="w-8 h-8 rounded bg-white/5 hover:bg-accent hover:text-white text-slate-300 flex items-center justify-center transition-colors"
                            >
                                {renderSocialIcon(social.icon)}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Columns 2-4: Structured Nav Items */}
                {FOOTER_DATA.navigationSections.map((section) => (
                    <div key={section.title} className="lg:col-span-2 space-y-4">
                        <h4 className="font-display font-extrabold text-xs uppercase tracking-wider text-accent">
                            {section.title}
                        </h4>
                        <ul className="space-y-2.5 font-sans lg:text-sm text-xs text-slate-300">
                            {section.links.map((link) => {
                                const isObjectLink = typeof link === "object";
                                const name = isObjectLink ? link.name : link;
                                const target = isObjectLink ? link.targetId : section.targetId;

                                return (
                                    <li key={name}>
                                        <a
                                            href={`#${target}`}
                                            onClick={() => target !== "#" && onNavigate(target)}
                                            className="hover:text-accent transition-colors"
                                        >
                                            {name}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}

                {/* Column 5: Direct Contact Grid */}
                <div className="lg:col-span-2 space-y-4">
                    <h4 className="font-display font-extrabold lg:text-sm text-xs uppercase tracking-wider text-accent">
                        Direct Contact
                    </h4>
                    <ul className="space-y-3 font-sans text-xs text-slate-300">
                        <li className="grid grid-cols-[18px_1fr] gap-3">
                            <FiMapPin className="w-4 h-4 text-accent mt-1" />

                            <span className="lg:text-sm text-xs">
                                {FOOTER_DATA.contactInfo.location}
                            </span>
                        </li>
                        {/* Phone */}
                        <li className="grid grid-cols-[18px_1fr] gap-3">
                            <FiPhone className="w-4 h-4 text-accent mt-1" />

                            <div className="space-y-1.5">
                                {FOOTER_DATA.contactInfo.phoneNumbers.map((phone) => (
                                    <a
                                        key={phone}
                                        href={`tel:${phone.replace(/\s+/g, "")}`}
                                        className="block lg:text-sm text-xs font-semibold hover:text-accent transition-colors"
                                    >
                                        {phone}
                                    </a>
                                ))}
                            </div>
                        </li>

                        {/* Email */}
                        <li className="grid grid-cols-[18px_1fr] gap-3">
                            <FiMail className="w-4 h-4 text-accent mt-1" />

                            <div className="space-y-1.5 min-w-0">
                                {FOOTER_DATA.contactInfo.emails.map((email) => (
                                    <a
                                        key={email}
                                        href={`mailto:${email}`}
                                        className="block lg:text-sm text-xs hover:text-accent transition-colors"
                                    >
                                        {email}
                                    </a>
                                ))}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Processing Bar */}
            <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans lg:text-sm text-[10px] text-slate-300">
                <div>
                    &copy; {new Date().getFullYear()} {FOOTER_DATA.copyrightText}
                </div>

                <div className="flex items-center gap-6">
                    <a
                        href={FOOTER_DATA.designerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-300 transition-colors"
                    >
                        Designed by{" "}
                        <span className="font-semibold text-white hover:text-accent">
                            {FOOTER_DATA.designerName}
                        </span>
                    </a>

                    <button
                        onClick={scrollToTop}
                        className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer group"
                        id="scroll-to-top-footer"
                    >
                        <span className="text-xs">Back to Top</span>
                        <FiArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </footer>
    );
}