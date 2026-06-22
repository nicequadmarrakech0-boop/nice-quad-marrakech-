// Fake data to replace Convex

export interface FakeBooking {
  _id: string;
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

export interface FakeReview {
  _id: string;
  carId?: string;
  carName: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
}

export interface FakeGalleryItem {
  _id: string;
  imageUrl: string;
  imageKitFileId: string;
  type?: "image" | "video";
  title?: string;
  description?: string;
  order: number;
  createdAt: number;
}

// Gallery images using the provided images
const galleryImages = [
  "/CSP00050.jpg",
  "/CSP00053.jpg",
  "/CSP00055.jpg",
  "/CSP00060.jpg",
  "/CSP00063.jpg",
  "/CSP00068.jpg",
  "/CSP00074.jpg",
  "/CSP00075.jpg",
  "/CSP00076.jpg",
  "/CSP00099.jpg",
];

export const fakeGalleryItems: FakeGalleryItem[] = galleryImages.map((url, index) => ({
  _id: `gallery-${index + 1}`,
  imageUrl: url,
  imageKitFileId: `fake-${index + 1}`,
  type: "image" as const,
  title: `Adventure Image ${index + 1}`,
  description: `Amazing desert adventure moment ${index + 1}`,
  order: index + 1,
  createdAt: Date.now() - (galleryImages.length - index) * 86400000, // Spread over days
}));

// Fake bookings
export const fakeBookings: FakeBooking[] = [
  {
    _id: "booking-1",
    customerName: "Ahmed Benali",
    customerEmail: "ahmed.benali@example.com",
    customerPhone: "+212 6 12 34 56 78",
    vehicleType: "CAN-AM XR 1000 (2 seats)",
    bookingDate: "2024-12-20",
    bookingTime: "09:00 AM",
    duration: "2 Hours",
    numberOfPeople: 2,
    numberOfVehicles: 1,
    totalPrice: 800,
    status: "confirmed",
    createdAt: Date.now() - 2 * 86400000,
  },
  {
    _id: "booking-2",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@example.com",
    customerPhone: "+212 6 98 76 54 32",
    vehicleType: "KYMCO MXU 300",
    bookingDate: "2024-12-22",
    bookingTime: "11:00 AM",
    duration: "2 Hours",
    numberOfPeople: 3,
    numberOfVehicles: 2,
    totalPrice: 350,
    specialRequests: "Please provide helmets for all participants",
    status: "pending",
    createdAt: Date.now() - 1 * 86400000,
  },
  {
    _id: "booking-3",
    customerName: "Mohammed Alami",
    customerEmail: "m.alami@example.com",
    customerPhone: "+212 6 11 22 33 44",
    vehicleType: "YAMAHA RAPTOR 700",
    bookingDate: "2024-12-18",
    bookingTime: "03:00 PM",
    duration: "1 Hour",
    numberOfPeople: 1,
    numberOfVehicles: 1,
    totalPrice: 300,
    status: "completed",
    createdAt: Date.now() - 5 * 86400000,
  },
  {
    _id: "booking-4",
    customerName: "Emma Wilson",
    customerEmail: "emma.wilson@example.com",
    customerPhone: "+212 6 55 66 77 88",
    vehicleType: "POLARIS RS1",
    bookingDate: "2024-12-25",
    bookingTime: "01:00 PM",
    duration: "2 Hours",
    numberOfPeople: 1,
    numberOfVehicles: 1,
    totalPrice: 600,
    status: "confirmed",
    createdAt: Date.now() - 3 * 86400000,
  },
  {
    _id: "booking-5",
    customerName: "Hassan Idrissi",
    customerEmail: "h.idrissi@example.com",
    customerPhone: "+212 6 99 88 77 66",
    vehicleType: "KYMCO MXU 300",
    bookingDate: "2024-12-15",
    bookingTime: "05:00 PM",
    duration: "2 Hours",
    numberOfPeople: 4,
    numberOfVehicles: 2,
    totalPrice: 400,
    status: "completed",
    createdAt: Date.now() - 7 * 86400000,
  },
];

// Fake reviews
export const fakeReviews: FakeReview[] = [
  {
    _id: "review-1",
    carName: "CAN-AM XR 1000",
    name: "John Smith, USA",
    email: "john.smith@example.com",
    rating: 5,
    comment: "Amazing experience! The quad was in perfect condition and the guide was very professional. The camel ride was a great bonus. Highly recommend!",
    status: "approved",
    createdAt: Date.now() - 10 * 86400000,
  },
  {
    _id: "review-2",
    carName: "YAMAHA RAPTOR 700",
    name: "Maria Garcia, Spain",
    email: "maria.g@example.com",
    rating: 5,
    comment: "Best adventure in Marrakech! The Raptor 700 is a beast. The desert views were breathtaking. Will definitely come back!",
    status: "approved",
    createdAt: Date.now() - 8 * 86400000,
  },
  {
    _id: "review-3",
    carName: "KYMCO MXU 300",
    name: "David Brown, UK",
    email: "david.brown@example.com",
    rating: 4,
    comment: "Great value for money. The quad handled well in the desert. The breakfast included was delicious. Only minor issue was the pickup was 10 minutes late.",
    status: "approved",
    createdAt: Date.now() - 6 * 86400000,
  },
  {
    _id: "review-4",
    carName: "POLARIS RS1",
    name: "Sophie Martin, France",
    email: "sophie.m@example.com",
    rating: 5,
    comment: "Incredible experience from start to finish! The Polaris RS1 is so powerful and fun. The team was very helpful and the photos they took are amazing.",
    status: "approved",
    createdAt: Date.now() - 4 * 86400000,
  },
  {
    _id: "review-5",
    carName: "CAN-AM XRC 1000",
    name: "Ahmed Hassan, Morocco",
    email: "ahmed.h@example.com",
    rating: 5,
    comment: "Perfect day out! The buggy was comfortable and powerful. Great service and very professional team. The camel ride was a nice touch!",
    status: "approved",
    createdAt: Date.now() - 2 * 86400000,
  },
  {
    _id: "review-6",
    carName: "KYMCO MXU 300",
    name: "Lisa Anderson, Canada",
    email: "lisa.a@example.com",
    rating: 4,
    comment: "Fun experience overall. The quads were well maintained. The desert landscape is beautiful. Would recommend to friends!",
    status: "pending",
    createdAt: Date.now() - 1 * 86400000,
  },
];

// Helper functions to simulate Convex queries
export const getAllBookings = (): FakeBooking[] => {
  return [...fakeBookings];
};

export const getBookingStats = () => {
  const bookings = getAllBookings();
  return {
    totalBookings: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    totalRevenue: bookings
      .filter(b => b.status !== "cancelled")
      .reduce((sum, b) => sum + b.totalPrice, 0),
  };
};

export const getAllApprovedReviews = (): FakeReview[] => {
  return fakeReviews.filter(r => r.status === "approved");
};

export const getAllReviewsForModeration = (): FakeReview[] => {
  return [...fakeReviews];
};

export const getReviewStats = () => {
  const reviews = getAllApprovedReviews();
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  reviews.forEach(r => {
    distribution[r.rating] = (distribution[r.rating] || 0) + 1;
  });

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  return {
    totalReviews,
    averageRating,
    distribution,
  };
};

export const getAllImages = (): FakeGalleryItem[] => {
  return fakeGalleryItems.filter(item => item.type === "image" || !item.type);
};

export const getAllVideos = (): FakeGalleryItem[] => {
  return fakeGalleryItems.filter(item => item.type === "video");
};

export const getAllImagesAdmin = (): FakeGalleryItem[] => {
  return getAllImages();
};

export const getAllVideosAdmin = (): FakeGalleryItem[] => {
  return getAllVideos();
};

