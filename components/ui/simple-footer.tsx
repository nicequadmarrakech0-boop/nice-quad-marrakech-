"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import { IconBrandTiktok } from "@tabler/icons-react";

const contactData = {
  phone: "+212 6 34 32 44 28",
  emails: ["nicequadmarrakech0@gmail.com", "contact@nicequadmarrakech.com"],
  address: "Palmeraie, Marrakech, Morocco"
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/nicequadmarrakech/" },
  { name: "TikTok", icon: IconBrandTiktok, href: "https://www.tiktok.com/@nicequadmarrakech" }
];

export function SimpleFooter() {
  return (
    <footer className="relative py-16 bg-orange-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
              <h3 className="font-bold text-lg text-orange-600">Nice Quad Marrakech</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Premium quad, buggy, and motocross rentals in Marrakech.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors text-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Experiences</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Quad Bikes</li>
              <li>Buggies</li>
              <li>Motocross</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-600" />
                {contactData.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-600" />
                {contactData.emails[0]}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                {contactData.address}
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            © 2025 Nice Quad Marrakech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
