"use client"

import { useClerk } from '@clerk/nextjs'
import { LogOut, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedPage() {
  const { signOut } = useClerk()

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 mb-3">
          Access Denied
        </h1>

        <p className="text-neutral-600 mb-6">
          You don't have permission to access the dashboard. This area is restricted to authorized administrators only.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out & Return Home
          </button>

          <Link
            href="/"
            className="block w-full px-6 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors font-medium"
          >
            Go to Homepage
          </Link>
        </div>

        <p className="text-sm text-neutral-500 mt-6">
          If you believe this is an error, please contact the administrator.
        </p>
      </div>
    </div>
  )
}
