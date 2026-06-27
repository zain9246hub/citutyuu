// Seeds demo data into localStorage once (idempotent).
// Triggered from main.tsx on every app load; only writes keys that are empty.

const SEED_FLAG = "demoDataSeeded_v1";

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"];

const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

function seedIfEmpty(key: string, value: unknown) {
  try {
    const existing = localStorage.getItem(key);
    if (existing && existing !== "[]" && existing !== "{}") return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("[seed] failed", key, e);
  }
}

function buildBusinesses() {
  return CITIES.flatMap((city, ci) =>
    [0, 1].map((i) => {
      const id = `seed-biz-${ci}-${i}`;
      const photos = [
        img("photo-1517248135467-4c7edcad34c4"),
        img("photo-1559339352-11d035aa65de"),
        img("photo-1555396273-367ea4eb4db5"),
      ];
      return {
        id,
        name: `${city} ${i === 0 ? "Cafe House" : "Style Studio"}`,
        category: i === 0 ? "Food & Dining" : "Shopping",
        rating: 4.3 + i * 0.2,
        reviewCount: 60 + ci * 7,
        priceRange: "₹₹",
        location: `${i === 0 ? "MG Road" : "Park Street"}, ${city}`,
        city,
        distance: `${1 + i}.${ci} km`,
        coordinates: { lat: 19 + ci * 0.5, lng: 72 + ci * 0.5 },
        image: photos[0],
        images: photos,
        isNew: i === 0,
        isUserSubmitted: true,
        offers: true,
        categories: [i === 0 ? "Cafe" : "Boutique"],
        description: `Popular ${i === 0 ? "cafe" : "boutique"} in ${city} offering great experiences and exclusive deals for Cityoffers users.`,
        phone: `+91 98${ci}${i}45${ci}${i}789`,
        email: `hello@${city.toLowerCase()}${i}.demo`,
        website: `https://example.com/${city.toLowerCase()}-${i}`,
        hours: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => ({
          day: d, open: "10:00", close: "22:00", isOpen: true,
        })),
        isOpenNow: true,
        products: [
          { id: `${id}-p1`, name: "Signature Item", price: "₹299", description: "Best seller", image: photos[1] },
          { id: `${id}-p2`, name: "Combo Pack", price: "₹599", description: "Value combo", image: photos[2] },
        ],
        reviews: [
          { id: `${id}-r1`, name: "Aarav", rating: 5, comment: "Loved it!", date: "2026-05-12", verified: true },
          { id: `${id}-r2`, name: "Priya", rating: 4, comment: "Great vibe.", date: "2026-04-22", verified: true },
        ],
        features: ["WiFi", "Card Accepted", "Parking"],
      };
    })
  );
}

function buildDeals() {
  const tiers = ["standard", "highlight", "citywide", "video"] as const;
  const photos = [
    img("photo-1504674900247-0877df9cc836"),
    img("photo-1498050108023-c5249f4df085"),
    img("photo-1542291026-7eec264c27ff"),
    img("photo-1521572163474-6864f9cf17ab"),
  ];
  let id = 90000;
  return CITIES.flatMap((city, ci) =>
    tiers.map((tier, ti) => {
      const original = 1000 + ti * 500;
      const discount = 20 + ti * 10;
      const deal: any = {
        id: id++,
        title: `${city} ${tier === "video" ? "Video Reel Deal" : tier[0].toUpperCase() + tier.slice(1) + " Deal"} - ${discount}% Off`,
        description: `Demo ${tier} deal in ${city}. Enjoy exclusive savings at our partner location.`,
        image: photos[ti],
        images: [photos[ti]],
        originalPrice: original,
        discountedPrice: Math.round(original * (1 - discount / 100)),
        discount,
        category: ti % 2 === 0 ? "Food & Dining" : "Shopping",
        tags: [tier, city.toLowerCase(), "demo"],
        location: `Main Street, ${city}`,
        city,
        phone: `+91 90000${ci}${ti}123`,
        expiryDate: "2026-12-31",
        rating: 4.2 + ti * 0.1,
        featured: ti < 2,
        duration: 30,
        tier,
        isMetroCity: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"].includes(city),
        uploadedBy: "demo",
        subscriptionStartDate: new Date().toISOString(),
        subscriptionEndDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        subscriptionPrice: tier === "video" ? 499 : tier === "citywide" ? 299 : 119,
        isActive: true,
      };
      if (tier === "video") {
        deal.videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      }
      return deal;
    })
  );
}

