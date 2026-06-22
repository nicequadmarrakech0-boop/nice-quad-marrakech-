"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import { IconBrandTiktok } from "@tabler/icons-react";
import { useTranslations } from "@/lib/i18n";

// Mock data for footer
const footerData = {
  company: {
    name: "Nice Quad Marrakech",
    tagline: "Experience the thrill of Marrakech's desert",
    description: "Guided quad bike and buggy tours in Marrakech Palmeraie. Safe, family-friendly desert adventures with hotel pickup and expert local guides."
  },
  contact: {
    phone: "+212 6 34 32 44 28",
    emails: [
      "nicequadmarrakech0@gmail.com",
      "contact@nicequadmarrakech.com"
    ],
    address: "Palmeraie, Marrakech, Morocco"
  },
  navigation: {
    experiences: [
      { name: "Quad Bikes", href: "#quad" },
      { name: "Buggies", href: "#buggy" },
      { name: "Motocross", href: "#moto" }
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Gallery", href: "#gallery" },
      { name: "Testimonials", href: "#testimonials" }
    ]
  },
  social: [
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/nicequadmarrakech/" },
    { name: "TikTok", icon: IconBrandTiktok, href: "https://www.tiktok.com/@nicequadmarrakech?lang=en" }
  ]
};

function StackedCircularFooter() {
  const t = useTranslations("footer")

  return (
    <footer className="relative py-12 md:py-16 lg:py-20 bg-orange-50 overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Main Footer Content */}
        <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-8 lg:gap-10 mb-8 lg:mb-10">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <Image
                src="/logo.png"
                alt="Nice Quad Marrakech"
                width={40}
                height={40}
                className="rounded-full"
              />
              <h3 className="font-bold text-base sm:text-lg text-orange-600">{footerData.company.name}</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 sm:mb-5">
              {t("description")}
            </p>

            {/* Social Links */}
            <div className="flex gap-2 sm:gap-3">
              {footerData.social.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border-2 border-gray-200 hover:bg-orange-600 hover:border-orange-600 text-gray-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="sr-only">{social.name}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Experiences Links */}
          <div className="grid grid-cols-1 gap-6 sm:col-span-2 lg:col-span-1">
            {/* Experiences Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-3 sm:mb-4 uppercase tracking-tight">{t("experiences")}</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-2 cursor-default select-none">
                    <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-gray-400" />
                    {t("quadBikes")}
                  </div>
                </li>
                <li>
                  <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-2 cursor-default select-none">
                    <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-gray-400" />
                    {t("buggies")}
                  </div>
                </li>
                <li>
                  <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-2 cursor-default select-none">
                    <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-gray-400" />
                    {t("motocross")}
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-3 sm:mb-4 uppercase tracking-tight">{t("contact")}</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <span>{footerData.contact.phone}</span>
              </li>
              <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  {footerData.contact.emails.map((email, index) => (
                    <span key={index}>{email}</span>
                  ))}
                </div>
              </li>
              <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <span>{footerData.contact.address}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="pt-6 sm:pt-8 border-t-2 border-gray-200"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left font-medium">
              © {new Date().getFullYear()} {footerData.company.name}. {t("allRightsReserved")}
            </p>
            <div className="flex items-center gap-2">
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-orange-600 shadow-md">
                <span className="text-xs sm:text-sm font-bold text-white">{t("premiumAdventures")}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export { StackedCircularFooter }; 