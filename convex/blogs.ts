import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all published blogs (for public listing)
export const getAllPublishedBlogs = query({
  args: {},
  handler: async (ctx) => {
    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();

    return blogs.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
  },
});

// Get recent blogs for homepage section
export const getRecentBlogs = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 3;
    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit);

    return blogs.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
  },
});

// Get single blog by slug
export const getBlogBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const blog = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    return blog;
  },
});

// Get all blogs for admin dashboard
export const getAllBlogs = query({
  args: {},
  handler: async (ctx) => {
    const blogs = await ctx.db
      .query("blogs")
      .order("desc")
      .collect();

    return blogs.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Create a new blog post
export const createBlog = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.string(),
    author: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    readTime: v.optional(v.number()),
    // French fields
    title_fr: v.optional(v.string()),
    excerpt_fr: v.optional(v.string()),
    content_fr: v.optional(v.string()),
    category_fr: v.optional(v.string()),
    tags_fr: v.optional(v.array(v.string())),
    metaTitle_fr: v.optional(v.string()),
    metaDescription_fr: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const blogId = await ctx.db.insert("blogs", {
      ...args,
      publishedAt: args.status === "published" ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });
    return blogId;
  },
});

// Update an existing blog post
export const updateBlog = mutation({
  args: {
    id: v.id("blogs"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    author: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    readTime: v.optional(v.number()),
    // French fields
    title_fr: v.optional(v.string()),
    excerpt_fr: v.optional(v.string()),
    content_fr: v.optional(v.string()),
    category_fr: v.optional(v.string()),
    tags_fr: v.optional(v.array(v.string())),
    metaTitle_fr: v.optional(v.string()),
    metaDescription_fr: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);

    if (!existing) {
      throw new Error("Blog not found");
    }

    // If publishing for the first time, set publishedAt
    const finalUpdates: Record<string, unknown> = {
      ...updates,
      updatedAt: Date.now(),
    };

    if (updates.status === "published" && existing.status !== "published") {
      finalUpdates.publishedAt = Date.now();
    }

    await ctx.db.patch(id, finalUpdates);
    return id;
  },
});

// Delete a blog post
export const deleteBlog = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Get blog statistics for dashboard
export const getBlogStats = query({
  args: {},
  handler: async (ctx) => {
    const allBlogs = await ctx.db.query("blogs").collect();

    const published = allBlogs.filter(b => b.status === "published").length;
    const drafts = allBlogs.filter(b => b.status === "draft").length;

    return {
      total: allBlogs.length,
      published,
      drafts,
    };
  },
});

// Get related blogs by category
export const getRelatedBlogs = query({
  args: {
    category: v.string(),
    excludeSlug: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 2;
    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("status"), "published"))
      .take(limit + 1);

    return blogs
      .filter(b => b.slug !== args.excludeSlug)
      .slice(0, limit);
  },
});

// Get all published blog slugs for sitemap
export const getAllBlogSlugs = query({
  args: {},
  handler: async (ctx) => {
    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    return blogs.map(blog => ({
      slug: blog.slug,
      updatedAt: blog.updatedAt,
    }));
  },
});
