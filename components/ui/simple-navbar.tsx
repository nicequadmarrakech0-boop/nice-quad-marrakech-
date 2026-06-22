"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface SimpleNavBarProps {
  items: NavItem[]
  className?: string
}

export function SimpleNavBar({ items, className }: SimpleNavBarProps) {
  return (
    <div className={cn(
      "fixed top-0 left-1/2 -translate-x-1/2 z-50 pt-6 pointer-events-none",
      className,
    )}>
      <div className="pointer-events-auto flex items-center justify-center gap-4 bg-white/95 border border-gray-200 backdrop-blur-xl py-2 px-8 rounded-full shadow-lg">
        <Link href="/" className="flex items-center pr-4 shrink-0">
          <Image
            src="/logo.png"
            alt="Nice Quad Marrakech"
            width={44}
            height={44}
            className="rounded-full"
          />
        </Link>
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.url}
              className="relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors text-neutral-600 hover:text-orange-600 hover:bg-orange-50"
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
