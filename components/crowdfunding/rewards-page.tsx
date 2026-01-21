"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const rewards = [
  {
    id: "vip-founder",
    title: "VIP Founder Access",
    price: 1,
    description: "Early updates + lowest price guarantee",
    itemsIncluded: 1,
    backers: 127,
    estimatedDelivery: "Immediate",
    shipsTo: "Digital Reward",
    limited: false,
    soldOut: false,
  },
  {
    id: "supporter-pack",
    title: "Supporter Pack",
    price: 15,
    description: "Thank-you email + Backer Badge + name on Founders Wall",
    itemsIncluded: 3,
    backers: 89,
    estimatedDelivery: "Mar 2026",
    shipsTo: "Digital Reward",
    limited: false,
    soldOut: false,
  },
  {
    id: "super-early-bird",
    title: "Super Early Bird",
    price: 199,
    originalPrice: 399,
    description: "DS5.5 or DS6.0 at the deepest discount",
    itemsIncluded: 1,
    backers: 50,
    estimatedDelivery: "Feb 2026",
    shipsTo: "Anywhere in the world",
    limited: true,
    limitedCount: 50,
    soldOut: true,
    discount: "50% OFF",
  },
  {
    id: "early-bird",
    title: "Early Bird",
    price: 249,
    originalPrice: 349,
    description: "DS5.5 or DS6.0 at a special price",
    itemsIncluded: 1,
    backers: 34,
    estimatedDelivery: "Feb 2026",
    shipsTo: "Anywhere in the world",
    limited: true,
    limitedCount: 100,
    soldOut: false,
    discount: "29% OFF",
  },
  {
    id: "standard",
    title: "Standard Campaign Price",
    price: 299,
    description: "DS5.5 or DS6.0 with warranty",
    itemsIncluded: 1,
    backers: 45,
    estimatedDelivery: "Mar 2026",
    shipsTo: "Anywhere in the world",
    limited: false,
    soldOut: false,
  },
  {
    id: "bundle",
    title: "DreamPlay Bundle",
    price: 349,
    originalPrice: 499,
    description: "Keyboard + stand + sustain pedal + carrying case",
    itemsIncluded: 4,
    backers: 28,
    estimatedDelivery: "Mar 2026",
    shipsTo: "Anywhere in the world",
    limited: false,
    soldOut: false,
    discount: "30% OFF",
  },
  {
    id: "collectors",
    title: "Collector's Edition",
    price: 499,
    description: "Signed by me, limited to 30",
    itemsIncluded: 1,
    backers: 12,
    estimatedDelivery: "Mar 2026",
    shipsTo: "Anywhere in the world",
    limited: true,
    limitedCount: 30,
    soldOut: false,
  },
  {
    id: "masterclass",
    title: "Masterclass Experience",
    price: 799,
    originalPrice: 1199,
    description: "Keyboard + bundle + 90-min private masterclass with me",
    itemsIncluded: 5,
    backers: 5,
    estimatedDelivery: "Apr 2026",
    shipsTo: "Anywhere in the world",
    limited: true,
    limitedCount: 10,
    soldOut: false,
    discount: "33% OFF",
  },
]

const optionalAddons = [
  { id: "stand", title: "DreamPlay Stand", price: 79, description: "DreamPlay Stand*1" },
  { id: "pedal", title: "Sustain Pedal", price: 29, description: "Sustain Pedal*1" },
  { id: "case", title: "Carrying Case", price: 49, description: "Carrying Case*1" },
  { id: "bench", title: "Piano Bench", price: 89, description: "Piano Bench*1" },
]

