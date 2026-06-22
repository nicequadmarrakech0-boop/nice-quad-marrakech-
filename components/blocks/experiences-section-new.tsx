"use client"

import React from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { useRouter } from "next/navigation"
import { experiences, type Experience } from "@/data/experiences"
import { ArrowRight } from "lucide-react"
import { useTranslations, useLocale, defaultLocale } from "@/lib/i18n"

export function ExperiencesSectionNew() {
  const router = useRouter()
  const t = useTranslations("experiences")
  const tCommon = useTranslations("common")
  const locale = useLocale()

  const categories = [
    { id: "BUGGY", label: t("categories.buggies") },
    { id: "QUAD", label: t("categories.quads") },
    { id: "MOTO CROSS", label: t("categories.motocross") },
  ]

  const handleBookNow = (experience: Experience) => {
    const path = `/booking?id=${experience.id}`
    // Add locale prefix if not default locale
    const localizedPath = locale === defaultLocale ? path : `/${locale}${path}`
    router.push(localizedPath)
  }

  return (
    <section id="experiences" className="relative bg-orange-50 py-12 md:py-16 lg:py-20">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header - Compact */}
        <div className="text-center mb-12 md:mb-16 space-y-4 md:space-y-5">
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {t("title")}{" "}
            <span className="text-orange-600 inline-block">
              {t("titleHighlight")}
            </span>
          </motion.h2>

          <motion.p
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* Categories with their vehicles */}
        <div className="space-y-12 md:space-y-16">
          {categories.map((category) => {
            const categoryExperiences = experiences.filter(exp =>
              exp.category === category.id &&
              exp.id !== "buggy-polaris-rs1" &&
              exp.id !== "buggy-canam-maverick-4seat"
            )

            return (
              <div key={category.id}>
                {/* Category Title with Divider */}
                <motion.div
                  className="flex items-center gap-4 mb-8 md:mb-10"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-tight">
                    {category.label}
                  </h3>
                  <div className="flex-1 h-1 bg-gradient-to-r from-orange-600 via-orange-500 to-transparent rounded-full"></div>
                </motion.div>

                {/* Vehicle Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
                  {categoryExperiences.map((experience, index) => (
                    <VehicleCard
                      key={experience.id}
                      experience={experience}
                      onBook={handleBookNow}
                      index={index}
                      tCommon={tCommon}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

interface VehicleCardProps {
  experience: Experience
  onBook: (experience: Experience) => void
  index: number
  tCommon: (key: string) => string
}

function VehicleCard({ experience, onBook, index, tCommon }: VehicleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={() => onBook(experience)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-[232px] sm:h-52 md:h-56 lg:h-64 overflow-hidden">
        <Image
          src={experience.images[0]}
          alt={`${experience.brand} ${experience.model}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Category Badge - Top Left */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
          <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
            {experience.category}
          </span>
        </div>

        {/* Price Badge - Top Right */}
        <div className="absolute top-3 right-3 px-3 py-1.5 bg-orange-600 rounded-lg shadow-lg">
          <div className="flex items-baseline gap-1">
            {experience.model === "MXU 300" ? (
              <>
                <span className="text-lg font-bold text-white">150</span>
                <span className="text-xs text-white/90">DHS/2h</span>
              </>
            ) : (
              <>
                <span className="text-lg font-bold text-white">{experience.pricing.oneHour.price}</span>
                <span className="text-xs text-white/90">DHS/hr</span>
              </>
            )}
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
            {experience.brand} {experience.model}
          </h3>
          <p className="text-sm text-white/90">
            {experience.specifications.power} • {experience.specifications.seats} {Number(experience.specifications.seats) > 1 ? tCommon('seats') : tCommon('seat')}
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="p-4 bg-white">
        <div className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-orange-600 text-white font-semibold text-sm rounded-lg transition-all group-hover:gap-3 group-hover:bg-orange-700">
          {tCommon('bookNow')}
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-orange-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}
