import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import { CONTACT_STATIC_TEXT, SUBJECT_OPTIONS } from "../data/contactData";

const INITIAL_FORM_STATE = {
    name: "",
    org: "",
    email: "",
    phone: "",
    subject: "procurement",
    message: "",
};

export default function ContactSection() {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1000);
    };

    const handleReset = () => {
        setFormData(INITIAL_FORM_STATE);
        setSubmitted(false);
    };

    return (
        <section
            id="contact"
            className="py-100 bg-white border-b border-border-light relative"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="max-w-3xl mb-10 md:mb-14 lg:mb-8 space-y-4">
                    <div className="inline-flex items-center space-x-2 text-accent">
                        <span className="w-8 h-[1.5px] bg-accent" />
                        <span className="font-sans font-extrabold text-xs uppercase tracking-widest">
                            {CONTACT_STATIC_TEXT.badge}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl mb-5">
                        {CONTACT_STATIC_TEXT.heading}
                    </h2>
                </div>

                <div
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch"
                    id="contact-content-grid"
                >
                    {/* Left Column - Information Sidebar */}
                    <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
                        <div className="space-y-6">
                            <h3 className="font-display lg:-mt-2 font-bold text-lg text-primary uppercase tracking-wider">
                                {CONTACT_STATIC_TEXT.sidebar.title}
                            </h3>

                            <div className="space-y-4" id="office-info-cards">
                                {/* Location Contact Card */}
                                <div className="flex items-start space-x-3 sm:space-x-4 bg-white p-4 sm:p-5 rounded-xl border border-border-light shadow-sm">
                                    <div className="p-2.5 bg-primary/5 rounded-lg text-accent flex-shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h4 className="font-display font-extrabold text-sm text-primary tracking-wider">
                                            {CONTACT_STATIC_TEXT.sidebar.locationTitle}
                                        </h4>
                                        <p className="font-sans lg:text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
                                            {CONTACT_STATIC_TEXT.sidebar.locationAddress}
                                        </p>
                                    </div>
                                </div>

                                {/* Phone Communications Card */}
                                <div className="flex items-start space-x-4 bg-white p-5 rounded-xl border border-border-light shadow-sm">
                                    <div className="p-2.5 bg-primary/5 rounded-lg text-accent flex-shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1.5 w-full">
                                        <h4 className="font-display font-extrabold text-sm text-primary tracking-wider">
                                            {CONTACT_STATIC_TEXT.sidebar.phoneTitle}
                                        </h4>
                                        <div className="space-y-1 flex flex-col">
                                            {CONTACT_STATIC_TEXT.sidebar.phoneNumbers.map((phone) => (
                                                <a
                                                    key={phone}
                                                    href={`tel:${phone.replace(/\s+/g, "")}`}
                                                    className="font-sans lg:text-sm text-xs text-gray-500 font-semibold hover:text-accent transition-colors"
                                                >
                                                    {phone}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Email Channels Card */}
                                <div className="flex items-start space-x-4 bg-white p-5 rounded-xl border border-border-light shadow-sm">
                                    <div className="p-2.5 bg-primary/5 rounded-lg text-accent flex-shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h4 className="font-display font-extrabold text-sm lg:text-md text-primary tracking-wider">
                                            {CONTACT_STATIC_TEXT.sidebar.emailTitle}
                                        </h4>
                                        <div className="space-y-1 flex flex-col">
                                            {CONTACT_STATIC_TEXT.sidebar.emails.map((email) => (
                                                <a
                                                    key={email}
                                                    href={`mailto:${email}`}
                                                    className="font-sans lg:text-sm text-xs text-gray-500 hover:text-accent font-bold hover:underline"
                                                >
                                                    {email}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Submission Panel */}
                    <div
                        className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 lg:p-8 border border-border-light shadow-xl min-h-[480px] flex flex-col justify-center"
                        id="contact-form-panel"
                    >
                        <AnimatePresence mode="wait">
                            {!submitted ? (
                                <motion.form
                                    key="form"
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h3 className="font-display font-extrabold text-sm sm:text-base text-primary uppercase tracking-wider pb-2 border-b border-border-light">
                                        {CONTACT_STATIC_TEXT.form.title}
                                    </h3>

                                    {/* Identification Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block lg:text-sm sm:text-xs font-semibold text-primary mb-1.5">
                                                {CONTACT_STATIC_TEXT.form.labelName}
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder={CONTACT_STATIC_TEXT.form.placeholderName}
                                                className="w-full px-4 py-3 bg-neutral-bg border border-border-light rounded-lg text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent font-sans"
                                            />
                                        </div>

                                        <div>
                                            <label className="block lg:text-sm sm:text-xs font-semibold text-primary mb-1.5">
                                                {CONTACT_STATIC_TEXT.form.labelOrg}
                                            </label>
                                            <input
                                                type="text"
                                                name="org"
                                                required
                                                value={formData.org}
                                                onChange={handleChange}
                                                placeholder={CONTACT_STATIC_TEXT.form.placeholderOrg}
                                                className="w-full px-4 py-3 bg-neutral-bg border border-border-light rounded-lg text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent font-sans"
                                            />
                                        </div>
                                    </div>

                                    {/* Communication Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block lg:text-sm sm:text-xs font-semibold text-primary mb-1.5">
                                                {CONTACT_STATIC_TEXT.form.labelEmail}
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder={CONTACT_STATIC_TEXT.form.placeholderEmail}
                                                className="w-full px-4 py-3 bg-neutral-bg border border-border-light rounded-lg text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent font-sans"
                                            />
                                        </div>

                                        <div>
                                            <label className="block lg:text-sm sm:text-xs font-semibold text-primary mb-1.5">
                                                {CONTACT_STATIC_TEXT.form.labelPhone}
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder={CONTACT_STATIC_TEXT.form.placeholderPhone}
                                                className="w-full px-4 py-3 bg-neutral-bg border border-border-light rounded-lg text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent font-sans"
                                            />
                                        </div>
                                    </div>

                                    {/* Intent Dropdown */}
                                    <div>
                                        <label className="block lg:text-sm sm:text-xs font-semibold text-primary mb-1.5">
                                            {CONTACT_STATIC_TEXT.form.labelSubject}
                                        </label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-neutral-bg border border-border-light rounded-lg text-sm text-primary focus:outline-none focus:border-accent font-sans cursor-pointer"
                                        >
                                            {SUBJECT_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Project Message Input */}
                                    <div>
                                        <label className="block lg:text-sm sm:text-xs font-semibold text-primary mb-1.5 tracking-wide">
                                            {CONTACT_STATIC_TEXT.form.labelMessage}
                                        </label>
                                        <textarea
                                            name="message"
                                            rows={4}
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder={CONTACT_STATIC_TEXT.form.placeholderMessage}
                                            className="w-full px-4 py-3 bg-neutral-bg border border-border-light rounded-lg text-sm text-primary placeholder-gray-400 focus:outline-none focus:border-accent font-sans resize-none"
                                        />
                                    </div>

                                    {/* Form Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 bg-primary hover:bg-accent text-white font-sans font-bold text-xs sm:text-sm rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                <span>{CONTACT_STATIC_TEXT.form.submitButton}</span>
                                            </>
                                        )}
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="py-8 md:py-12 text-center space-y-5"
                                >
                                    <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto text-accent">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-display font-extrabold text-lg sm:text-xl text-primary">
                                            {CONTACT_STATIC_TEXT.success.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-sans max-w-md mx-auto px-2">
                                            {CONTACT_STATIC_TEXT.success.messagePrefix}
                                            <strong className="text-primary">
                                                {formData.name}
                                            </strong>
                                            {CONTACT_STATIC_TEXT.success.messageSuffix}
                                        </p>
                                    </div>

                                    <div className="p-4 bg-neutral-bg border border-border-light rounded-xl max-w-sm mx-auto text-xs text-gray-400 font-sans">
                                        {CONTACT_STATIC_TEXT.success.notice}
                                    </div>

                                    <button
                                        onClick={handleReset}
                                        className="px-6 py-2.5 bg-primary hover:bg-accent text-white font-sans font-bold text-xs rounded-lg transition-colors shadow-md cursor-pointer"
                                    >
                                        {CONTACT_STATIC_TEXT.success.resetButton}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}