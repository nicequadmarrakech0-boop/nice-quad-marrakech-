import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all gallery images ordered by order field
export const getAllImages = query({
  args: {},
  handler: async (ctx) => {
    const allItems = await ctx.db
      .query("gallery")
      .withIndex("by_order")
      .order("asc")
      .collect();
    // Return items with type "image" or undefined (for backward compatibility)
    return allItems.filter(item => !item.type || item.type === "image");
  },
});

// Get all gallery videos ordered by order field
export const getAllVideos = query({
  args: {},
  handler: async (ctx) => {
    const allItems = await ctx.db
      .query("gallery")
      .withIndex("by_order")
      .order("asc")
      .collect();
    return allItems.filter(item => item.type === "video");
  },
});

// Get all images for admin (includes all details)
export const getAllImagesAdmin = query({
  args: {},
  handler: async (ctx) => {
    const allItems = await ctx.db
      .query("gallery")
      .withIndex("by_created")
      .order("desc")
      .collect();
    // Return items with type "image" or undefined (for backward compatibility)
    return allItems.filter(item => !item.type || item.type === "image");
  },
});

// Get all videos for admin (includes all details)
export const getAllVideosAdmin = query({
  args: {},
  handler: async (ctx) => {
    const allItems = await ctx.db
      .query("gallery")
      .withIndex("by_created")
      .order("desc")
      .collect();
    return allItems.filter(item => item.type === "video");
  },
});

// Add new image to gallery
export const addImage = mutation({
  args: {
    imageUrl: v.string(),
    imageKitFileId: v.string(),
    type: v.optional(v.union(v.literal("image"), v.literal("video"))),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const type = args.type || "image"; // Default to image for backward compatibility

    // If no order specified, get the highest order for this type and add 1
    let order = args.order;
    if (order === undefined) {
      const allItems = await ctx.db
        .query("gallery")
        .withIndex("by_order")
        .order("desc")
        .collect();

      const itemsOfType = allItems.filter(item => item.type === type);
      order = itemsOfType.length > 0 ? itemsOfType[0].order + 1 : 0;
    }

    const imageId = await ctx.db.insert("gallery", {
      imageUrl: args.imageUrl,
      imageKitFileId: args.imageKitFileId,
      type: type,
      title: args.title,
      description: args.description,
      order: order,
      createdAt: Date.now(),
    });

    return imageId;
  },
});

// Update image details
export const updateImage = mutation({
  args: {
    imageId: v.id("gallery"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const updateData: any = {};

    if (args.title !== undefined) updateData.title = args.title;
    if (args.description !== undefined) updateData.description = args.description;
    if (args.order !== undefined) updateData.order = args.order;

    await ctx.db.patch(args.imageId, updateData);
  },
});

// Delete image from gallery
export const deleteImage = mutation({
  args: {
    imageId: v.id("gallery"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.imageId);
  },
});

// Reorder images
export const reorderImages = mutation({
  args: {
    imageOrders: v.array(
      v.object({
        imageId: v.id("gallery"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Update all image orders
    for (const { imageId, order } of args.imageOrders) {
      await ctx.db.patch(imageId, { order });
    }
  },
});
