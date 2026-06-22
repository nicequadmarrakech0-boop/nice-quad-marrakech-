"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslations } from "@/lib/i18n";

// Generate optimized thumbnail URL for videos
function getVideoThumbnailUrl(videoUrl: string): string {
  // Check if it's a Cloudinary URL
  if (videoUrl.includes('res.cloudinary.com')) {
    // Extract the public ID from Cloudinary URL
    // Format: https://res.cloudinary.com/{cloud}/video/upload/{transformations}/{publicId}.{ext}
    const match = videoUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.(mp4|mov|webm)/i);
    if (match) {
      const publicId = match[1];
      const cloudName = videoUrl.match(/res\.cloudinary\.com\/([^\/]+)/)?.[1];

      // Generate thumbnail URL with Cloudinary transformations
      // c_thumb = thumbnail mode, f_jpg = format as jpg, w_400 = width, so_auto = auto select best frame
      return `https://res.cloudinary.com/${cloudName}/video/upload/c_thumb,f_jpg,w_400,q_auto,so_auto/${publicId}.mp4`;
    }
  }

  // For ImageKit videos, use their video thumbnail API
  if (videoUrl.includes('ik.imagekit.io')) {
    // ImageKit format: add transformation params before the file path
    const url = new URL(videoUrl);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const baseUrl = videoUrl.replace(fileName, '');

    // Generate thumbnail at 2 seconds with 400px width
    return `${baseUrl}tr:w-400,q-80,so-2/${fileName}`;
  }

  // Fallback: return original URL (browser will handle it)
  return videoUrl;
}

