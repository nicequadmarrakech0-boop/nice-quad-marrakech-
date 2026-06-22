"use client"

import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from "@/lib/i18n";

export const MapSection: React.FC = () => {
  const t = useTranslations("map")
  return (
    <div className="relative py-12 lg:py-16 bg-orange-50 overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >

          {/* Heading */}
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            {t("title")} <span className="text-orange-600">{t("titleHighlight")}</span>
          </h2>

          {/* Subheading */}
          <p className="text-base text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative w-full h-[350px] lg:h-[450px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.2!2d-7.925256!3d31.714203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdaff32d14cb972f%3A0xf3bdc56a40cf21cd!2sNice%20Quad%20Marrakech!5e0!3m2!1sen!2sma!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Nice Quad Marrakech Location"
              className="w-full h-full"
            />
          </div>

          {/* Map Info Overlay */}
          <div className="bg-white border-t border-gray-200 p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-gray-900">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Palmeraie, Marrakech</p>
                  <p className="text-xs text-gray-600">Morocco</p>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/rpQPurcjPNtntgmn9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors duration-200 text-sm shadow-md hover:shadow-lg"
              >
                <Navigation className="w-4 h-4" />
                <span>{t("getDirections")}</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
