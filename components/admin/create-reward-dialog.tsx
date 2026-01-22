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
import { Plus } from "lucide-react"
import { createReward } from "@/app/admin/actions" // Import the server action
import { useToast } from "@/hooks/use-toast"

export function CreateRewardDialog() {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    async function handleSubmit(formData: FormData) {
        const result = await createReward(null, formData)

        if (result?.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive",
            })
        } else {
            toast({
                title: "Success",
                description: "Reward created successfully",
                variant: "default", // You can use "success" if you have that variant configured
            })
            setOpen(false) // Close the modal
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Reward
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Reward</DialogTitle>
                    <DialogDescription>
                        Add a new pledge tier for your backers.
                    </DialogDescription>
                </DialogHeader>

                {/* The Action Attribute connects to the Server Action */}
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Reward Title</Label>
                        <Input id="title" name="title" placeholder="e.g. Early Bird Special" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input id="price" name="price" type="number" min="1" placeholder="50" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="delivery">Est. Delivery</Label>
                            <Input id="delivery" name="delivery" placeholder="Feb 2026" required />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="What do they get?" required />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="items">Items Included (comma separated)</Label>
                        <Input id="items" name="items" placeholder="Keyboard, Stand, Cable..." required />
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Save Reward</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
