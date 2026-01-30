"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { updateCampaignDetails } from "../actions" // <--- Import the action
import { useCampaign } from "@/context/campaign-context"
import { KeyFeature, TechSpec } from "@/types/campaign"
import { Plus, Trash2 } from "lucide-react"

export default function CampaignDetailsEditor() {
    const { toast } = useToast()
    const { campaign, refreshCampaign } = useCampaign() // Load current data to populate defaults
    const [galleryImages, setGalleryImages] = useState<string[]>(campaign?.images?.gallery || [])
    const [keyFeatures, setKeyFeatures] = useState<KeyFeature[]>(campaign?.keyFeatures || [])
    const [techSpecs, setTechSpecs] = useState<TechSpec[]>(campaign?.techSpecs || [])

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

                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Info (HTML)</CardTitle>
                        <CardDescription>
                            Shipping details, delivery estimates, and regional information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            id="shipping"
                            name="shipping"
                            className="min-h-[200px]"
                            defaultValue={campaign.shipping}
                        />
                    </CardContent>
                </Card>

                {/* Gallery Images Management */}
                <Card>
                    <CardHeader>
                        <CardTitle>Gallery Images</CardTitle>
                        <CardDescription>
                            Min 1920x1080 recommended. Drag to reorder is not supported yet (files upload in selection order).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Existing Images Grid */}
                        {galleryImages.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {galleryImages.map((src, index) => (
                                    <div key={index} className="group relative aspect-video bg-muted rounded-md overflow-hidden border">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={src} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newImages = [...galleryImages]
                                                newImages.splice(index, 1)
                                                setGalleryImages(newImages)
                                            }}
                                            className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label="Remove image"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* File Input for New Images */}
                        <div className="grid gap-2">
                            <Label htmlFor="new_gallery_images">Upload New Images</Label>
                            <Input
                                id="new_gallery_images"
                                name="new_gallery_images"
                                type="file"
                                multiple
                                accept="image/*"
                            />
                        </div>

                        {/* Hidden Input to pass the specific list of KEPT existing images */}
                        <input
                            type="hidden"
                            name="existing_gallery_images"
                            value={JSON.stringify(galleryImages)}
                        />
                    </CardContent>
                </Card>

                {/* Key Features Editor */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Key Features</CardTitle>
                            <CardDescription>Add the main selling points (Icon + Title + Desc)</CardDescription>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setKeyFeatures([...keyFeatures, { icon: "✨", title: "", desc: "" }])}
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add Feature
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {keyFeatures.map((feature, idx) => (
                            <div key={idx} className="flex gap-4 items-start border p-4 rounded-md bg-muted/20">
                                <div className="w-16">
                                    <Label className="text-xs">Icon</Label>
                                    <Input
                                        value={feature.icon}
                                        onChange={(e) => {
                                            const newFeatures = [...keyFeatures]
                                            newFeatures[idx].icon = e.target.value
                                            setKeyFeatures(newFeatures)
                                        }}
                                        className="text-center text-xl"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div>
                                        <Label className="text-xs">Title</Label>
                                        <Input
                                            value={feature.title}
                                            onChange={(e) => {
                                                const newFeatures = [...keyFeatures]
                                                newFeatures[idx].title = e.target.value
                                                setKeyFeatures(newFeatures)
                                            }}
                                            placeholder="Feature Title"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Description</Label>
                                        <Input
                                            value={feature.desc}
                                            onChange={(e) => {
                                                const newFeatures = [...keyFeatures]
                                                newFeatures[idx].desc = e.target.value
                                                setKeyFeatures(newFeatures)
                                            }}
                                            placeholder="Short description"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => {
                                        const newFeatures = [...keyFeatures]
                                        newFeatures.splice(idx, 1)
                                        setKeyFeatures(newFeatures)
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {keyFeatures.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No features added yet.</p>}
                    </CardContent>
                </Card>

                {/* Tech Specs Editor */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Technical Specs</CardTitle>
                            <CardDescription>Add specification details (Label + Value)</CardDescription>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setTechSpecs([...techSpecs, { label: "", value: "" }])}
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add Spec
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {techSpecs.map((spec, idx) => (
                            <div key={idx} className="flex gap-4 items-end border p-4 rounded-md bg-muted/20">
                                <div className="flex-1">
                                    <Label className="text-xs">Label</Label>
                                    <Input
                                        value={spec.label}
                                        onChange={(e) => {
                                            const newSpecs = [...techSpecs]
                                            newSpecs[idx].label = e.target.value
                                            setTechSpecs(newSpecs)
                                        }}
                                        placeholder="e.g. Weight"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Label className="text-xs">Value</Label>
                                    <Input
                                        value={spec.value}
                                        onChange={(e) => {
                                            const newSpecs = [...techSpecs]
                                            newSpecs[idx].value = e.target.value
                                            setTechSpecs(newSpecs)
                                        }}
                                        placeholder="e.g. 12kg"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => {
                                        const newSpecs = [...techSpecs]
                                        newSpecs.splice(idx, 1)
                                        setTechSpecs(newSpecs)
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {techSpecs.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No specs added yet.</p>}
                    </CardContent>
                </Card>

                <input type="hidden" name="key_features_json" value={JSON.stringify(keyFeatures)} />
                <input type="hidden" name="tech_specs_json" value={JSON.stringify(techSpecs)} />

                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto">
                    Save All Changes
                </Button>
            </form>
        </div>
    )
}