function buildVideoReels() {
  return CITIES.slice(0, 4).map((city, i) => ({
    id: `seed-reel-${i}`,
    dealId: 90000 + i * 4 + 3,
    title: `${city} Hot Deal Reel`,
    description: `Trending video deal in ${city}`,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail: img("photo-1574375927938-d5a98e8ffe85"),
    city,
    location: `Downtown, ${city}`,
    likes: 50 + i * 12,
    shares: 5 + i,
    category: "Food & Dining",
    businessName: `${city} Cafe House`,
    phone: `+91 90000${i}0000`,
    createdAt: new Date().toISOString(),
  }));
}

function buildUploadedAds() {
  const photos = [
    img("photo-1556909114-f6e7ad7d3136"),
    img("photo-1571171637578-41bc2dd41cd2"),
    img("photo-1572635196237-14b3f281503f"),
    img("photo-1542838132-92c53300491e"),
  ];
  const now = Date.now();
  const ads: any[] = [];
  CITIES.slice(0, 4).forEach((city, ci) => {
    [1, 2].forEach((position, pi) => {
      ads.push({
        id: `seed-ad-${ci}-${position}`,
        slotId: String(position),
        position,
        location: city,
        title: `${city} ${position === 1 ? "Premium" : "Standard"} Banner`,
        description: `Featured promo in ${city} — tap to explore deals.`,
        websiteUrl: "https://example.com",
        phoneNumber: `+91 99${ci}${pi}1122334`,
        imageUrl: photos[(ci + pi) % photos.length],
        imageUrls: [photos[(ci + pi) % photos.length]],
        uploadedBy: "demo",
        uploadedAt: new Date(now).toISOString(),
        isActive: true,
        subscriptionStartDate: new Date(now).toISOString(),
        subscriptionEndDate: new Date(now + 30 * 86400000).toISOString(),
        monthlyPrice: position === 1 ? 999 : 499,
      });
    });
  });
  return ads;
}

function buildChatMessages() {
  const now = Date.now();
  const mk = (city: string, sender: string, content: string, mins: number) => ({
    id: `${city}-${sender}-${mins}`,
    sender,
    content,
    contentType: "text" as const,
    timestamp: new Date(now - mins * 60000).toISOString(),
    status: "read" as const,
    seenBy: [sender],
    city,
  });
  const out: Record<string, any[]> = { "All Cities": [
    mk("All Cities", "Emma", "Anyone tried the new burger combo deal? 🍔", 30),
    mk("All Cities", "Michael", "Yes! Worth every rupee.", 25),
    mk("All Cities", "Sophia", "Heading to Bangalore next week, any cafe recos?", 10),
  ]};
  CITIES.forEach((city, i) => {
    out[city] = [
      mk(city, "John", `Hey ${city}! Any good offers this weekend?`, 120 - i * 10),
      mk(city, "Emma", "Check the Premium banner — 40% off!", 90 - i * 10),
      mk(city, "You", "Thanks, just saved it.", 60 - i * 10),
    ];
  });
  return out;
}

export function seedDemoData(force = false) {
  try {
    if (!force && localStorage.getItem(SEED_FLAG)) return;

    seedIfEmpty("userBusinesses", buildBusinesses());
    seedIfEmpty("userDeals", buildDeals());
    seedIfEmpty("videoReels", buildVideoReels());
    seedIfEmpty("uploadedAds", buildUploadedAds());
    seedIfEmpty("city_chat_messages", buildChatMessages());

    localStorage.setItem(SEED_FLAG, "1");
    console.log("[seed] demo data seeded");
  } catch (e) {
    console.warn("[seed] error", e);
  }
}
