import { Campaign } from "@/types/campaign";

export const CAMPAIGN_DATA: Campaign = {
  id: "dreamplay-one",
  title: "DreamPlay One - Crowdfunding Campaign",
  subtitle: "Back the DreamPlay One keyboard with narrower keys designed for your handspan. Stop over-stretching.",
  story: `
    <h2 class="text-4xl font-bold">Story</h2>
    <p class="text-base leading-relaxed text-foreground">
      I’ve been a concert pianist for years, performing at Carnegie Hall, Lincoln Center,
      and venues around the world. But there’s something most people never saw: I was
      constantly fighting against the piano.
    </p>
    <p class="text-base leading-relaxed text-foreground">
      My hands span just under 8.5 inches. That meant many traditional pieces were
      difficult, sometimes impossible, for me to play comfortably. No matter how much I
      practiced, I felt like the instrument wasn’t built for me.
    </p>
    <p class="text-base leading-relaxed text-foreground">
      So I asked myself:
      “What if the piano could be designed to fit the pianist, instead of the other way
      around?”
    </p>
    <p class="text-base leading-relaxed text-foreground">
      That’s where DreamPlay was born.
    </p>
  `,
  risks: `
    <h3 class="text-2xl font-bold">Risks & Challenges</h3>
    <p class="text-base leading-relaxed text-foreground">
      Every crowdfunding campaign comes with risks, and I want to be fully transparent with you. Here are the main challenges we face and how I plan to overcome them:
    </p>

    <div class="space-y-2">
      <h4 class="text-lg font-semibold">1. Manufacturing & Production Delays</h4>
      <p class="text-base leading-relaxed text-muted-foreground">
        Bringing a new musical instrument to life requires precision. Delays in manufacturing or supply chains can sometimes happen.
      </p>
      <p class="text-base leading-relaxed text-foreground">
        <span class="font-medium">My plan:</span> I've already partnered with experienced manufacturers who specialize in digital instruments, and we've accounted for buffer time in the production schedule.
      </p>
    </div>

    <div class="space-y-2">
      <h4 class="text-lg font-semibold">2. Shipping & Logistics</h4>
      <p class="text-base leading-relaxed text-muted-foreground">
        Global shipping can face unexpected issues such as customs delays or increased costs.
      </p>
      <p class="text-base leading-relaxed text-foreground">
        <span class="font-medium">My plan:</span> I'll be working with logistics partners who have handled international campaigns before. Shipping costs will be clearly calculated before you pledge, and I'll communicate any changes immediately.
      </p>
    </div>

    <div class="space-y-2">
      <h4 class="text-lg font-semibold">3. Product Development & Quality</h4>
      <p class="text-base leading-relaxed text-muted-foreground">
        The DS5.5 and DS6.0 prototypes are tested and working, but scaling production always carries the challenge of maintaining quality.
      </p>
      <p class="text-base leading-relaxed text-foreground">
        <span class="font-medium">My plan:</span> Every unit will go through strict quality control before shipping. I'll personally oversee this process to ensure DreamPlay meets the professional standards I demand as a pianist.
      </p>
    </div>

    <div class="space-y-2">
      <h4 class="text-lg font-semibold">4. Stretch Goal Features</h4>
      <p class="text-base leading-relaxed text-muted-foreground">
        Some stretch goals (like the DS6.5 model or premium finishes) will require additional development.
      </p>
      <p class="text-base leading-relaxed text-foreground">
        <span class="font-medium">My plan:</span> These features will only be unlocked if funding allows. This ensures I can deliver the promised products without overextending resources.
      </p>
    </div>

    <div class="space-y-2">
      <h4 class="text-lg font-semibold">5. Communication</h4>
      <p class="text-base leading-relaxed text-muted-foreground">
        Crowdfunding projects sometimes fail when creators go silent. That won't happen here.
      </p>
      <p class="text-base leading-relaxed text-foreground">
        <span class="font-medium">My plan:</span> I will post regular updates and send emails throughout production, so you always know where things stand.
      </p>
    </div>

    <div class="mt-8 rounded-lg border border-border bg-muted/30 p-6">
      <h4 class="text-lg font-semibold mb-3">Final Note</h4>
      <p class="text-base leading-relaxed text-foreground">
        I've poured my heart into DreamPlay because I know what it feels like to struggle against the piano. My commitment to you is simple: I'll deliver the instrument I always wished I had, and I'll keep you updated every step of the way.
      </p>
      <p class="mt-4 text-base leading-relaxed text-foreground">
        Thank you for trusting me and being part of this journey.
      </p>
    </div>
  `,
  images: {
    hero: "/images/hero-piano.png",
    gallery: [
      "/placeholder.jpg",
      "/placeholder.jpg"
    ]
  },
  stats: {
    totalPledged: 88808,
    goalAmount: 5000,
    totalBackers: 224,
    daysLeft: 28
  },
  creator: {
    id: "popumusic",
    name: "PopuMusic",
    avatarUrl: "/placeholder-user.jpg",
    bio: "Founded on April 1, 2015, PopuMusic is a dynamic team revolutionizing music interaction. Our mission is to make music accessible and engaging.",
    location: "Delaware City, DE",
    projectsCreated: 1,
    projectsBacked: 0
  },
  rewards: [
    {
      id: "vip-founder",
      title: "VIP Founder Access",
      price: 1,
      description: "Early updates + lowest price guarantee",
      itemsIncluded: ["VIP Access"],
      estimatedDelivery: "Immediate",
      shipsTo: ["Digital Reward"],
      backersCount: 127,
      isSoldOut: false
    },
    {
      id: "super-early-bird",
      title: "Super Early Bird",
      price: 199,
      originalPrice: 399,
      description: "DS5.5 or DS6.0 at the deepest discount",
      itemsIncluded: ["DreamPlay Keyboard"],
      estimatedDelivery: "Feb 2026",
      shipsTo: ["Anywhere in the world"],
      backersCount: 50,
      limitedQuantity: 50,
      isSoldOut: true
    },
    {
      id: "early-bird",
      title: "Early Bird",
      price: 249,
      originalPrice: 349,
      description: "DS5.5 or DS6.0 at a special price",
      itemsIncluded: ["DreamPlay Keyboard"],
      estimatedDelivery: "Feb 2026",
      shipsTo: ["Anywhere in the world"],
      backersCount: 34,
      limitedQuantity: 100,
      isSoldOut: false
    }
  ],
  faqs: [
    {
      id: "model-choice",
      category: "About Purchase",
      question: "Which DreamPlay model is right for me?",
      answer: "DreamPlay comes in two sizes: DS5.5..."
    },
    {
      id: "delivery-timeline",
      category: "About Purchase",
      question: "When will I receive my keyboard?",
      answer: "Here's the current timeline: Campaign ends..."
    }
  ],
  shipping: "<p>We ship worldwide! Estimated delivery: March 2026.</p><p>Shipping costs vary by region and will be calculated at checkout.</p>",
  keyFeatures: [
    { icon: "🎹", title: "Narrower Keys", desc: "15/16th size for ergonomic reach." },
    { icon: "🔊", title: "Pro Sound Engine", desc: "Sampled from a 9ft Concert Grand." },
    { icon: "🔋", title: "Portable Power", desc: "Built-in battery for 8 hours of play." },
    { icon: "📱", title: "Bluetooth MIDI", desc: "Connect instantly to your tablet." }
  ],
  techSpecs: [
    { label: "Dimensions", value: "120cm x 30cm x 10cm" },
    { label: "Weight", value: "12kg (26 lbs)" },
    { label: "Connectivity", value: "USB-C, Bluetooth 5.0, MIDI" },
    { label: "Power", value: "Internal Battery (8hrs) or AC Adapter" }
  ]
};
