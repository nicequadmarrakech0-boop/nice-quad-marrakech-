export type ExperienceHighlight = {
  icon: 'plane' | 'elevator' | 'vacation' | 'food' | 'mic' | 'parachute';
  text: string;
};

export type Experience = {
  id: string;
  slug: string;
  category: 'QUAD' | 'BUGGY' | 'MOTO CROSS';
  title: string;
  highlightedText: string;
  emoji: string;
  brand: string;
  model: string;
  engineSize: string;
  description: string;
  images: string[];
  highlights: ExperienceHighlight[];
  specifications: Record<string, string | number>;
  pricing: {
    oneHour: { price: number; currency: string };
    twoHours: { price: number; currency: string };
  };
  seatOptions?: {
    seats: number;
    pricing: {
      oneHour: { price: number; currency: string };
      twoHours: { price: number; currency: string };
    };
  }[];
  bikeOptions?: {
    engineSize: string;
    model: string;
    brand: string;
    specifications: Record<string, string | number>;
    pricing: {
      oneHour: { price: number; currency: string };
      twoHours: { price: number; currency: string };
    };
  }[];
};

export const experiences: Experience[] = [
  // QUAD BIKES
  {
    id: "quad-kymco-300",
    slug: "quad-kymco-300",
    category: "QUAD",
    title: "Beginner-friendly adventure with",
    highlightedText: "KYMCO 300cc",
    emoji: "🏍️",
    brand: "KYMCO",
    model: "MXU 300",
    engineSize: "300cc",
    description: "Perfect beginner-friendly adventure through Marrakech's stunning desert landscapes. Your complete package includes: hotel pickup & drop-off, traditional Moroccan breakfast & tea, professional photos, and all safety gear. Automatic transmission makes it easy for first-time riders.",
    images: [
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.52%20(3).jpeg",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.51%20(3).jpeg",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.51%20(2).jpeg",
      "https://ik.imagekit.io/nicequad/IMG_0597.png",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.51%20(4).jpeg",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.53%20(1).jpeg",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.51%20(5).jpeg",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.51.jpeg",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.52%20(1).jpeg",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.52%20(4).jpeg",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.52.jpeg",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.53%20(2).jpeg",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.53.jpeg",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.51%20(1).jpeg",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.53%20(2).jpeg",
    ],
    specifications: {
      engine: "270cc 4-stroke liquid-cooled",
      power: "19.6 HP",
      transmission: "Automatic CVT",
      seats: 2,
    },
    pricing: {
      oneHour: { price: 150, currency: "MAD" },
      twoHours: { price: 150, currency: "MAD" },
    },
    highlights: [
      { icon: 'plane', text: 'Hotel pickup & drop-off' },
      { icon: 'food', text: 'Moroccan breakfast & tea' },
      { icon: 'mic', text: 'Professional photos included' },
      { icon: 'parachute', text: 'All safety gear included' },
      { icon: 'elevator', text: 'Beginner friendly' },
      { icon: 'vacation', text: 'Desert trails' },
    ],
  },
  {
    id: "quad-raptor-700",
    slug: "quad-yamaha-raptor-700",
    category: "QUAD",
    title: "High-performance thrill with",
    highlightedText: "Yamaha Raptor 700",
    emoji: "🏁",
    brand: "YAMAHA",
    model: "RAPTOR 700",
    engineSize: "700cc",
    description: "Unleash 45 HP of pure adrenaline on Morocco's most challenging terrain. This high-performance sport quad is built for experienced riders seeking the ultimate thrill. All-inclusive package features: hotel transfers, Moroccan breakfast & tea, professional photos, and full safety equipment. Advanced suspension tackles any terrain.",
    images: [
      "https://ik.imagekit.io/momh2323/CSP00215.jpg",
      "https://ik.imagekit.io/momh2323/CSP00269.jpg",
      "https://ik.imagekit.io/momh2323/CSP00280.jpg",
      "https://ik.imagekit.io/nicequad/IMG_0594.png",
      "https://ik.imagekit.io/momh2323/CSP00226.jpg",
      "https://ik.imagekit.io/momh2323/CSP00250.jpg",
      "https://ik.imagekit.io/momh2323/CSP00259.jpg",
      "https://ik.imagekit.io/momh2323/CSP00241.jpg",

    ],
    specifications: {
      engine: "686cc fuel-injected",
      power: "~45 HP",
      transmission: "5-speed manual",
      seats: 2,
    },
    pricing: {
      oneHour: { price: 1200, currency: "MAD" },
      twoHours: { price: 2000, currency: "MAD" },
    },
    highlights: [
      { icon: 'plane', text: 'Hotel pickup & drop-off' },
      { icon: 'food', text: 'Moroccan breakfast & tea' },
      { icon: 'mic', text: 'Professional photos included' },
      { icon: 'parachute', text: 'Full safety equipment' },
      { icon: 'elevator', text: '45 HP power' },
      { icon: 'vacation', text: 'Advanced suspension' },
    ],
  },

  // BUGGIES
  {
    id: "buggy-polaris-rs1",
    slug: "buggy-polaris-rzr-rs1",
    category: "BUGGY",
    title: "Solo performance with",
    highlightedText: "Polaris RZR RS1",
    emoji: "🏎️",
    brand: "POLARIS",
    model: "RZR RS1 1000",
    engineSize: "1000cc",
    description: "Experience pure performance with this 110 HP single-seat beast designed for aggressive off-road adventures. Your complete adventure includes: hotel pickup & drop-off, traditional Moroccan breakfast & tea, professional photos to capture every moment, and all safety equipment. Perfect for solo thrill-seekers.",
    images: [
      "https://lupz513xt9.ufs.sh/f/3n8dSxhfsmQPE5lZg72J7wGsO3TIRMWBjcue4XA05YzmlyrC",
      "https://lupz513xt9.ufs.sh/f/3n8dSxhfsmQP2UshyabyNt3V1WvLQbKFuUje4STkh6XYzAi8",
      "https://lupz513xt9.ufs.sh/f/3n8dSxhfsmQPRtZ1IRYeEjidf2Nnk6hpQY8UWVaHKvCZc3DS",
    ],
    specifications: {
      engine: "999cc ProStar Twin",
      power: "110 HP",
      transmission: "Automatic P/R/N/D",
      seats: 1,
      drivetrain: "AWD",
    },
    pricing: {
      oneHour: { price: 1500, currency: "MAD" },
      twoHours: { price: 2500, currency: "MAD" },
    },
    highlights: [
      { icon: 'plane', text: 'Hotel pickup & drop-off' },
      { icon: 'food', text: 'Moroccan breakfast & tea' },
      { icon: 'mic', text: 'Professional photos included' },
      { icon: 'parachute', text: 'Safety harness included' },
      { icon: 'elevator', text: 'AWD drivetrain' },
      { icon: 'vacation', text: 'Desert dunes ready' },
    ],
  },
  {
    id: "buggy-cfmoto-zforce-1000",
    slug: "buggy-cfmoto-zforce-1000-sport-r",
    category: "BUGGY",
    title: "Share the adventure with",
    highlightedText: "CFmoto ZFORCE 1000 SPORT R",
    emoji: "🚙",
    brand: "CFMOTO",
    model: "ZFORCE 1000 SPORT R",
    engineSize: "1000cc",
    description: "Share the adventure with this powerful 90 HP V-twin side-by-side buggy. Perfect for couples or friends wanting to experience the desert together. Complete package includes: hotel pickup & drop-off, traditional Moroccan breakfast & tea, professional photos of your journey, and dual safety harnesses. 2WD/4WD selectable for any terrain.",
    images: [
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.49.jpeg?updatedAt=1760793588274",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.49%20(1).jpeg?updatedAt=1760793588287",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.50.jpeg?updatedAt=1760793588311",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.49%20(2).jpeg?updatedAt=1760793588262",
      "https://ik.imagekit.io/nicequad/IMG_0605.png",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.49%20(3).jpeg?updatedAt=1760793588322",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.48.jpeg?updatedAt=1760793588032",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.49%20(4).jpeg?updatedAt=1760793588255",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.48%20(1).jpeg?updatedAt=1760793588331",
      "https://ik.imagekit.io/momh2323/WhatsApp%20Image%202025-10-16%20at%2014.43.48%20(2).jpeg?updatedAt=1760793588328",
    ],
    specifications: {
      engine: "963cc V-Twin",
      power: "90 HP",
      transmission: "CVT Sport/Normal",
      seats: 2,
      drivetrain: "2WD/4WD Selectable",
    },
    pricing: {
      oneHour: { price: 1400, currency: "MAD" },
      twoHours: { price: 2500, currency: "MAD" },
    },
    highlights: [
      { icon: 'plane', text: 'Hotel pickup & drop-off' },
      { icon: 'food', text: 'Moroccan breakfast & tea' },
      { icon: 'mic', text: 'Professional photos included' },
      { icon: 'parachute', text: 'Dual safety harness' },
      { icon: 'elevator', text: '90 HP V-twin power' },
      { icon: 'vacation', text: 'Couples adventure' },
    ],
  },
  {
    id: "buggy-canam-maverick",
    slug: "buggy-canam-xr-xrc",
    category: "BUGGY",
    title: "Ultimate power with",
    highlightedText: "CAN AM XR/XRC",
    emoji: "🔥",
    brand: "CAN-AM",
    model: "XR/XRC",
    engineSize: "1000cc",
    description: "Experience the ultimate adrenaline rush with this 200 HP turbocharged beast, perfect for extreme off-road desert adventures. Your all-inclusive package features: hotel pickup & drop-off, traditional Moroccan breakfast & tea, professional photos to capture your experience, and 4-point safety harnesses. Available in 2-seater for intense rides or 4-seater for sharing the adventure with family.",
    images: [
      "https://ik.imagekit.io/momh2323/Screenshot%202025-11-11%20at%2013.50.10.png",
      "https://ik.imagekit.io/nicequad/IMG_0614.png",
      "https://ik.imagekit.io/momh2323/CSP00428.jpg",
      "https://ik.imagekit.io/momh2323/CSP00417.jpg",
      "https://ik.imagekit.io/momh2323/CSP00423.jpg",
      "https://ik.imagekit.io/momh2323/Screenshot%202025-11-11%20at%2013.50.01.png",
      "https://ik.imagekit.io/momh2323/CSP00438.jpg",
      "https://ik.imagekit.io/momh2323/CSP00433.jpg",
      "https://ik.imagekit.io/momh2323/Screenshot%202025-11-11%20at%2013.49.44.png",
    ],
    specifications: {
      engine: "900cc Rotax ACE Turbo",
      power: "200 HP",
      transmission: "CVT Sport mode",
      seats: "2 or 4",
      drivetrain: "AWD Smart-Lok",
      suspension: "FOX Podium RC2",
    },
    pricing: {
      oneHour: { price: 1500, currency: "MAD" },
      twoHours: { price: 2500, currency: "MAD" },
    },
    seatOptions: [
      {
        seats: 2,
        pricing: {
          oneHour: { price: 1500, currency: "MAD" },
          twoHours: { price: 2500, currency: "MAD" },
        },
      },
      {
        seats: 4,
        pricing: {
          oneHour: { price: 2300, currency: "MAD" },
          twoHours: { price: 3800, currency: "MAD" },
        },
      },
    ],
    highlights: [
      { icon: 'plane', text: 'Hotel pickup & drop-off' },
      { icon: 'food', text: 'Moroccan breakfast & tea' },
      { icon: 'mic', text: 'Professional photos included' },
      { icon: 'parachute', text: '4-point harness' },
      { icon: 'elevator', text: 'FOX racing suspension' },
      { icon: 'vacation', text: 'Extreme terrain' },
    ],
  },

  // MOTOCROSS - Unified Experience
  {
    id: "moto-cross",
    slug: "motocross",
    category: "MOTO CROSS",
    title: "Motocross adventures",
    highlightedText: "Multiple Bike Options",
    emoji: "🏍️",
    brand: "YAMAHA/KTM",
    model: "Multiple Options",
    engineSize: "85cc - 450cc",
    description: "Professional motocross experience on world-class tracks with bikes ranging from 85cc youth models to powerful 450cc racing machines. Perfect for all skill levels from beginners to experts. Your complete package includes: hotel pickup & drop-off, traditional Moroccan breakfast & tea, professional photos of your ride, and full MX gear (helmet, boots, protective gear). Choose your perfect bike and skill level.",
    images: [
      "https://ik.imagekit.io/momh2323/CSP00463.jpg?updatedAt=1762862350363",
      "https://ik.imagekit.io/momh2323/CSP00381.jpg?updatedAt=1762862350152",
      "https://ik.imagekit.io/momh2323/CSP00338.jpg?updatedAt=1762862350105",
      "https://ik.imagekit.io/momh2323/CSP00467.jpg?updatedAt=1762862350102",
      "https://ik.imagekit.io/nicequad/IMG_0605.png",
      "https://ik.imagekit.io/momh2323/CSP00341.jpg?updatedAt=1762862350096",
      "https://ik.imagekit.io/momh2323/CSP00311.jpg?updatedAt=1762862349265",
      "https://ik.imagekit.io/momh2323/CSP00364.jpg?updatedAt=1762862347878",
      "https://ik.imagekit.io/momh2323/CSP00326.jpg?updatedAt=1762862347993",
    ],
    specifications: {
      engine: "85cc - 450cc",
      power: "20-62 HP",
      transmission: "5-6 speed",
      seats: 2,
    },
    pricing: {
      oneHour: { price: 1000, currency: "MAD" },
      twoHours: { price: 1800, currency: "MAD" },
    },
    bikeOptions: [
      {
        engineSize: "125cc",
        model: "YZ125",
        brand: "YAMAHA",
        specifications: {
          engine: "125cc 2-stroke",
          power: "~34 HP",
          transmission: "5-speed",
          weight: "86 kg",
          seats: 2,
        },
        pricing: {
          oneHour: { price: 1000, currency: "MAD" },
          twoHours: { price: 1800, currency: "MAD" },
        },
      },
      {
        engineSize: "250cc",
        model: "YZ250",
        brand: "YAMAHA",
        specifications: {
          engine: "250cc 2-stroke",
          power: "~49 HP",
          transmission: "5-speed",
          weight: "102 kg",
          seats: 2,
        },
        pricing: {
          oneHour: { price: 1000, currency: "MAD" },
          twoHours: { price: 1800, currency: "MAD" },
        },
      },
      {
        engineSize: "85cc",
        model: "YZ85",
        brand: "YAMAHA",
        specifications: {
          engine: "85cc 2-stroke",
          power: "~20 HP",
          transmission: "6-speed",
          weight: "68 kg",
          seats: 2,
        },
        pricing: {
          oneHour: { price: 1000, currency: "MAD" },
          twoHours: { price: 1800, currency: "MAD" },
        },
      },
      {
        engineSize: "450cc",
        model: "450 SX-F",
        brand: "KTM",
        specifications: {
          engine: "450cc 4-stroke SOHC",
          power: "~62 HP",
          transmission: "5-speed",
          weight: "100 kg",
          seats: 2,
        },
        pricing: {
          oneHour: { price: 1000, currency: "MAD" },
          twoHours: { price: 1800, currency: "MAD" },
        },
      },
    ],
    highlights: [
      { icon: 'plane', text: 'Hotel pickup & drop-off' },
      { icon: 'food', text: 'Moroccan breakfast & tea' },
      { icon: 'mic', text: 'Professional photos included' },
      { icon: 'parachute', text: 'Full MX gear included' },
      { icon: 'elevator', text: 'All skill levels' },
      { icon: 'vacation', text: 'Motocross tracks' },
    ],
  },
];
