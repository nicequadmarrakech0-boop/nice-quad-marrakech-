import { I18nProvider, Locale } from "@/lib/i18n"
import { notFound } from "next/navigation"

// Define locales here for server-side use (generateStaticParams runs on server)
const supportedLocales: Locale[] = ["en", "fr"]

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!supportedLocales.includes(locale as Locale)) {
    notFound()
  }

  return (
    <I18nProvider locale={locale as Locale}>
      {children}
    </I18nProvider>
  )
}
