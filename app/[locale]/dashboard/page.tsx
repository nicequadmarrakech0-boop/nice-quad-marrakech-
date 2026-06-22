"use client"

import { motion } from "motion/react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Star, MessageCircle, Images, Calendar, TrendingUp, Clock, ArrowUpRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const allReviews = useQuery(api.reviews.getAllReviewsForModeration)
  const allImages = useQuery(api.gallery.getAllImagesAdmin)
  const reviewStats = useQuery(api.reviews.getReviewStats)
  const bookingStats = useQuery(api.bookings.getBookingStats)
  const allBookings = useQuery(api.bookings.getAllBookings)

  // Show loading state while data is being fetched
  if (allReviews === undefined || allImages === undefined || reviewStats === undefined || bookingStats === undefined || allBookings === undefined) {
    return (
      <div className="max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px] pt-16 lg:pt-0">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  const pendingReviews = allReviews.filter(r => r.status === 'pending')
  const recentBookings = allBookings.slice(0, 5)

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pt-16 lg:pt-0">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2"
      >
        <h1 className="text-2xl font-semibold text-neutral-900">لوحة التحكم</h1>
        <p className="text-sm text-neutral-600">راقب أداء عملك وإدارة العمليات</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {/* Total Bookings */}
        {bookingStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-white border border-neutral-200 rounded-lg p-3 sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-medium text-neutral-600">إجمالي الحجوزات</p>
                <p className="text-3xl font-semibold text-neutral-900">
                  {bookingStats.totalBookings}
                </p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Pending Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-white border border-neutral-200 rounded-lg p-3 sm:p-6"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium text-neutral-600">التقييمات قيد الانتظار</p>
              <p className="text-3xl font-semibold text-neutral-900">
                {pendingReviews.length}
              </p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </motion.div>

        {/* Gallery Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white border border-neutral-200 rounded-lg p-3 sm:p-6"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium text-neutral-600">صور المعرض</p>
              <p className="text-3xl font-semibold text-neutral-900">
                {allImages.length}
              </p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Images className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </motion.div>

        {/* Total Revenue */}
        {bookingStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="bg-white border border-neutral-200 rounded-lg p-3 sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-medium text-neutral-600">إجمالي الإيرادات</p>
                <p className="text-3xl font-semibold text-neutral-900">
                  {bookingStats.totalRevenue.toLocaleString()} <span className="text-xl text-neutral-600">DHS</span>
                </p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Link
            href="/dashboard/bookings"
            className="group block bg-white border border-neutral-200 rounded-lg p-6 hover:border-orange-300 hover:bg-orange-50/50 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-medium text-neutral-900">إدارة الحجوزات</h3>
                <p className="text-sm text-neutral-600">
                  {bookingStats?.pending || 0} طلب قيد الانتظار
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover:text-orange-600 transition-colors" />
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <Link
            href="/dashboard/reviews"
            className="group block bg-white border border-neutral-200 rounded-lg p-6 hover:border-orange-300 hover:bg-orange-50/50 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-medium text-neutral-900">إدارة التقييمات</h3>
                <p className="text-sm text-neutral-600">
                  {pendingReviews.length} في انتظار الموافقة
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover:text-orange-600 transition-colors" />
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Link
            href="/dashboard/gallery"
            className="group block bg-white border border-neutral-200 rounded-lg p-6 hover:border-orange-300 hover:bg-orange-50/50 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-medium text-neutral-900">إدارة المعرض</h3>
                <p className="text-sm text-neutral-600">
                  {allImages.length} صورة محملة
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover:text-orange-600 transition-colors" />
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="bg-white border border-neutral-200 rounded-lg"
          >
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-neutral-900">الحجوزات الأخيرة</h3>
                <Link
                  href="/dashboard/bookings"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  عرض الكل
                </Link>
              </div>
            </div>
            <div className="divide-y divide-neutral-200">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="p-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 truncate">{booking.customerName}</p>
                      <p className="text-sm text-neutral-600 mt-1">{booking.vehicleType}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-medium text-neutral-900">{booking.totalPrice.toLocaleString()} DHS</p>
                      <span className={`inline-block mt-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                        booking.status === 'pending' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        booking.status === 'confirmed' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        booking.status === 'completed' ? 'bg-neutral-100 text-neutral-700 border border-neutral-200' :
                        'bg-neutral-100 text-neutral-600 border border-neutral-200'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Review Stats */}
        {reviewStats && reviewStats.totalReviews > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="bg-white border border-neutral-200 rounded-lg"
          >
            <div className="p-6 border-b border-neutral-200">
              <h3 className="font-medium text-neutral-900">إحصائيات التقييمات</h3>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-8">
                <div className="space-y-2">
                  <div className="text-4xl font-semibold text-neutral-900">
                    {reviewStats.averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={
                          star <= Math.round(reviewStats.averageRating)
                            ? 'text-orange-500 fill-orange-500'
                            : 'text-neutral-300'
                        }
                      />
                    ))}
                  </div>
                  <p className="text-sm text-neutral-600">{reviewStats.totalReviews} تقييم</p>
                </div>
                <div className="flex-1 space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="text-sm text-neutral-600 w-8">{rating}★</div>
                      <div className="flex-1 bg-neutral-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-orange-500 h-full rounded-full transition-all"
                          style={{
                            width: `${
                              reviewStats.totalReviews > 0
                                ? (reviewStats.distribution[rating] / reviewStats.totalReviews) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-sm text-neutral-600 w-8 text-right">
                        {reviewStats.distribution[rating]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
