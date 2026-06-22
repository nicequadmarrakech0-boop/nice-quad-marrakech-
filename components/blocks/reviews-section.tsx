"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Plus, Eye, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { getAllApprovedReviews } from "@/data/fakeData";
import { useTranslations } from "@/lib/i18n";

export const TestimonialsSectionDemo: React.FC = () => {
  const t = useTranslations("reviews")
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);

  // Fetch reviews from fake data - only show approved reviews
  const testimonials = getAllApprovedReviews();

  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth < 768) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < slidesPerView; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <div className="relative py-12 lg:py-16 bg-orange-50 overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          
          {/* Heading */}
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            {t("title")} <span className="text-orange-600">{t("titleHighlight")}</span> {t("titleEnd")}
          </h2>

          {/* Subheading */}
          <p className="text-base text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Empty State or Testimonials Slider */}
        {testimonials.length === 0 ? (
          <motion.div
            className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Quote className="w-16 h-16 mx-auto mb-4 text-orange-600/20" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("noReviews")}</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {t("noReviewsDesc")}
            </p>
            <a
              href="https://g.page/r/Cc0hz0Bqxb3zEAE/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg text-sm"
            >
              <Plus size={16} />
              {t("addReview")}
            </a>
          </motion.div>
        ) : (
          <>
            {/* Testimonials Slider */}
            <div className="relative">
              <div className="overflow-visible pb-4">
                <motion.div
                  className="flex gap-6"
                  initial={false}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {getVisibleTestimonials().map((testimonial, index) => (
                <motion.div
                  key={`${testimonial._id}-${currentIndex}-${index}`}
                  className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 h-full flex flex-col">
                    {/* Quote Icon */}
                    <div className="mb-4">
                      <Quote className="w-8 h-8 text-orange-600/20" />
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={`filled-${i}`} size={16} className="text-orange-600 fill-orange-600" />
                      ))}
                      {[...Array(5 - testimonial.rating)].map((_, i) => (
                        <Star key={`empty-${i}`} size={16} className="text-gray-300" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-6 flex-grow">
                      "{testimonial.comment}"
                    </p>

                    {/* Author */}
                    <div className="border-t border-gray-100 pt-4">
                      <p className="font-semibold text-gray-900 text-sm">
                        {testimonial.name.split(',')[0]}
                      </p>
                      <p className="text-xs text-gray-500">
                        {testimonial.name.split(',')[1]?.trim()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
                </motion.div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-center gap-3 mt-8">
                <button
                  onClick={prevSlide}
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-white border-2 border-gray-200 hover:bg-orange-600 hover:border-orange-600 hover:text-white text-gray-700 transition-colors duration-200 shadow-sm"
                  aria-label="Previous testimonials"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-white border-2 border-gray-200 hover:bg-orange-600 hover:border-orange-600 hover:text-white text-gray-700 transition-colors duration-200 shadow-sm"
                  aria-label="Next testimonials"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 bg-white text-orange-600 border-2 border-orange-200 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200 text-sm shadow-sm hover:shadow-md"
              >
                <Eye size={16} />
                {t("seeAllReviews")}
              </Link>
              <a
                href="https://g.page/r/Cc0hz0Bqxb3zEAE/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg text-sm"
              >
                <Plus size={16} />
                {t("addReview")}
              </a>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};
