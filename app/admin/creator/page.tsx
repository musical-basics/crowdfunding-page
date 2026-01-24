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

export default function CreatorProfilePage() {
    const { toast } = useToast()
    const { campaign } = useCampaign()
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        try {
            await updateCreatorProfile(formData)
            toast({
                title: "Success",
                description: "Creator profile updated successfully",
                variant: "default"
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive"
            })
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    if (!campaign) return <div className="p-8">Loading creator data...</div>
    const { creator } = campaign

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
                                <Label htmlFor="avatarFile">Profile Picture</Label>

                                <div className="flex gap-2">
                                    <Input
                                        id="avatarFile"
                                        name="avatarFile"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="cursor-pointer"
                                    />
                                </div>

                                {/* Hidden input to keep old URL if no new file */}
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
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 min-w-[150px]">
                        Save Profile
                    </Button>
                </div>
            </form>
        </div>
    )
}
