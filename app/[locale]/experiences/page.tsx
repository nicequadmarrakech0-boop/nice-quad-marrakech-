"use client"

import React from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { useRouter } from "next/navigation"
import { experiences, type Experience } from "@/data/experiences"
import { BreadcrumbSchema } from "@/components/seo/structured-data"
import { ArrowRight, Gauge, Users, Zap, Settings, ChevronLeft } from "lucide-react"
import { StackedCircularFooter } from "@/components/ui/footer-section"
import { useTranslations, useLocale, defaultLocale } from "@/lib/i18n"

export default function ExperiencesPage() {
  const router = useRouter()
  const t = useTranslations('experiences')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  const handleBookNow = (experience: Experience) => {
    const path = `/booking?id=${experience.id}`
    const localizedPath = locale === defaultLocale ? path : `/${locale}${path}`
    router.push(localizedPath)
  }

  const displayedExperiences = experiences.filter(exp => exp.id !== "buggy-polaris-rs1" && exp.id !== "buggy-canam-maverick-4seat")

  return (
    <>
      {/* Structured Data for SEO */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://nicequadmarrakech.com" },
          { name: "Experiences", url: "https://nicequadmarrakech.com/experiences" },
        ]}
      />

      <div className="min-h-screen bg-orange-50">
        {/* Floating Back Button */}
        <motion.button
          onClick={() => router.push("/")}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-full shadow-lg hover:shadow-xl text-gray-700 hover:text-orange-600 transition-all group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">{tCommon('backHome')}</span>
        </motion.button>

        {/* Hero Section */}
        <section className="relative pt-20 pb-12 md:pt-24 md:pb-16 overflow-hidden">
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-4 md:space-y-5"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 tracking-tight">
                {t('pageTitle')}{" "}
                <span className="text-orange-600 inline-block">
                  {t('pageTitleHighlight')}
                </span>
              </h1>

              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                {t('pageSubtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Experiences Grid */}
        <section className="relative z-10 pb-16 md:pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
              {displayedExperiences.map((experience, index) => (
                <VehicleCard
                  key={experience.id}
                  experience={experience}
                  onBook={handleBookNow}
                  index={index}
                  t={t}
                  tCommon={tCommon}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <StackedCircularFooter />
      </div>
    </>
  )
}

interface VehicleCardProps {
  experience: Experience
  onBook: (experience: Experience) => void
  index: number
  t: (key: string) => string
  tCommon: (key: string) => string
}

function VehicleCard({ experience, onBook, index, t, tCommon }: VehicleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.05, duration: 0.4 }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={() => onBook(experience)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-[232px] sm:h-52 md:h-56 overflow-hidden flex-shrink-0">
        <Image
          src={experience.images[0]}
          alt={`${experience.brand} ${experience.model} - ${experience.category} rental in Marrakech`}
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
            <span className="text-lg font-bold text-white">{experience.pricing.oneHour.price}</span>
            <span className="text-xs text-white/90">DHS/hr</span>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
            {experience.brand} {experience.model}
          </h3>
          <p className="text-sm text-white/90">
            {experience.specifications.power} • {experience.specifications.seats} {Number(experience.specifications.seats) > 1 ? tCommon('seats') : tCommon('seat')}
          </p>
        </div>
      </div>

      {/* Vehicle Information Section */}
      <div className="p-4 flex-1 flex flex-col bg-white space-y-4">
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {experience.description}
        </p>

        {/* Technical Specifications Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
            <Gauge className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">{t('specs.power')}</p>
              <p className="font-semibold text-xs text-gray-900 truncate">{experience.specifications.power}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
            <Zap className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">{t('specs.engine')}</p>
              <p className="font-semibold text-xs text-gray-900 truncate">{experience.engineSize}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
            <Users className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">{t('specs.capacity')}</p>
              <p className="font-semibold text-xs text-gray-900 truncate">
                {experience.specifications.seats} {Number(experience.specifications.seats) > 1 ? tCommon('seats') : tCommon('seat')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
            <Settings className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">{t('specs.type')}</p>
              <p className="font-semibold text-xs text-gray-900 truncate">{experience.specifications.transmission}</p>
            </div>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-gray-600">{tCommon('startingFrom')}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-orange-600">{experience.pricing.oneHour.price}</span>
              <span className="text-sm text-gray-600">{experience.pricing.oneHour.currency}{tCommon('perHour')}</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-orange-600 text-white font-semibold text-sm rounded-lg transition-all group-hover:gap-3 group-hover:bg-orange-700">
            {tCommon('bookNow')}
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-orange-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}
