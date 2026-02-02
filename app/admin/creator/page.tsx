"use client"

import { useState, useEffect } from "react"
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
import { Loader2, Upload, Copy, Check } from "lucide-react"
import { uploadCreatorAsset } from "../actions"

const DEFAULT_CONTENT = `
<div class="space-y-12">
  <!-- Header -->
  <div class="border-b border-border pb-6">
    <h2 class="text-3xl font-bold mb-2">Meet the Creator</h2>
    <p class="text-muted-foreground text-lg">
      Concert pianist and founder of DreamPlay
    </p>
  </div>

  <!-- My Story Section -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
    <div class="space-y-4">
      <h3 class="text-2xl font-bold">My Story</h3>
      <div class="prose prose-lg max-w-none text-muted-foreground space-y-4">
        <p>
          I've been a concert pianist for years, performing at Carnegie Hall, Lincoln Center, 
          and venues around the world. But there's something most people never saw: I was 
          constantly fighting against the piano.
        </p>
        <p>
          My hands span just under 8.5 inches. That meant many traditional pieces were difficult, 
          sometimes impossible, for me to play comfortably. No matter how much I practiced, 
          I felt like the instrument wasn't built for me.
        </p>
        <p class="font-semibold text-foreground">
          So I asked myself: "What if the piano could be designed to fit the pianist, 
          instead of the other way around?"
        </p>
        <p class="text-lg font-semibold text-foreground">
          That's where DreamPlay was born.
        </p>
      </div>
    </div>
    <div class="space-y-4">
      <!-- Carnegie Hall Image Placeholder -->
      <div class="aspect-video bg-muted/50 rounded-lg border border-dashed border-border flex items-center justify-center">
        <div class="text-center p-6">
          <p class="text-muted-foreground font-medium">Carnegie Hall Performance Photo</p>
          <p class="text-sm text-muted-foreground mt-2">Upload image in Design Mode</p>
        </div>
      </div>
      <!-- Personal Photo Placeholder -->
      <div class="aspect-video bg-muted/50 rounded-lg border border-dashed border-border flex items-center justify-center">
        <div class="text-center p-6">
          <p class="text-muted-foreground font-medium">Personal Photo - Working on Instrument</p>
          <p class="text-sm text-muted-foreground mt-2">Upload image in Design Mode</p>
        </div>
      </div>
    </div>
  </div>

  <!-- The Problem Section -->
  <div class="bg-muted/30 rounded-xl p-8 border border-border">
    <h3 class="text-2xl font-bold mb-6">The Problem I Wanted to Solve</h3>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div class="space-y-4">
        <p class="text-lg text-muted-foreground leading-relaxed">
          Most pianos are designed for large hand spans, at least 8.5 inches. But <span class="font-bold text-foreground">87% of women</span> and <span class="font-bold text-foreground">24% of men</span> fall short of that.
        </p>
        <p class="text-lg text-muted-foreground leading-relaxed">
          That means strain, tension, and frustration. I know because I lived it.
        </p>
      </div>
      <div class="aspect-square bg-muted/50 rounded-lg border border-dashed border-border flex items-center justify-center">
        <div class="text-center p-6">
          <p class="text-muted-foreground font-medium">Infographic</p>
          <p class="text-sm text-muted-foreground mt-2">Handspan stats & zones visualization</p>
          <p class="text-xs text-muted-foreground mt-1">Upload image in Design Mode</p>
        </div>
      </div>
    </div>
  </div>

  <!-- The Solution Section -->
  <div class="space-y-8">
    <div class="text-center max-w-3xl mx-auto">
      <h3 class="text-3xl font-bold mb-4">The Solution: DreamPlay</h3>
      <p class="text-xl text-muted-foreground">
        DreamPlay is the instrument I always wished I had: a professional keyboard designed to fit your hands.
      </p>
    </div>

    <!-- Product Images -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="aspect-video bg-muted/50 rounded-lg border border-dashed border-border flex items-center justify-center">
        <div class="text-center p-6">
          <p class="text-muted-foreground font-medium">Keyboard Product Shot 1</p>
          <p class="text-sm text-muted-foreground mt-2">Upload image in Design Mode</p>
        </div>
      </div>
      <div class="aspect-video bg-muted/50 rounded-lg border border-dashed border-border flex items-center justify-center">
        <div class="text-center p-6">
          <p class="text-muted-foreground font-medium">DS5.5 vs DS6.0 Comparison</p>
          <p class="text-sm text-muted-foreground mt-2">Side-by-side comparison photo</p>
        </div>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <!-- Two Sizes Available -->
      <div class="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-teal-200 dark:border-teal-800">
        <h4 class="text-xl font-bold mb-4 text-teal-900 dark:text-teal-100">Two Sizes Available</h4>
        <div class="space-y-3">
          <div class="bg-white/50 dark:bg-slate-800/50 rounded-md p-4 border border-teal-200 dark:border-teal-700">
            <p class="font-semibold text-foreground">DS5.5</p>
            <p class="text-sm text-muted-foreground">For smaller hand spans (&lt; 7.6")</p>
          </div>
          <div class="bg-white/50 dark:bg-slate-800/50 rounded-md p-4 border border-teal-200 dark:border-teal-700">
            <p class="font-semibold text-foreground">DS6.0</p>
            <p class="text-sm text-muted-foreground">For hand spans between 7.6–8.5"</p>
          </div>
        </div>
      </div>

      <!-- Authentic Grand Piano Feel -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h4 class="text-xl font-bold mb-3 text-blue-900 dark:text-blue-100">Authentic Grand Piano Feel</h4>
        <p class="text-muted-foreground">
          Weighted keys with expressive touch for a truly professional playing experience.
        </p>
      </div>

      <!-- LED Learning System -->
      <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
        <h4 class="text-xl font-bold mb-3 text-amber-900 dark:text-amber-100">LED Learning System</h4>
        <p class="text-muted-foreground">
          My proprietary system for faster learning and improved practice sessions.
        </p>
      </div>

      <!-- Portable, Modern Design -->
      <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
        <h4 class="text-xl font-bold mb-3 text-purple-900 dark:text-purple-100">Portable, Modern Design</h4>
        <p class="text-muted-foreground">
          Perfect for home, studio, or stage. Take your music anywhere.
        </p>
      </div>
    </div>

    <!-- Professional Sound Quality -->
    <div class="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 rounded-xl p-8 text-white text-center">
      <h4 class="text-2xl font-bold mb-3">Professional Sound Quality</h4>
      <p class="text-slate-200 text-lg max-w-2xl mx-auto">
        Inspiring tone for every pianist. Experience studio-quality sound that brings your music to life.
      </p>
    </div>
  </div>

  <!-- Who DreamPlay Is For Section -->
  <div class="bg-muted/30 rounded-xl p-8 border border-border">
    <h3 class="text-2xl font-bold mb-6 text-center">Who DreamPlay Is For</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <div class="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
        <div class="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0 mt-1">
          <span class="text-teal-700 dark:text-teal-300 font-bold">1</span>
        </div>
        <p class="text-muted-foreground">
          <span class="font-semibold text-foreground">Pianists with smaller hand spans</span>, like me, who want comfort and freedom.
        </p>
      </div>
      <div class="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
        <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-1">
          <span class="text-blue-700 dark:text-blue-300 font-bold">2</span>
        </div>
        <p class="text-muted-foreground">
          <span class="font-semibold text-foreground">Students</span> starting their piano journey with the right foundation.
        </p>
      </div>
      <div class="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
        <div class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 mt-1">
          <span class="text-purple-700 dark:text-purple-300 font-bold">3</span>
        </div>
        <p class="text-muted-foreground">
          <span class="font-semibold text-foreground">Professionals</span> who want speed, comfort, and expressive control.
        </p>
      </div>
      <div class="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
        <div class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0 mt-1">
          <span class="text-amber-700 dark:text-amber-300 font-bold">4</span>
        </div>
        <p class="text-muted-foreground">
          <span class="font-semibold text-foreground">Anyone</span> who wants to unlock their full musical potential.
        </p>
      </div>
    </div>
  </div>
</div>
`

