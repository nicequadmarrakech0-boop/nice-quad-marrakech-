"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Star, Filter, Search, User, Calendar, Quote, Plus, ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ReviewModal } from '@/components/ui/ReviewModal'
import { StackedCircularFooter } from '@/components/ui/footer-section'
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from 'next/navigation'
import { useTranslations } from '@/lib/i18n'

function ReviewsPageContent() {
  const router = useRouter()
  const t = useTranslations('reviews')
  const tCommon = useTranslations('common')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating-high' | 'rating-low'>('newest')

  // Modal state
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleReviewClick = (review: any) => {
    setSelectedReview(review)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedReview(null)
  }

  // Get all approved reviews from Convex
  const allReviewsQuery = useQuery(api.reviews.getAllApprovedReviews)
  const allReviews = allReviewsQuery ?? []
  const isLoading = allReviewsQuery === undefined

  // Filter and sort reviews
  const filteredReviews = allReviews
    ?.filter(review => {
      const matchesSearch = searchTerm === '' ||
        review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.carName.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    })
    ?.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt - a.createdAt
        case 'oldest':
          return a.createdAt - b.createdAt
        case 'rating-high':
          return b.rating - a.rating
        case 'rating-low':
          return a.rating - b.rating
        default:
          return b.createdAt - a.createdAt
      }
    })

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const calculateStats = () => {
    if (!allReviews || allReviews.length === 0) return { average: 0, distribution: {} }

    const total = allReviews.reduce((sum, review) => sum + review.rating, 0)
    const average = total / allReviews.length

    const distribution = allReviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    return { average, distribution }
  }

  const stats = calculateStats()

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Floating Back Button */}
      <motion.button
        onClick={() => router.push("/")}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-full shadow-lg hover:shadow-xl text-gray-700 hover:text-orange-600 transition-all group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold">{tCommon('back')}</span>
      </motion.button>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-600 text-white mb-3 shadow-sm">
            <Star className="w-3.5 h-3.5" />
            <span className="font-semibold text-xs tracking-wide uppercase">{t('customerReviews')}</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            {t('pageTitle')} <span className="text-orange-600">{t('pageTitleHighlight')}</span> {t('pageTitleEnd')}
          </h1>

          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto mb-6">
            {t('pageSubtitle')}
          </p>

          {/* Stats */}
          {allReviews && allReviews.length > 0 && (
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.average.toFixed(1)}</div>
                <div className="text-xs text-gray-600">{t('averageRating')}</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{allReviews.length}</div>
                <div className="text-xs text-gray-600">{t('totalReviews')}</div>
              </div>
            </div>
          )}
        </div>

        {/* Sort Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          
        </motion.div>

        {/* Reviews Grid */}
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden animate-pulse">
                  <div className="p-6 space-y-3">
                    <div className="h-2 w-16 bg-gray-200 rounded"></div>
                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                    <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-5 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredReviews && filteredReviews.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredReviews.map((review, index) => (
                  <motion.article
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    onClick={() => handleReviewClick(review)}
                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xl hover:shadow-2xl hover:border-orange-200 transition-all duration-300 h-full flex flex-col cursor-pointer"
                  >
                  {/* Quote Icon */}
                  <div className="mb-3">
                    <Quote className="w-7 h-7 text-orange-600/20" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={14} className="text-orange-600 fill-orange-600" />
                    ))}
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <Star key={i} size={14} className="text-gray-300" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-grow line-clamp-4">
                    "{review.comment}"
                  </p>

                  {/* Author Info */}
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <div className="font-semibold text-gray-900 text-sm">{review.name}</div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={11} />
                        {formatDate(review.createdAt)}
                      </div>
                      <div className="inline-flex items-center px-2.5 py-1 bg-orange-50 text-orange-900 rounded-md text-xs font-semibold border border-orange-200">
                        {review.carName}
                      </div>
                    </div>
                  </div>
                  </motion.article>
                ))}
              </div>

              {/* Add Review CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center"
              >
                <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 max-w-lg mx-auto border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t('shareExperience')}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {t('shareExperienceDesc')}
                  </p>
                  <a
                    href="https://g.page/r/Cc0hz0Bqxb3zEAE/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:scale-[1.02]"
                  >
                    <Plus size={16} />
                    {t('addReview')}
                  </a>
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-200 max-w-md mx-auto">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('noReviewsFound')}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {searchTerm ? t('tryAdjusting') : t('beFirst')}
                </p>
                <a
                  href="https://g.page/r/Cc0hz0Bqxb3zEAE/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:scale-[1.02]"
                >
                  <Plus size={16} />
                  {t('addReview')}
                </a>
              </div>
            </motion.div>
          )}
        </div>

        {/* Review Modal */}
        <ReviewModal
          review={selectedReview}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>

      <StackedCircularFooter />
    </div>
  )
}

export default function ReviewsPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show loading state during SSR/hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return <ReviewsPageContent />
}