// Optimized video thumbnail component using lazy-loaded images
function VideoThumbnail({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  const thumbnailUrl = getVideoThumbnailUrl(src);

  return (
    <div ref={imgRef} className="relative w-full h-full">
      {isInView ? (
        <>
          <Image
            src={thumbnailUrl}
            alt={alt}
            fill
            className={className}
            style={{ objectFit: 'cover' }}
            onLoad={() => setIsLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!isLoaded && (
            <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
          )}
        </>
      ) : (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
      )}
    </div>
  );
}

export function LayoutGridDemo() {
  const t = useTranslations("gallery")

  // Tab state
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");

  // Fetch images and videos from Convex
  const galleryImages = useQuery(api.gallery.getAllImages) ?? [];
  const galleryVideos = useQuery(api.gallery.getAllVideos) ?? [];
  const images = galleryImages.map(img => img.imageUrl);
  const videos = galleryVideos.map(vid => vid.imageUrl);

  // Loading state
  const isLoading = galleryImages === undefined || galleryVideos === undefined;

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Get active items based on tab
  const activeItems = activeTab === "images" ? images : videos;

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % activeItems.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + activeItems.length) % activeItems.length);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeItems.length) % activeItems.length);
  };

  useEffect(() => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: currentSlide * slideWidth,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  // Auto-switch carousel on mobile every 5 seconds
  useEffect(() => {
    if (activeItems.length === 0) return;

    const autoSwitch = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeItems.length);
    }, 5000);

    return () => clearInterval(autoSwitch);
  }, [activeItems.length]);

  // Reset slide when switching tabs
  useEffect(() => {
    setCurrentSlide(0);
    setSelectedImageIndex(null);
  }, [activeTab]);

  // Scroll active thumbnail into view (without affecting page scroll)
  useEffect(() => {
    if (thumbnailRefs.current[currentSlide] && thumbnailContainerRef.current) {
      const thumbnail = thumbnailRefs.current[currentSlide];
      const container = thumbnailContainerRef.current;

      if (thumbnail) {
        const thumbnailLeft = thumbnail.offsetLeft;
        const thumbnailWidth = thumbnail.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollLeft = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);

        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentSlide]);

  // Hide navbar when modal is open
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = 'hidden';
      // Hide all fixed elements with z-50 (navbar)
      const fixedElements = document.querySelectorAll('.fixed.z-50, [class*="z-50"]');
      fixedElements.forEach((element) => {
        (element as HTMLElement).style.display = 'none';
      });
    } else {
      document.body.style.overflow = '';
      // Restore all fixed elements
      const fixedElements = document.querySelectorAll('.fixed.z-50, [class*="z-50"]');
      fixedElements.forEach((element) => {
        (element as HTMLElement).style.display = '';
      });
    }
  }, [selectedImageIndex]);

  // Show empty state if no items in current tab
  const showEmptyState = activeItems.length === 0;

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative py-16 md:py-20 lg:py-24 bg-orange-50 overflow-hidden">
        <div className="container mx-auto flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-16 md:py-20 lg:py-24 bg-orange-50 overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Modern Section Header - Same style as animated-modal-demo */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
            {t("title")} <span className="text-primary">{t("titleHighlight")}</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {t("subtitle")}
          </p>

          {/* Decorative Line - Same as animated-modal-demo */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-px w-16 bg-primary" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="h-px w-16 bg-primary" />
          </div>
        </motion.div>

        {/* Tab Buttons */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            onClick={() => setActiveTab("images")}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === "images"
                ? "bg-primary text-white shadow-lg scale-105"
                : "bg-white/50 text-neutral-700 hover:bg-white/80 border border-neutral-200"
            }`}
          >
            {t("images")}
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === "videos"
                ? "bg-primary text-white shadow-lg scale-105"
                : "bg-white/50 text-neutral-700 hover:bg-white/80 border border-neutral-200"
            }`}
          >
            {t("videos")}
          </button>
        </motion.div>

        <style jsx global>{`
          .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            grid-auto-rows: 280px;
            grid-auto-flow: dense;
            gap: 16px;
            width: 100%;
          }

          @media (max-width: 768px) {
            .gallery-grid {
              display: none;
            }
          }

          /* Modern dynamic sizes - Pinterest/Masonry style */
          .gallery-grid > :nth-child(1) {
            grid-column: span 2;
            grid-row: span 2;
          }

          .gallery-grid > :nth-child(5) {
            grid-column: span 2;
          }

          .gallery-grid > :nth-child(7) {
            grid-row: span 2;
          }

          .gallery-grid > :nth-child(10) {
            grid-column: span 2;
          }

          .gallery-grid > :nth-child(12) {
            grid-row: span 2;
          }

          .gallery-grid > :nth-child(14) {
            grid-column: span 2;
            grid-row: span 2;
          }

          .gallery-carousel {
            display: none;
          }

          @media (max-width: 768px) {
            .gallery-carousel {
              display: block;
              position: relative;
              width: 100%;
              overflow: hidden;
            }

            .carousel-container {
              display: flex;
              overflow-x: auto;
              scroll-snap-type: x mandatory;
              scrollbar-width: none;
              -ms-overflow-style: none;
            }

            .carousel-container::-webkit-scrollbar {
              display: none;
            }

            .carousel-slide {
              flex: 0 0 100%;
              scroll-snap-align: start;
            }
          }

          .gallery-item-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow:
              0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
            cursor: pointer;
          }

          .dark .gallery-item-wrapper {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.08);
          }

          .gallery-item-wrapper:hover {
            transform: translateY(-2px);
            box-shadow:
              0 10px 20px -8px rgba(255, 119, 0, 0.15),
              0 8px 16px -8px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 0 rgba(255, 119, 0, 0.05);
            background: rgba(255, 119, 0, 0.03);
            border-color: rgba(255, 119, 0, 0.2);
          }

          .dark .gallery-item-wrapper:hover {
            background: rgba(255, 119, 0, 0.05);
            border-color: rgba(255, 119, 0, 0.15);
          }

          .gallery-item-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            border-radius: 15px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .gallery-item-wrapper:hover .gallery-item-image {
            transform: scale(1.02);
            filter: brightness(1.05) contrast(1.02) saturate(1.05);
          }

          /* Overlay effect on hover */
          .gallery-item-wrapper::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255, 119, 0, 0) 0%, rgba(255, 119, 0, 0.1) 100%);
            opacity: 0;
            transition: opacity 0.4s ease;
            border-radius: 15px;
            pointer-events: none;
          }

          .gallery-item-wrapper:hover::after {
            opacity: 1;
          }

          @media (max-width: 768px) {
            .gallery-item-wrapper {
              height: 400px;
            }
          }

          /* Hide scrollbar for thumbnails */
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }

          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Empty State */}
        {showEmptyState && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-muted-foreground">
              {t("noItems").replace("{type}", activeTab === "images" ? t("images").toLowerCase() : t("videos").toLowerCase())}
            </p>
          </motion.div>
        )}

        {/* Desktop Gallery Grid */}
        {!showEmptyState && (
          <div className="gallery-grid">
            {activeItems.map((item, index) => (
              <motion.div
                key={`desktop-${activeTab}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
              >
                <div
                  className="gallery-item-wrapper"
                  onClick={() => openModal(index)}
                >
                  {activeTab === "images" ? (
                    <img
                      className="gallery-item-image"
                      src={item}
                      alt={`Adventure ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="gallery-item-image relative">
                      {/* Client-side video thumbnail generation */}
                      <VideoThumbnail
                        src={item}
                        alt={`Video ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                        <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-8 h-8">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Mobile Gallery Carousel */}
        {!showEmptyState && (
          <div className="gallery-carousel">
            <div className="carousel-container" ref={carouselRef}>
              {activeItems.map((item, index) => (
                <div key={`mobile-${activeTab}-${index}`} className="carousel-slide">
                  <div
                    className="gallery-item-wrapper"
                    onClick={() => openModal(index)}
                  >
                    {activeTab === "images" ? (
                      <img
                        className="gallery-item-image"
                        src={item}
                        alt={`Adventure ${index + 1}`}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="gallery-item-image relative">
                        {/* Client-side video thumbnail generation - mobile */}
                        <VideoThumbnail
                          src={item}
                          alt={`Video ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                          <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-8 h-8">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Navigation */}
            <div className="flex flex-col items-center gap-4 mt-6">
              {/* Thumbnail Navigation */}
              <div ref={thumbnailContainerRef} className="flex gap-2 overflow-x-auto max-w-full px-4 py-2 scrollbar-hide">
                {activeItems.map((item, index) => (
                  <button
                    key={`thumb-${activeTab}-${index}`}
                    ref={(el) => { thumbnailRefs.current[index] = el; }}
                    onClick={() => setCurrentSlide(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                      index === currentSlide
                        ? 'ring-2 ring-primary scale-105'
                        : 'opacity-50 hover:opacity-75'
                    }`}
                    aria-label={`Go to ${activeTab === "images" ? "image" : "video"} ${index + 1}`}
                  >
                    {activeTab === "images" ? (
                      <img
                        src={item}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <VideoThumbnail
                        src={item}
                        alt={`Video thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Arrow Navigation */}
              <div className="flex items-center gap-4">
                <button
                  onClick={prevSlide}
                  className="p-3 rounded-full bg-background/10 backdrop-blur-xl border border-white/10 hover:bg-background/20 hover:border-white/20 transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={nextSlide}
                  className="p-3 rounded-full bg-background/10 backdrop-blur-xl border border-white/10 hover:bg-background/20 hover:border-white/20 transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Image Counter */}
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  {currentSlide + 1} / {activeItems.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
            onClick={closeModal}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={closeModal}
              className="absolute top-4 right-4 p-3 rounded-full bg-background/10 backdrop-blur-xl border border-white/10 hover:bg-background/20 hover:border-white/20 transition-all z-10"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Previous Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-background/10 backdrop-blur-xl border border-white/10 hover:bg-background/20 hover:border-white/20 transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </motion.button>

            {/* Next Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-background/10 backdrop-blur-xl border border-white/10 hover:bg-background/20 hover:border-white/20 transition-all z-10"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>

            {/* Media Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {activeTab === "images" ? (
                <img
                  src={activeItems[selectedImageIndex]}
                  alt={`Adventure ${selectedImageIndex + 1}`}
                  className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-2xl"
                />
              ) : (
                <video
                  src={activeItems[selectedImageIndex]}
                  controls
                  preload="metadata"
                  poster={getVideoThumbnailUrl(activeItems[selectedImageIndex])}
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '16px'
                  }}
                />
              )}

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-background/10 backdrop-blur-xl border border-white/10">
                <p className="text-white text-sm font-medium">
                  {selectedImageIndex + 1} / {activeItems.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}