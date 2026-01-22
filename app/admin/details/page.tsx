"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function CampaignDetailsEditor() {
    const { toast } = useToast()

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        // Here we will eventually call supabase.from('cf_campaign').update(...)
        toast({
            title: "Changes Saved",
            description: "Your campaign details have been updated successfully.",
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Edit Campaign Details</h1>
                <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
            </div>

            <form className="space-y-8">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>The core details displayed on your campaign header.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Campaign Title</Label>
                            <Input id="title" defaultValue="DreamPlay One - Crowdfunding Campaign" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="subtitle">Subtitle</Label>
                            <Textarea id="subtitle" defaultValue="Back the DreamPlay One keyboard with narrower keys..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="goal">Goal Amount ($)</Label>
                                <Input id="goal" type="number" defaultValue="5000" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="duration">End Date</Label>
                                <Input id="duration" type="date" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Story Editor */}
                <Card>
                    <CardHeader>
                        <CardTitle>Campaign Story</CardTitle>
                        <CardDescription>HTML content for the main story tab.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <Label htmlFor="story">Story Content (HTML)</Label>
                            <Textarea id="story" className="min-h-[300px] font-mono text-sm" placeholder="<p>Write your story...</p>" />
                            <p className="text-xs text-muted-foreground">
                                Tip: In the future, we can replace this with a Rich Text Editor (Tiptap/Quill).
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Risks Editor */}
                <Card>
                    <CardHeader>
                        <CardTitle>Risks & Challenges</CardTitle>
                        <CardDescription>Be transparent about potential hurdles.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <Label htmlFor="risks">Risks Content (HTML)</Label>
                            <Textarea id="risks" className="min-h-[200px] font-mono text-sm" />
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