export function RewardsPage() {
  const [selectedReward, setSelectedReward] = useState(rewards[3]) // Early Bird as default

  const availableRewards = rewards.filter((r) => !r.soldOut)
  const soldOutRewards = rewards.filter((r) => r.soldOut)

  return (
    <div className="space-y-8">
      {/* Main 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar - Available Rewards List */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Available rewards</h2>
            <div className="space-y-1">
              {availableRewards.map((reward) => (
                <button
                  key={reward.id}
                  onClick={() => setSelectedReward(reward)}
                  className={`w-full text-left p-3 rounded-md transition-colors ${
                    selectedReward.id === reward.id
                      ? "border-l-4 border-emerald-600 bg-muted/50"
                      : "hover:bg-muted/30"
                  }`}
                >
                  <p className="font-medium text-sm">{reward.title}</p>
                  <p className="text-sm text-muted-foreground">
                    ${reward.price} · {reward.itemsIncluded} item{reward.itemsIncluded > 1 ? "s" : ""} included
                  </p>
                </button>
              ))}
            </div>
          </div>

          {soldOutRewards.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-muted-foreground">All gone</h3>
              <div className="space-y-1">
                {soldOutRewards.map((reward) => (
                  <div key={reward.id} className="p-3 opacity-60">
                    <p className="font-medium text-sm">{reward.title}</p>
                    <p className="text-sm text-muted-foreground">
                      ${reward.price} · {reward.itemsIncluded} item included
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center - Featured Reward Card */}
        <div className="lg:col-span-5">
          <div className="border border-border rounded-lg overflow-hidden">
            {/* Discount Badge */}
            {selectedReward.discount && (
              <div className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 inline-block rounded-br-lg">
                {selectedReward.discount}
              </div>
            )}

            {/* Product Display */}
            <div className="p-6">
              <h3 className="text-2xl font-serif italic mb-4">{selectedReward.title}</h3>

              {/* Product Image Placeholder */}
              <div className="aspect-video bg-muted/30 rounded-lg border border-dashed border-border flex items-center justify-center mb-4">
                <p className="text-muted-foreground text-sm">Product Image Placeholder</p>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold">${selectedReward.price}</span>
                {selectedReward.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${selectedReward.originalPrice}
                  </span>
                )}
                {selectedReward.limited && (
                  <span className="ml-auto bg-rose-100 text-rose-700 text-xs px-2 py-1 rounded">
                    Limited: {selectedReward.limitedCount}
                  </span>
                )}
              </div>

              {/* Reward Info */}
              <div className="border-t border-border pt-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{selectedReward.title}</span>
                  <span className="font-semibold">${selectedReward.price}</span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedReward.description}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground">Backers</p>
                  <p className="font-medium">{selectedReward.backers}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ships to</p>
                  <p className="font-medium">{selectedReward.shipsTo}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-muted-foreground text-sm">Estimated delivery</p>
                <p className="font-medium">{selectedReward.estimatedDelivery}</p>
              </div>

              {/* Pledge Button */}
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg"
                disabled={selectedReward.soldOut}
              >
                {selectedReward.soldOut ? "Sold Out" : `Pledge $${selectedReward.price}`}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Included Items & Add-ons */}
        <div className="lg:col-span-4 space-y-6">
          {/* Selected Reward Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{selectedReward.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedReward.itemsIncluded} item{selectedReward.itemsIncluded > 1 ? "s" : ""} included
            </p>

            {/* Included Item Card */}
            <div className="border border-border rounded-lg p-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="font-medium">DreamPlay Keyboard</p>
                <p className="text-sm text-muted-foreground">Quantity: 1</p>
              </div>
              <div className="w-20 h-16 bg-muted/30 rounded border border-dashed border-border flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Image</span>
              </div>
            </div>
          </div>

          {/* Optional Add-ons */}
          <div>
            <h4 className="text-sm text-muted-foreground mb-4">Optional add-ons</h4>
            <div className="space-y-3">
              {optionalAddons.map((addon) => (
                <div
                  key={addon.id}
                  className="border border-border rounded-lg p-4 flex items-center gap-4 hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{addon.title}</p>
                    <p className="text-sm text-emerald-600">+${addon.price}</p>
                    <p className="text-sm text-muted-foreground">{addon.description}</p>
                  </div>
                  <div className="w-20 h-16 bg-muted/30 rounded border border-dashed border-border flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Image</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Chart Section */}
      <div className="border-t border-border pt-8">
        <h2 className="text-2xl font-bold mb-6">Rewards Pricing Chart</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Tier</th>
                <th className="text-left py-3 px-4 font-semibold">Price</th>
                <th className="text-left py-3 px-4 font-semibold">What You Get</th>
                <th className="text-left py-3 px-4 font-semibold">Availability</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((reward) => (
                <tr key={reward.id} className="border-b border-border hover:bg-muted/30">
                  <td className="py-3 px-4 font-medium">{reward.title}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold">${reward.price}</span>
                    {reward.originalPrice && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        ${reward.originalPrice}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{reward.description}</td>
                  <td className="py-3 px-4">
                    {reward.soldOut ? (
                      <span className="text-rose-600 font-medium">Sold Out</span>
                    ) : reward.limited ? (
                      <span className="text-amber-600">Limited ({reward.limitedCount})</span>
                    ) : (
                      <span className="text-emerald-600">Available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Stretch Goals Section */}
      <div className="border-t border-border pt-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Unlock More Together</h2>
          <p className="text-lg text-muted-foreground">
            Our goal is <span className="font-semibold text-foreground">$35,000</span> to fund the first production run. 
            The more support we get, the more exclusive features we unlock for everyone!
          </p>
        </div>

        {/* Visual Progress Bar */}
        <div className="relative bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full h-16 p-2 shadow-inner">
          <div className="absolute inset-0 flex items-center justify-between px-8 text-xs font-bold z-10">
            <span className="text-white drop-shadow-md">$35K</span>
            <span className="text-slate-700 dark:text-slate-300">$50K</span>
            <span className="text-slate-700 dark:text-slate-300">$100K</span>
          </div>
          <div className="relative h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-1/3 shadow-lg flex items-center justify-end pr-3">
            <div className="absolute -right-1 w-6 h-6 bg-white rounded-full shadow-md border-4 border-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Stretch Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Base Goal */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-3">
                FUNDED
              </div>
              <h3 className="text-4xl font-bold mb-2">$35K</h3>
              <p className="text-xl font-semibold mb-3">Production Unlocked</p>
              <p className="text-emerald-50 text-sm leading-relaxed">
                First production run of DreamPlay keyboards. Make the narrower keys a reality!
              </p>
            </div>
          </div>

          {/* Stretch Goal 1 */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-xl border-2 border-slate-700 hover:border-slate-500 transition-all hover:scale-105">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 bg-slate-700 rounded-full text-xs font-semibold mb-3">
                STRETCH GOAL
              </div>
              <h3 className="text-4xl font-bold mb-2">$50K</h3>
              <p className="text-xl font-semibold mb-3">White Edition</p>
              <p className="text-slate-300 text-sm leading-relaxed">
                Limited-edition matte black finish. Sleek, professional, and exclusive to backers.
              </p>
            </div>
          </div>

          {/* Stretch Goal 2 */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-700 dark:to-slate-800 p-6 shadow-xl border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 transition-all hover:scale-105">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-300/20 dark:bg-white/5 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-300/20 dark:bg-white/5 rounded-full -ml-12 -mb-12" />
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 bg-slate-300 dark:bg-slate-600 rounded-full text-xs font-semibold mb-3 text-slate-800 dark:text-white">
                ULTIMATE GOAL
              </div>
              <h3 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">$100K</h3>
              <p className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Premium Bundle</p>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                White Edition + Premium accessories package with advanced pedals, cables, and limited swag.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-8 border border-emerald-200 dark:border-emerald-900">
          <p className="text-lg font-semibold mb-2">Every pledge brings us closer!</p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Back at any level to help unlock premium finishes and accessories for the entire community. 
            Together we can make DreamPlay even better.
          </p>
        </div>
      </div>
    </div>
  )
}
