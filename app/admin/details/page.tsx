"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { updateCampaignDetails } from "../actions"
import { useCampaign, CampaignProvider } from "@/context/campaign-context" // Import CampaignProvider
import { KeyFeature, TechSpec, Campaign } from "@/types/campaign"
import { Plus, Trash2, Smartphone, Monitor } from "lucide-react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from "@dnd-kit/sortable"
import { SortableGalleryImage } from "@/components/admin/sortable-gallery-image"
import { compressImageFile } from "@/lib/image-utils"
import { CrowdfundingPage } from "@/components/crowdfunding-page" // Import the public page component

export default function CampaignDetailsEditor() {
    const { toast } = useToast()
    const { campaign, refreshCampaign } = useCampaign() // Load current data to populate defaults

    // Controlled inputs for all editable fields
    const [title, setTitle] = useState(campaign?.title || "")
    const [subtitle, setSubtitle] = useState(campaign?.subtitle || "")
    const [goalAmount, setGoalAmount] = useState(campaign?.stats.goalAmount || 0)
    // For date, assuming campaign has an endDate which might need parsing/formatting
    // Just using a placeholder state for now if it's not strictly typed in Campaign yet, or if it is.
    // Looking at Campaign interface, I don't see endDate in top level, maybe it's missing or I should just handle it if it exists.
    // The previous code had an input for it but no default value from campaign object. I'll add a state for it.
    const [endDate, setEndDate] = useState("")

    const [story, setStory] = useState(campaign?.story || "")
    const [risks, setRisks] = useState(campaign?.risks || "")
    const [shipping, setShipping] = useState(campaign?.shipping || "")
    const [technicalDetails, setTechnicalDetails] = useState(campaign?.technicalDetails || `
<div style="font-family: sans-serif; color: #111; margin-top: 40px;">
  <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Technical Details</h2>
  <div style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
    <div style="display: flex; background: #f9f9f9; padding: 15px; border-bottom: 1px solid #eee;">
      <div style="width: 40%; font-weight: bold;">Keyboard Versions</div>
      <div style="width: 60%;">DS5.5 (7/8ths size) or DS6.0 (15/16ths size)</div>
    </div>
    <div style="display: flex; padding: 15px; border-bottom: 1px solid #eee;">
      <div style="width: 40%; font-weight: bold;">Overall Dimensions<br><span style="font-size: 12px; font-weight: normal; color: #666;">(LxWxH)</span></div>
      <div style="width: 60%;">
        48.27" x 11.65" x 5.9"<br>
        <span style="font-size: 12px; color: #666;">(1226 mm x 296 mm x 150 mm)</span>
      </div>
    </div>
    <div style="display: flex; background: #f9f9f9; padding: 15px; border-bottom: 1px solid #eee;">
      <div style="width: 40%; font-weight: bold;">Active Key Width</div>
      <div style="width: 60%;">
        <strong>DS 6.0:</strong> 44.53" (1131 mm)<br>
        <strong>DS 5.5:</strong> 41.1" (1044 mm)
      </div>
    </div>
    <div style="display: flex; padding: 15px; border-bottom: 1px solid #eee;">
      <div style="width: 40%; font-weight: bold;">Action</div>
      <div style="width: 60%;">Graded Hammer Action (Weighted)</div>
    </div>
    <div style="display: flex; background: #f9f9f9; padding: 15px; border-bottom: 1px solid #eee;">
      <div style="width: 40%; font-weight: bold;">Polyphony</div>
      <div style="width: 60%;">256 Notes (Never cut off a sound)</div>
    </div>
    <div style="display: flex; padding: 15px;">
      <div style="width: 40%; font-weight: bold;">Connectivity</div>
      <div style="width: 60%;">USB-MIDI, Bluetooth Audio, 2x Headphone Jacks, Aux In/Out, Sustain Pedal</div>
    </div>
  </div>
</div>`)

    const [galleryImages, setGalleryImages] = useState<string[]>(campaign?.images?.gallery || [])
    const [keyFeatures, setKeyFeatures] = useState<KeyFeature[]>(campaign?.keyFeatures || [])

    // Preview mode state (desktop vs mobile) - purely visual scaling if we wanted, 
    // but for now we'll just show standard responsive view in a container.

    // Update state when campaign loads
    useEffect(() => {
        if (campaign) {
            setTitle(campaign.title)
            setSubtitle(campaign.subtitle)
            setGoalAmount(campaign.stats.goalAmount)
            setStory(campaign.story)
            setRisks(campaign.risks)
            setShipping(campaign.shipping)
            if (campaign.technicalDetails) {
                setTechnicalDetails(campaign.technicalDetails)
            }
            setGalleryImages(campaign.images.gallery)
            setKeyFeatures(campaign.keyFeatures)
        }
    }, [campaign])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (active.id !== over?.id) {
            setGalleryImages((items) => {
                const oldIndex = items.indexOf(active.id as string)
                const newIndex = items.indexOf(over?.id as string)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    async function handleSubmit(formData: FormData) {
        // Because we are using controlled inputs, we might need to ensure the FormData 
        // has the correct values if the inputs weren't updating the DOM attributes (they should be though).
        // Since we are passing name attributes and value attributes, FormData will pick up current values.

        try {
            await updateCampaignDetails(formData)
            await refreshCampaign()
            toast({
                title: "Success",
                description: "Campaign updated successfully",
                variant: "default",
                duration: 3000,
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

    // Construct the preview object
    const previewCampaign: Campaign = {
        ...campaign,
        title,
        subtitle,
        story,
        risks,
        shipping,
        technicalDetails,
        // Update stats goal amount visually
        stats: {
            ...campaign.stats,
            goalAmount
        },
        images: {
            ...campaign.images,
            gallery: galleryImages
        },
        keyFeatures,
    }

    return (
        <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-4rem)]">
            {/* Editor Column - Scrollable */}
            <div className="flex-1 overflow-y-auto pr-2 pb-20">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">Edit Campaign Details</h1>
                    </div>

                    <form action={handleSubmit} className="space-y-8">

                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Campaign Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="subtitle">Subtitle</Label>
                                    <Textarea
                                        id="subtitle"
                                        name="subtitle"
                                        value={subtitle}
                                        onChange={e => setSubtitle(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="goal">Goal Amount ($)</Label>
                                        <Input
                                            id="goal"
                                            name="goal"
                                            type="number"
                                            value={goalAmount}
                                            onChange={e => setGoalAmount(Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="endDate">End Date</Label>
                                        <Input
                                            id="endDate"
                                            name="endDate"
                                            type="date"
                                            value={endDate}
                                            onChange={e => setEndDate(e.target.value)}
                                        />
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
                                    value={story}
                                    onChange={e => setStory(e.target.value)}
                                />
                            </CardContent>
                        </Card>

                        {/* Gallery Images Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Gallery Images</CardTitle>
                                <CardDescription>
                                    Min 1920x1080 recommended. Drag to reorder.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* DnD Context for Reordering */}
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={galleryImages}
                                        strategy={rectSortingStrategy}
                                    >
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {galleryImages.map((src, index) => (
                                                <SortableGalleryImage
                                                    key={src}
                                                    id={src}
                                                    src={src}
                                                    index={index}
                                                    onRemove={() => {
                                                        const newImages = [...galleryImages]
                                                        newImages.splice(index, 1)
                                                        setGalleryImages(newImages)
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>

                                {/* File Input for New Images (with Compression) */}
                                <div className="grid gap-2">
                                    <Label htmlFor="new_gallery_images">Upload New Images</Label>
                                    <Input
                                        id="new_gallery_images"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={async (e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                const files = Array.from(e.target.files)
                                                const compressedFiles: File[] = []

                                                // Compress each file
                                                for (const file of files) {
                                                    try {
                                                        const compressed = await compressImageFile(file)
                                                        compressedFiles.push(compressed)
                                                        console.log(`Compressed ${file.name}: ${(file.size / 1024).toFixed(1)}kb -> ${(compressed.size / 1024).toFixed(1)}kb`)
                                                    } catch (err) {
                                                        console.error("Compression failed for", file.name, err)
                                                        compressedFiles.push(file) // Fallback to original
                                                    }
                                                }

                                                const dataTransfer = new DataTransfer()
                                                compressedFiles.forEach(f => dataTransfer.items.add(f))
                                                e.target.files = dataTransfer.files

                                                toast({
                                                    title: "Images Processed",
                                                    description: `Compressed ${compressedFiles.length} images. Ready to save.`,
                                                })
                                            }
                                        }}
                                        name="new_gallery_images"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Large images will be automatically compressed before upload.
                                    </p>
                                </div>

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



                        <Card>
                            <CardHeader>
                                <CardTitle>Technical Details (HTML)</CardTitle>
                                <CardDescription>Custom HTML block for detailed specs</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    id="technicalDetails"
                                    name="technicalDetails"
                                    className="min-h-[300px] font-mono text-sm"
                                    value={technicalDetails}
                                    onChange={e => setTechnicalDetails(e.target.value)}
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
                                    value={risks}
                                    onChange={e => setRisks(e.target.value)}
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
                                    value={shipping}
                                    onChange={e => setShipping(e.target.value)}
                                />
                            </CardContent>
                        </Card>

                        <input type="hidden" name="key_features_json" value={JSON.stringify(keyFeatures)} />

                        <Button type="submit" className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700">
                            Save All Changes
                        </Button>
                    </form>
                </div>
            </div>

            {/* Preview Column - Sticky/Fixed */}
            <div className="hidden xl:block w-[500px] border-l bg-background pl-4">
                <div className="flex items-center justify-between mb-4 mt-2">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Monitor className="h-4 w-4" /> Live Preview
                    </h2>
                    <div className="text-xs text-muted-foreground">
                        Updates as you type
                    </div>
                </div>

                {/* Preview Container - simulating a window or allowing scroll */}
                <div className="border rounded-xl overflow-hidden shadow-2xl h-[calc(100vh-8rem)] bg-white relative">
                    {/* Scale the content if needed, or just let it scroll. 
                         For a 'preview', we might want to scale it down to fit more, 
                         or just present it as a mobile/tablet view. 
                     */}
                    <div className="h-full w-full overflow-y-auto bg-white" style={{ isolation: 'isolate' }}>
                        <CampaignProvider initialData={previewCampaign}>
                            <div className="pointer-events-none select-none [&_a]:pointer-events-none [&_button]:pointer-events-none transform origin-top-left">
                                {/* We disable pointer events to prevent accidental navigation, 
                                     since it's just a visual preview. 
                                     If we want it interactive, we can remove the pointer-events-none class.
                                 */}
                                <CrowdfundingPage />
                            </div>
                        </CampaignProvider>
                    </div>
                </div>
            </div>
        </div >
    )
}
