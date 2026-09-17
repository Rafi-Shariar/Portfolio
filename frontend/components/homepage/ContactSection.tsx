"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { toast } from "sonner"; // Ba react-hot-toast (top-right set kora)

import { useGetProfile } from "@/hooks/profile.hook";
import { useContact } from "@/hooks/contact.hook";

export default function ContactSection() {
  const { data: profileRes } = useGetProfile();
  const profile = profileRes?.data;

  const { mutate: sendMessage, isPending } = useContact();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields", { position: "top-right" });
      return;
    }

    sendMessage(formData, {
      onSuccess: () => {
        toast.success("Message sent, I will connect shortly", {
          position: "top-right",
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to send message. Try again.", {
          position: "top-right",
        });
      },
    });
  };

  return (
    <section
      id="contact"
      className="w-full py-20 sm:py-16 relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FFF5EC] to-[#FFF1E3]"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-[450px] h-[300px] bg-orange-300/35 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-amber-300/30 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-14 sm:mb-16">
         

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950">
            Let&apos;s Build Something Great<span className="text-orange-600">.</span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl font-medium leading-relaxed">
            Have an open role, an interesting project, or just want to connect? 
            Send a message and I&apos;ll get back to you promptly.
          </p>
        </div>

        {/* 2-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch max-w-6xl mx-auto">
          
          {/* LEFT COLUMN: Contact Information & Channels (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 rounded-[20px] p-7 sm:p-10 text-white shadow-xl shadow-orange-600/20 flex flex-col justify-between relative overflow-hidden">
            {/* Top Accents */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-8 relative z-10">
              <div className="space-y-2">
                <span className="text-xs font-bold tracking-widest uppercase text-orange-100">
                  Direct Line
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Reach Out Directly
                </h3>
                <p className="text-xs sm:text-sm text-orange-50/90 leading-relaxed font-normal">
                  I&apos;m currently open to software engineering opportunities, contract roles, and technical collaborations.
                </p>
              </div>

              {/* Channels */}
              <div className="space-y-5">
                {profile?.email && (
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-[10px] bg-white/15 backdrop-blur-md text-white shrink-0 mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-orange-200">
                        Email
                      </span>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-sm sm:text-base font-semibold text-white hover:underline truncate block"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}

                {profile?.phone && (
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-[10px] bg-white/15 backdrop-blur-md text-white shrink-0 mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-orange-200">
                        Phone
                      </span>
                      <a
                        href={`tel:${profile.phone}`}
                        className="text-sm sm:text-base font-semibold text-white hover:underline"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                )}

                {profile?.location && (
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-[10px] bg-white/15 backdrop-blur-md text-white shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-orange-200">
                        Location
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-white">
                        {profile.location}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-8 mt-8 border-t border-white/20 relative z-10">
              <span className="block text-xs font-bold uppercase tracking-wider text-orange-200 mb-3">
                Social Profiles
              </span>
              <div className="flex items-center gap-2.5">
                {profile?.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-[10px] bg-white/15 hover:bg-white hover:text-orange-600 text-white transition-all active:scale-95 backdrop-blur-md"
                    title="GitHub"
                  >
                    <FaGithub className="w-4 h-4" />
                  </a>
                )}
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-[10px] bg-white/15 hover:bg-white hover:text-[#0A66C2] text-white transition-all active:scale-95 backdrop-blur-md"
                    title="LinkedIn"
                  >
                    <FaLinkedinIn className="w-4 h-4" />
                  </a>
                )}
                {profile?.phone && (
                  <a
                    href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "").replace(/^0/, "880")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-[10px] bg-white/15 hover:bg-white hover:text-emerald-600 text-white transition-all active:scale-95 backdrop-blur-md"
                    title="WhatsApp"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </a>
                )}
                {profile?.facebook && (
                  <a
                    href={profile.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-[10px] bg-white/15 hover:bg-white hover:text-[#1877F2] text-white transition-all active:scale-95 backdrop-blur-md"
                    title="Facebook"
                  >
                    <FaFacebookF className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-[20px] p-7 sm:p-10 border border-orange-200/80 shadow-xl shadow-orange-950/5 flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-neutral-800">
                    Your Name <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3 rounded-[10px] bg-[#FAF8F5] border border-orange-200/80 focus:border-orange-500 focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-neutral-800">
                    Email Address <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-[10px] bg-[#FAF8F5] border border-orange-200/80 focus:border-orange-500 focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Phone (Optional) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="phone" className="text-xs font-bold text-neutral-800">
                    Phone Number
                  </label>
                  <span className="text-[11px] font-mono text-neutral-400 font-medium">
                    Optional
                  </span>
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 1XXXXXXXXX"
                  className="w-full px-4 py-3 rounded-[10px] bg-[#FAF8F5] border border-orange-200/80 focus:border-orange-500 focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all shadow-2xs"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-bold text-neutral-800">
                  Message <span className="text-orange-600">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project, timeline, or open role..."
                  className="w-full px-4 py-3 rounded-[10px] bg-[#FAF8F5] border border-orange-200/80 focus:border-orange-500 focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none resize-none transition-all shadow-2xs"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[12px] bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-600/25 active:scale-98 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center gap-2 text-neutral-400 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Response time: usually within 12-24 hours.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}