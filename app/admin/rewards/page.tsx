"use client"

import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react" // Removed 'Plus' import as it's inside the dialog now
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
import { CreateRewardDialog } from "@/components/admin/create-reward-dialog" // <--- Import the new component
import { deleteReward } from "../actions"

export default function AdminRewardsPage() {
    const { campaign } = useCampaign()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Manage Rewards</h1>

                {/* Replaced the static button with the functional Dialog */}
                <CreateRewardDialog />

            </div>

            <div className="border rounded-lg">
                {/* ... (Table code remains exactly the same as before) ... */}
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