export default function CreatorProfilePage() {
    const { toast } = useToast()
    const { campaign, refreshCampaign } = useCampaign() // using refreshCampaign

    // Update state when campaign loads
    useEffect(() => {
        if (campaign) {
            setPageContent(campaign.creator.pageContent || DEFAULT_CONTENT)
        }
    }, [campaign])


    // UI States
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [pageContent, setPageContent] = useState("")

    // Asset Uploader State
    const [isUploading, setIsUploading] = useState(false)
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

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

    const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setUploadedUrl(null)
        try {
            const formData = new FormData()
            formData.append("file", file)
            const result = await uploadCreatorAsset(formData)

            if (result.success && result.url) {
                setUploadedUrl(result.url)
                toast({ title: "Image Uploaded", description: "Copy the URL below to use in your HTML." })
            } else {
                toast({ title: "Error", description: result.error || "Upload failed", variant: "destructive" })
            }
        } catch (err) {
            console.error(err)
            toast({ title: "Error", description: "Upload exception", variant: "destructive" })
        } finally {
            setIsUploading(false)
        }
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

                {/* Content Editor */}
                <Card>
                    <CardHeader>
                        <CardTitle>Creator Page Content (HTML)</CardTitle>
                        <CardDescription>
                            Customize the full "Meet the Creator" page. Use the Image Uploader below to get image URLs.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Image Asset Helper */}
                        <div className="bg-muted p-4 rounded-lg space-y-3">
                            <div className="flex items-center gap-2">
                                <Label className="text-sm font-semibold">Asset Uploader</Label>
                                <span className="text-xs text-muted-foreground">(Upload images here to use in the HTML)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAssetUpload}
                                    disabled={isUploading}
                                    className="max-w-xs bg-background"
                                />
                                {isUploading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                            </div>

                            {uploadedUrl && (
                                <div className="flex items-center gap-2 bg-background p-2 rounded border border-emerald-200">
                                    <Check className="h-4 w-4 text-emerald-600" />
                                    <code className="text-xs flex-1 truncate">{uploadedUrl}</code>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            navigator.clipboard.writeText(uploadedUrl)
                                            toast({ title: "Copied!" })
                                        }}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <Textarea
                            id="pageContent"
                            name="pageContent"
                            className="min-h-[600px] font-mono text-xs"
                            value={pageContent}
                            onChange={(e) => setPageContent(e.target.value)}
                        />
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
