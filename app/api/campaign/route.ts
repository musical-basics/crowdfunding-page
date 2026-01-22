import { NextResponse } from 'next/server'
import { CAMPAIGN_DATA } from '@/lib/mock-data'

export async function GET() {
    // Simulate a realistic database delay (e.g., 500ms)
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(CAMPAIGN_DATA)
}
