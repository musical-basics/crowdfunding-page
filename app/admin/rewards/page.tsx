"use client"

import { Button } from "@/components/ui/button"
import { Trash, Eye, EyeOff, Copy } from "lucide-react"
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
import { deleteReward, toggleRewardVisibility, duplicateReward } from "../actions"
import { useToast } from "@/hooks/use-toast"

import { ImportRewardsButton } from "@/components/admin/import-rewards-button"
import { BulkAddRewardsDialog } from "@/components/admin/bulk-add-rewards-dialog"

export default function AdminRewardsPage() {
    const { campaign, refreshCampaign } = useCampaign()
    const { toast } = useToast()

    const handleToggleVisibility = async (reward: any) => {
        try {
            await toggleRewardVisibility(reward.id, reward.isVisible)
            await refreshCampaign()
            toast({
                title: reward.isVisible ? "Reward Hidden" : "Reward Visible",
                description: `"${reward.title}" is now ${reward.isVisible ? "hidden" : "live"}.`
            })
        } catch (e) {
            toast({ title: "Error", description: "Failed to update visibility", variant: "destructive" })
        }
    }

    const handleDuplicate = async (rewardId: string) => {
        try {
            const result = await duplicateReward(rewardId)
            if (result.success) {
                await refreshCampaign()
                toast({
                    title: "Reward Duplicated",
                    description: "A copy of the reward has been created."
                })
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to duplicate reward",
                    variant: "destructive"
                })
            }
        } catch (e) {
            toast({ title: "Error", description: "Failed to duplicate reward", variant: "destructive" })
        }
    }

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
                            <TableRow key={reward.id} className={!reward.isVisible ? "opacity-60 bg-muted/30" : ""}>
                                <TableCell className="font-medium">
                                    {reward.title}
                                    {!reward.isVisible && (
                                        <Badge variant="outline" className="ml-2 text-xs border-dashed">Hidden</Badge>
                                    )}
                                </TableCell>
                                <TableCell>${reward.price}</TableCell>
                                <TableCell>{reward.backersCount}</TableCell>
                                <TableCell>
                                    {!reward.isVisible ? (
                                        <Badge variant="outline">Hidden</Badge>
                                    ) : reward.isSoldOut ? (
                                        <Badge variant="destructive">Sold Out</Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                                            Active
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleToggleVisibility(reward)}
                                            title={reward.isVisible ? "Hide from public" : "Show to public"}
                                        >
                                            {reward.isVisible ? (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>

                                        <EditRewardDialog reward={reward} />

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDuplicate(reward.id)}
                                            title="Duplicate Reward"
                                        >
                                            <Copy className="h-4 w-4 text-muted-foreground" />
                                        </Button>

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
                                                        This action cannot be undone. This will permanently delete the reward "{reward.title}" AND REMOVE ALL associated backers/pledges.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-red-600 hover:bg-red-700"
                                                        onClick={async () => {
                                                            try {
                                                                await deleteReward(reward.id)
                                                                await refreshCampaign()
                                                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                                            } catch (error: any) {
                                                                alert("Failed to delete reward. " + error.message)
                                                            }
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
