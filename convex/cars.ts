import { query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("cars").collect();
  },
});

export const getById = query({
  args: { id: v.id("cars") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
