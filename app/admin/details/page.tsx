"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog" // Import Dialog parts
import { updateCampaignDetails, uploadCreatorAsset } from "../actions"
import { useCampaign, CampaignProvider } from "@/context/campaign-context" // Import CampaignProvider
import { KeyFeature, TechSpec, Campaign, MediaItem } from "@/types/campaign"
import { Plus, Trash2, Smartphone, Monitor, Video, Image as ImageIcon, PlayCircle } from "lucide-react"
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
    useSortable
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { SortableGalleryImage } from "@/components/admin/sortable-gallery-image"
import { compressImageFile } from "@/lib/image-utils"
import { CrowdfundingPage } from "@/components/crowdfunding-page" // Import the public page component

// --- NEW COMPONENT: Sortable Media Item ---
function SortableMediaItem({ item, onRemove }: { item: MediaItem, onRemove: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} className="relative group aspect-video bg-muted rounded-md overflow-hidden border touch-none">
            {/* Thumbnail Display */}
            <img
                src={item.type === 'video' ? (item.thumbnail || item.src) : item.src}
                alt="Media"
                className="w-full h-full object-cover"
            />

            {/* Video Indicator Overlay */}
            {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <PlayCircle className="w-8 h-8 text-white opacity-80" />
                </div>
            )}

            {/* Drag Handle Overlay */}
            <div {...attributes} {...listeners} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

            {/* Delete Button */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation() // Prevent drag
                    onRemove()
                }}
                className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90 z-10"
            >
                <Trash2 className="h-4 w-4" />
            </button>

            {/* Type Badge */}
            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-bold pointer-events-none">
                {item.type}
            </div>
        </div>
    )
}

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

    const [heroImage, setHeroImage] = useState(campaign?.images?.hero || "")
    const [galleryImages, setGalleryImages] = useState<string[]>(campaign?.images?.gallery || [])

    // NEW: Media Gallery State
    const [mediaGallery, setMediaGallery] = useState<MediaItem[]>([])

    // NEW: Video Dialog State
    const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false)
    const [newVideoUrl, setNewVideoUrl] = useState("")
    const [newVideoThumb, setNewVideoThumb] = useState<File | null>(null)
    const [isUploadingVideo, setIsUploadingVideo] = useState(false)
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
            if (campaign.images?.hero) {
                setHeroImage(campaign.images.hero)
            }
            setGalleryImages(campaign.images.gallery)
            setKeyFeatures(campaign.keyFeatures)

            // LOAD GALLERY: 
            if (campaign.mediaGallery && campaign.mediaGallery.length > 0) {
                setMediaGallery(campaign.mediaGallery)
            } else if (campaign.images.gallery.length > 0) {
                // Convert legacy string array to new object structure
                setMediaGallery(campaign.images.gallery.map(url => ({
                    id: url,
                    type: 'image',
                    src: url
                })))
            }
        }
    }, [campaign])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleMediaDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active.id !== over?.id) {
            setMediaGallery((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id)
                const newIndex = items.findIndex(i => i.id === over?.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    // Handle Standard Image Uploads (Multi-select)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return

        const files = Array.from(e.target.files)
        const newItems: MediaItem[] = []

        toast({ title: "Uploading images...", description: "Please wait." })

        for (const file of files) {
            const formData = new FormData()
            formData.append("file", await compressImageFile(file))

            // Reuse the creator asset upload action (it just returns a URL)
            const result = await uploadCreatorAsset(formData)

            if (result.success && result.url) {
                newItems.push({
                    id: result.url as string, // Use URL as ID
                    type: 'image',
                    src: result.url as string
                })
            }
        }

        setMediaGallery(prev => [...prev, ...newItems])
        toast({ title: "Images added", description: "Don't forget to save changes." })
    }

    // Handle New Video Addition
    const handleAddVideo = async () => {
        if (!newVideoUrl) return

        setIsUploadingVideo(true)
        let thumbUrl = ""

        // Upload thumbnail if present
        if (newVideoThumb) {
            const formData = new FormData()
            formData.append("file", await compressImageFile(newVideoThumb))
            const result = await uploadCreatorAsset(formData)
            if (result.success && result.url) thumbUrl = result.url as string
        }

        // Add to gallery
        const newItem: MediaItem = {
            id: `video-${Date.now()}`, // Temporary ID
            type: 'video',
            src: newVideoUrl,
            thumbnail: thumbUrl || "/images/video-placeholder.jpg" // Fallback
        }

        setMediaGallery(prev => [...prev, newItem])

        // Reset & Close
        setIsVideoDialogOpen(false)
        setNewVideoUrl("")
        setNewVideoThumb(null)
        setIsUploadingVideo(false)
    }

    async function handleSubmit(formData: FormData) {
        // Convert our rich MediaGallery state to JSON string for the DB
        formData.set("media_gallery_json", JSON.stringify(mediaGallery))
        // Maintain legacy galleryImages for backward compatibility if needed, using the 'image' type items
        const legacyImages = mediaGallery.filter(i => i.type === 'image').map(i => i.src)
        formData.set("existing_gallery_images", JSON.stringify(legacyImages))

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
            hero: heroImage,
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
                        {/* Media Gallery Management */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Media Gallery</CardTitle>
                                    <CardDescription>Images & Videos for the main carousel. First item can be Hero.</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    {/* Add Video Button */}
                                    <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <Video className="h-4 w-4" /> Add Video
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add Video to Carousel</DialogTitle>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label>Video URL (Cloudflare R2 or Direct MP4)</Label>
                                                    <Input
                                                        placeholder="https://pub-xyz.r2.dev/video.mp4"
                                                        value={newVideoUrl}
                                                        onChange={e => setNewVideoUrl(e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Thumbnail Image (Required for Carousel)</Label>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={e => setNewVideoThumb(e.target.files?.[0] || null)}
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleAddVideo} disabled={isUploadingVideo}>
                                                    {isUploadingVideo ? "Uploading..." : "Add to Gallery"}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Add Images Button (Hidden Input Trick) */}
                                    <div className="relative">
                                        <Button variant="outline" size="sm" className="gap-2 pointer-events-none">
                                            <ImageIcon className="h-4 w-4" /> Add Images
                                        </Button>
                                        <Input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleMediaDragEnd}
                                >
                                    <SortableContext
                                        items={mediaGallery.map(i => i.id)}
                                        strategy={rectSortingStrategy}
                                    >
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {mediaGallery.map((item) => (
                                                <SortableMediaItem
                                                    key={item.id}
                                                    item={item}
                                                    onRemove={() => setMediaGallery(prev => prev.filter(i => i.id !== item.id))}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>

                                {mediaGallery.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg mt-4">
                                        No media added. Upload images or add videos.
                                    </div>
                                )}
                            </CardContent>
                        </Card>



                        {/* Hero Image Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Hero Image</CardTitle>
                                <CardDescription>
                                    Displayed at the top of the Story tab. Min 1920px width recommended.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {heroImage && (
                                    <div className="relative aspect-video w-full rounded-md overflow-hidden border border-border">
                                        <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-8 w-8"
                                            onClick={() => setHeroImage("")}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="hero_image_file">Upload Hero Image</Label>
                                    <Input
                                        id="hero_image_file"
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                const file = e.target.files[0]
                                                try {
                                                    const compressed = await compressImageFile(file)

                                                    // Create a local preview URL
                                                    const previewUrl = URL.createObjectURL(compressed)
                                                    setHeroImage(previewUrl)

                                                    // Use DataTransfer to update the file input with compressed file
                                                    const dataTransfer = new DataTransfer()
                                                    dataTransfer.items.add(compressed)
                                                    e.target.files = dataTransfer.files

                                                    toast({
                                                        title: "Image Processed",
                                                        description: "Hero image ready to upload.",
                                                    })
                                                } catch (err) {
                                                    console.error("Compression failed", err)
                                                }
                                            }
                                        }}
                                        name="hero_image_file"
                                    />
                                </div>
                                <input type="hidden" name="hero_image_url" value={heroImage} />
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
            </div >

            {/* Preview Column - Sticky/Fixed */}
            < div className="hidden xl:block w-[500px] border-l bg-background pl-4" >
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
            </div >
        </div >
    )
}
