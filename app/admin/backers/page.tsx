"use client"

import { useEffect, useState } from "react"
// REMOVE: import { createBrowserClient } from "@/lib/supabase/client"
import { getBackers } from "@/app/admin/actions" // <--- Import the new action
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ManualPledgeDialog } from "@/components/admin/manual-pledge-dialog"
import { ImportPledgesButton } from "@/components/admin/import-pledges-button"
import { ExportPledgesButton } from "@/components/admin/export-pledges-button"

// Define interface for the data shape
interface Backer {
    id: string
    created_at: string
    amount: number
    status: string
    shipping_address: string | null
    shipping_location: string | null
    Customer: { name: string; email: string } | null
    cf_reward: { title: string } | null
}

export default function BackersPage() {
    const [pledges, setPledges] = useState<Backer[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            // Call the Server Action
            const data = await getBackers()
            // @ts-ignore - Supabase types can be tricky with joins, trusting the fetcher
            setPledges(data as Backer[])
            setIsLoading(false)
        }

        loadData()
    }, [])

    if (isLoading) return <div className="p-8">Loading backers...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Backers & Pledges</h1>
                <div className="flex gap-2 items-center">
                    <div className="text-muted-foreground mr-2">Total: {pledges.length}</div>
                    <ExportPledgesButton data={pledges} />
                    <ImportPledgesButton />
                    <ManualPledgeDialog />
                </div>
            </div>

            <div className="border rounded-lg bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Backer</TableHead>
                            <TableHead>Reward</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Shipping Address</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pledges.map((pledge) => (
                            <TableRow key={pledge.id}>
                                <TableCell>
                                    {new Date(pledge.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">
                                        {pledge.Customer?.name || 'Unknown'}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {pledge.Customer?.email || 'No email'}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {pledge.cf_reward?.title || 'No Reward'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-bold">
                                    ${pledge.amount.toLocaleString()}
                                </TableCell>
                                <TableCell className="max-w-[250px] truncate" title={pledge.shipping_address || ""}>
                                    {pledge.shipping_address ? (
                                        <div className="text-sm">
                                            <div>{pledge.shipping_address.substring(0, 30)}...</div>
                                            <div className="text-xs text-muted-foreground">
                                                {pledge.shipping_location}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">Digital / No Address</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={pledge.status === 'succeeded' ? 'default' : 'secondary'}
                                        className={pledge.status === 'succeeded' ? 'bg-emerald-600' : ''}
                                    >
                                        {pledge.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {pledges.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                        No backers found. Try importing a CSV or adding one manually.
                    </div>
                )}
            </div>
        </div>
    )
}
