import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, CheckCircle2, Shield, Clock, Users } from "lucide-react";
import {
    MODAL_COPY,
    INFRASTRUCTURE_OPTIONS,
    URGENCY_LEVELS,
    TRUST_BADGES
} from "../data/quoteModalData";

// Icon mapping dictionary for footer badges
const BADGE_ICONS = {
    Shield,
    Clock,
    Users
};

export default function QuoteModal({ isOpen, onClose, initialCategory }) {
    const [formData, setFormData] = useState({
        fullName: "",
        companyName: "",
        email: "",
        phone: "",
        category: "desktops",
        message: "",
        urgency: "standard"
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Generate reference token only when step switches to success state
    const referenceToken = useMemo(() => {
        if (!submitted) return "";
        return `#SS-${Math.floor(Math.random() * 90000) + 10000}`;
    }, [submitted]);

    // Synchronize initialCategory when modal opens
    useEffect(() => {
        if (isOpen) {
            let mappedCat = "desktops";
            if (initialCategory) {
                const lowerCat = initialCategory.toLowerCase();
                if (lowerCat.includes("desktop")) mappedCat = "desktops";
                else if (lowerCat.includes("laptop")) mappedCat = "laptops";
                else if (lowerCat.includes("server")) mappedCat = "servers";
                else if (lowerCat.includes("storage")) mappedCat = "storage";
                else if (lowerCat.includes("network")) mappedCat = "networking";
                else if (lowerCat.includes("printer") || lowerCat.includes("scanner")) mappedCat = "peripherals";
                else if (lowerCat.includes("ups") || lowerCat.includes("power")) mappedCat = "power";
                else if (lowerCat.includes("security") || lowerCat.includes("surveillance")) mappedCat = "security";
            }
            setFormData(prev => ({
                ...prev,
                category: mappedCat
            }));
            setSubmitted(false);
        }
    }, [isOpen, initialCategory]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1200);
    };

    const handleReset = () => {
        setFormData({
            fullName: "",
            companyName: "",
            email: "",
            phone: "",
            category: "desktops",
            message: "",
            urgency: "standard"
        });
        setSubmitted(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-primary/45 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ type: "spring", duration: 0.4 }}
                    className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-border-light overflow-hidden z-10"
                    id="quote-modal-container"
                >
                    {/* Header Banner */}
                    <div className="bg-primary px-6 py-5 text-white flex items-center justify-between">
                        <div>
                            <h3 className="font-display font-bold text-lg">{MODAL_COPY.header.title}</h3>
                            <p className="text-xs text-slate-300 font-sans mt-0.5">{MODAL_COPY.header.subtitle}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                            aria-label={MODAL_COPY.header.closeLabel}
                            id="close-quote-modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[80vh]">
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4" id="quote-request-form">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wider">
                                            {MODAL_COPY.fields.fullName.label}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            placeholder={MODAL_COPY.fields.fullName.placeholder}
                                            className="w-full px-4 py-2.5 bg-neutral-bg border border-border-light rounded-lg text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wider">
                                            {MODAL_COPY.fields.company.label}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                            placeholder={MODAL_COPY.fields.company.placeholder}
                                            className="w-full px-4 py-2.5 bg-neutral-bg border border-border-light rounded-lg text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wider">
                                            {MODAL_COPY.fields.email.label}
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder={MODAL_COPY.fields.email.placeholder}
                                            className="w-full px-4 py-2.5 bg-neutral-bg border border-border-light rounded-lg text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wider">
                                            {MODAL_COPY.fields.phone.label}
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder={MODAL_COPY.fields.phone.placeholder}
                                            className="w-full px-4 py-2.5 bg-neutral-bg border border-border-light rounded-lg text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wider">
                                            {MODAL_COPY.fields.infrastructure.label}
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-neutral-bg border border-border-light rounded-lg text-sm text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans cursor-pointer"
                                        >
                                            {INFRASTRUCTURE_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wider">
                                            {MODAL_COPY.fields.urgency.label}
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {URGENCY_LEVELS.map((urg) => (
                                                <button
                                                    key={urg}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, urgency: urg })}
                                                    className={`py-2 px-1 text-center font-sans font-semibold text-xs rounded-lg border transition-all cursor-pointer capitalize ${formData.urgency === urg
                                                            ? "bg-accent/10 border-accent text-accent"
                                                            : "bg-white border-border-light text-gray-500 hover:border-gray-300"
                                                        }`}
                                                >
                                                    {urg}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wider">
                                        {MODAL_COPY.fields.requirements.label}
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder={MODAL_COPY.fields.requirements.placeholder}
                                        className="w-full px-4 py-3 bg-neutral-bg border border-border-light rounded-lg text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans"
                                    />
                                </div>

                                {/* Dynamic Info Badges */}
                                <div className="grid grid-cols-3 gap-3 pt-2">
                                    {TRUST_BADGES.map((badge) => {
                                        const BadgeIcon = BADGE_ICONS[badge.iconName] || Shield;
                                        return (
                                            <div key={badge.id} className="bg-neutral-bg border border-border-light/60 p-2.5 rounded-lg flex items-center space-x-2">
                                                <BadgeIcon className="w-4 h-4 text-accent flex-shrink-0" />
                                                <span className="text-[10px] text-gray-500 font-sans leading-tight">{badge.description}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex justify-end pt-4 border-t border-border-light space-x-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-5 py-2.5 border border-border-light text-gray-500 hover:bg-neutral-bg font-sans font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                                    >
                                        {MODAL_COPY.buttons.cancel}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2.5 bg-primary hover:bg-accent text-white font-sans font-semibold text-xs rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-3.5 h-3.5" />
                                                <span>{MODAL_COPY.buttons.submit}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-12 px-6 text-center space-y-4"
                                id="quote-success-state"
                            >
                                <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto text-accent">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-display font-extrabold text-xl text-primary">{MODAL_COPY.success.title}</h4>
                                    <p className="text-sm text-gray-500 font-sans max-w-md mx-auto">
                                        Thank you, <strong className="text-primary">{formData.fullName}</strong>. Your request for <span className="font-semibold text-primary">{formData.companyName}</span> has been assigned to our senior enterprise systems architect.
                                    </p>
                                </div>
                                <div className="bg-neutral-bg border border-border-light p-4 rounded-xl max-w-sm mx-auto text-left space-y-2">
                                    <div className="flex justify-between text-xs font-sans">
                                        <span className="text-gray-400">{MODAL_COPY.success.referenceLabel}</span>
                                        <span className="font-mono text-primary font-bold">{referenceToken}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-sans">
                                        <span className="text-gray-400">{MODAL_COPY.success.etaLabel}</span>
                                        <span className="text-accent font-semibold flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {formData.urgency === "critical" ? MODAL_COPY.success.etaCritical : MODAL_COPY.success.etaStandard}
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-6 flex justify-center space-x-3">
                                    <button
                                        onClick={handleReset}
                                        className="px-5 py-2 bg-neutral-bg hover:bg-neutral-200 text-gray-600 font-sans font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                                    >
                                        {MODAL_COPY.success.btnReset}
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2 bg-primary hover:bg-accent text-white font-sans font-semibold text-xs rounded-lg transition-colors shadow-md cursor-pointer"
                                    >
                                        {MODAL_COPY.success.btnHome}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}