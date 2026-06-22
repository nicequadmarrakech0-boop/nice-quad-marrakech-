"use client"

import { LandingHero } from "@/components/herosection"
import { LayoutGridDemo } from "@/components/blocks/gallerysection"
import { ExperiencesSectionNew } from "@/components/blocks/experiences-section-new"
import { TestimonialsSectionDemo } from "@/components/blocks/reviews-section"
import { MapSection } from "@/components/blocks/map-section"
import { DiscoverMarrakechGallery } from "@/components/blocks/discover-morocco"
import { BlogSection } from "@/components/blocks/blog-section"
import { StackedCircularFooter } from "@/components/ui/footer-section"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { HomeIcon, Briefcase, Image, MessageSquare, MapPin, Compass } from "lucide-react"
import { useTranslations } from "@/lib/i18n"

export default function LocalizedMainPage() {
  const t = useTranslations("nav")

  const navItems = [
    {
      name: t("home"),
      url: "#hero",
      icon: HomeIcon,
    },
    {
      name: t("experiences"),
      url: "#experiences",
      icon: Briefcase,
    },
    {
      name: t("gallery"),
      url: "#gallery",
      icon: Image,
    },
    {
      name: t("reviews"),
      url: "#testimonials",
      icon: MessageSquare,
    },
    {
      name: t("map"),
      url: "#location",
      icon: MapPin,
    },
    {
      name: t("explore"),
      url: "#discover",
      icon: Compass,
    },
  ]

  return (
    <>
      <div className="absolute inset-0 w-full h-24 bg-gradient-to-b from-orange-50 to-transparent z-[60] pointer-events-none" />
      <NavBar items={navItems} className="!fixed !top-0 !z-[70]" />

      <main className="relative min-h-screen w-full overflow-x-hidden bg-background">
        <section id="hero" className="relative bg-orange-50 overflow-hidden min-h-screen">
          <LandingHero />
        </section>
        <section id="experiences" className="relative z-10">
          <ExperiencesSectionNew />
        </section>
        <section id="gallery" className="relative z-10">
          <LayoutGridDemo />
        </section>
        <section id="testimonials" className="relative z-10">
          <TestimonialsSectionDemo />
        </section>
        <section id="location" className="relative z-10">
          <MapSection />
        </section>
        <section id="discover" className="relative z-10">
          <DiscoverMarrakechGallery />
        </section>
        <section id="blog" className="relative z-10">
          <BlogSection />
        </section>
        <StackedCircularFooter />
      </main>
    </>
  )
}
