"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { useTranslations } from "@/lib/i18n"

interface GalleryItem {
  id: number
  image: string
  cityKey: string
  alt: string
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    image: "https://ik.imagekit.io/momh2323/aggafay.jpg?updatedAt=1745514931795",
    cityKey: "marrakech",
    alt: "Marrakech quad biking Morocco imperial city desert tours"
  },
  {
    id: 2,
    image: "https://ik.imagekit.io/momh2323/marzougaa.jpg?updatedAt=1759869843373",
    cityKey: "merzouga",
    alt: "Merzouga Sahara Desert quad biking Morocco Erg Chebbi"
  },
  {
    id: 3,
    image: "https://ik.imagekit.io/momh2323/esaouiraaa.jpg?updatedAt=1759869843456",
    cityKey: "essaouira",
    alt: "Essaouira coastal quad biking Morocco Atlantic beach"
  },
  {
    id: 4,
    image: "https://ik.imagekit.io/momh2323/1156553319_Ouarzazate.webp?updatedAt=1759869927390",
    cityKey: "ouarzazate",
    alt: "Ouarzazate quad biking Morocco desert gateway atlas"
  },
  {
    id: 5,
    image: "https://ik.imagekit.io/momh2323/fes%202.jpg?updatedAt=1759869843581",
    cityKey: "fes",
    alt: "Fes quad biking Morocco imperial city cultural tours"
  },
  {
    id: 6,
    image: "https://ik.imagekit.io/momh2323/agadir%203.webp?updatedAt=1759869927396",
    cityKey: "agadir",
    alt: "Agadir beach quad biking Morocco coastal adventures"
  }
]

export function DiscoverMarrakechGallery() {
  const t = useTranslations("discover")
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section className="relative py-16 md:py-24 lg:py-32 bg-orange-50 overflow-hidden">
      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "name": "Marrakech Quad & Buggy Adventures",
            "description": "Premium quad biking, buggy tours, and motocross adventures in Marrakech, Morocco. Experience the Atlas Mountains, desert dunes, and palm groves with expert local guides.",
            "url": "https://nicequadmarrakech.com",
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "31.6295",
              "longitude": "-7.9811"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Marrakech",
              "addressCountry": "Morocco"
            },
            "image": galleryItems.map(item => item.image),
            "touristType": ["Adventure Seekers", "Nature Lovers", "Photography Enthusiasts"],
            "availableLanguage": ["English", "French", "Arabic"]
          })
        }}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            {t("title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Accordion Gallery - Vertical on Mobile, Horizontal on Desktop */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-2 md:h-[400px] lg:h-[450px]">
          {galleryItems.map((item) => {
            const isActive = hoveredId === item.id

            return (
            <motion.div
              key={item.id}
              className="relative overflow-hidden rounded-xl cursor-pointer w-full md:w-auto flex-none md:flex-1"
              onClick={() => setHoveredId(isActive ? null : item.id)}
              onMouseEnter={(e) => {
                // Only trigger hover on non-touch devices (desktop)
                if (window.matchMedia('(hover: hover)').matches) {
                  setHoveredId(item.id)
                }
              }}
              onMouseLeave={(e) => {
                // Only clear hover on non-touch devices (desktop)
                if (window.matchMedia('(hover: hover)').matches) {
                  setHoveredId(null)
                }
              }}
              animate={{
                flexGrow: isActive ? 5 : 1
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 35
              }}
              initial={false}
            >
              {/* Mobile height animation wrapper */}
              <motion.div
                className="relative w-full h-full md:h-full"
                animate={{
                  height: isMobile
                    ? (isActive ? '350px' : '120px')
                    : '100%'
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 35
                }}
                initial={false}
              >
              {/* Background Image */}
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h3 className="text-white font-bold text-lg md:text-xl lg:text-2xl mb-1 md:mb-2 leading-tight">
                  {t(`cities.${item.cityKey}.title`)}
                </h3>

                {isActive && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="text-white text-xs sm:text-sm lg:text-base font-medium leading-relaxed"
                  >
                    {t(`cities.${item.cityKey}.description`)}
                  </motion.p>
                )}
              </div>

              {/* Orange Border on Active */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 border-2 md:border-3 border-orange-500 rounded-xl pointer-events-none"
                />
              )}
              </motion.div>
            </motion.div>
            )
          })}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12 md:mt-16"
        >
          
        </motion.div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  )
}
