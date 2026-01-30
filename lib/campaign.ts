import { createAdminClient } from "@/lib/supabase/server"
import { Campaign } from "@/types/campaign"

export async function getCampaignData(slug: string): Promise<Campaign | null> {
    const supabase = createAdminClient()

    // 1. Fetch Campaign & Creator
    const { data: campaignData, error } = await supabase
        .from('cf_campaign')
        .select(`*, creator:cf_creator(*)`)
        .eq('id', slug)
        .single()

    if (error || !campaignData) return null

    const campaignId = campaignData.id

    // 2. Fetch Rewards
    const { data: rewardsData } = await supabase
        .from('cf_reward')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('price', { ascending: true })

    // 3. Fetch FAQs
    const { data: faqData } = await supabase
        .from('cf_faq')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('order', { ascending: true })

    // 4. Transform to Frontend Type
    return {
        id: campaignData.id,
        title: campaignData.title,
        subtitle: campaignData.subtitle,
        story: campaignData.story,
        risks: campaignData.risks,
        shipping: campaignData.shipping || '',
        images: {
            hero: campaignData.hero_image,
            gallery: campaignData.gallery_images || []
        },
        stats: {
            totalPledged: Number(campaignData.total_pledged),
            goalAmount: Number(campaignData.goal_amount),
            totalBackers: campaignData.total_backers,
            daysLeft: Math.max(0, Math.ceil((new Date(campaignData.ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        },
        creator: {
            id: campaignData.creator.id,
            name: campaignData.creator.name,
            avatarUrl: campaignData.creator.avatar_url,
            bio: campaignData.creator.bio,
            location: campaignData.creator.location,
            projectsCreated: campaignData.creator.projects_created,
            projectsBacked: campaignData.creator.projects_backed
        },
        rewards: rewardsData?.map((r: any) => ({
            id: r.id,
            title: r.title,
            price: Number(r.price),
            originalPrice: r.original_price ? Number(r.original_price) : undefined,
            description: r.description,
            itemsIncluded: r.items_included || [],
            estimatedDelivery: r.estimated_delivery,
            shipsTo: r.ships_to || [],
            backersCount: r.backers_count,
            limitedQuantity: r.limit_quantity,
            isSoldOut: r.is_sold_out,
            imageUrl: r.image_url
        })) || [],
        faqs: faqData?.map((f: any) => ({
            id: f.id,
            category: f.category,
            question: f.question,
            answer: f.answer
        })) || [],
        keyFeatures: campaignData.key_features || [],
        techSpecs: campaignData.tech_specs || []
    }
}
