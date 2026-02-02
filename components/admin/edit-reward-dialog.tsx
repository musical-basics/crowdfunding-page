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
import { ImageCropper } from "./image-cropper" // Add import

interface EditRewardDialogProps {
    reward: Reward
}

export function EditRewardDialog({ reward }: EditRewardDialogProps) {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()
    const { refreshCampaign } = useCampaign()
    const [preview, setPreview] = useState(reward.imageUrl || "")

    // Cropper States
    const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null)
    const [isCropperOpen, setIsCropperOpen] = useState(false)
    const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.addEventListener("load", () => {
                setOriginalImageSrc(reader.result as string)
                setIsCropperOpen(true)
                // Clear the input so selecting the same file again works
                e.target.value = ""
            })
            reader.readAsDataURL(file)
        }
    }

    const handleCropComplete = (blob: Blob) => {
        setCroppedBlob(blob)
        setPreview(URL.createObjectURL(blob))
        setIsCropperOpen(false)
    }

    async function handleSubmit(formData: FormData) {
        formData.append("id", reward.id) // Ensure ID is passed

        // If we have a cropped blob, we must append it manually
        if (croppedBlob) {
            formData.set("imageFile", croppedBlob, "reward-cropped.jpg")
        }

        const result = await updateReward(null, formData)

        if (result?.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive",
            })
        } else {
            setOpen(false)
            setCroppedBlob(null) // Reset
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
                    <input type="hidden" name="imageUrl" value={reward.imageUrl || ""} />
                    <div className="grid gap-2">
                        <Label htmlFor="title">Reward Title</Label>
                        <Input id="title" name="title" defaultValue={reward.title} required />
                    </div>

                    <div className="grid gap-2">
                        <Label>Reward Image</Label>
                        <div className="flex items-center gap-4">
                            {preview && (
                                <div className="relative w-24 h-16 rounded overflow-hidden border border-border">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <Input
                                id="imageFile"
                                name="imageFile"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="cursor-pointer"
                            />
                        </div>
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

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isFeatured"
                            name="isFeatured"
                            defaultChecked={reward.isFeatured}
                            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <Label htmlFor="isFeatured">Featured Reward (Most Popular)</Label>
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

            {/* Cropper Modal */}
            {
                originalImageSrc && (
                    <ImageCropper
                        isOpen={isCropperOpen}
                        imageSrc={originalImageSrc}
                        onClose={() => setIsCropperOpen(false)}
                        onCropComplete={handleCropComplete}
                        aspect={16 / 9} // Landscape for rewards
                    />
                )
            }
        </Dialog >
    )
}
