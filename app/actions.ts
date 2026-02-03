'use server'

import { createAdminClient } from "@/lib/supabase/server" // <--- Import from new server file
import { revalidatePath } from "next/cache"

export async function submitPledge(formData: FormData) {
    const supabase = createAdminClient() // <--- Initialize it here
    const campaignId = "dreamplay-one"

    const rewardId = formData.get("rewardId") as string
    const amount = Number(formData.get("amount"))
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const shippingAddress = formData.get("address") as string
    const shippingLocation = formData.get("shippingLocation") as string

    // 1. Find or Create Customer
    // We try to find a customer by email first
    let customerId: string

    const { data: existingCustomer } = await supabase
        .from("Customer")
        .select("id")
        .eq("email", email)
        .single()

    if (existingCustomer) {
        customerId = existingCustomer.id
    } else {
        // Create new customer
        const newId = crypto.randomUUID()
        const { error: createError } = await supabase
            .from("Customer")
            .insert({
                id: newId,
                email,
                name,
                // Add any other required fields for your Customer table here
            })

        if (createError) throw new Error(`Customer creation failed: ${createError.message}`)
        customerId = newId
    }

    // 2. Create the Pledge Record
    const { error: pledgeError } = await supabase
        .from("cf_pledge")
        .insert({
            campaign_id: campaignId,
            reward_id: rewardId,
            customer_id: customerId,
            amount: amount,
            shipping_address: shippingAddress,
            shipping_location: shippingLocation,
            status: 'succeeded' // In a real Stripe app, this would be 'pending' until webhook fires
        })

    if (pledgeError) throw new Error(`Pledge failed: ${pledgeError.message}`)

    // 3. Update Campaign Stats (Atomic Increment)
    // We use an RPC call or direct update. For simplicity/speed in this prototype, we fetch and update.
    // Ideally, you'd use a Database Trigger for this to ensure consistency.

    // A. Update Campaign Totals
    const { data: campaign } = await supabase
        .from("cf_campaign")
        .select("total_pledged, total_backers")
        .eq("id", campaignId)
        .single()

    if (campaign) {
        await supabase.from("cf_campaign").update({
            total_pledged: Number(campaign.total_pledged) + amount,
            total_backers: Number(campaign.total_backers) + 1
        }).eq("id", campaignId)
    }

    // B. Update Reward Stats
    const { data: reward } = await supabase
        .from("cf_reward")
        .select("backers_count")
        .eq("id", rewardId)
        .single()

    if (reward) {
        await supabase.from("cf_reward").update({
            backers_count: reward.backers_count + 1
        }).eq("id", rewardId)
    }

    // 4. Revalidate to show new numbers on UI
    revalidatePath("/")

    return { success: true }
}

// --- COMMUNITY ACTIONS ---

// 1. ADMIN: Post an Update
export async function postCampaignUpdate(formData: FormData) {
    const supabase = createAdminClient()
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const image = formData.get("image") as string // Assuming you upload via your existing upload tool first

    const { error } = await supabase.from("cf_update").insert({
        campaign_id: "dreamplay-one",
        title,
        content,
        image
    })

    if (error) return { success: false, error: error.message }
    revalidatePath("/")
    return { success: true }
}

// 2. PUBLIC: Post a Comment
export async function postComment(formData: FormData) {
    const supabase = createAdminClient()
    const updateId = formData.get("updateId") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const content = formData.get("content") as string

    const { error } = await supabase.from("cf_comment").insert({
        update_id: updateId,
        name,
        email,
        content
    })

    if (error) return { success: false, error: error.message }
    revalidatePath("/")
    return { success: true }
}

// 3. GET: Fetch Feed with "Verified" Logic
export async function getCommunityFeed() {
    const supabase = createAdminClient()

    // Fetch Updates
    const { data: updates } = await supabase
        .from("cf_update")
        .select("*")
        .order("created_at", { ascending: false })

    if (!updates) return []

    // Fetch Comments
    const { data: comments } = await supabase
        .from("cf_comment")
        .select("*")
        .order("created_at", { ascending: true })

    // Fetch All Backer Emails (to check status)
    // In a huge app, we'd do this differently, but for <10k backers this is instant.
    const { data: pledges } = await supabase
        .from("cf_pledge")
        .select("customer_id, Customer(email)")
        .eq("status", "succeeded")

    // Create a Set of verified emails for O(1) lookup
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const verifiedEmails = new Set(pledges?.map((p: any) => p.Customer?.email).filter(Boolean))

    // Merge Data
    return updates.map(update => ({
        ...update,
        comments: comments
            ?.filter(c => c.update_id === update.id)
            .map(c => ({
                ...c,
                isVerified: verifiedEmails.has(c.email) // <--- MAGIC HAPPENS HERE
            })) || []
    }))
}
