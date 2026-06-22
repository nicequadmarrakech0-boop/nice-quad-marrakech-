"use client"

import { useUser, UserButton, useClerk } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageCircle, Images, Calendar, Home, ChevronLeft, Menu, X, LogOut, BookOpen } from 'lucide-react'
import { useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-600 border-t-transparent"></div>
      </div>
    )
  }

  const navigation = [
    { name: 'نظرة عامة', href: '/dashboard', icon: LayoutDashboard },
    { name: 'الحجوزات', href: '/dashboard/bookings', icon: Calendar },
    { name: 'التقييمات', href: '/dashboard/reviews', icon: MessageCircle },
    { name: 'معرض الصور', href: '/dashboard/gallery', icon: Images },
    { name: 'المدونة', href: '/dashboard/blogs', icon: BookOpen },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 font-arabic" dir="rtl">
      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'} bg-white border-l border-neutral-200 z-40`}>
        {/* Logo Section */}
        <div className="flex h-20 items-center justify-between px-6">
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
                Nice Quad
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">Marrakech</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-all"
          >
            <ChevronLeft className={`w-4 h-4 text-neutral-600 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-700'}`} />
                {!sidebarCollapsed && <span className="text-sm">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-neutral-700 hover:bg-neutral-100 transition-all"
            title={sidebarCollapsed ? 'View Site' : undefined}
          >
            <Home className="w-5 h-5 flex-shrink-0 text-neutral-500" />
            {!sidebarCollapsed && <span className="text-sm">عرض الموقع</span>}
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all"
            title={sidebarCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="fixed inset-y-0 right-0 w-72 bg-white border-l border-neutral-200 shadow-2xl flex flex-col">
            {/* Logo Section */}
            <div className="flex h-20 items-center justify-between px-6">
              <div>
                <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
                  Nice Quad
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">Marrakech</p>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-all"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-700'}`} />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-neutral-700 hover:bg-neutral-100 transition-all"
              >
                <Home className="w-5 h-5 flex-shrink-0 text-neutral-500" />
                <span className="text-sm">عرض الموقع</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">تسجيل الخروج</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pr-20' : 'lg:pr-72'}`}>
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 right-4 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-3 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 transition-all shadow-sm"
          >
            <Menu className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        {/* Page Content */}
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
