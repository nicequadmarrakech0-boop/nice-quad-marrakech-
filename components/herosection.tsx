"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { MapPin, Star, Shield, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "@/lib/i18n"

const heroImage = "https://lupz513xt9.ufs.sh/f/3n8dSxhfsmQPE5lZg72J7wGsO3TIRMWBjcue4XA05YzmlyrC"

const offeringsData = [
  {
    titleKey: "quadBiking",
    descKey: "quadDesc",
    price: "150 DHS",
    image: "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.52%20(3).jpeg?updatedAt=1760794996966",
    tag: "QUAD",
  },
  {
    titleKey: "buggyTours",
    descKey: "buggyDesc",
    price: "1400 DHS",
    image: "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.50.jpeg?updatedAt=1760793588311",
    tag: "BUGGY",
  },
  {
    titleKey: "motocross",
    descKey: "motocrossDesc",
    price: "1000 DHS",
    image: "https://ik.imagekit.io/momh2323/CSP00463.jpg?updatedAt=1762862350363",
    tag: "MOTO CROSS",
  },
]

function LandingHero() {
  const t = useTranslations("hero")
  const [currentIndex, setCurrentIndex] = useState(0)

  const stats = [
    { icon: Users, label: t("stats.vehicles"), value: t("stats.premiumFleet") },
    { icon: Shield, label: t("stats.fullyInsured"), value: t("stats.safeSecure") },
    { icon: Star, label: t("stats.expertGuides"), value: t("stats.allSkillLevels") },
  ]

  const offerings = offeringsData.map((o) => ({
    ...o,
    title: t(`offerings.${o.titleKey}`),
    description: t(`offerings.${o.descKey}`),
  }))

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % offerings.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + offerings.length) % offerings.length)
  }

  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offerings.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const currentOffering = offerings[currentIndex]

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-orange-50">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            className="flex flex-col space-y-5 md:space-y-6 lg:space-y-7 order-2 lg:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Location Badge */}
            <motion.div
              className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full bg-orange-600 text-white shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-semibold tracking-wide uppercase">{t("location")}</span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-3 md:space-y-4">
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                <span className="text-orange-600">{t("title")}</span>
                <br />
                {t("subtitle")}
              </motion.h1>

              <motion.p
                className="text-base text-gray-600 max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {t("description")} <span className="font-semibold text-orange-600">{t("descriptionHighlight")}</span> {t("descriptionSuffix")}
              </motion.p>
            </div>

            {/* Carousel Section - Mobile Only */}
            <motion.div
              className="lg:hidden relative w-full h-[450px] rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  className="relative w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  {/* Main Image */}
                  <Image
                    src={currentOffering.image}
                    alt={currentOffering.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg">
                    {currentOffering.tag}
                  </div>

                  {/* Floating Info Card */}
                  <motion.div
                    className="absolute bottom-4 left-4 right-4 p-5 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{currentOffering.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{currentOffering.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-orange-600">{currentOffering.price}</span>
                          <span className="text-sm text-gray-500">/hour</span>
                        </div>
                        <div className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                          <Star className="w-4 h-4 text-orange-600 fill-orange-600 flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-900">4.9</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                aria-label="Previous offering"
              >
                <ChevronLeft className="w-5 h-5 text-gray-900" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                aria-label="Next offering"
              >
                <ChevronRight className="w-5 h-5 text-gray-900" />
              </button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              className="grid grid-cols-3 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start p-3 md:p-5 rounded-xl bg-gray-50 border border-gray-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300"
                >
                  <stat.icon className="w-5 h-5 text-orange-600 flex-shrink-0 mb-1.5" />
                  <p className="text-xs text-gray-500 uppercase tracking-wide leading-tight">{stat.label}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 leading-tight">{stat.value}</p>
                </div>
              ))}
            </motion.div>

            {/* Price Indicator */}
            <motion.div
              className="inline-flex flex-wrap items-baseline gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-orange-600">150 DHS</span>
              <span className="text-base md:text-lg text-gray-600 font-medium">/hour</span>
              <span className="text-sm text-gray-600">{t("startingFrom")}</span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 pt-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <Link
                href="#experiences"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('experiences')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
                className="w-full sm:w-auto"
              >
                <motion.button
                  className="w-full sm:w-auto px-6 md:px-7 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t("viewFleet")}
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Carousel Section - Desktop Only */}
          <motion.div
            className="hidden lg:block relative w-full h-[450px] md:h-[500px] lg:h-[580px] rounded-2xl overflow-hidden shadow-2xl order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="relative w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {/* Main Image */}
                <Image
                  src={currentOffering.image}
                  alt={currentOffering.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg">
                  {currentOffering.tag}
                </div>

                {/* Floating Info Card */}
                <motion.div
                  className="absolute bottom-4 left-4 right-4 md:bottom-5 md:left-5 md:right-5 p-5 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 shadow-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{currentOffering.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{currentOffering.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-orange-600">{currentOffering.price}</span>
                        <span className="text-sm text-gray-500">/hour</span>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                        <Star className="w-4 h-4 text-orange-600 fill-orange-600 flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-900">4.9</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
              aria-label="Previous offering"
            >
              <ChevronLeft className="w-5 h-5 text-gray-900" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
              aria-label="Next offering"
            >
              <ChevronRight className="w-5 h-5 text-gray-900" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export { LandingHero }
