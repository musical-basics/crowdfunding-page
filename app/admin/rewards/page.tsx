"use client"

import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useCampaign } from "@/context/campaign-context"
import { deleteReward } from "../actions" // Import action

export default function AdminRewardsPage() {
    const { campaign } = useCampaign()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Manage Rewards</h1>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Reward
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Backers</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {campaign?.rewards.map((reward) => (
                            <TableRow key={reward.id}>
                                <TableCell className="font-medium">{reward.title}</TableCell>
                                <TableCell>${reward.price}</TableCell>
                                <TableCell>{reward.backersCount}</TableCell>
                                <TableCell>
                                    {reward.isSoldOut ? (
                                        <Badge variant="destructive">Sold Out</Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                                            Active
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>

                                        {/* Wrap the delete button in a form to trigger the server action */}
                                        <form action={async () => {
                                            await deleteReward(reward.id)
                                        }}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-600"
                                                type="submit"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </form>

                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
