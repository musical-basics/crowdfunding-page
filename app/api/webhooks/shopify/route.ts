import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(req: Request) {
    const text = await req.text()

    // 1. Security Check (HMAC)
    // You get this secret from Shopify Settings -> Notifications -> Webhooks
    const hmac = req.headers.get('x-shopify-hmac-sha256')
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET || ""

    if (secret) {
        const hash = crypto.createHmac('sha256', secret).update(text, 'utf8').digest('base64')
        if (hash !== hmac) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    }

    const order = JSON.parse(text)
    const supabase = createAdminClient()

    // 2. Process Order
    try {
        const email = order.email
        const name = order.shipping_address?.name || order.customer?.first_name || "Backer"
        const location = order.shipping_address?.country || "Unknown"

        // 3. Find Customer (or create)
        let customerId
        const { data: existing } = await supabase.from("Customer").select("id").eq("email", email).single()

        if (existing) {
            customerId = existing.id
        } else {
            const { data: newCustomer } = await supabase.from("Customer").insert({
                id: crypto.randomUUID(),
                email,
                name
            }).select("id").single()
            customerId = newCustomer?.id
        }

        // 4. Iterate Line Items
        // We match the Shopify Variant ID in the order to the one in your DB
        for (const item of order.line_items) {
            const variantId = item.variant_id.toString()
            const price = parseFloat(item.price)

            // Find matching reward in your DB
            const { data: reward } = await supabase
                .from("cf_reward")
                .select("id")
                .eq("shopify_variant_id", variantId)
                .single()

            if (reward) {
                // Insert Pledge
                await supabase.from("cf_pledge").insert({
                    campaign_id: "dreamplay-one",
                    reward_id: reward.id,
                    customer_id: customerId,
                    amount: price,
                    shipping_location: location,
                    status: "succeeded",
                    // Store Shopify Order ID to prevent duplicates if webhook fires twice
                    shipping_address: `Shopify Order #${order.order_number}`
                })
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Webhook Error:", error)
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}
