export interface Creator {
    id: string;
    name: string;
    avatarUrl: string;
    bio: string;
    location: string;
    projectsCreated: number;
    projectsBacked: number;
}

export interface Reward {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    description: string;
    itemsIncluded: string[]; // e.g. ["Keyboard", "Cable"]
    estimatedDelivery: string;
    shipsTo: string[];
    backersCount: number;
    limitedQuantity?: number; // If null, unlimited
    timeLeft?: string; // For scarcity logic
    isSoldOut: boolean;
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
}

export interface CampaignStats {
    totalPledged: number;
    goalAmount: number;
    totalBackers: number;
    daysLeft: number;
}

export interface Campaign {
    id: string;
    title: string;
    subtitle: string;
    story: string; // HTML or Markdown content
    risks: string; // HTML or Markdown content
    images: {
        hero: string;
        gallery: string[];
    };
    stats: CampaignStats;
    creator: Creator;
    rewards: Reward[];
    faqs: FAQItem[];
}
