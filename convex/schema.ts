import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  blogs: defineTable({
    // English fields (default)
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    // French fields
    title_fr: v.optional(v.string()),
    excerpt_fr: v.optional(v.string()),
    content_fr: v.optional(v.string()),
    category_fr: v.optional(v.string()),
    tags_fr: v.optional(v.array(v.string())),
    metaTitle_fr: v.optional(v.string()),
    metaDescription_fr: v.optional(v.string()),
    // Shared fields (same for both languages)
    coverImage: v.string(),
    author: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    readTime: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_published", ["publishedAt"]),

  cars: defineTable({
    name: v.string(),
    model: v.string(),
    year: v.number(),
    location: v.string(),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string()),
  }),

  reviews: defineTable({
    carId: v.optional(v.id("cars")),
    carName: v.string(), // Denormalized for easier querying
    name: v.string(),
    email: v.string(),
    rating: v.number(), // 1-5
    comment: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    createdAt: v.number(),
  })
    .index("by_car", ["carId"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),

  gallery: defineTable({
    imageUrl: v.string(),
    imageKitFileId: v.string(),
    type: v.optional(v.union(v.literal("image"), v.literal("video"))),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.number(),
    createdAt: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_created", ["createdAt"]),

  bookings: defineTable({
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    vehicleType: v.string(),
    bookingDate: v.string(),
    bookingTime: v.string(),
    duration: v.string(),
    numberOfPeople: v.number(),
    numberOfVehicles: v.optional(v.number()),
    totalPrice: v.number(),
    specialRequests: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    ),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_date", ["bookingDate"])
    .index("by_created", ["createdAt"]),
});
