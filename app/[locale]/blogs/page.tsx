"use client"

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight, Search, Tag, BookOpen, Home } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { SimpleNavBar } from "@/components/ui/simple-navbar";
import { SimpleFooter } from "@/components/ui/simple-footer";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslations, useLocale, getLocalizedHref } from "@/lib/i18n";

// Blog type interface
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
  // French fields
  title_fr?: string;
  excerpt_fr?: string;
  category_fr?: string;
  tags_fr?: string[];
}

export default function BlogsPage() {
  const t = useTranslations('blog')
  const tNav = useTranslations('nav')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  // Helper to get localized blog field
  const localized = (blog: Blog, field: 'title' | 'excerpt' | 'category') => {
    if (locale === 'fr') {
      const frField = `${field}_fr` as keyof Blog;
      return (blog[frField] as string) || blog[field];
    }
    return blog[field];
  };

  const navItems = [
    { name: tNav("home"), url: getLocalizedHref("/", locale), icon: Home },
    { name: tNav("blog"), url: getLocalizedHref("/blogs", locale), icon: BookOpen },
  ];

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch blogs from Convex
  const blogs = useQuery(api.blogs.getAllPublishedBlogs) as Blog[] | undefined;

  // Loading state
  if (!blogs) {
    return (
      <>
        <div className="absolute inset-0 w-full h-24 bg-gradient-to-b from-orange-50 to-transparent z-[60] pointer-events-none" />
        <SimpleNavBar items={navItems} className="!fixed !top-0 !z-[70]" />
        <main className="relative min-h-screen w-full overflow-x-hidden bg-orange-50">
          <section className="relative pt-32 pb-16 bg-gradient-to-b from-orange-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <div className="text-center">
                <div className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }

  // Get unique categories (using localized names)
  const categories = [...new Set(blogs.map(blog => localized(blog, 'category')))];

  // Filter blogs based on search and category
  const filteredBlogs = blogs.filter(blog => {
    const blogTitle = localized(blog, 'title').toLowerCase();
    const blogExcerpt = localized(blog, 'excerpt').toLowerCase();
    const blogCategory = localized(blog, 'category');
    const matchesSearch = searchQuery === '' ||
      blogTitle.includes(searchQuery.toLowerCase()) ||
      blogExcerpt.includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || blogCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Featured blog (first published)
  const featuredBlog = filteredBlogs[0];
  const otherBlogs = filteredBlogs.slice(1);

  return (
    <>
      <div className="absolute inset-0 w-full h-24 bg-gradient-to-b from-orange-50 to-transparent z-[60] pointer-events-none" />
      <SimpleNavBar items={navItems} className="!fixed !top-0 !z-[70]" />

      <main className="relative min-h-screen w-full overflow-x-hidden bg-orange-50">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 bg-gradient-to-b from-orange-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
                {t('pageTitle')} <span className="text-orange-600">{t('pageTitleHighlight')}</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
                {t('pageSubtitle')}
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={t('searchArticles')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories Filter */}
        {categories.length > 0 && (
          <section className="py-8 bg-white border-b border-gray-100">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !selectedCategory
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tCommon('allPosts')}
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Blog Grid */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* No blogs state */}
            {filteredBlogs.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">{t('noArticles')}</h3>
                <p className="text-gray-500">
                  {searchQuery ? t('noArticlesSearch') : t('noArticlesCheck')}
                </p>
              </div>
            )}

            {/* Featured Blog */}
            {featuredBlog && (
              <Link href={getLocalizedHref(`/blog/${featuredBlog.slug}`, locale)} className="block group mb-12">
                <motion.article
                  className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-64 lg:h-96">
                      <Image
                        src={featuredBlog.coverImage}
                        alt={localized(featuredBlog, 'title')}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-block bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {tCommon('featured')}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold w-fit mb-4">
                        {localized(featuredBlog, 'category')}
                      </span>
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                        {localized(featuredBlog, 'title')}
                      </h2>
                      <p className="text-gray-600 mb-6 line-clamp-3">
                        {localized(featuredBlog, 'excerpt')}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(featuredBlog.publishedAt)}
                        </span>
                        {featuredBlog.readTime && (
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {featuredBlog.readTime} {t('minRead')}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-3 transition-all">
                        {t('readArticle')} <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </motion.article>
              </Link>
            )}

            {/* Other Blogs Grid */}
            {otherBlogs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherBlogs.map((blog, index) => (
                  <motion.article
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={getLocalizedHref(`/blog/${blog.slug}`, locale)} className="block group h-full">
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                        <div className="relative h-48">
                          <Image
                            src={blog.coverImage}
                            alt={localized(blog, 'title')}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold w-fit mb-3">
                            {localized(blog, 'category')}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                            {localized(blog, 'title')}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                            {localized(blog, 'excerpt')}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {formatDate(blog.publishedAt)}
                            </span>
                            {blog.readTime && (
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {blog.readTime} {t('min')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        <SimpleFooter />
      </main>
    </>
  );
}
