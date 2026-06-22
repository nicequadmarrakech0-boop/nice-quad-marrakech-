"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { SimpleLanguageSwitcher } from "./simple-language-switcher"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle smooth scrolling
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    // Only handle click if it's directly on the nav item
    if (e.target === e.currentTarget || e.target instanceof SVGElement || e.target instanceof HTMLSpanElement) {
      e.preventDefault()
      e.stopPropagation() // Stop event from bubbling up
      setActiveTab(item.name)
      
      const element = document.querySelector(item.url)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  // Update active tab based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3

      items.forEach((item) => {
        const element = document.querySelector(item.url)
        if (element) {
          const { offsetTop, offsetHeight } = element as HTMLElement
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveTab(item.name)
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [items])

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 sm:left-1/2 sm:-translate-x-1/2 left-0 right-0 sm:right-auto z-50 mb-0 sm:mb-6 sm:pt-6 pointer-events-none",
        className,
      )}
    >
      <div className="pointer-events-auto flex items-center justify-between gap-1 sm:gap-4 bg-white/95 dark:bg-neutral-950/95 border border-white/10 backdrop-blur-xl py-2.5 sm:py-2 px-2 sm:px-8 rounded-t-none rounded-b-3xl sm:rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] transition-all duration-300 sm:min-w-[960px] sm:h-[60px] w-full sm:w-auto">
        <div className="flex items-center pl-0 sm:pl-3 pr-1 sm:pr-4 shrink-0">
          <Image
            src="/logo.png"
            alt="Nice Quad Marrakech"
            width={48}
            height={48}
            className="rounded-full w-9 h-9 sm:!w-11 sm:!h-11 shrink-0"
          />
        </div>
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={(e) => handleClick(e, item)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-2 sm:px-6 py-2 sm:py-2 rounded-full transition-colors",
                "text-neutral-600 hover:text-primary dark:text-neutral-300",
                isActive && "bg-muted text-primary",
              )}
            >
              <span className="hidden md:inline pointer-events-none">{item.name}</span>
              <span className="md:hidden pointer-events-none">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10 pointer-events-none"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full pointer-events-none">
                    <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2 pointer-events-none" />
                    <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1 pointer-events-none" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2 pointer-events-none" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
        <SimpleLanguageSwitcher className="ml-1 sm:ml-2" />
      </div>
    </div>
  )
} 