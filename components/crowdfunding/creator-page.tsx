"use client"

import { useCampaign } from "@/context/campaign-context"

export function CreatorPage() {
  const { campaign } = useCampaign()

  if (!campaign) return <div>Loading...</div>

  // If there's content in the DB, use it. Otherwise, we might want to default to nothing or a placeholder.
  // But since we pre-fill the admin editor with the default content, 
  // and the DB migration adds an empty string by default, 
  // the first time the user visits admin and saves, it will populate.
  // However, for immediate view without saving, we might fallback if string is empty?
  // Actually, the admin page effect will set the state to DEFAULT_CONTENT if empty.
  // But the public page reads from `campaign`. `campaign.creator.pageContent` will be empty initially.
  // So we should fallback to the default here too if empty, OR the user must go to admin and save once.
  // To avoid a broken page, I will paste the DEFAULT_CONTENT here as fallback too. 
  // (Wait, duplication is bad, but it safeguards the initial state).

  const content = campaign.creator.pageContent || `
<div class="space-y-12">
  <!-- Header -->
  <div class="border-b border-border pb-6">
    <h2 class="text-3xl font-bold mb-2">Meet the Creator</h2>
    <p class="text-muted-foreground text-lg">
      Concert pianist and founder of DreamPlay
    </p>
  </div>
  <!-- ... (Truncated fallback for brevity in source, but I should probably put full default here or just let it be blank until saved) -->
  <!-- Actually, the user wants "keep all the text". If I make it blank, the page breaks. -->
  <!-- So I will include the full default content here. -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
    <!-- ... Content ... -->
    <!-- I will put the full content in the write_to_file call below -->
  </div>
</div>
`

  // Actually, to keep the file clean, I'll just use the full content in the dangerouslySetInnerHTML

  return (
    <div
      className="prose dark:prose-invert max-w-none text-muted-foreground [&_img]:rounded-xl [&_img]:shadow-sm"
      dangerouslySetInnerHTML={{ __html: campaign.creator.pageContent || FALLBACK_HTML }}
    />
  )
}

const FALLBACK_HTML = `
<div class="space-y-12">
  <div class="border-b border-border pb-6">
    <h2 class="text-3xl font-bold mb-2 text-foreground">Meet the Creator</h2>
    <p class="text-muted-foreground text-lg">Concert pianist and founder of DreamPlay</p>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
    <div class="space-y-4">
      <h3 class="text-2xl font-bold text-foreground">My Story</h3>
      <div class="space-y-4">
        <p>I've been a concert pianist for years, performing at Carnegie Hall, Lincoln Center, and venues around the world. But there's something most people never saw: I was constantly fighting against the piano.</p>
        <p>My hands span just under 8.5 inches. That meant many traditional pieces were difficult, sometimes impossible, for me to play comfortably. No matter how much I practiced, I felt like the instrument wasn't built for me.</p>
        <p class="font-semibold text-foreground">So I asked myself: "What if the piano could be designed to fit the pianist, instead of the other way around?"</p>
        <p class="text-lg font-semibold text-foreground">That's where DreamPlay was born.</p>
      </div>
    </div>
    <div class="space-y-4">
      <div class="aspect-video bg-muted/50 rounded-lg border border-dashed border-border flex items-center justify-center">
        <div class="text-center p-6">
          <p class="text-muted-foreground font-medium">Carnegie Hall Performance Photo</p>
          <p class="text-sm text-muted-foreground mt-2">Upload image in Design Mode</p>
        </div>
      </div>
      <div class="aspect-video bg-muted/50 rounded-lg border border-dashed border-border flex items-center justify-center">
        <div class="text-center p-6">
          <p class="text-muted-foreground font-medium">Personal Photo - Working on Instrument</p>
          <p class="text-sm text-muted-foreground mt-2">Upload image in Design Mode</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-muted/30 rounded-xl p-8 border border-border">
    <h3 class="text-2xl font-bold mb-6 text-foreground">The Problem I Wanted to Solve</h3>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div class="space-y-4">
        <p class="text-lg text-muted-foreground leading-relaxed">Most pianos are designed for large hand spans, at least 8.5 inches. But <span class="font-bold text-foreground">87% of women</span> and <span class="font-bold text-foreground">24% of men</span> fall short of that.</p>
        <p class="text-lg text-muted-foreground leading-relaxed">That means strain, tension, and frustration. I know because I lived it.</p>
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
  <div class="space-y-8">
    <div class="text-center max-w-3xl mx-auto">
      <h3 class="text-3xl font-bold mb-4 text-foreground">The Solution: DreamPlay</h3>
      <p class="text-xl text-muted-foreground">DreamPlay is the instrument I always wished I had: a professional keyboard designed to fit your hands.</p>
    </div>
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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
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
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h4 class="text-xl font-bold mb-3 text-blue-900 dark:text-blue-100">Authentic Grand Piano Feel</h4>
        <p class="text-muted-foreground">Weighted keys with expressive touch for a truly professional playing experience.</p>
      </div>
      <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
        <h4 class="text-xl font-bold mb-3 text-amber-900 dark:text-amber-100">LED Learning System</h4>
        <p class="text-muted-foreground">My proprietary system for faster learning and improved practice sessions.</p>
      </div>
      <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
        <h4 class="text-xl font-bold mb-3 text-purple-900 dark:text-purple-100">Portable, Modern Design</h4>
        <p class="text-muted-foreground">Perfect for home, studio, or stage. Take your music anywhere.</p>
      </div>
    </div>
    <div class="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 rounded-xl p-8 text-white text-center">
      <h4 class="text-2xl font-bold mb-3">Professional Sound Quality</h4>
      <p class="text-slate-200 text-lg max-w-2xl mx-auto">Inspiring tone for every pianist. Experience studio-quality sound that brings your music to life.</p>
    </div>
  </div>
  <div class="bg-muted/30 rounded-xl p-8 border border-border">
    <h3 class="text-2xl font-bold mb-6 text-center text-foreground">Who DreamPlay Is For</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <div class="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
        <div class="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0 mt-1">
          <span class="text-teal-700 dark:text-teal-300 font-bold">1</span>
        </div>
        <p class="text-muted-foreground"><span class="font-semibold text-foreground">Pianists with smaller hand spans</span>, like me, who want comfort and freedom.</p>
      </div>
      <div class="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
        <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-1">
          <span class="text-blue-700 dark:text-blue-300 font-bold">2</span>
        </div>
        <p class="text-muted-foreground"><span class="font-semibold text-foreground">Students</span> starting their piano journey with the right foundation.</p>
      </div>
      <div class="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
        <div class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 mt-1">
          <span class="text-purple-700 dark:text-purple-300 font-bold">3</span>
        </div>
        <p class="text-muted-foreground"><span class="font-semibold text-foreground">Professionals</span> who want speed, comfort, and expressive control.</p>
      </div>
      <div class="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
        <div class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0 mt-1">
          <span class="text-amber-700 dark:text-amber-300 font-bold">4</span>
        </div>
        <p class="text-muted-foreground"><span class="font-semibold text-foreground">Anyone</span> who wants to unlock their full musical potential.</p>
      </div>
    </div>
  </div>
</div>
`
