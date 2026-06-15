import { Activity } from "../types";

export const ACTIVITIES: Activity[] = [
  {
    id: "beginner-surf",
    title: "Beginner Surf Lesson",
    price: 45,
    duration: "2 Hours",
    availability: "Available",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNFNPVuWc2fATjy22zkKRWtgM6wSPHl8_NvS-gOQu0qdXvpUjbu3GU4jeughHG-dX6ZE5loQS35FkYVK-Yp4miMvTkE36ZZm-t-FbRtFgI6dIGLl0n80ibsebANUEW1BnAAjxM0sAhTVq6LI6F3omrdjtH4tO5jNIVkcIceH-isvyTMU82IsdJmJH-cMfH_wgtBruPxr4mokgCohOHPdLZ9HVunyv2vrGV7q7gtAVxZ2CX8hR-4evyb41mUnls4GFi_CjQHUck-dmt",
    category: "Surf",
    rating: 4.9,
    reviewsCount: 128,
    description: "Master the waves with our expert instructors. Perfect for first-timers! Experience the thrill of standing on a board in a safe, supportive environment along our beautiful wave break.",
    tags: ["Water Sports", "Beginner Friendly"],
    maxGroupSize: 6,
    slots: [
      { id: "slot-bs-1", date: "June 12", time: "10:00 AM - 12:00 PM", spotsLeft: 4, full: false },
      { id: "slot-bs-2", date: "June 12", time: "2:00 PM - 4:00 PM", spotsLeft: 0, full: true },
      { id: "slot-bs-3", date: "June 13", time: "10:00 AM - 12:00 PM", spotsLeft: 6, full: false }
    ]
  },
  {
    id: "advanced-surf",
    title: "Advanced Surf Session",
    price: 60,
    duration: "2 Hours",
    availability: "Limited",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdXCoLN_ckT6fAGGaTM-6lnbBAUSxNq99P2GzgjT521MA0zaoDN7oe0LCm1nbUO_RXrv_DEUIS6ohCedK4um0QhuryVlvx56QJoEmTojTwOuOHZxnSP1CZO6SuJ2rksbx5rj8Nj6Q6nEKTLVej_Quc9Xl-FJd6CdKAR2Z7HiIng5gh12nAufo_1-ciZvFTc-jW-thzPeL8jdf8PLSxEL4eTndK6bu8nEum6pPi8kNbYUDxJCuEkNzuDud5e5HH7X0ibA-eTyfYObDw",
    category: "Surf",
    rating: 4.8,
    reviewsCount: 94,
    description: "For experienced surfers looking to challenge themselves. Our professional guides find the perfect breaks and analyze your style with live coastal coaching.",
    tags: ["Water Sports", "Advanced Only"],
    maxGroupSize: 4,
    slots: [
      { id: "slot-as-1", date: "June 12", time: "1:00 PM - 3:00 PM", spotsLeft: 1, full: false },
      { id: "slot-as-2", date: "June 14", time: "10:00 AM - 12:00 PM", spotsLeft: 3, full: false }
    ]
  },
  {
    id: "lake-boat",
    title: "Glass-Bottom Boat Trip",
    price: 35,
    duration: "3 Hours",
    availability: "Full",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaWrgDGzo1Ykg1ShTAqeGyI6iXFRGgXFRsA9Z5K20KFLGxD7OrJtA_RyI0v7oVpzSrQXZYkjl5EeiVBmBVm7iJ1jAuLFivb8e3akhQ561eSj2bLnJonLoDpogh_nbBWVd1hc5YrmA_VEQRmeB5bdrdeTgocEqBA6xwtVnZ2KWiJDFFQ0xcSZICbqQHvKyAlNPh9AQDB5j-fd6JA2hFcvXxEVZ56iXSMacrepABvLGoge3xGH-3uy4Uk6K446l3DqAViTJwqmhiKKlt",
    category: "Boat",
    rating: 4.7,
    reviewsCount: 215,
    description: "Glide over shallow reef sanctuaries on our customized observation vessel. Watch exotic coastal wildlife interact seamlessly through our safe panoramic underwater windows.",
    tags: ["Sightseeing", "Family Friendly"],
    maxGroupSize: 15,
    slots: [
      { id: "slot-gbb-1", date: "June 12", time: "11:00 AM - 2:00 PM", spotsLeft: 0, full: true }
    ]
  },
  {
    id: "sunset-sailing",
    title: "Sunset Sailing Tour",
    price: 55,
    duration: "2 Hours",
    availability: "Available",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkOAyGcWPqMkpdgZy6e14SANMJBEHUIs1S3az6FQG7VZqY6daYrMF8KyKouLii-iqxUlqv9mMNEefBoiEiV5XBfkYqFgOlaViibUg0EBkjhlz2ooBara97qroqvumUkQHV2cXH4PGTxSJXlKRXtuJwSgxMNhJ4DHgXoRU87uqfXxsPVelRjCvhRg4ZZfICS-kwanA2exR7Olt8EGJqznMuSn__zwn2akBm-ayrRhMgzM-ja2d0cyEQDK61T2UHRKhdIvG3CY_yzrao",
    category: "Tours",
    rating: 4.9,
    reviewsCount: 84,
    description: "Set sail at golden hour aboard our ultra-modern luxury catamarans. Take in premium views of the coastal cliffs while enjoying refreshments.",
    tags: ["Sailing", "Relaxing"],
    maxGroupSize: 10,
    slots: [
      { id: "slot-ss-1", date: "June 12", time: "6:00 PM - 8:00 PM", spotsLeft: 8, full: false },
      { id: "slot-ss-2", date: "June 13", time: "6:00 PM - 8:00 PM", spotsLeft: 5, full: false }
    ]
  },
  {
    id: "paddleboard-rental",
    title: "Stand-Up Paddleboard Rental",
    price: 20,
    duration: "1 Hour",
    availability: "Available",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCy69GrGyjkjddr2N7VWWNgfGk2-7sAgmoLu6dAxm-PHevk-x0PIU8z60AXRqmTSBlgzNTy7siXI0NgU4xGMx5ks-Y0I5gIObzS9IHorkA0JuZZmGlfOwemfKh3N1EGDVT_tNjGKyWrGeDzn2rmNi6ZwV2MsYVP6OeTnVZVdskVoLPsCDntJA598XD1EqrT4Hrm72TLwYxNTXn4P-O4ZztPtfHG6xjAXk38uK2BnmLM5iwT_UQHpzG_0UvkQJPYMw0rlE0pLtU7Ikb",
    category: "Surf",
    rating: 4.6,
    reviewsCount: 50,
    description: "Grab a high-grade foam core board and paddle through tranquil, glassy sea areas. Savor a peaceful and beautiful shoreline perspective.",
    tags: ["Rental", "Solo Friendly"],
    maxGroupSize: 1,
    slots: [
      { id: "slot-paddle-1", date: "June 12", time: "9:00 AM - 10:00 AM", spotsLeft: 1, full: false },
      { id: "slot-paddle-2", date: "June 13", time: "10:00 AM - 11:00 AM", spotsLeft: 1, full: false }
    ]
  }
];
