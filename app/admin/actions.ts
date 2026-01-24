'use server'

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// --- CAMPAIGN ACTIONS ---

export async function updateCampaignDetails(formData: FormData) {
    const id = "dreamplay-one" // Hardcoded for single-campaign app

    const title = formData.get("title") as string
    const subtitle = formData.get("subtitle") as string
    const story = formData.get("story") as string
    const risks = formData.get("risks") as string
    const goalAmount = formData.get("goal")
    const endsAt = formData.get("endDate")

    const { error } = await supabase
        .from("cf_campaign")
        .update({
            title,
            subtitle,
            story,
            risks,
            goal_amount: goalAmount,
            ends_at: endsAt ? new Date(endsAt as string).toISOString() : undefined
        })
        .eq("id", id)

    if (error) throw new Error(error.message)

    // Refresh the data on the site immediately
    revalidatePath("/")
    revalidatePath("/admin/details")
    return { success: true }
}

// --- REWARD ACTIONS ---

export async function deleteReward(rewardId: string) {
    const { error } = await supabase
        .from("cf_reward")
        .delete()
        .eq("id", rewardId)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/rewards")
    revalidatePath("/") // Update public page too
    return { success: true }
}

export async function createReward(prevState: any, formData: FormData) {
    const campaignId = "dreamplay-one"

    const { error } = await supabase
        .from("cf_reward")
        .insert({
            id: crypto.randomUUID(), // Generate a new ID
            campaign_id: campaignId,
            title: formData.get("title"),
            price: Number(formData.get("price")),
            description: formData.get("description"),
            items_included: (formData.get("items") as string).split(",").map(i => i.trim()),
            estimated_delivery: formData.get("delivery"),
            ships_to: ["Anywhere in the world"], // Default to worldwide
            is_sold_out: false
        })

    if (error) return { error: error.message }

    revalidatePath("/admin/rewards")
    return { success: true }
}

// --- FAQ ACTIONS ---

export async function deleteFAQ(faqId: string) {
    const { error } = await supabase
        .from("cf_faq")
        .delete()
        .eq("id", faqId)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/faqs")
    revalidatePath("/")
    return { success: true }
}

// --- CREATOR ACTIONS ---

export async function updateCreatorProfile(formData: FormData) {
    const id = "popumusic" // Hardcoded for this single-creator demo

    const name = formData.get("name") as string
    const bio = formData.get("bio") as string
    const location = formData.get("location") as string

    // Handle File Upload
    const avatarFile = formData.get("avatarFile") as File
    let avatarUrl = formData.get("avatarUrl") as string

    if (avatarFile && avatarFile.size > 0) {
        // 1. Upload file to Supabase Storage
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `avatar-${Date.now()}.${fileExt}`
        const filePath = `creators/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('campaign-assets')
            .upload(filePath, avatarFile)

        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

        // 2. Get Public URL
        const { data: urlData } = supabase.storage
            .from('campaign-assets')
            .getPublicUrl(filePath)

        avatarUrl = urlData.publicUrl
    }

    const { error } = await supabase
        .from("cf_creator")
        .update({
            name,
            bio,
            location,
            avatar_url: avatarUrl,
        })
        .eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/creator")
    revalidatePath("/") // Update public page immediately
    return { success: true }
}
