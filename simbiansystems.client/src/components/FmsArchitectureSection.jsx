import React from "react";
import { Wrench, Users, Clock, ShieldCheck, Cpu } from "lucide-react";

export default function FmsServicesSection() {
    const services = [
        {
            icon: Wrench,
            title: "In-House System Maintenance",
            desc: "Full-lifecycle maintenance of hardware, operating systems, and core front-end enterprise applications.",
        },
        {
            icon: Users,
            title: "Resident On-Site Engineers",
            desc: "Dedicated resident engineers deployed directly at client sites for 365 work days according to company rules.",
        },
        {
            icon: Clock,
            title: "Call Record Tracking Software",
            desc: "Proprietary software logging Call No., Employee Name, Tel Ext, Call-In time, Engineer Attendance, and Resolution time.",
        },
        {
            icon: ShieldCheck,
            title: "On-Site Spares Management",
            desc: "Immediate standby spares and peripherals maintained at the client site to eliminate operational downtime.",
        },
        {
            icon: Cpu,
            title: "40+ System Support Engineers",
            desc: "A robust internal workforce of 40+ certified systems support engineers providing rapid response.",
        },
    ];

    return (
        <section className="py-10 bg-slate-50/60 border-b border-slate-200/80 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 space-y-2">
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#004A7C] tracking-tight uppercase">
                        Facility Management System (FMS)
                    </h2>
                    <p className="font-sans text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
                        Our FMS model delivers complete peace of mind through dedicated site engineers, automated ticket tracking, and immediate spare replacements.
                    </p>
                </div>

                {/* Compact 5-Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    {services.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#004A7C]/30 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    {/* Icon Container */}
                                    <div className="w-9 h-9 rounded-lg bg-[#004A7C]/10 text-[#004A7C] flex items-center justify-center mb-3 shrink-0">
                                        <Icon className="w-4 h-4" />
                                    </div>

                                    {/* Card Title */}
                                    <h3 className="font-display text-xs font-bold text-[#004A7C] uppercase tracking-wide mb-2 leading-tight">
                                        {item.title}
                                    </h3>

                                    {/* Card Description */}
                                    <p className="font-sans text-[11px] sm:text-xs text-slate-600 leading-normal">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}