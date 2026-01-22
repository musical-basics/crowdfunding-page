"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { updateCreatorProfile } from "../actions" // Import the new action
import { useCampaign } from "@/context/campaign-context"

export default function CreatorProfilePage() {
    const { toast } = useToast()
    const { campaign } = useCampaign()

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

    if (!campaign) return <div className="p-8">Loading creator data...</div>
    const { creator } = campaign

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

                        {/* Avatar Preview & Input */}
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <Avatar className="h-24 w-24 border-2 border-border">
                                <AvatarImage src={creator.avatarUrl} className="object-cover" />
                                <AvatarFallback className="text-2xl font-bold">
                                    {creator.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 gap-2 grid w-full">
                                <Label htmlFor="avatarUrl">Avatar Image URL</Label>
                                <Input
                                    id="avatarUrl"
                                    name="avatarUrl"
                                    defaultValue={creator.avatarUrl}
                                    placeholder="https://example.com/my-image.jpg"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Paste a direct link to an image (JPG/PNG).
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
                            <p className="text-xs text-muted-foreground">
                                Tell backers about yourself and your background.
                            </p>
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
