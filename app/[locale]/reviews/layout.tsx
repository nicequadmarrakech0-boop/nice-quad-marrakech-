import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Reviews - Real Experiences",
  description: "Read authentic reviews from our customers about their quad and buggy adventures in Marrakech. See what makes Nice Quad Marrakech the top choice for desert adventures.",
  keywords: [
    "quad reviews marrakech",
    "buggy reviews marrakech",
    "customer testimonials",
    "marrakech adventure reviews",
    "nice quad reviews"
  ],
  alternates: {
    canonical: 'https://nicequadmarrakech.com/reviews',
  },
  openGraph: {
    title: "Customer Reviews | Nice Quad Marrakech",
    description: "Read authentic reviews from our customers",
    url: "https://nicequadmarrakech.com/reviews",
    images: [
      {
        url: "https://ik.imagekit.io/momh2323/can%20am%201%20.jpeg",
        width: 1200,
        height: 630,
        alt: "Customer Reviews"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Customer Reviews | Nice Quad Marrakech",
    description: "Read authentic reviews from our customers",
    images: ["https://ik.imagekit.io/momh2323/can%20am%201%20.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
