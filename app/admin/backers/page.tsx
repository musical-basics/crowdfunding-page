"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PledgeWithDetails {
    id: string
    amount: number
    created_at: string
    status: string
    shipping_address: string | null
    shipping_location: string | null
    Customer: {
        name: string
        email: string
    }
    cf_reward: {
        title: string
    }
}

import { ManualPledgeDialog } from "@/components/admin/manual-pledge-dialog"

export default function BackersPage() {
    const [pledges, setPledges] = useState<PledgeWithDetails[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchBackers = async () => {
            const supabase = createBrowserClient()
            const { data, error } = await supabase
                .from('cf_pledge')
                .select(`
                    id,
                    amount,
                    created_at,
                    status,
                    shipping_address,
                    shipping_location,
                    Customer (
                        name,
                        email
                    ),
                    cf_reward (
                        title
                    )
                `)
                .order('created_at', { ascending: false })

            if (!error && data) {
                // @ts-ignore - Supabase types might verify strict joins but basic join works
                setPledges(data as unknown as PledgeWithDetails[])
            }
            setIsLoading(false)
        }

        fetchBackers()
    }, [])

    if (isLoading) return <div className="p-8">Loading backers...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Backers & Pledges</h1>
                <div className="flex gap-4 items-center">
                    <div className="text-muted-foreground">Total: {pledges.length}</div>
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
                                    <div className="font-medium">{pledge.Customer?.name || 'Unknown'}</div>
                                    <div className="text-xs text-muted-foreground">{pledge.Customer?.email}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{pledge.cf_reward?.title || 'No Reward'}</Badge>
                                </TableCell>
                                <TableCell className="font-bold">
                                    ${pledge.amount}
                                </TableCell>
                                <TableCell className="max-w-[250px]">
                                    {pledge.shipping_address ? (
                                        <div className="text-sm">
                                            <div>{pledge.shipping_address}</div>
                                            <div className="text-xs text-muted-foreground">{pledge.shipping_location}</div>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">Digital / No Address</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={pledge.status === 'succeeded' ? 'default' : 'secondary'} className={pledge.status === 'succeeded' ? 'bg-emerald-600' : ''}>
                                        {pledge.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
