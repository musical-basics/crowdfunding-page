"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { updateCreatorProfile } from "../actions"
import { useCampaign } from "@/context/campaign-context"
import { ImageCropper } from "@/components/admin/image-cropper"
import { Loader2 } from "lucide-react"

export default function CreatorProfilePage() {
    const { toast } = useToast()
    const { campaign, refreshCampaign } = useCampaign() // using refreshCampaign

    // UI States
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    // Cropper States
    const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null)
    const [isCropperOpen, setIsCropperOpen] = useState(false)
    const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null)

    // 1. User picks a file -> Read it -> Open Cropper
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.addEventListener("load", () => {
                setOriginalImageSrc(reader.result as string)
                setIsCropperOpen(true)
                // Clear the input so selecting the same file again works if needed
                e.target.value = ""
            })
            reader.readAsDataURL(file)
        }
    }

    // 2. User confirms crop
    const handleCropComplete = (blob: Blob) => {
        setCroppedBlob(blob)
        setPreviewUrl(URL.createObjectURL(blob)) // Show cropped preview
        setIsCropperOpen(false)
    }

    async function handleSubmit(formData: FormData) {
        setIsSaving(true)
        try {
            // If we have a cropped blob, we must append it manually 
            // because the original file input still holds the uncropped file (or is empty if we cleared it)
            // But actually, we want to SEND the cropped blob.
            if (croppedBlob) {
                formData.set("avatarFile", croppedBlob, "avatar-cropped.jpg")
            }

            await updateCreatorProfile(formData)

            // Refresh context to show latest data
            if (refreshCampaign) {
                await refreshCampaign()
            }

            toast({
                title: "Success",
                description: "Creator profile updated successfully",
                variant: "default"
            })
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (!campaign) return <div className="p-8">Loading creator data...</div>
    const { creator } = campaign

    // Use preview URL if available, otherwise fallback to database URL
    const currentAvatar = previewUrl || creator.avatarUrl

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Creator Profile</h1>
            </div>

            <form action={handleSubmit} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Public Profile</CardTitle>
                        <CardDescription>
                            This information appears on the campaign page sidebar and the "Creator" tab.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Avatar Preview & Upload */}
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <Avatar className="h-24 w-24 border-2 border-border">
                                <AvatarImage src={currentAvatar} className="object-cover" />
                                <AvatarFallback className="text-2xl font-bold">
                                    {creator.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 gap-2 grid w-full">
                                <Label htmlFor="avatarTrigger">Profile Picture</Label>

                                <div className="flex gap-2">
                                    {/* Visible Label acting as button */}
                                    <Label
                                        htmlFor="avatarTrigger"
                                        className="cursor-pointer inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        Choose Image to Crop & Upload...
                                    </Label>

                                    {/* Hidden Input */}
                                    <Input
                                        id="avatarTrigger"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>

                                {/* Keep old URL just in case */}
                                <input type="hidden" name="avatarUrl" value={creator.avatarUrl} />

                                <p className="text-xs text-muted-foreground">
                                    Upload a JPG or PNG. Max size 2MB.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={creator.name}
                                className="max-w-md"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                defaultValue={creator.location}
                                className="max-w-md"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bio">Biography</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                className="min-h-[150px] font-sans"
                                defaultValue={creator.bio}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 min-w-[150px]">
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Profile
                    </Button>
                </div>
            </form>

            {/* Cropper Modal */}
            {originalImageSrc && (
                <ImageCropper
                    isOpen={isCropperOpen}
                    imageSrc={originalImageSrc}
                    onClose={() => setIsCropperOpen(false)}
                    onCropComplete={handleCropComplete}
                />
            )}
        </div>
    )
}
