"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
]

const locales = ["en", "fr"]
const defaultLocale = "en"

function setCookie(name: string, value: string, days: number = 365) {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`
}

export function SimpleLanguageSwitcher({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Get current locale from pathname
  const getCurrentLocale = (): string => {
    const segments = pathname.split("/").filter(Boolean)
    const firstSegment = segments[0]

    if (firstSegment && locales.includes(firstSegment)) {
      return firstSegment
    }
    return defaultLocale
  }

  const currentLocale = getCurrentLocale()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLanguageChange = (langCode: string) => {
    // Set cookie for preference persistence
    setCookie("NEXT_LOCALE", langCode)
    setIsOpen(false)

    // Get path without current locale prefix
    let pathWithoutLocale = pathname
    const segments = pathname.split("/").filter(Boolean)

    if (segments[0] && locales.includes(segments[0])) {
      pathWithoutLocale = "/" + segments.slice(1).join("/")
    }

    // If path is empty after removing locale, use root
    if (pathWithoutLocale === "" || pathWithoutLocale === "/") {
      pathWithoutLocale = "/"
    }

    // Navigate to new locale
    if (langCode === defaultLocale) {
      // For default locale (en), navigate to path without prefix
      router.push(pathWithoutLocale)
    } else {
      // For other locales, add prefix
      router.push(`/${langCode}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`)
    }
  }

  const currentLang = languages.find((l) => l.code === currentLocale) || languages[0]

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-full transition-colors",
          "text-neutral-600 hover:text-primary dark:text-neutral-300",
          "hover:bg-muted/50"
        )}
        aria-label="Select language"
      >
        <span className="text-base">{currentLang.flag}</span>
        <span className="hidden sm:inline text-sm font-semibold uppercase">
          {currentLang.code}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden min-w-[140px] z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors",
                "hover:bg-muted/50",
                currentLocale === lang.code
                  ? "text-primary font-semibold bg-primary/5"
                  : "text-neutral-600 dark:text-neutral-300"
              )}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
