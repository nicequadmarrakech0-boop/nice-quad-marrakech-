"use client"

import React from 'react';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslations, useLocale, getLocalizedHref } from "@/lib/i18n";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt?: number;
  readTime?: number;
  title_fr?: string;
  excerpt_fr?: string;
  category_fr?: string;
}

export function BlogSection() {
  const t = useTranslations("blog")
  const locale = useLocale()
  const blogs = useQuery(api.blogs.getRecentBlogs, { limit: 3 }) as Blog[] | undefined;

  const localized = (blog: Blog, field: 'title' | 'excerpt' | 'category') => {
    if (locale === 'fr') {
      const frField = `${field}_fr` as keyof Blog;
      return (blog[frField] as string) || blog[field];
    }
    return blog[field];
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Don't render section if no blogs
  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section className="relative py-12 md:py-16 lg:py-20 bg-orange-50 overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header - Matching other sections */}
        <div className="text-center mb-12 md:mb-16 space-y-4 md:space-y-5">
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {t("title")}{" "}
            <span className="text-orange-600 inline-block">
              {t("titleHighlight")}
            </span>
          </motion.h2>

          <motion.p
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 mb-12">
          {blogs.map((blog, index) => (
            <motion.article
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={getLocalizedHref(`/blog/${blog.slug}`, locale)} className="block group h-full">
                <motion.div
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  {/* Image Container */}
                  <div className="relative h-52 md:h-56 lg:h-64 overflow-hidden">
                    <Image
                      src={blog.coverImage}
                      alt={localized(blog, 'title')}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Category Badge - Top Left */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
                      <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                        {localized(blog, 'category')}
                      </span>
                    </div>

                    {/* Read Time Badge - Top Right */}
                    {blog.readTime && (
                      <div className="absolute top-3 right-3 px-3 py-1.5 bg-orange-600 rounded-lg shadow-lg">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-white" />
                          <span className="text-xs font-bold text-white">{blog.readTime} {t("min")}</span>
                        </div>
                      </div>
                    )}

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1 line-clamp-2">
                        {localized(blog, 'title')}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-white/90">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {blog.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(blog.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 bg-white flex-grow flex flex-col">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                      {localized(blog, 'excerpt')}
                    </p>
                    <div className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-orange-600 text-white font-semibold text-sm rounded-lg transition-all group-hover:gap-3 group-hover:bg-orange-700">
                      {t("readMore") || "Read More"}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 border-2 border-orange-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Link
            href={getLocalizedHref("/blogs", locale)}
            className="inline-flex items-center gap-2 bg-white text-orange-600 border-2 border-orange-200 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200 text-sm shadow-sm hover:shadow-md"
          >
            {t("viewAllArticles")}
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
