"use client"

import React, { createContext, useContext, ReactNode } from "react"

// Import translations
import en from "@/messages/en.json"
import fr from "@/messages/fr.json"

export type Locale = "en" | "fr"

const translations: Record<Locale, typeof en> = {
  en,
  fr,
}

export const locales: Locale[] = ["en", "fr"]
export const defaultLocale: Locale = "en"

type TranslationValue = string | Record<string, unknown>

interface I18nContextType {
  locale: Locale
  t: (key: string) => string
  messages: typeof en
}

const I18nContext = createContext<I18nContextType | null>(null)

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".")
  let current: unknown = obj

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path // Return the key if not found
    }
  }

  return typeof current === "string" ? current : path
}

export function I18nProvider({
  children,
  locale,
}: {
  children: ReactNode
  locale: Locale
}) {
  const messages = translations[locale] || translations.en

  const t = (key: string): string => {
    return getNestedValue(messages as Record<string, unknown>, key)
  }

  return (
    <I18nContext.Provider value={{ locale, t, messages }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslations(namespace?: string) {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error("useTranslations must be used within an I18nProvider")
  }

  const { t, messages, locale } = context

  // Return a function that prepends the namespace
  const translate = (key: string): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    return t(fullKey)
  }

  return translate
}

export function useLocale(): Locale {
  const context = useContext(I18nContext)

  if (!context) {
    // Default to 'en' if used outside provider (for SSR or initial render)
    return "en"
  }

  return context.locale
}

// Helper to get locale from pathname
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split("/").filter(Boolean)
  const firstSegment = segments[0]

  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale
  }

  return defaultLocale
}

// Helper to create localized href
export function getLocalizedHref(href: string, locale: Locale): string {
  // If locale is default (en), no prefix needed
  if (locale === defaultLocale) {
    return href
  }

  // Add locale prefix
  if (href.startsWith("/")) {
    return `/${locale}${href}`
  }

  return `/${locale}/${href}`
}
