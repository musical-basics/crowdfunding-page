import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    const { data: rewards, error } = await supabase
        .from('cf_reward')
        .select('id, title, price')
        .eq('campaign_id', 'dreamplay-one')

    if (error) {
        console.error('Error fetching rewards:', error)
        return
    }

    console.log('Rewards:', JSON.stringify(rewards, null, 2))
}

main()
