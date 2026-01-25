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
