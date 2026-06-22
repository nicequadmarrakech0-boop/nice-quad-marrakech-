import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share Your Experience - Add a Review",
  description: "Share your quad or buggy adventure experience with others. Leave a review and help future adventurers choose their perfect ride in Marrakech.",
  keywords: [
    "add review marrakech",
    "share experience",
    "customer feedback",
    "testimonial submission"
  ],
  alternates: {
    canonical: 'https://nicequadmarrakech.com/add-review',
  },
  openGraph: {
    title: "Share Your Experience | Nice Quad Marrakech",
    description: "Share your adventure experience with others",
    url: "https://nicequadmarrakech.com/add-review",
  },
  robots: {
    index: false, // No need to index the review submission form page
    follow: true,
  },
};

export default function AddReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
