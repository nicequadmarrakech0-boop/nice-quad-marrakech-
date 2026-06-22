import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all bookings (admin)
export const getAllBookings = query({
  handler: async (ctx) => {
    const bookings = await ctx.db
      .query("bookings")
      .order("desc")
      .collect();
    return bookings;
  },
});

// Get bookings by status
export const getBookingsByStatus = query({
  args: {
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    )
  },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
    return bookings;
  },
});

// Get booking stats
export const getBookingStats = query({
  handler: async (ctx) => {
    const bookings = await ctx.db.query("bookings").collect();

    const totalBookings = bookings.length;
    const pending = bookings.filter(b => b.status === "pending").length;
    const confirmed = bookings.filter(b => b.status === "confirmed").length;
    const cancelled = bookings.filter(b => b.status === "cancelled").length;
    const completed = bookings.filter(b => b.status === "completed").length;

    const totalRevenue = bookings
      .filter(b => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + b.totalPrice, 0);

    return {
      totalBookings,
      pending,
      confirmed,
      cancelled,
      completed,
      totalRevenue,
    };
  },
});

// Create booking
export const createBooking = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const bookingId = await ctx.db.insert("bookings", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
    return bookingId;
  },
});

// Update booking status
export const updateBookingStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookingId, {
      status: args.status,
    });
  },
});

// Update booking
export const updateBooking = mutation({
  args: {
    bookingId: v.id("bookings"),
    customerName: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    vehicleType: v.optional(v.string()),
    bookingDate: v.optional(v.string()),
    bookingTime: v.optional(v.string()),
    duration: v.optional(v.string()),
    numberOfPeople: v.optional(v.number()),
    numberOfVehicles: v.optional(v.number()),
    totalPrice: v.optional(v.number()),
    specialRequests: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { bookingId, ...updates } = args;
    await ctx.db.patch(bookingId, updates);
  },
});

// Delete booking
export const deleteBooking = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.bookingId);
  },
});
