"use client"

import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react" // Removed 'Plus' import as it's inside the dialog now
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useCampaign } from "@/context/campaign-context"
import { CreateRewardDialog } from "@/components/admin/create-reward-dialog"
import { EditRewardDialog } from "@/components/admin/edit-reward-dialog" // <--- Import the new component
import { deleteReward } from "../actions"

import { ImportRewardsButton } from "@/components/admin/import-rewards-button"
import { BulkAddRewardsDialog } from "@/components/admin/bulk-add-rewards-dialog"

export default function AdminRewardsPage() {
    const { campaign, refreshCampaign } = useCampaign()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Manage Rewards</h1>

                <div className="flex gap-2">
                    <BulkAddRewardsDialog />
                    <ImportRewardsButton />
                    <CreateRewardDialog />
                </div>

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
                                        <EditRewardDialog reward={reward} />

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the reward "{reward.title}" and remove it from the campaign.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-red-600 hover:bg-red-700"
                                                        onClick={async () => {
                                                            await deleteReward(reward.id)
                                                            await refreshCampaign()
                                                        }}
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

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
