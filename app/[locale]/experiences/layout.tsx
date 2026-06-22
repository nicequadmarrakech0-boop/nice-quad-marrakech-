import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Experiences - Quad, Buggy & Motocross Rentals",
  description: "Explore our complete fleet of premium quads, buggies, and motocross bikes. Choose the perfect ride for your Marrakech desert adventure. From beginner-friendly KYMCO 300 to powerful CAN-AM XR.",
  keywords: [
    "quad experiences marrakech",
    "buggy rentals marrakech",
    "motocross marrakech",
    "yamaha raptor 700",
    "can-am xr",
    "polaris rzr",
    "cfmoto zforce"
  ],
  alternates: {
    canonical: 'https://nicequadmarrakech.com/experiences',
  },
  openGraph: {
    title: "All Experiences | Nice Quad Marrakech",
    description: "Browse our complete fleet of premium adventure vehicles in Marrakech",
    url: "https://nicequadmarrakech.com/experiences",
    images: [
      {
        url: "https://ik.imagekit.io/momh2323/can%20am%201%20.jpeg",
        width: 1200,
        height: 630,
        alt: "Nice Quad Marrakech Experiences"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Experiences | Nice Quad Marrakech",
    description: "Browse our complete fleet of premium adventure vehicles in Marrakech",
    images: ["https://ik.imagekit.io/momh2323/can%20am%201%20.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ExperiencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
