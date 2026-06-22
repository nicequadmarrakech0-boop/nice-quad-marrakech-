import { Metadata } from "next";
import { experiences } from "@/data/experiences";
import BookingClient from "./booking-client";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const experienceId = params.id;

  // Find the experience
  const experience = experiences.find(exp => exp.id === experienceId);

  if (!experience) {
    return {
      title: "Book Your Adventure - Quad & Buggy Rental | Nice Quad Marrakech",
      description: "Book your premium quad, buggy, or motocross adventure in Marrakech. Easy online booking with instant confirmation.",
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  }

  const title = `Book ${experience.brand} ${experience.model} - ${experience.category} Rental Marrakech | Nice Quad Marrakech`;
  const description = `Book ${experience.brand} ${experience.model} for your Marrakech adventure. ${experience.description} ${experience.pricing.oneHour.price} DHS/hour. Instant confirmation and professional guides.`;
  const canonicalUrl = `https://nicequadmarrakech.com/booking?id=${experienceId}`;
  const imageUrl = experience.images[0];

  return {
    title,
    description,
    keywords: [
      `book ${experience.brand} ${experience.model}`,
      `${experience.brand} ${experience.model} marrakech`,
      `${experience.category} rental marrakech`,
      `book ${experience.category} marrakech`,
      "quad booking marrakech",
      "buggy booking marrakech",
      "marrakech adventure booking"
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Book ${experience.brand} ${experience.model} | Nice Quad Marrakech`,
      description,
      url: canonicalUrl,
      siteName: "Nice Quad Marrakech",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${experience.brand} ${experience.model} - ${experience.category} rental in Marrakech`
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Book ${experience.brand} ${experience.model} | Nice Quad Marrakech`,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function BookingPage() {
  return <BookingClient />;
}
