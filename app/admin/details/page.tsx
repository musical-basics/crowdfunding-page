"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { updateCampaignDetails } from "../actions" // <--- Import the action
import { useCampaign } from "@/context/campaign-context"

export default function CampaignDetailsEditor() {
    const { toast } = useToast()
    const { campaign, refreshCampaign } = useCampaign() // Load current data to populate defaults

    // Wrapper to handle the server action response
    async function handleSubmit(formData: FormData) {
        try {
            await updateCampaignDetails(formData)
            await refreshCampaign() // Refresh client state immediately
            toast({
                title: "Success",
                description: "Campaign updated successfully",
                variant: "default",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update campaign",
                variant: "destructive",
            })
        }
    }

    if (!campaign) return <div>Loading...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Edit Campaign Details</h1>
            </div>

            {/* Connect the form to the Server Action */}
            <form action={handleSubmit} className="space-y-8">

                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Campaign Title</Label>
                            <Input id="title" name="title" defaultValue={campaign.title} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="subtitle">Subtitle</Label>
                            <Textarea id="subtitle" name="subtitle" defaultValue={campaign.subtitle} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="goal">Goal Amount ($)</Label>
                                <Input id="goal" name="goal" type="number" defaultValue={campaign.stats.goalAmount} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="endDate">End Date</Label>
                                {/* Note: You might need to format the date string properly for the input */}
                                <Input id="endDate" name="endDate" type="date" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Story Editor */}
                <Card>
                    <CardHeader>
                        <CardTitle>Campaign Story (HTML)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            id="story"
                            name="story"
                            className="min-h-[300px] font-mono text-sm"
                            defaultValue={campaign.story}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Risks (HTML)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            id="risks"
                            name="risks"
                            className="min-h-[200px]"
                            defaultValue={campaign.risks}
                        />
                    </CardContent>
                </Card>

                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto">
                    Save All Changes
                </Button>
            </form>
        </div>
    )
}
