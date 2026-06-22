"use client"

import { X, Star, Calendar, Quote } from 'lucide-react';
import { useEffect } from 'react';

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  carName: string;
  createdAt: number;
}

interface ReviewModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({ review, isOpen, onClose }: ReviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !review) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 hover:bg-orange-600 text-gray-600 hover:text-white transition-colors z-10 group"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Quote Icon */}
          <div className="mb-6">
            <Quote className="w-12 h-12 text-orange-600/20" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} size={24} className="text-orange-600 fill-orange-600" />
            ))}
            {[...Array(5 - review.rating)].map((_, i) => (
              <Star key={i} size={24} className="text-gray-300" />
            ))}
            <span className="ml-2 text-lg font-semibold text-gray-700">
              {review.rating}.0
            </span>
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <p className="text-gray-700 text-base leading-relaxed">
              "{review.comment}"
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{review.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Calendar size={14} />
                {formatDate(review.createdAt)}
              </div>
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-orange-50 text-orange-900 rounded-lg text-sm font-semibold border border-orange-200">
              {review.carName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
