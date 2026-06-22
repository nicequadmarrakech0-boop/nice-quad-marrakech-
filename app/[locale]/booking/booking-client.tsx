"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { experiences, type Experience } from "@/data/experiences";
import { BreadcrumbSchema, ProductSchema } from "@/components/seo/structured-data";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Users,
  Zap,
  Settings,
  CheckCircle2,
  ShieldCheck,
  Award,
  Headphones,
  X,
  Check,
  Loader2,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { StackedCircularFooter } from "@/components/ui/footer-section";
import { useTranslations, useLocale, defaultLocale } from "@/lib/i18n";

function BookingContent() {
  const t = useTranslations('booking')
  const tCommon = useTranslations('common')
  const tExp = useTranslations('experiences')
  const tVehicles = useTranslations('experienceVehicles')
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const experienceId = searchParams.get("id");

  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<number | null>(null);
  const [selectedBike, setSelectedBike] = useState<string | null>(null);

  const thumbnailRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const thumbnailContainerRef = React.useRef<HTMLDivElement>(null);

  // Convex mutation for creating bookings
  const createBookingMutation = useMutation(api.bookings.createBooking);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    duration: "2hours" as "1hour" | "2hours",
    selectedDate: null as Date | null,
    selectedTime: null as Date | null,
    numberOfVehicles: 1,
    numberOfPeople: 1,
  });

  useEffect(() => {
    if (experienceId) {
      const experience = experiences.find((e) => e.id === experienceId);
      if (experience) {
        setSelectedExperience(experience);
        // Set default seat selection for vehicles with seat options
        if (experience.seatOptions && experience.seatOptions.length > 0) {
          setSelectedSeats(experience.seatOptions[0].seats);
        }
        // Set default bike selection for motocross with bike options
        if (experience.bikeOptions && experience.bikeOptions.length > 0) {
          setSelectedBike(experience.bikeOptions[0].engineSize);
        }
        // Set default duration to 2 hours for KYMCO MXU 300
        if (experience.model === "MXU 300") {
          setFormData(prev => ({ ...prev, duration: "2hours" }));
        }
      }
    }
    // Set loading to false after checking
    setIsLoading(false);
  }, [experienceId]);

  useEffect(() => {
    if (showConfirmationModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showConfirmationModal]);

  // Scroll active thumbnail into view (center it)
  useEffect(() => {
    if (thumbnailRefs.current[imageIndex] && thumbnailContainerRef.current) {
      const thumbnail = thumbnailRefs.current[imageIndex];
      const container = thumbnailContainerRef.current;

      if (thumbnail) {
        const thumbnailLeft = thumbnail.offsetLeft;
        const thumbnailWidth = thumbnail.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollLeft = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);

        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [imageIndex]);

  const nextImage = () => {
    if (selectedExperience) {
      setImageIndex((prev) => (prev + 1) % selectedExperience.images.length);
    }
  };

  const prevImage = () => {
    if (selectedExperience) {
      setImageIndex((prev) => (prev - 1 + selectedExperience.images.length) % selectedExperience.images.length);
    }
  };

  const handleVehicleChange = (experience: Experience) => {
    setSelectedExperience(experience);
    setImageIndex(0);
    setShowVehicleSelector(false);
    const path = `/booking?id=${experience.id}`;
    const localizedPath = locale === defaultLocale ? path : `/${locale}${path}`;
    router.push(localizedPath, { scroll: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExperience || !formData.selectedDate || !formData.selectedTime) return;

    setIsSubmitting(true);

    try {
      // Format the date - use local date components to avoid timezone shift
      const year = formData.selectedDate.getFullYear();
      const month = String(formData.selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(formData.selectedDate.getDate()).padStart(2, '0');
      const bookingDate = `${year}-${month}-${day}`;

      const bookingTime = formData.selectedTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Calculate the total price with currency
      const totalPrice = calculateTotal();
      const priceWithCurrency = `${totalPrice} ${selectedExperience.pricing.oneHour.currency}`;

      // Create the booking in Convex
      const vehicleDescription = selectedExperience.seatOptions && selectedSeats
        ? `${selectedExperience.brand} ${selectedExperience.model} (${selectedSeats} seats)`
        : selectedExperience.bikeOptions && selectedBike
          ? `${selectedExperience.bikeOptions.find(opt => opt.engineSize === selectedBike)?.brand} ${selectedExperience.bikeOptions.find(opt => opt.engineSize === selectedBike)?.model} (${selectedBike})`
          : `${selectedExperience.brand} ${selectedExperience.model}`;

      const newBookingId = await createBookingMutation({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        vehicleType: vehicleDescription,
        bookingDate,
        bookingTime,
        duration: formData.duration === "1hour" ? "1 Hour" : "2 Hours",
        numberOfPeople: selectedExperience.category === "QUAD" && selectedExperience.model !== "RAPTOR 700"
          ? formData.numberOfPeople
          : formData.numberOfVehicles,
        numberOfVehicles: selectedExperience.category === "QUAD" && selectedExperience.model !== "RAPTOR 700"
          ? formData.numberOfVehicles
          : undefined,
        totalPrice: totalPrice,
      });

      // Send confirmation emails
      try {
        // Get specific bike brand/model if motocross with bike options
        const specificBike = selectedExperience.bikeOptions && selectedBike
          ? selectedExperience.bikeOptions.find(opt => opt.engineSize === selectedBike)
          : null;

        const emailResponse = await fetch('/api/send-booking-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            vehicleBrand: specificBike ? specificBike.brand : selectedExperience.brand,
            vehicleModel: specificBike ? specificBike.model : selectedExperience.model,
            category: selectedExperience.category,
            date: bookingDate,
            time: formData.selectedTime.toISOString(),
            duration: formData.duration,
            price: priceWithCurrency,
            numberOfVehicles: formData.numberOfVehicles,
            numberOfPeople: selectedExperience.category === "QUAD" && selectedExperience.model !== "RAPTOR 700"
              ? formData.numberOfPeople
              : formData.numberOfVehicles,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send email confirmation');
          // Don't fail the booking if email fails
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the booking if email fails
      }

      setBookingId(newBookingId);
      setShowConfirmationModal(true);
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedExperience) return 0;

    // Special pricing for vehicles with seat options (like CAN-AM XR/XRC)
    if (selectedExperience.seatOptions && selectedSeats) {
      const seatOption = selectedExperience.seatOptions.find(opt => opt.seats === selectedSeats);
      if (seatOption) {
        const basePrice = formData.duration === "1hour"
          ? seatOption.pricing.oneHour.price
          : seatOption.pricing.twoHours.price;
        return basePrice * formData.numberOfVehicles;
      }
    }

    // Special pricing for motocross with bike options
    if (selectedExperience.bikeOptions && selectedBike) {
      const bikeOption = selectedExperience.bikeOptions.find(opt => opt.engineSize === selectedBike);
      if (bikeOption) {
        const basePrice = formData.duration === "1hour"
          ? bikeOption.pricing.oneHour.price
          : bikeOption.pricing.twoHours.price;
        return basePrice * formData.numberOfVehicles;
      }
    }

    // Special pricing for KYMCO MXU 300 - Only 2 hours at 150 DHS
    if (selectedExperience.model === "MXU 300") {
      const numberOfQuads = formData.numberOfVehicles;
      const numberOfPeople = formData.numberOfPeople;
      const secondPassengers = Math.max(0, numberOfPeople - numberOfQuads);

      // Always 150 DHS for 2 hours, each second passenger: 50 DHS
      return (numberOfQuads * 150) + (secondPassengers * 50);
    }

    // Special pricing for other quads (except YAMAHA RAPTOR 700)
    // Each quad costs full price, second passengers pay 50 DHS
    if (
      selectedExperience.category === "QUAD" &&
      selectedExperience.model !== "RAPTOR 700"
    ) {
      const numberOfQuads = formData.numberOfVehicles;
      const numberOfPeople = formData.numberOfPeople;
      const secondPassengers = Math.max(0, numberOfPeople - numberOfQuads);

      if (formData.duration === "1hour") {
        // Each quad: 150 DHS, each second passenger: 50 DHS
        return (numberOfQuads * 150) + (secondPassengers * 50);
      } else {
        // 2 hours: each quad 250 DHS, each second passenger: 83 DHS
        return (numberOfQuads * 250) + (secondPassengers * 83);
      }
    }

    // Default pricing for YAMAHA RAPTOR 700 and all other vehicles
    const basePrice = formData.duration === "1hour"
      ? selectedExperience.pricing.oneHour.price
      : selectedExperience.pricing.twoHours.price;
    return basePrice * formData.numberOfVehicles;
  };

  const isFormValid = () => {
    return formData.name && formData.email && formData.phone && formData.selectedDate && formData.selectedTime;
  };

  // Show loading state while checking for experience
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">{tCommon('loading')}</p>
        </div>
      </div>
    );
  }

  // Show no vehicle message only after loading is complete
  if (!selectedExperience) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('noVehicleSelected')}</h2>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            {t('goBack')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Structured Data for SEO */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://nicequadmarrakech.com" },
          { name: "Booking", url: "https://nicequadmarrakech.com/booking" },
          { name: `${selectedExperience.brand} ${selectedExperience.model}`, url: `https://nicequadmarrakech.com/booking?id=${selectedExperience.id}` },
        ]}
      />
      <ProductSchema
        name={`${selectedExperience.brand} ${selectedExperience.model}`}
        description={selectedExperience.description}
        image={selectedExperience.images[0]}
        brand={selectedExperience.brand}
        model={selectedExperience.model}
        price={selectedExperience.pricing.oneHour.price}
        currency={selectedExperience.pricing.oneHour.currency}
        category={selectedExperience.category}
      />

      {/* Floating Back Button */}
      <motion.button
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-full shadow-lg hover:shadow-xl text-gray-700 hover:text-orange-600 transition-all group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold">{tCommon('back')}</span>
      </motion.button>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6 lg:pt-24 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-6 items-start">
          {/* Left Column - Vehicle Info */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              className="relative h-[344px] sm:h-[331px] lg:h-[463px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg"
              layoutId="vehicle-image"
            >
              {/* Preload all images */}
              {selectedExperience.images.map((image, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    idx === imageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${selectedExperience.brand} ${selectedExperience.model}`}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              ))}

              {/* Image Controls */}
              {selectedExperience.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all group z-10"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all group z-10"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>

                  {/* Thumbnail Gallery - Inside Main Image */}
                  <div
                    ref={thumbnailContainerRef}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/30 backdrop-blur-md z-10 overflow-x-auto w-[280px] sm:w-[320px] scrollbar-hide"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  >
                    {selectedExperience.images.map((image, idx) => (
                      <button
                        key={idx}
                        ref={(el) => { thumbnailRefs.current[idx] = el; }}
                        onClick={() => setImageIndex(idx)}
                        className={`relative flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-md overflow-hidden transition-all ${
                          idx === imageIndex
                            ? "ring-2 ring-orange-500 shadow-lg scale-110"
                            : "ring-1 ring-white/40 hover:ring-orange-400 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${selectedExperience.brand} ${selectedExperience.model} - Image ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      </button>
                    ))}
                  </div>
                  <style jsx global>{`
                    .scrollbar-hide::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                </>
              )}
            </motion.div>

            {/* Vehicle Details Card */}
            <motion.div
              className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200"
              layoutId="vehicle-details"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    {selectedExperience.bikeOptions && selectedBike
                      ? `${selectedExperience.bikeOptions.find(opt => opt.engineSize === selectedBike)?.brand} ${selectedExperience.bikeOptions.find(opt => opt.engineSize === selectedBike)?.model}`
                      : `${selectedExperience.brand} ${selectedExperience.model}`
                    }
                  </h1>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-600 text-white uppercase">
                      {selectedExperience.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {selectedExperience.bikeOptions && selectedBike
                        ? selectedBike
                        : selectedExperience.engineSize
                      }
                    </span>
                  </div>
                </div>
                {!selectedExperience.seatOptions && !selectedExperience.bikeOptions && (
                  <button
                    onClick={() => setShowVehicleSelector(true)}
                    className="px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-lg border border-orange-200 transition-colors"
                  >
                    {t('change')}
                  </button>
                )}
              </div>

              {/* Seat Selection for vehicles with seat options */}
              {selectedExperience.seatOptions && (
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
                    {t('selectConfiguration')}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedExperience.seatOptions.map((option) => (
                      <button
                        key={option.seats}
                        type="button"
                        onClick={() => setSelectedSeats(option.seats)}
                        className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                          selectedSeats === option.seats
                            ? "border-orange-600 bg-orange-50 text-orange-600 shadow-md"
                            : "border-gray-200 hover:border-orange-200 text-gray-900"
                        }`}
                      >
                        <div className="text-lg font-bold mb-0.5">{option.seats} {option.seats > 1 ? tCommon('seats') : tCommon('seat')}</div>
                        <div className="text-xs text-gray-600">{option.pricing.oneHour.price} DHS/hr</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bike Selection for motocross with bike options */}
              {selectedExperience.bikeOptions && (
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
                    {t('selectBike')}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedExperience.bikeOptions.map((option) => (
                      <button
                        key={option.engineSize}
                        type="button"
                        onClick={() => setSelectedBike(option.engineSize)}
                        className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                          selectedBike === option.engineSize
                            ? "border-orange-600 bg-orange-50 text-orange-600 shadow-md"
                            : "border-gray-200 hover:border-orange-200 text-gray-900"
                        }`}
                      >
                        <div className="text-lg font-bold mb-0.5">{option.brand} {option.model}</div>
                        <div className="text-xs text-gray-600">{option.engineSize} • {option.specifications.power}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-gray-600 text-sm mb-4">{tVehicles(`${selectedExperience.id}.description`)}</p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5">
                  <Gauge className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{tExp('specs.power')}</p>
                    <p className="font-semibold text-sm text-gray-900">
                      {selectedExperience.bikeOptions && selectedBike
                        ? selectedExperience.bikeOptions.find(opt => opt.engineSize === selectedBike)?.specifications.power
                        : selectedExperience.specifications.power
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5">
                  <Zap className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{tExp('specs.engine')}</p>
                    <p className="font-semibold text-sm text-gray-900">
                      {selectedExperience.bikeOptions && selectedBike
                        ? selectedBike
                        : selectedExperience.engineSize
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5">
                  <Users className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{tExp('specs.capacity')}</p>
                    <p className="font-semibold text-sm text-gray-900">
                      {selectedExperience.seatOptions && selectedSeats
                        ? `${selectedSeats} ${selectedSeats > 1 ? tCommon('seats') : tCommon('seat')}`
                        : selectedExperience.bikeOptions && selectedBike
                          ? `${selectedExperience.bikeOptions.find(opt => opt.engineSize === selectedBike)?.specifications.seats} ${Number(selectedExperience.bikeOptions.find(opt => opt.engineSize === selectedBike)?.specifications.seats) > 1 ? tCommon('seats') : tCommon('seat')}`
                          : `${selectedExperience.specifications.seats} ${selectedExperience.specifications.seats > 1 ? tCommon('seats') : tCommon('seat')}`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5">
                  <Settings className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{tExp('specs.transmission')}</p>
                    <p className="font-semibold text-sm text-gray-900">
                      {selectedExperience.bikeOptions && selectedBike
                        ? selectedExperience.bikeOptions.find(opt => opt.engineSize === selectedBike)?.specifications.transmission
                        : selectedExperience.specifications.transmission
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Bonus Gift */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-3 mb-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">🎁</span>
                  </div>
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-wide">{t('freeBonusGift')}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900 pl-8">{t('camelRideIncluded')}</p>
              </div>

              {/* Highlights */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">{tCommon('included')}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {['pickup', 'breakfast', 'photos', 'safety'].map((highlightKey) => (
                    <div key={highlightKey} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                      <span className="text-xs text-gray-600">{tVehicles(`${selectedExperience.id}.highlights.${highlightKey}`)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Trust Badges - Desktop Only */}
            <div className="hidden lg:grid grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                <ShieldCheck className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700">{t('trustBadges.securePayment')}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700">{t('trustBadges.licensed')}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                <Headphones className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700">{t('trustBadges.support')}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <motion.div
              className="bg-white rounded-2xl p-5 lg:p-6 shadow-xl border border-gray-200"
              layoutId="booking-form"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-5">{t('completeBooking')}</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Personal Info Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-orange-600" />
                    {t('yourInformation')}
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        {t('fullName')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          {t('email')} *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-all"
                          placeholder={t('emailPlaceholder')}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          {t('phone')} *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => {
                            // Only allow numbers, spaces, +, and -
                            const value = e.target.value.replace(/[^\d\s+\-]/g, '');
                            setFormData({ ...formData, phone: value });
                          }}
                          className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-all"
                          placeholder="+212 6 34 32 44 28"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Date & Time Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-orange-600" />
                    {t('dateTime')}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        {t('date')} *
                      </label>
                      <DatePicker
                        selected={formData.selectedDate}
                        onChange={(date) => setFormData({ ...formData, selectedDate: date })}
                        minDate={new Date()}
                        dateFormat="MMM d, yyyy"
                        placeholderText="Select date"
                        required
                        excludeOutOfBoundsTimes
                        showMonthDropdown={false}
                        showYearDropdown={false}
                        className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-all"
                        wrapperClassName="w-full"
                        calendarClassName="!font-sans"
                        popperClassName="!z-[10000]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        {t('time')} *
                      </label>
                      <DatePicker
                        selected={formData.selectedTime}
                        onChange={(time) => setFormData({ ...formData, selectedTime: time })}
                        showTimeSelect
                        showTimeSelectOnly
                        injectTimes={[
                          new Date(new Date().setHours(9, 0, 0, 0)),
                          new Date(new Date().setHours(11, 0, 0, 0)),
                          new Date(new Date().setHours(13, 0, 0, 0)),
                          new Date(new Date().setHours(15, 0, 0, 0)),
                          new Date(new Date().setHours(17, 0, 0, 0)),
                          new Date(new Date().setHours(19, 0, 0, 0)),
                        ]}
                        timeIntervals={1440}
                        minTime={new Date(new Date().setHours(9, 0, 0, 0))}
                        maxTime={new Date(new Date().setHours(19, 0, 0, 0))}
                        filterTime={(time) => {
                          const hours = time.getHours();
                          const allowedHours = [9, 11, 13, 15, 17, 19];
                          return allowedHours.includes(hours) && time.getMinutes() === 0;
                        }}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        placeholderText="Select time"
                        required
                        className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-all"
                        wrapperClassName="w-full"
                        calendarClassName="!font-sans"
                        popperClassName="!z-[10000]"
                      />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Duration Selection */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                    {t('duration')}
                  </h3>

                  {/* KYMCO MXU 300 - Only 2 hours option */}
                  {selectedExperience.model === "MXU 300" ? (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, duration: "2hours" })}
                        className="w-full p-3 rounded-lg border-2 border-orange-600 bg-orange-50 text-orange-600 shadow-md font-semibold"
                      >
                        <div className="text-lg font-bold mb-0.5">
                          150 DHS
                        </div>
                        <div className="text-xs text-gray-600">{t('twoHours')}</div>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, duration: "1hour" })}
                        className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                          formData.duration === "1hour"
                            ? "border-orange-600 bg-orange-50 text-orange-600 shadow-md"
                            : "border-gray-200 hover:border-orange-200 text-gray-900"
                        }`}
                      >
                        <div className="text-lg font-bold mb-0.5">
                          {selectedExperience.seatOptions && selectedSeats
                            ? selectedExperience.seatOptions.find(opt => opt.seats === selectedSeats)?.pricing.oneHour.price
                            : selectedExperience.bikeOptions && selectedBike
                              ? selectedExperience.bikeOptions.find(opt => opt.engineSize === selectedBike)?.pricing.oneHour.price
                              : selectedExperience.pricing.oneHour.price
                          } {selectedExperience.pricing.oneHour.currency}
                        </div>
                        <div className="text-xs text-gray-600">{t('oneHour')}</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, duration: "2hours" })}
                        className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                          formData.duration === "2hours"
                            ? "border-orange-600 bg-orange-50 text-orange-600 shadow-md"
                            : "border-gray-200 hover:border-orange-200 text-gray-900"
                        }`}
                      >
                        <div className="text-lg font-bold mb-0.5">
                          {selectedExperience.seatOptions && selectedSeats
                            ? selectedExperience.seatOptions.find(opt => opt.seats === selectedSeats)?.pricing.twoHours.price
                            : selectedExperience.bikeOptions && selectedBike
                              ? selectedExperience.bikeOptions.find(opt => opt.engineSize === selectedBike)?.pricing.twoHours.price
                              : selectedExperience.pricing.twoHours.price
                          } {selectedExperience.pricing.twoHours.currency}
                        </div>
                        <div className="text-xs text-gray-600">{t('twoHours')}</div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Number of Vehicles/People Selection */}
                {selectedExperience.category === "QUAD" && selectedExperience.model !== "RAPTOR 700" ? (
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <span>{t('secondPassengerInfo')}</span>
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                    {/* Number of Quads */}
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                        <Settings className="w-3.5 h-3.5 text-orange-600" />
                        {t('quads')}
                      </h3>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newVehicles = Math.max(1, formData.numberOfVehicles - 1);
                            const newPeople = Math.min(formData.numberOfPeople, newVehicles * 2);
                            setFormData({
                              ...formData,
                              numberOfVehicles: newVehicles,
                              numberOfPeople: Math.max(newVehicles, newPeople)
                            });
                          }}
                          disabled={formData.numberOfVehicles <= 1}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-200 hover:border-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white transition-all font-bold text-sm text-gray-700"
                        >
                          -
                        </button>

                        <div className="flex-1">
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={formData.numberOfVehicles}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              const newVehicles = Math.min(Math.max(1, value), 50);
                              const newPeople = Math.min(formData.numberOfPeople, newVehicles * 2);
                              setFormData({
                                ...formData,
                                numberOfVehicles: newVehicles,
                                numberOfPeople: Math.max(newVehicles, newPeople)
                              });
                            }}
                            className="w-full px-2 py-2 text-center text-lg font-bold text-gray-900 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-all"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const newVehicles = Math.min(formData.numberOfVehicles + 1, 50);
                            setFormData({
                              ...formData,
                              numberOfVehicles: newVehicles,
                              numberOfPeople: Math.max(formData.numberOfPeople, newVehicles)
                            });
                          }}
                          disabled={formData.numberOfVehicles >= 50}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-200 hover:border-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white transition-all font-bold text-sm text-gray-700"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 text-center">{t('howMany')}?</p>
                    </div>

                    {/* Number of People */}
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-orange-600" />
                        {t('people')}
                      </h3>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            numberOfPeople: Math.max(formData.numberOfVehicles, formData.numberOfPeople - 1)
                          })}
                          disabled={formData.numberOfPeople <= formData.numberOfVehicles}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-200 hover:border-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white transition-all font-bold text-sm text-gray-700"
                        >
                          -
                        </button>

                        <div className="flex-1">
                          <input
                            type="number"
                            min={formData.numberOfVehicles}
                            max={formData.numberOfVehicles * 2}
                            value={formData.numberOfPeople}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || formData.numberOfVehicles;
                              setFormData({
                                ...formData,
                                numberOfPeople: Math.min(Math.max(formData.numberOfVehicles, value), formData.numberOfVehicles * 2)
                              });
                            }}
                            className="w-full px-2 py-2 text-center text-lg font-bold text-gray-900 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-all"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            numberOfPeople: Math.min(formData.numberOfPeople + 1, formData.numberOfVehicles * 2)
                          })}
                          disabled={formData.numberOfPeople >= formData.numberOfVehicles * 2}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-200 hover:border-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white transition-all font-bold text-sm text-gray-700"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 text-center">{t('secondPassenger')} 50 DHS</p>
                    </div>
                  </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5 text-orange-600" />
                      {t('numberOfVehicles')}
                    </h3>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, numberOfVehicles: Math.max(1, formData.numberOfVehicles - 1) })}
                        disabled={formData.numberOfVehicles <= 1}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-gray-200 hover:border-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white transition-all font-bold text-base text-gray-700"
                      >
                        -
                      </button>

                      <div className="flex-1">
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={formData.numberOfVehicles}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            setFormData({
                              ...formData,
                              numberOfVehicles: Math.min(Math.max(1, value), 50)
                            });
                          }}
                          className="w-full px-3 py-2 text-center text-xl font-bold text-gray-900 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-all"
                        />
                        <p className="text-xs text-gray-500 text-center mt-1">
                          {t('howMany')} {selectedExperience?.category.toLowerCase()}s?
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          numberOfVehicles: Math.min(formData.numberOfVehicles + 1, 50)
                        })}
                        disabled={formData.numberOfVehicles >= 50}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-gray-200 hover:border-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white transition-all font-bold text-base text-gray-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Total Price Display */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                  <div className="space-y-2">
                    {/* Price Breakdown */}
                    <div className="text-xs space-y-1">
                      {selectedExperience.model === "MXU 300" ? (
                        <>
                          <div className="flex items-center justify-between text-orange-800">
                            <span>{formData.numberOfVehicles} Quad{formData.numberOfVehicles > 1 ? 's' : ''} × 150 DHS (2h)</span>
                            <span className="font-semibold text-orange-900">
                              {formData.numberOfVehicles * 150} DHS
                            </span>
                          </div>
                          {(formData.numberOfPeople - formData.numberOfVehicles) > 0 && (
                            <div className="flex items-center justify-between text-orange-800">
                              <span>{formData.numberOfPeople - formData.numberOfVehicles} 2nd Passenger{(formData.numberOfPeople - formData.numberOfVehicles) > 1 ? 's' : ''} × 50 DHS</span>
                              <span className="font-semibold text-orange-900">
                                {(formData.numberOfPeople - formData.numberOfVehicles) * 50} DHS
                              </span>
                            </div>
                          )}
                        </>
                      ) : selectedExperience.category === "QUAD" && selectedExperience.model !== "RAPTOR 700" ? (
                        <>
                          <div className="flex items-center justify-between text-orange-800">
                            <span>{formData.numberOfVehicles} Quad{formData.numberOfVehicles > 1 ? 's' : ''} × {formData.duration === "1hour" ? "150" : "250"} DHS</span>
                            <span className="font-semibold text-orange-900">
                              {formData.numberOfVehicles * (formData.duration === "1hour" ? 150 : 250)} DHS
                            </span>
                          </div>
                          {(formData.numberOfPeople - formData.numberOfVehicles) > 0 && (
                            <div className="flex items-center justify-between text-orange-800">
                              <span>{formData.numberOfPeople - formData.numberOfVehicles} 2nd Passenger{(formData.numberOfPeople - formData.numberOfVehicles) > 1 ? 's' : ''} × {formData.duration === "1hour" ? "50" : "83"} DHS</span>
                              <span className="font-semibold text-orange-900">
                                {(formData.numberOfPeople - formData.numberOfVehicles) * (formData.duration === "1hour" ? 50 : 83)} DHS
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center justify-between text-orange-800">
                          <span>
                            {formData.duration === "1hour" ? t('oneHour') : t('twoHours')} × {formData.numberOfVehicles} {formData.numberOfVehicles === 1 ? t('vehicle') : t('vehicles')}
                          </span>
                          <span className="font-semibold text-orange-900">
                            {formData.duration === "1hour"
                              ? selectedExperience.pricing.oneHour.price
                              : selectedExperience.pricing.twoHours.price} × {formData.numberOfVehicles}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-orange-300"></div>

                    {/* Total */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-orange-800 font-semibold">{t('totalAmount')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-600">
                          {calculateTotal()} <span className="text-sm">{selectedExperience.pricing.oneHour.currency}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{t('confirmationNote')}</span>
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('processing')}
                    </>
                  ) : isFormValid() ? (
                    t('confirmBooking')
                  ) : (
                    t('completeAllFields')
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Vehicle Selector Modal */}
      <AnimatePresence>
        {showVehicleSelector && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVehicleSelector(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-orange-50 via-orange-50 to-orange-100 rounded-2xl shadow-2xl"
              >
                <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 p-4 md:p-6 flex items-center justify-between z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">{t('vehicleSelector.title')}</h3>
                  <button
                    onClick={() => setShowVehicleSelector(false)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {experiences.map((exp) => (
                      <motion.button
                        key={exp.id}
                        onClick={() => handleVehicleChange(exp)}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer text-left ${
                          exp.id === selectedExperience.id ? "ring-4 ring-orange-600" : ""
                        }`}
                      >
                        {/* Selected Badge */}
                        {exp.id === selectedExperience.id && (
                          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-orange-600 rounded-full shadow-lg flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span className="text-xs font-bold text-white">{t('vehicleSelector.selected')}</span>
                          </div>
                        )}

                        {/* Image Container */}
                        <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                          <Image
                            src={exp.images[0]}
                            alt={`${exp.brand} ${exp.model}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                          {/* Category Badge - Top Right */}
                          <div className={`absolute ${exp.id === selectedExperience.id ? "top-3 right-3" : "top-3 left-3"} px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-md`}>
                            <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                              {exp.category}
                            </span>
                          </div>

                          {/* Price Badge */}
                          <div className="absolute top-3 right-3 px-3 py-1.5 bg-orange-600 rounded-lg shadow-lg">
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-bold text-white">{exp.pricing.oneHour.price}</span>
                              <span className="text-xs text-white/90">DHS/hr</span>
                            </div>
                          </div>

                          {/* Title Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                              {exp.brand} {exp.model}
                            </h3>
                            <p className="text-sm text-white/90">
                              {exp.specifications.power} • {exp.specifications.seats} {Number(exp.specifications.seats) > 1 ? tCommon('seats') : tCommon('seat')}
                            </p>
                          </div>
                        </div>

                        {/* Hover Border Effect */}
                        <div className="absolute inset-0 border-2 border-orange-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmationModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60]"
            />
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 pointer-events-none max-lg:overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-4xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-h-[90vh] max-lg:overflow-y-auto overflow-x-hidden pointer-events-auto my-auto lg:overflow-visible lg:max-h-fit"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-100/40 to-orange-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-100/30 to-orange-50/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setShowConfirmationModal(false);
                      router.push("/");
                    }}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white border border-gray-200 hover:border-orange-300 transition-all hover:scale-110 shadow-lg"
                  >
                    <X className="w-5 h-5 text-gray-600 hover:text-orange-600" />
                  </button>

                  {/* Success Icon */}
                  <div className="relative pt-8 pb-4 text-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                      className="w-20 h-20 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-orange-500/50 ring-4 ring-orange-100"
                    >
                      <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold text-gray-900 mb-2"
                    >
                      {t('confirmation.title')}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-600 font-medium"
                    >
                      {t('confirmation.subtitle')}
                    </motion.p>
                  </div>

                  {/* Booking Details */}
                  <div className="relative px-4 sm:px-6 pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                      {/* Left Column - Booking Info */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-3 min-w-0"
                      >
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <div className="w-1 h-4 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                          {t('confirmation.bookingDetails')}
                        </h3>

                        <div className="space-y-2.5">
                          <div className="group">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{t('confirmation.customer')}</p>
                            <p className="text-base font-bold text-gray-900 break-words">{formData.name}</p>
                          </div>

                          <div className="group">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{t('phone')}</p>
                            <p className="text-base font-bold text-gray-900 break-words">{formData.phone}</p>
                          </div>

                          <div className="group">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{t('vehicle')}</p>
                            <p className="text-base font-bold text-gray-900 break-words">
                              {selectedExperience?.bikeOptions && selectedBike
                                ? `${selectedExperience.bikeOptions.find(opt => opt.engineSize === selectedBike)?.brand} ${selectedExperience.bikeOptions.find(opt => opt.engineSize === selectedBike)?.model}`
                                : `${selectedExperience?.brand} ${selectedExperience?.model}`
                              }
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="group">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{t('date')}</p>
                              <p className="text-sm font-bold text-gray-900">
                                {formData.selectedDate?.toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="group">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{t('time')}</p>
                              <p className="text-sm font-bold text-gray-900">
                                {formData.selectedTime?.toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="group">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{t('duration')}</p>
                              <p className="text-sm font-bold text-gray-900">
                                {formData.duration === "1hour" ? t('oneHour') : t('twoHours')}
                              </p>
                            </div>
                            <div className="group">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                                {selectedExperience?.category === "QUAD" && selectedExperience?.model !== "RAPTOR 700" ? t('quads') : t('vehicles')}
                              </p>
                              <p className="text-sm font-bold text-gray-900">{formData.numberOfVehicles}</p>
                            </div>
                          </div>

                          {selectedExperience?.category === "QUAD" && selectedExperience?.model !== "RAPTOR 700" && (
                            <div className="group">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{t('people')}</p>
                              <p className="text-base font-bold text-gray-900">{formData.numberOfPeople}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {/* Right Column - Payment & Next Steps */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-4 min-w-0"
                      >
                        {/* Total Price Card */}
                        <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 shadow-2xl shadow-orange-500/30 overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                          <div className="relative">
                            <p className="text-orange-100 text-xs font-semibold uppercase tracking-wider mb-1">{t('totalAmount')}</p>
                            <p className="text-4xl font-bold text-white mb-0.5">
                              {calculateTotal()}
                              <span className="text-xl ml-2 text-orange-100">{selectedExperience?.pricing.oneHour.currency}</span>
                            </p>
                            <p className="text-orange-100/80 text-xs">{t('allInclusive')}</p>
                          </div>
                        </div>

                        {/* Next Steps */}
                        <div className="space-y-2.5">
                          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50/80 border border-orange-100">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                              <Mail className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900">{t('confirmation.confirmationEmailSent')}</p>
                              <p className="text-xs text-gray-600 mt-0.5 break-words">{formData.email}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50/80 border border-orange-100">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                              <Phone className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900">{t('confirmation.wellCallYou')}</p>
                              <p className="text-xs text-gray-600 mt-0.5 break-words">{t('confirmation.confirmationWithin')}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="flex flex-col sm:flex-row gap-3 pt-6"
                    >
                      <button
                        onClick={() => {
                          setShowConfirmationModal(false);
                          router.push("/");
                        }}
                        className="flex-1 px-6 py-3.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-2xl font-bold text-base transition-all shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:scale-[1.02]"
                      >
                        {t('confirmation.backToHome')}
                      </button>
                      <button
                        onClick={() => {
                          setShowConfirmationModal(false);
                          setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            duration: "1hour",
                            selectedDate: null,
                            selectedTime: null,
                            numberOfVehicles: 1,
                            numberOfPeople: 1,
                          });
                        }}
                        className="px-6 py-3.5 bg-white hover:bg-gray-50 border-2 border-orange-200 hover:border-orange-300 text-gray-900 rounded-2xl font-bold text-base transition-all hover:scale-[1.02] shadow-lg"
                      >
                        {t('confirmation.newBooking')}
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <StackedCircularFooter />
    </div>
  );
}

export default function BookingClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
