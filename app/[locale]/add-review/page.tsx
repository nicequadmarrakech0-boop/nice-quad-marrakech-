"use client"

export const dynamic = 'force-dynamic'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, ArrowLeft, MapPin, Send, CheckCircle, Search, ChevronDown, Check, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { StackedCircularFooter } from '@/components/ui/footer-section'
import { experiences } from '@/data/experiences'
import { useTranslations } from '@/lib/i18n'

interface ReviewFormData {
  carId: string
  name: string
  email: string
  rating: number
  comment: string
}

interface ReviewFormErrors {
  carId?: string
  name?: string
  email?: string
  rating?: string
  comment?: string
}

function AddReviewPageContent() {
  const router = useRouter()
  const t = useTranslations('addReview')
  const tCommon = useTranslations('common')
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState<ReviewFormData>({
    carId: '',
    name: '',
    email: '',
    rating: 0,
    comment: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<ReviewFormErrors>({})

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCar, setSelectedCar] = useState<any>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Submit review function (fake - just shows success)
  const submitReview = async (data: {
    carName: string;
    name: string;
    email: string;
    rating: number;
    comment: string;
  }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Review submitted (fake):', data);
    return 'review-fake-id';
  };

  // Filter experiences based on search term
  const filteredCars = experiences.filter(exp =>
    exp.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const validateForm = (): boolean => {
    const newErrors: ReviewFormErrors = {}

    if (!formData.carId) newErrors.carId = t('errors.selectVehicle')
    if (!formData.name.trim()) newErrors.name = t('errors.nameRequired')
    if (!formData.email.trim()) newErrors.email = t('errors.emailRequired')
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('errors.emailInvalid')
    if (formData.rating === 0) newErrors.rating = t('errors.ratingRequired')
    if (!formData.comment.trim()) newErrors.comment = t('errors.commentRequired')
    if (formData.comment.length < 10) newErrors.comment = t('errors.commentMinLength')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await submitReview({
        carName: selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : '',
        name: formData.name.trim(),
        email: formData.email.trim(),
        rating: formData.rating,
        comment: formData.comment.trim()
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }))
    }
  }

  const handleCarSelect = (car: any) => {
    setSelectedCar(car)
    setFormData(prev => ({ ...prev, carId: car.id }))
    setIsDropdownOpen(false)
    setSearchTerm('')
    if (errors.carId) {
      setErrors(prev => ({ ...prev, carId: undefined }))
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center py-20">
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

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 text-center border border-gray-200 max-w-2xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/50 ring-4 ring-green-100"
            >
              <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            >
              {t('thankYou')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base text-gray-600 mb-8 leading-relaxed"
            >
              {t('successMessage')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:scale-[1.02]"
              >
                {t('backToHome')}
              </Link>
              <Link
                href="/reviews"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 border-2 border-orange-200 hover:border-orange-300 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all hover:scale-[1.02] shadow-lg"
              >
                {t('viewAllReviews')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!mounted) {
    return <div className="flex items-center justify-center min-h-screen bg-orange-50">{tCommon('loading')}</div>
  }

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
            <span className="font-semibold text-xs tracking-wide uppercase">{t('shareExperience')}</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            {t('title')} <span className="text-orange-600">{t('titleHighlight')}</span>
          </h1>

          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-5 lg:p-6 border border-gray-200 max-w-3xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fleet Selection - Custom Searchable Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('vehicleQuestion')} *
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200 text-left flex items-center justify-between ${
                    errors.carId ? 'border-orange-300 focus:border-orange-500' : 'border-gray-300 focus:border-orange-500'
                  } ${selectedCar ? 'text-gray-900' : 'text-gray-500'}`}
                >
                  <span className="truncate">
                    {selectedCar ? `${selectedCar.brand} ${selectedCar.model} - ${selectedCar.category}` : t('selectVehicle')}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-100">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder={t('searchVehicles')}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 transition-colors duration-200 text-sm"
                        />
                      </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto">
                      {filteredCars.length > 0 ? (
                        filteredCars.map((car) => (
                          <button
                            key={car.id}
                            type="button"
                            onClick={() => handleCarSelect(car)}
                            className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors duration-200 border-b border-gray-50 last:border-b-0 flex items-center justify-between group"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate group-hover:text-orange-700">
                                {car.brand} {car.model}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-semibold">
                                  {car.category}
                                </span>
                                <span>•</span>
                                <span>{car.engineSize}</span>
                              </div>
                            </div>
                            {selectedCar?.id === car.id && (
                              <Check size={16} className="text-orange-600 ml-2" />
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-gray-500">
                          <Search size={24} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm">{t('noVehiclesFound')}</p>
                          <p className="text-xs text-gray-400">{t('tryAdjusting')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {errors.carId && <p className="text-orange-500 text-sm mt-1">{errors.carId}</p>}
            </div>

            {/* Personal Information */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('yourName')} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }))
                  if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
                }}
                placeholder={t('enterName')}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200 ${
                  errors.name ? 'border-orange-300 focus:border-orange-500' : 'border-gray-300 focus:border-orange-500'
                }`}
              />
              {errors.name && <p className="text-orange-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('yourEmail')} *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, email: e.target.value }))
                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
                }}
                placeholder={t('enterEmail')}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200 ${
                  errors.email ? 'border-orange-300 focus:border-orange-500' : 'border-gray-300 focus:border-orange-500'
                }`}
              />
              {errors.email && <p className="text-orange-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('overallRating')} *
              </label>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="p-1 hover:scale-110 transition-transform duration-200"
                  >
                    <Star
                      size={32}
                      className={`transition-colors duration-200 ${
                        star <= formData.rating
                          ? 'text-orange-500 fill-orange-500'
                          : 'text-gray-300 hover:text-orange-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-gray-600 font-medium">
                  {formData.rating > 0 && (
                    <>
                      {formData.rating} {formData.rating > 1 ? t('stars') : t('star')} -
                      {formData.rating === 5 && ` ${t('ratingLabels.excellent')}`}
                      {formData.rating === 4 && ` ${t('ratingLabels.veryGood')}`}
                      {formData.rating === 3 && ` ${t('ratingLabels.good')}`}
                      {formData.rating === 2 && ` ${t('ratingLabels.fair')}`}
                      {formData.rating === 1 && ` ${t('ratingLabels.poor')}`}
                    </>
                  )}
                </span>
              </div>
              {errors.rating && <p className="text-orange-500 text-sm">{errors.rating}</p>}
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('experienceLabel')} *
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, comment: e.target.value }))
                  if (errors.comment) setErrors(prev => ({ ...prev, comment: undefined }))
                }}
                placeholder={t('experiencePlaceholder')}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200 resize-none ${
                  errors.comment ? 'border-orange-300 focus:border-orange-500' : 'border-gray-300 focus:border-orange-500'
                }`}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-500 text-sm">
                  {formData.comment.length}/500 {t('characters')}
                </span>
                {errors.comment && <p className="text-orange-500 text-sm">{errors.comment}</p>}
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>{t('privacyNotice')}</strong> {t('privacyText')}
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('submitting')}
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    {t('submitReview')}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <StackedCircularFooter />
    </div>
  )
}

export default function AddReviewPage() {
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

  return <AddReviewPageContent />
}
