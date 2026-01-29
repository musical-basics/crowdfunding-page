"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit } from "lucide-react"
import { updateReward } from "@/app/admin/actions"
import { useToast } from "@/hooks/use-toast"
import { useCampaign } from "@/context/campaign-context"
import { Reward } from "@/types/campaign"

interface EditRewardDialogProps {
    reward: Reward
}

export function EditRewardDialog({ reward }: EditRewardDialogProps) {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()
    const { refreshCampaign } = useCampaign()

    async function handleSubmit(formData: FormData) {
        formData.append("id", reward.id) // Ensure ID is passed
        const result = await updateReward(null, formData)

        if (result?.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive",
            })
        } else {
            setOpen(false)
            if (refreshCampaign) await refreshCampaign()
            toast({
                title: "Success",
                description: "Reward updated successfully",
                variant: "default",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Reward</DialogTitle>
                    <DialogDescription>
                        Update the details of this pledge tier.
                    </DialogDescription>
                </DialogHeader>

                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Reward Title</Label>
                        <Input id="title" name="title" defaultValue={reward.title} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input id="price" name="price" type="number" min="1" defaultValue={reward.price} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="delivery">Est. Delivery</Label>
                            <Input id="delivery" name="delivery" defaultValue={reward.estimatedDelivery} required />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="quantity">Quantity Limit (Optional)</Label>
                        <Input
                            id="quantity"
                            name="quantity"
                            type="number"
                            min="1"
                            defaultValue={reward.limitedQuantity || ""}
                            placeholder="Leave empty for unlimited"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" defaultValue={reward.description} required />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="items">Items Included (comma separated)</Label>
                        <Input id="items" name="items" defaultValue={reward.itemsIncluded.join(", ")} required />
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
