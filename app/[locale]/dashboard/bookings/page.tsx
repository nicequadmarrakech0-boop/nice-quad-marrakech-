"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from "motion/react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Car,
  Users,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  X,
  Trash2,
  Settings,
  Loader2
} from 'lucide-react'

type Booking = {
  _id: Id<"bookings">;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleType: string;
  bookingDate: string;
  bookingTime: string;
  duration: string;
  numberOfPeople: number;
  numberOfVehicles?: number;
  totalPrice: number;
  specialRequests?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: number;
}

export default function BookingsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Fetch real bookings from Convex
  const allBookingsQuery = useQuery(api.bookings.getAllBookings)
  const bookingStats = useQuery(api.bookings.getBookingStats)

  const allBookings = allBookingsQuery ?? []

  // Handle body overflow when modal is open - must be before any early returns
  useEffect(() => {
    if (isDetailsModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isDetailsModalOpen])

  // Mutations for updating and deleting bookings
  const updateStatusMutation = useMutation(api.bookings.updateBookingStatus)
  const deleteBookingMutation = useMutation(api.bookings.deleteBooking)

  const updateStatus = async ({ bookingId, status }: { bookingId: Id<"bookings">; status: "pending" | "confirmed" | "cancelled" | "completed" }) => {
    await updateStatusMutation({ bookingId, status })
  }

  const deleteBooking = async ({ bookingId }: { bookingId: Id<"bookings"> }) => {
    await deleteBookingMutation({ bookingId })
  }

  const filteredBookings = selectedStatus === 'all'
    ? allBookings
    : allBookings.filter(b => b.status === selectedStatus)

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          badgeColor: 'bg-orange-50 text-orange-700 border border-orange-200',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-300',
          textColor: 'text-orange-700',
          icon: AlertCircle,
          label: 'قيد الانتظار'
        }
      case 'confirmed':
        return {
          badgeColor: 'bg-green-50 text-green-700 border border-green-200',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-300',
          textColor: 'text-green-700',
          icon: CheckCircle2,
          label: 'مؤكد'
        }
      case 'completed':
        return {
          badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-300',
          textColor: 'text-blue-700',
          icon: CheckCircle2,
          label: 'مكتمل'
        }
      case 'cancelled':
        return {
          badgeColor: 'bg-neutral-100 text-neutral-600 border border-neutral-200',
          bgColor: 'bg-neutral-50',
          borderColor: 'border-neutral-300',
          textColor: 'text-neutral-600',
          icon: XCircle,
          label: 'ملغى'
        }
      default:
        return {
          badgeColor: 'bg-neutral-100 text-neutral-600 border border-neutral-200',
          bgColor: 'bg-neutral-50',
          borderColor: 'border-neutral-300',
          textColor: 'text-neutral-600',
          icon: AlertCircle,
          label: status
        }
    }
  }

  const handleStatusChange = async (bookingId: Id<"bookings">, newStatus: "pending" | "confirmed" | "cancelled" | "completed") => {
    await updateStatus({ bookingId, status: newStatus })
    if (selectedBooking && selectedBooking._id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status: newStatus })
    }
  }

  const handleDeleteBooking = async (bookingId: Id<"bookings">, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('هل أنت متأكد من حذف هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء.')) {
      await deleteBooking({ bookingId })
      if (selectedBooking && selectedBooking._id === bookingId) {
        closeDetailsModal()
      }
    }
  }

  // Show loading state while data is being fetched
  if (allBookingsQuery === undefined || bookingStats === undefined) {
    return (
      <div className="max-w-[1400px] mx-auto pt-16 lg:pt-0 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
          <p className="text-neutral-600">جاري تحميل الحجوزات...</p>
        </div>
      </div>
    )
  }

  const openDetailsModal = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailsModalOpen(true)
  }

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false)
  }

  const formatDate = (dateString: string) => {
    // Parse date as local time to avoid timezone offset issues
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pt-16 lg:pt-0">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2"
      >
        <h1 className="text-2xl font-semibold text-neutral-900">الحجوزات</h1>
        <p className="text-sm text-neutral-600">إدارة ومتابعة جميع حجوزات العملاء</p>
      </motion.div>

      {/* Stats Grid */}
      {bookingStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="bg-white border border-neutral-200 rounded-lg p-3 sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-medium text-neutral-600">قيد الانتظار</p>
                <p className="text-3xl font-semibold text-neutral-900">
                  {bookingStats.pending}
                </p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-white border border-neutral-200 rounded-lg p-3 sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-medium text-neutral-600">مؤكدة</p>
                <p className="text-3xl font-semibold text-neutral-900">
                  {bookingStats.confirmed}
                </p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </motion.div>

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
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-white border border-neutral-200 rounded-lg p-4"
      >
        <div className="flex items-center gap-2 overflow-x-auto">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedStatus === status
                  ? 'bg-orange-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {status === 'all' ? 'الكل' : status === 'pending' ? 'قيد الانتظار' : status === 'confirmed' ? 'مؤكدة' : status === 'completed' ? 'مكتملة' : 'ملغاة'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Bookings Grid */}
      {filteredBookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-white border border-neutral-200 rounded-lg p-12 text-center"
        >
          <Calendar className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">لم يتم العثور على حجوزات</h3>
          <p className="text-sm text-neutral-600">
            {selectedStatus === 'all'
              ? 'لا توجد حجوزات بعد'
              : `لا توجد حجوزات ${selectedStatus === 'pending' ? 'قيد الانتظار' : selectedStatus === 'confirmed' ? 'مؤكدة' : selectedStatus === 'completed' ? 'مكتملة' : 'ملغاة'}`}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking, index) => {
            const statusConfig = getStatusConfig(booking.status)
            const StatusIcon = statusConfig.icon

            return (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.4 }}
                className={`group bg-white border-2 rounded-lg transition-all cursor-pointer ${statusConfig.borderColor}`}
                onClick={() => openDetailsModal(booking)}
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-neutral-900 truncate">{booking.customerName}</h3>
                      <p className="text-sm text-neutral-600 mt-1">{booking.vehicleType}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${statusConfig.badgeColor} shrink-0 ml-3`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="px-6 pb-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(booking.bookingDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Clock className="w-4 h-4" />
                    <span>{booking.bookingTime} • {booking.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Users className="w-4 h-4" />
                    <span>{booking.numberOfPeople} شخص</span>
                  </div>
                </div>

                {/* Footer */}
                <div className={`px-6 py-4 border-t-2 flex items-center justify-between ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
                  <div className="flex items-center gap-3">
                    <div className={`font-semibold ${statusConfig.textColor}`}>
                      {booking.totalPrice.toLocaleString()} DHS
                    </div>
                    <button
                      onClick={(e) => handleDeleteBooking(booking._id, e)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                      title="حذف الحجز"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <button className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${statusConfig.textColor}`}>
                    عرض التفاصيل
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDetailsModal}
          />
          <div className="min-h-full flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-200">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">تفاصيل الحجز</h2>
                <p className="text-xs text-neutral-600 mt-0.5">
                  ID: {String(selectedBooking._id).slice(-8)}
                </p>
              </div>
              <button
                onClick={closeDetailsModal}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">تحديث الحالة</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => {
                    const config = getStatusConfig(status)
                    const StatusIcon = config.icon
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedBooking._id, status as any)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedBooking.status === status
                            ? config.badgeColor
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
                        }`}
                      >
                        {selectedBooking.status === status && <StatusIcon className="w-4 h-4" />}
                        {config.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2.5">
                <h3 className="text-sm font-medium text-neutral-900">معلومات العميل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">الاسم</p>
                      <p className="text-sm font-medium text-neutral-900">{selectedBooking.customerName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-600">البريد الإلكتروني</p>
                      <p className="text-sm font-medium text-neutral-900 break-all">{selectedBooking.customerEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">رقم الهاتف</p>
                      <p className="text-sm font-medium text-neutral-900">{selectedBooking.customerPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className="space-y-2.5">
                <h3 className="text-sm font-medium text-neutral-900">معلومات الحجز</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Car className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">المركبة</p>
                      <p className="text-sm font-medium text-neutral-900">{selectedBooking.vehicleType}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">التاريخ</p>
                      <p className="text-sm font-medium text-neutral-900">{formatDate(selectedBooking.bookingDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">الوقت والمدة</p>
                      <p className="text-sm font-medium text-neutral-900">{selectedBooking.bookingTime} • {selectedBooking.duration}</p>
                    </div>
                  </div>

                  {/* Show both quads and people for KYMCO MXU 300 and other quads */}
                  {selectedBooking.numberOfVehicles !== undefined ? (
                    <>
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Settings className="w-3.5 h-3.5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600">الكوادات</p>
                          <p className="text-sm font-medium text-neutral-900">{selectedBooking.numberOfVehicles} كواد</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-3.5 h-3.5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600">إجمالي الأشخاص</p>
                          <p className="text-sm font-medium text-neutral-900">{selectedBooking.numberOfPeople} شخص</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-3.5 h-3.5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600">المشاركين</p>
                        <p className="text-sm font-medium text-neutral-900">{selectedBooking.numberOfPeople} شخص</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">السعر الإجمالي</p>
                      <p className="text-base font-semibold text-neutral-900">{selectedBooking.totalPrice.toLocaleString()} DHS</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-900 mb-2">طلبات خاصة</h3>
                  <p className="text-sm text-neutral-600 bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                    {selectedBooking.specialRequests}
                  </p>
                </div>
              )}

              {/* Timestamps */}
              <div className="pt-3 border-t border-neutral-200">
                <p className="text-xs text-neutral-500">
                  تم الإنشاء {new Date(selectedBooking.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
