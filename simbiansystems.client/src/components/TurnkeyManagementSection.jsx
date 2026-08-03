import React from "react";
import { motion } from "framer-motion";
import { Server, Network, Layout, Radio, Video, CheckCircle2 } from "lucide-react";

export default function TurnkeyManagementSection() {
    const turnkeyServices = [
        {
            id: "systems-software",
            icon: Server,
            title: "Systems & Application Software"
        },
        {
            id: "lan-networking",
            icon: Network,
            title: "Local Area Networking"
        },
        {
            id: "desktop-publishing",
            icon: Layout,
            title: "Desktop Publishing"
        },
        {
            id: "modems-fax",
            icon: Radio,
            title: "Modems / FAX Interfaces"
        },
        {
            id: "multimedia-products",
            icon: Video,
            title: "Multimedia Products"
        }
    ];

    return (
        <section
            id="turnkey-management"
            className="lg:py-16 sm:py-20 bg-white border-b border-border-light/60 scroll-mt-24 relative"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Section Header */}
                <div className="max-w-full mb-5 space-y-3">
                    <div className="inline-flex items-center space-x-2 text-accent">
                        <span className="w-8 h-[1.5px] bg-accent" />
                        <span className="font-sans font-bold text-xs uppercase tracking-widest text-accent">
                            ENTERPRISE IT SERVICES
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl text-primary font-bold tracking-tight">
                        Turnkey Information Management Solutions
                    </h2>
                </div>

                {/* Header Subtitle with Global Turnkey Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
                    <p className="lead-text max-w-7xl">
                        We market turnkey solutions for information management, putting together a comprehensive set of products and specialized services:
                    </p>

                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {turnkeyServices.map((card, idx) => {
                        const IconComp = card.icon;
                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.35, delay: idx * 0.05 }}
                                className="px-6 lg:py-3 py-4 rounded-xl bg-neutral-bg/40 border border-border-light/60 hover:border-accent/40 hover:bg-neutral-bg/60 hover:shadow-sm transition-all duration-300 group relative flex items-center space-x-4"
                            >
                                {/* Icon Container */}
                                <div className="w-11 h-11 rounded-full bg-[#2F8F83]/10 text-[#2F8F83] flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#2BA84A] group-hover:text-white transition-colors duration-300">
                                    <IconComp className="w-5 h-5 transition-colors duration-300" />
                                </div>

                                {/* Title on the Same Line */}
                                <h3 className="font-sans font-extrabold text-base text-primary leading-snug">
                                    {card.title}
                                </h3>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}