"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal';
  className?: string;
}

export function LanguageSwitcher({ variant = 'default', className = '' }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLocale = (newLocale: string) => {
    // Remove the current locale from the pathname if it exists
    let newPathname = pathname;

    // Check if pathname starts with a locale
    const localePattern = /^\/(en|fr)(\/|$)/;
    if (localePattern.test(pathname)) {
      newPathname = pathname.replace(localePattern, '/');
    }

    // If new locale is not the default (en), prepend it
    if (newLocale !== 'en') {
      newPathname = `/${newLocale}${newPathname === '/' ? '' : newPathname}`;
    }

    // Ensure we have a valid path
    if (!newPathname || newPathname === '') {
      newPathname = '/';
    }

    router.push(newPathname);
    setIsOpen(false);
  };

  if (variant === 'minimal') {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
          aria-label="Switch language"
        >
          <span className="text-base">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 min-w-[140px]"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => switchLocale(lang.code)}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-orange-50 transition-colors ${
                    locale === lang.code ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                  {locale === lang.code && (
                    <Check className="w-4 h-4 ml-auto text-orange-600" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:border-orange-300 transition-all"
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4 text-orange-600" />
        <span className="text-sm font-semibold text-gray-700">{currentLanguage.flag} {currentLanguage.code.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 min-w-[160px]"
          >
            <div className="p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => switchLocale(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-orange-50 transition-colors ${
                    locale === lang.code ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-semibold">{lang.name}</span>
                  {locale === lang.code && (
                    <Check className="w-4 h-4 ml-auto text-orange-600" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile language switcher - shows at the top on mobile devices
export function MobileLanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    let newPathname = pathname;
    const localePattern = /^\/(en|fr)(\/|$)/;
    if (localePattern.test(pathname)) {
      newPathname = pathname.replace(localePattern, '/');
    }
    if (newLocale !== 'en') {
      newPathname = `/${newLocale}${newPathname === '/' ? '' : newPathname}`;
    }
    if (!newPathname || newPathname === '') {
      newPathname = '/';
    }
    router.push(newPathname);
  };

  return (
    <div className="fixed top-[72px] left-0 right-0 z-[60] flex items-center justify-center gap-2 py-2 px-4 bg-white/95 backdrop-blur-sm border-b border-gray-200 sm:hidden">
      <Globe className="w-4 h-4 text-orange-600" />
      <button
        onClick={() => switchLocale('en')}
        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
          locale === 'en'
            ? 'bg-orange-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale('fr')}
        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
          locale === 'fr'
            ? 'bg-orange-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
        }`}
      >
        FR
      </button>
    </div>
  );
}
