import Script from 'next/script';

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
}

export function OrganizationSchema({
  name = "Nice Quad Marrakech",
  url = "https://nicequadmarrakech.com",
  logo = "https://ik.imagekit.io/momh2323/can%20am%201%20.jpeg",
  description = "Premium quad, buggy, and motocross rentals in Marrakech, Morocco. Experience the ultimate desert adventure.",
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": url,
    name,
    description,
    url,
    logo,
    image: logo,
    telephone: "+212 6 34 32 44 28",
    email: "contact@nicequadmarrakech.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marrakech",
      addressRegion: "Marrakech-Safi",
      addressCountry: "MA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.6295,
      longitude: -7.9811,
    },
    priceRange: "150 DHS - 2500 DHS",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "20:00",
    },
    sameAs: [
      "https://www.instagram.com/nicequadmarrakech/",
      "https://www.tiktok.com/@nicequadmarrakech?lang=en",
    ],
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  brand: string;
  model: string;
  price: number;
  currency: string;
  category: string;
}

export function ProductSchema({
  name,
  description,
  image,
  brand,
  model,
  price,
  currency,
  category,
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${brand} ${model}`,
    description,
    image,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    model,
    category,
    offers: {
      "@type": "Offer",
      url: "https://nicequadmarrakech.com/booking",
      priceCurrency: currency,
      price: price.toString(),
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      seller: {
        "@type": "Organization",
        name: "Nice Quad Marrakech",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "MA",
        },
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: currency,
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "MA",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        merchantReturnDays: 0,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "50",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <Script
      id={`product-schema-${model.toLowerCase().replace(/\s+/g, '-')}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ServiceSchemaProps {
  name?: string;
  description?: string;
}

export function ServiceSchema({
  name = "Quad and Buggy Rental Services",
  description = "Professional quad bike, buggy, and motocross rentals in Marrakech with guided desert tours and safety equipment included.",
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Vehicle Rental Service",
    name,
    description,
    provider: {
      "@type": "LocalBusiness",
      name: "Nice Quad Marrakech",
      url: "https://nicequadmarrakech.com",
    },
    areaServed: {
      "@type": "City",
      name: "Marrakech",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Rental Services",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Quad Bike Rentals",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "Quad Bike Rental",
              },
            },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Buggy Rentals",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "Buggy Rental",
              },
            },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Motocross Rentals",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "Motocross Bike Rental",
              },
            },
          ],
        },
      ],
    },
  };

  return (
    <Script
      id="service-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
