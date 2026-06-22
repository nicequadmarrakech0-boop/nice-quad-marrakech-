import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all approved reviews
export const getAllApprovedReviews = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .order("desc")
      .collect();
  },
});

// Get all reviews for moderation (admin dashboard)
export const getAllReviewsForModeration = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("reviews")
      .order("desc")
      .collect();
  },
});

// Get reviews for a specific car
export const getReviewsByCar = query({
  args: { carId: v.id("cars") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_car", (q) => q.eq("carId", args.carId))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .order("desc")
      .collect();
  },
});

// Submit a new review (from public form)
export const submitReview = mutation({
  args: {
    carName: v.string(),
    name: v.string(),
    email: v.string(),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const reviewId = await ctx.db.insert("reviews", {
      carName: args.carName,
      name: args.name,
      email: args.email,
      rating: args.rating,
      comment: args.comment,
      status: "pending", // Reviews start as pending
      createdAt: Date.now(),
    });

    return reviewId;
  },
});

// Create a new review (admin)
export const createReview = mutation({
  args: {
    carName: v.string(),
    name: v.string(),
    email: v.string(),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const reviewId = await ctx.db.insert("reviews", {
      carName: args.carName,
      name: args.name,
      email: args.email,
      rating: args.rating,
      comment: args.comment,
      status: "approved", // Admin-created reviews are auto-approved
      createdAt: args.createdAt || Date.now(),
    });

    return reviewId;
  },
});

// Update review status (admin)
export const updateReviewStatus = mutation({
  args: {
    reviewId: v.id("reviews"),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reviewId, {
      status: args.status,
    });
  },
});

// Update review (admin)
export const updateReview = mutation({
  args: {
    reviewId: v.id("reviews"),
    name: v.string(),
    email: v.string(),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reviewId, {
      name: args.name,
      email: args.email,
      rating: args.rating,
      comment: args.comment,
      createdAt: args.createdAt,
    });
  },
});

// Delete a review (admin)
export const deleteReview = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.reviewId);
  },
});

// Get review stats
export const getReviewStats = query({
  args: {},
  handler: async (ctx) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .collect();

    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        distribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    const distribution = reviews.reduce(
      (acc, review) => {
        acc[review.rating as keyof typeof acc]++;
        return acc;
      },
      { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    );

    return {
      totalReviews: reviews.length,
      averageRating,
      distribution,
    };
  },
});
