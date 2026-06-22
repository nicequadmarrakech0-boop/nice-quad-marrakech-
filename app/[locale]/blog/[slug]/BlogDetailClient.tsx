"use client"

import React from 'react';
import { Calendar, Clock, ArrowLeft, Tag, Share2, Home, BookOpen, User, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { SimpleNavBar } from "@/components/ui/simple-navbar";
import { SimpleFooter } from "@/components/ui/simple-footer";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslations, useLocale, getLocalizedHref } from "@/lib/i18n";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  status: string;
  publishedAt?: number;
  updatedAt: number;
  readTime?: number;
  title_fr?: string;
  excerpt_fr?: string;
  content_fr?: string;
  category_fr?: string;
  tags_fr?: string[];
}

interface BlogDetailClientProps {
  slug: string;
}

export default function BlogDetailClient({ slug }: BlogDetailClientProps) {
  const t = useTranslations('blog')
  const tNav = useTranslations('nav')
  const locale = useLocale()

  // Helper to get localized blog field
  const localized = (blog: BlogPost, field: 'title' | 'excerpt' | 'content' | 'category') => {
    if (locale === 'fr') {
      const frField = `${field}_fr` as keyof BlogPost;
      return (blog[frField] as string) || blog[field];
    }
    return blog[field];
  };

  const localizedTags = (blog: BlogPost) => {
    if (locale === 'fr' && blog.tags_fr && blog.tags_fr.length > 0) {
      return blog.tags_fr;
    }
    return blog.tags;
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

  const blog = useQuery(api.blogs.getBlogBySlug, { slug }) as BlogPost | null | undefined;
  const relatedBlogs = useQuery(
    api.blogs.getRelatedBlogs,
    blog ? { category: blog.category, excludeSlug: slug, limit: 3 } : "skip"
  ) as BlogPost[] | undefined;

  // Loading state
  if (blog === undefined) {
    return (
      <>
        <SimpleNavBar items={navItems} className="!fixed !top-0 !z-[70]" />
        <main className="relative min-h-screen w-full bg-orange-50">
          <section className="relative">
            <div className="h-[60vh] lg:h-[70vh] w-full bg-gray-200 animate-pulse" />
          </section>
          <section className="py-16 -mt-32 relative z-10">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }

  // Not found state
  if (!blog) {
    return (
      <>
        <SimpleNavBar items={navItems} className="!fixed !top-0 !z-[70]" />
        <main className="relative min-h-screen w-full bg-orange-50 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-24 h-24 mx-auto mb-8 bg-orange-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-orange-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t('noArticles')}</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{t('noArticlesCheck')}</p>
            <Link
              href={getLocalizedHref("/blogs", locale)}
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl"
            >
              <ArrowLeft size={18} />
              {tNav('blog')}
            </Link>
          </div>
        </main>
      </>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://nicequadmarrakech.com/blog/${slug}`;

  return (
    <>
      <SimpleNavBar items={navItems} className="!fixed !top-0 !z-[70]" />

      <main className="relative min-h-screen w-full bg-orange-50">
        {/* Hero Section with Full Cover Image */}
        <section className="relative">
          <div className="relative h-[70vh] lg:h-[80vh] w-full">
            <Image
              src={blog.coverImage}
              alt={localized(blog, 'title')}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

            {/* Hero Content */}
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-16 lg:pb-24">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-4xl"
                >
                  {/* Breadcrumb */}
                  <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
                    <Link href={getLocalizedHref("/", locale)} className="hover:text-white transition-colors">
                      {tNav('home')}
                    </Link>
                    <ChevronRight size={14} />
                    <Link href={getLocalizedHref("/blogs", locale)} className="hover:text-white transition-colors">
                      {tNav('blog')}
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-white">{localized(blog, 'category')}</span>
                  </nav>

                  {/* Category Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 rounded-lg text-white text-sm font-semibold mb-6">
                    <Tag size={14} />
                    {localized(blog, 'category')}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                    {localized(blog, 'title')}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-6 text-white/80">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center">
                        <User size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{blog.author}</p>
                        <p className="text-white/60 text-sm">{t('author') || 'Author'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{formatDate(blog.publishedAt)}</span>
                    </div>
                    {blog.readTime && (
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{blog.readTime} {t('minRead')}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content Card */}
        <section className="relative z-10 -mt-16 pb-16 lg:pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Article Body */}
              <div className="p-6 sm:p-8 lg:p-12">
                {/* Excerpt / Lead */}
                <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-8 font-medium border-l-4 border-orange-600 pl-6">
                  {localized(blog, 'excerpt')}
                </p>

                {/* Main Content */}
                <article
                  className="prose prose-lg max-w-none
                    prose-headings:text-gray-900 prose-headings:font-bold
                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900
                    prose-ul:my-6 prose-li:text-gray-600
                    prose-img:rounded-xl prose-img:shadow-lg"
                >
                  <div
                    className="blog-content whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: localized(blog, 'content') }}
                  />
                </article>

                {/* Tags Section */}
                {localizedTags(blog).length > 0 && (
                  <motion.div
                    className="mt-12 pt-8 border-t border-gray-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">{t('tags')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {localizedTags(blog).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-4 py-2 rounded-lg text-sm text-orange-700 font-medium hover:bg-orange-100 transition-colors cursor-pointer"
                        >
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Share Section */}
                <motion.div
                  className="mt-8 pt-8 border-t border-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Share2 size={14} />
                    {t('sharePost')}
                  </h4>
                  <div className="flex gap-3">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1877F2] text-white font-medium text-sm hover:bg-[#1664d9] transition-all shadow-md hover:shadow-lg"
                      aria-label="Share on Facebook"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(localized(blog, 'title'))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black text-white font-medium text-sm hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
                      aria-label="Share on X"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      X
                    </a>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(localized(blog, 'title') + ' ' + shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] text-white font-medium text-sm hover:bg-[#20bd5a] transition-all shadow-md hover:shadow-lg"
                      aria-label="Share on WhatsApp"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Related Articles Section */}
            {relatedBlogs && relatedBlogs.length > 0 && (
              <motion.div
                className="mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {t('relatedPosts')}
                  </h3>
                  <div className="flex-1 h-1 bg-gradient-to-r from-orange-600 via-orange-500 to-transparent rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedBlogs.map((relatedBlog, index) => (
                    <motion.div
                      key={relatedBlog._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                    >
                      <Link href={getLocalizedHref(`/blog/${relatedBlog.slug}`, locale)} className="block group">
                        <motion.article
                          className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                          whileHover={{ y: -6, scale: 1.02 }}
                        >
                          <div className="relative h-44 overflow-hidden">
                            <Image
                              src={relatedBlog.coverImage}
                              alt={localized(relatedBlog, 'title')}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            {/* Category Badge */}
                            <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
                              <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                                {localized(relatedBlog, 'category')}
                              </span>
                            </div>
                          </div>

                          <div className="p-5">
                            <h4 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 text-lg">
                              {localized(relatedBlog, 'title')}
                            </h4>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                              {localized(relatedBlog, 'excerpt')}
                            </p>
                            <div className="flex items-center gap-2 text-orange-600 text-sm font-semibold group-hover:gap-3 transition-all">
                              {t('readMore') || 'Read More'}
                              <ChevronRight size={16} />
                            </div>
                          </div>

                          {/* Hover Border Effect */}
                          <div className="absolute inset-0 border-2 border-orange-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </motion.article>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Back to Blog Button */}
                <div className="flex justify-center mt-12">
                  <Link
                    href={getLocalizedHref("/blogs", locale)}
                    className="inline-flex items-center gap-2 bg-white text-orange-600 border-2 border-orange-200 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200 text-sm shadow-sm hover:shadow-md"
                  >
                    <ArrowLeft size={16} />
                    {t('viewAllArticles') || 'Back to Blog'}
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        <SimpleFooter />
      </main>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": localized(blog, 'title'),
            "description": localized(blog, 'excerpt'),
            "image": blog.coverImage,
            "author": {
              "@type": "Organization",
              "name": blog.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Nice Quad Marrakech",
              "logo": {
                "@type": "ImageObject",
                "url": "https://nicequadmarrakech.com/logo.png"
              }
            },
            "datePublished": blog.publishedAt ? new Date(blog.publishedAt).toISOString() : undefined,
            "dateModified": new Date(blog.updatedAt).toISOString(),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://nicequadmarrakech.com/blog/${blog.slug}`
            }
          })
        }}
      />
    </>
  );
}
