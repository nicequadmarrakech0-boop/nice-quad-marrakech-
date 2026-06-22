"use client"

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from "motion/react"
import { Star, Check, X, Clock, MessageCircle, Plus, Edit3, Trash2, Save, Loader2 } from 'lucide-react'
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

interface EditReviewData {
  name: string
  email: string
  rating: number
  comment: string
  createdAt: number
}

export default function AdminReviewsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<any>(null)
  const [editFormData, setEditFormData] = useState<EditReviewData>({
    name: '',
    email: '',
    rating: 5,
    comment: '',
    createdAt: Date.now()
  })
  const [isEditing, setIsEditing] = useState(false)

  // Create new review modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createFormData, setCreateFormData] = useState<EditReviewData & { carName: string }>({
    name: '',
    email: '',
    rating: 5,
    comment: '',
    createdAt: Date.now(),
    carName: ''
  })
  const [isCreating, setIsCreating] = useState(false)

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingReview, setDeletingReview] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Convex queries and mutations
  const allReviewsQuery = useQuery(api.reviews.getAllReviewsForModeration)
  const updateReviewStatusMutation = useMutation(api.reviews.updateReviewStatus)
  const updateReviewMutation = useMutation(api.reviews.updateReview)
  const createReviewMutation = useMutation(api.reviews.createReview)
  const deleteReviewMutation = useMutation(api.reviews.deleteReview)

  const allReviews = allReviewsQuery ?? []

  const approveReview = async ({ reviewId, status }: { reviewId: Id<"reviews">; status: "approved" | "rejected" }) => {
    await updateReviewStatusMutation({ reviewId, status })
  }

  const rejectReview = async ({ reviewId, status }: { reviewId: Id<"reviews">; status: "approved" | "rejected" }) => {
    await updateReviewStatusMutation({ reviewId, status })
  }

  const updateReview = async ({ reviewId, ...data }: { reviewId: Id<"reviews">; name: string; email: string; rating: number; comment: string; createdAt: number }) => {
    await updateReviewMutation({ reviewId, ...data })
  }

  const createReview = async (data: { carName: string; name: string; email: string; rating: number; comment: string; createdAt?: number }) => {
    return await createReviewMutation(data)
  }

  const deleteReview = async ({ reviewId }: { reviewId: Id<"reviews"> }) => {
    await deleteReviewMutation({ reviewId })
  }

  // Show loading state while data is being fetched
  if (allReviewsQuery === undefined) {
    return (
      <div className="max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px] pt-16 lg:pt-0">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  // Filter reviews based on selected tab
  const filteredReviews = filter === 'all'
    ? allReviews
    : allReviews.filter(review => review.status === filter)

  const pendingReviews = allReviews.filter(review => review.status === 'pending')

  const handleApprove = async (reviewId: Id<"reviews">) => {
    try {
      await approveReview({ reviewId, status: 'approved' })
    } catch (error) {
      console.error('Error approving review:', error)
    }
  }

  const handleReject = async (reviewId: Id<"reviews">) => {
    try {
      await rejectReview({ reviewId, status: 'rejected' })
    } catch (error) {
      console.error('Error rejecting review:', error)
    }
  }

  const handleCreateNewReview = () => {
    setCreateFormData({
      name: '',
      email: '',
      rating: 5,
      comment: '',
      createdAt: Date.now(),
      carName: ''
    })
    setIsCreateModalOpen(true)
  }

  const handleEditClick = (review: any) => {
    setEditingReview(review)
    setEditFormData({
      name: review.name,
      email: review.email,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (review: any) => {
    setDeletingReview(review)
    setIsDeleteModalOpen(true)
  }

  const handleEditSubmit = async () => {
    if (!editingReview) return

    setIsEditing(true)
    try {
      await updateReview({
        reviewId: editingReview._id as Id<"reviews">,
        name: editFormData.name,
        email: editFormData.email,
        rating: editFormData.rating,
        comment: editFormData.comment,
        createdAt: editFormData.createdAt,
      })
      setIsEditModalOpen(false)
      setEditingReview(null)
    } catch (error) {
      console.error('Error updating review:', error)
    } finally {
      setIsEditing(false)
    }
  }

  const handleCreateSubmit = async () => {
    if (!createFormData.name || !createFormData.email || !createFormData.comment || !createFormData.carName) {
      alert('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    setIsCreating(true)
    try {
      await createReview({
        carName: createFormData.carName,
        name: createFormData.name,
        email: createFormData.email,
        rating: createFormData.rating,
        comment: createFormData.comment,
      })
      setIsCreateModalOpen(false)
      setCreateFormData({
        name: '',
        email: '',
        rating: 5,
        comment: '',
        createdAt: Date.now(),
        carName: ''
      })
    } catch (error) {
      console.error('Error creating review:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingReview) return

    setIsDeleting(true)
    try {
      await deleteReview({ reviewId: deletingReview._id as Id<"reviews"> })
      setIsDeleteModalOpen(false)
      setDeletingReview(null)
    } catch (error) {
      console.error('Error deleting review:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pt-16 lg:pt-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-semibold text-neutral-900">التقييمات</h1>
          <p className="text-sm text-neutral-600">إدارة مراجعات وتعليقات العملاء</p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          onClick={handleCreateNewReview}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
          إنشاء تقييم
        </motion.button>
      </div>

      {/* Alert for pending reviews */}
      {pendingReviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-amber-900 text-sm">{pendingReviews.length} تقييم يحتاج لانتباهك</p>
              <p className="text-xs text-amber-700">مراجعة والموافقة على تعليقات العملاء</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-white rounded-xl shadow-md p-2.5"
      >
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { key: 'pending', label: 'قيد الانتظار', count: pendingReviews.length },
            { key: 'all', label: 'الكل', count: allReviews.length },
            { key: 'approved', label: 'موافق عليه', count: allReviews.filter(r => r.status === 'approved').length },
            { key: 'rejected', label: 'مرفوض', count: allReviews.filter(r => r.status === 'rejected').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filter === tab.key
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                filter === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Reviews List */}
      <div className="space-y-2.5">
        {filteredReviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6 text-center"
          >
            <MessageCircle className="w-10 h-10 mx-auto mb-2.5 text-gray-400" />
            <h3 className="font-bold text-gray-900 mb-1 text-sm">لا توجد تقييمات {filter === 'all' ? '' : filter === 'pending' ? 'قيد الانتظار' : filter === 'approved' ? 'موافق عليها' : 'مرفوضة'}</h3>
            <p className="text-xs text-gray-600">
              {filter === 'pending' ? 'تم معالجة جميع التقييمات' : 'لم يتم العثور على تقييمات'}
            </p>
          </motion.div>
        ) : (
          filteredReviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + index * 0.05, duration: 0.4 }}
              className="bg-white rounded-xl shadow-md p-3 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2.5 flex-1">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold text-xs">{review.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="font-bold text-gray-900 text-xs">{review.name}</h3>
                      <span className={`px-1.5 py-0.5 text-xs font-bold rounded ${
                        review.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        review.status === 'approved' ? 'bg-green-100 text-green-700' :
                        review.status === 'rejected' ? 'bg-gray-200 text-gray-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {review.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span>{review.email}</span>
                      <span>•</span>
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                      <span className="font-semibold text-gray-900">المركبة:</span> {review.carName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < review.rating ? "fill-orange-500 text-orange-500" : "text-gray-300"}
                    />
                  ))}
                  <span className="ml-1 font-bold text-gray-900 text-xs">{review.rating}</span>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-gray-700 text-xs leading-relaxed">"{review.comment}"</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                {/* Action buttons for pending reviews */}
                {review.status === 'pending' && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleApprove(review._id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-xs shadow-md"
                    >
                      <Check size={13} />
                      موافقة
                    </button>
                    <button
                      onClick={() => handleReject(review._id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold text-xs shadow-md"
                    >
                      <X size={13} />
                      رفض
                    </button>
                  </div>
                )}

                {/* Edit and Delete buttons (always visible) */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    onClick={() => handleEditClick(review)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors font-semibold text-xs"
                  >
                    <Edit3 size={12} />
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDeleteClick(review)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-xs"
                  >
                    <Trash2 size={12} />
                    حذف
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Edit Review Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">تعديل التقييم</h2>
              <p className="text-gray-600 mt-1">إجراء تغييرات على تفاصيل التقييم</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Publish Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">تاريخ النشر</label>
                <input
                  type="datetime-local"
                  value={new Date(editFormData.createdAt).toISOString().slice(0, 16)}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setEditFormData(prev => ({ ...prev, createdAt: newDate.getTime() }))
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">
                  يحدد هذا متى يظهر التقييم كما لو تم نشره
                </p>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">التقييم</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditFormData(prev => ({ ...prev, rating: star }))}
                      className="p-1 hover:scale-110 transition-transform duration-200"
                    >
                      <Star
                        size={32}
                        className={`transition-colors duration-200 ${
                          star <= editFormData.rating
                            ? 'text-orange-500 fill-orange-500'
                            : 'text-gray-300 hover:text-orange-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-gray-600 font-medium">
                    {editFormData.rating} نجمة
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">التعليق</label>
                <textarea
                  value={editFormData.comment}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, comment: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={isEditing}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    حفظ التغييرات
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 size={32} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">حذف التقييم</h2>
              <p className="text-gray-600 mb-6">
                هل أنت متأكد من حذف هذا التقييم لـ{' '}
                <span className="font-semibold">{deletingReview?.name}</span>؟
                لا يمكن التراجع عن هذا الإجراء.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الحذف...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      حذف التقييم
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Review Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">إنشاء تقييم جديد</h2>
              <p className="text-gray-600 mt-1">إضافة تقييم عميل جديد</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم *</label>
                <input
                  type="text"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="الاسم الكامل للعميل"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني *</label>
                <input
                  type="email"
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="customer@email.com"
                />
              </div>

              {/* Car Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المركبة *</label>
                <input
                  type="text"
                  value={createFormData.carName}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, carName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="اسم المركبة أو طراز السيارة"
                />
              </div>

              {/* Publish Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Publish Date</label>
                <input
                  type="datetime-local"
                  value={new Date(createFormData.createdAt).toISOString().slice(0, 16)}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setCreateFormData(prev => ({ ...prev, createdAt: newDate.getTime() }))
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">
                  متى يظهر التقييم كما لو تم نشره
                </p>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">التقييم *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCreateFormData(prev => ({ ...prev, rating: star }))}
                      className="p-1 hover:scale-110 transition-transform duration-200"
                    >
                      <Star
                        size={32}
                        className={`transition-colors duration-200 ${
                          star <= createFormData.rating
                            ? 'text-orange-500 fill-orange-500'
                            : 'text-gray-300 hover:text-orange-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-gray-600 font-medium">
                    {createFormData.rating} نجمة
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">تعليق التقييم *</label>
                <textarea
                  value={createFormData.comment}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, comment: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                  placeholder="اكتب تقييم العميل هنا..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubmit}
                disabled={isCreating}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    إنشاء تقييم
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
