'use server'

import { createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// --- CAMPAIGN ACTIONS ---

export async function updateCampaignDetails(formData: FormData) {
    const id = "dreamplay-one" // Hardcoded for single-campaign app

    const title = formData.get("title") as string
    const subtitle = formData.get("subtitle") as string
    const story = formData.get("story") as string
    const risks = formData.get("risks") as string
    const shipping = formData.get("shipping") as string
    const goalAmount = formData.get("goal")
    const endsAt = formData.get("endDate")

    // Parse JSON fields
    const keyFeaturesJson = formData.get("key_features_json") as string
    const techSpecsJson = formData.get("tech_specs_json") as string

    // Default to empty array if valid JSON isn't provided (though UI sends [])
    const keyFeatures = keyFeaturesJson ? JSON.parse(keyFeaturesJson) : []
    const techSpecs = techSpecsJson ? JSON.parse(techSpecsJson) : []

    // Handle Gallery Images
    // 1. Parse existing (kept) images
    const existingImagesJson = formData.get("existing_gallery_images") as string
    let galleryImages: string[] = existingImagesJson ? JSON.parse(existingImagesJson) : []

    // 2. Handle new file uploads
    const newFiles = formData.getAll("new_gallery_images") as File[]

    // We need a supabase client for storage uploads
    const supabase = createAdminClient()

    if (newFiles && newFiles.length > 0) {
        for (const file of newFiles) {
            if (file.size > 0) {
                const fileExt = file.name.split('.').pop()
                const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                const filePath = `campaign-gallery/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('campaign-assets')
                    .upload(filePath, file)

                if (uploadError) {
                    console.error("Upload failed:", uploadError)
                    continue // Skip failed uploads but continue with others
                }

                const { data: urlData } = supabase.storage
                    .from('campaign-assets')
                    .getPublicUrl(filePath)

                galleryImages.push(urlData.publicUrl)
            }
        }
    }

    const { error } = await supabase
        .from("cf_campaign")
        .update({
            title,
            subtitle,
            story,
            risks,
            shipping,
            goal_amount: goalAmount,
            ends_at: endsAt ? new Date(endsAt as string).toISOString() : undefined,
            gallery_images: galleryImages,
            key_features: keyFeatures,
            tech_specs: techSpecs
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
    const supabase = createAdminClient()

    // 1. Delete associated pledges first (Nuclear Option)
    const { error: pledgeError } = await supabase
        .from("cf_pledge")
        .delete()
        .eq("reward_id", rewardId)

    if (pledgeError) throw new Error(`Failed to delete associated pledges: ${pledgeError.message}`)

    // 2. Delete the reward
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
    const supabase = createAdminClient()

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
            limit_quantity: formData.get("quantity") ? Number(formData.get("quantity")) : null,
            ships_to: ["Anywhere in the world"], // Default to worldwide
            is_sold_out: false,
            image_url: await uploadRewardImage(formData.get("imageFile") as File, supabase)
        })

    if (error) return { error: error.message }

    revalidatePath("/admin/rewards")
    return { success: true }
}

export async function updateReward(prevState: any, formData: FormData) {
    const id = formData.get("id") as string
    const supabase = createAdminClient()

    // Upload image first so we can catch errors
    const imageFile = formData.get("imageFile") as File
    const existingImageUrl = formData.get("imageUrl") as string
    let imageUrl = existingImageUrl || null

    console.log("[updateReward] File info:", {
        hasFile: !!imageFile,
        size: imageFile?.size,
        name: imageFile?.name,
        existingUrl: existingImageUrl
    })

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name?.split('.').pop() || 'jpg'
        const fileName = `reward-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `rewards/${fileName}`

        console.log("[updateReward] Uploading to:", filePath)

        const { error: uploadError } = await supabase.storage
            .from('campaign-assets')
            .upload(filePath, imageFile)

        if (uploadError) {
            console.error("[updateReward] Upload failed:", uploadError)
            return { error: `Image upload failed: ${uploadError.message}` }
        }

        const { data: urlData } = supabase.storage
            .from('campaign-assets')
            .getPublicUrl(filePath)

        imageUrl = urlData.publicUrl
        console.log("[updateReward] Upload successful, new URL:", imageUrl)
    }

    console.log("[updateReward] Updating DB with image_url:", imageUrl)

    const { error } = await supabase
        .from("cf_reward")
        .update({
            title: formData.get("title"),
            price: Number(formData.get("price")),
            description: formData.get("description"),
            items_included: (formData.get("items") as string).split(",").map(i => i.trim()),
            estimated_delivery: formData.get("delivery"),
            limit_quantity: formData.get("quantity") ? Number(formData.get("quantity")) : null,
            image_url: imageUrl
        })
        .eq("id", id)

    if (error) {
        console.error("[updateReward] DB update failed:", error)
        return { error: error.message }
    }

    console.log("[updateReward] Success!")
    revalidatePath("/admin/rewards")
    revalidatePath("/")
    return { success: true }
}

async function uploadRewardImage(file: File, supabase: any, existingUrl?: string) {
    if (!file || file.size === 0) return existingUrl || null

    const fileExt = file.name.split('.').pop()
    const fileName = `reward-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `rewards/${fileName}`

    const { error: uploadError } = await supabase.storage
        .from('campaign-assets')
        .upload(filePath, file)

    if (uploadError) {
        console.error("Upload failed:", uploadError)
        return existingUrl || null
    }

    const { data: urlData } = supabase.storage
        .from('campaign-assets')
        .getPublicUrl(filePath)

    return urlData.publicUrl
}

// --- FAQ ACTIONS ---

export async function deleteFAQ(faqId: string) {
    const supabase = createAdminClient()
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

    const supabase = createAdminClient() // Move to top scope

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

// Helper to parse CSV respecting quotes
function parseCSVLine(line: string): string[] {
    const result = [];
    let startValueIndex = 0;
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
            inQuotes = !inQuotes;
        } else if (line[i] === ',' && !inQuotes) {
            let val = line.substring(startValueIndex, i).trim();
            // Remove surrounding quotes if present
            if (val.startsWith('"') && val.endsWith('"')) {
                val = val.slice(1, -1).replace(/""/g, '"');
            }
            result.push(val);
            startValueIndex = i + 1;
        }
    }
    // Push last value
    let lastVal = line.substring(startValueIndex).trim();
    if (lastVal.startsWith('"') && lastVal.endsWith('"')) {
        lastVal = lastVal.slice(1, -1).replace(/""/g, '"');
    }
    result.push(lastVal);
    return result;
}

// --- CSV IMPORT ACTION ---

export async function importRewards(formData: FormData) {
    const file = formData.get("file") as File
    if (!file) return { success: false, error: "No file provided" }

    const supabase = createAdminClient()

    const text = await file.text()
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0)

    // Assuming Row 1 is header, skip it
    // Expected Format: Title, Price, Description, Items (comma sep), Delivery, Quantity
    const dataRows = lines.slice(1)
    const campaignId = "dreamplay-one"
    const newRewards = []

    for (const line of dataRows) {
        const cols = parseCSVLine(line)

        // Safety check for column count
        if (cols.length < 3) continue

        newRewards.push({
            id: crypto.randomUUID(),
            campaign_id: campaignId,
            title: cols[0] || "Untitled Reward",
            price: parseFloat(cols[1]) || 0,
            description: cols[2] || "",
            items_included: cols[3] ? cols[3].split(';').map(i => i.trim()) : [], // Use ; for items inside CSV
            estimated_delivery: cols[4] || "TBD",
            ships_to: ["Anywhere in the world"],
            limit_quantity: cols[5] ? parseInt(cols[5]) : null,
            backers_count: 0,
            is_sold_out: false
        })
    }

    if (newRewards.length === 0) {
        return { success: false, error: "No valid rows found in CSV" }
    }

    const { error } = await supabase
        .from("cf_reward")
        .insert(newRewards)

    if (error) return { success: false, error: error.message }

    revalidatePath("/admin/rewards")
    revalidatePath("/")

    return { success: true, count: newRewards.length }
}

// Define the type for our bulk insert payload
type RewardRow = {
    title: string
    price: number
    description: string
    items: string
    delivery: string
    quantity: number | null
}

export async function bulkCreateRewards(rewards: RewardRow[]) {
    const campaignId = "dreamplay-one"
    const supabase = createAdminClient()

    // Transform the rows into the database format
    const dbPayload = rewards.map(r => ({
        id: crypto.randomUUID(),
        campaign_id: campaignId,
        title: r.title,
        price: r.price,
        description: r.description,
        items_included: r.items ? r.items.split(',').map(i => i.trim()) : [],
        estimated_delivery: r.delivery,
        limit_quantity: r.quantity && r.quantity > 0 ? r.quantity : null,
        ships_to: ["Anywhere in the world"],
        is_sold_out: false,
        backers_count: 0
    }))

    const { error } = await supabase
        .from("cf_reward")
        .insert(dbPayload)

    if (error) return { success: false, error: error.message }

    revalidatePath("/admin/rewards")
    revalidatePath("/")

    return { success: true }
}

// --- FAQ ACTIONS ---

export async function createFAQ(formData: FormData) {
    const campaignId = "dreamplay-one"
    const supabase = createAdminClient()

    const { error } = await supabase
        .from("cf_faq")
        .insert({
            id: crypto.randomUUID(),
            campaign_id: campaignId,
            question: formData.get("question"),
            answer: formData.get("answer"),
            category: formData.get("category"),
            order: 0 // Default to 0 for now
        })

    if (error) throw new Error(error.message)

    revalidatePath("/admin/faqs")
    revalidatePath("/")
    return { success: true }
}

export async function updateFAQ(formData: FormData) {
    const id = formData.get("id") as string
    const supabase = createAdminClient()

    const { error } = await supabase
        .from("cf_faq")
        .update({
            question: formData.get("question"),
            answer: formData.get("answer"),
            category: formData.get("category"),
        })
        .eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/faqs")
    revalidatePath("/")
    return { success: true }
}

// --- SETTINGS ACTIONS ---

export async function recalculateCampaignStats() {
    const campaignId = "dreamplay-one"
    const supabase = createAdminClient()

    // 1. Calculate Totals from scratch (The Source of Truth)
    const { data, error } = await supabase
        .from('cf_pledge')
        .select('amount')
        .eq('campaign_id', campaignId)
        .eq('status', 'succeeded')

    if (error) throw new Error(error.message)

    // 2. Perform the math
    const totalPledged = data.reduce((sum, row) => sum + Number(row.amount), 0)
    const totalBackers = data.length

    // 3. Overwrite the Campaign Table
    const { error: updateError } = await supabase
        .from('cf_campaign')
        .update({
            total_pledged: totalPledged,
            total_backers: totalBackers
        })
        .eq('id', campaignId)

    if (updateError) throw new Error(updateError.message)

    revalidatePath("/")
    revalidatePath("/admin")

    return {
        success: true,
        stats: { totalPledged, totalBackers }
    }
}
