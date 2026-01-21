"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CampaignPage() {
  const [pledgeAmount, setPledgeAmount] = useState("")
  const [activeSection, setActiveSection] = useState("meet-partystudio")

  const sections = [
    { id: "meet-partystudio", label: "Meet PartyStudio" },
    { id: "first-hand", label: "First Hand Experiences" },
    { id: "features", label: "Features" },
    { id: "meet-partykeys", label: "Meet PartyKeys" },
    { id: "technical", label: "Technical Specifications" },
    { id: "rewards", label: "Rewards" },
    { id: "production", label: "Production" },
    { id: "popumusic-team", label: "Popumusic Team" },
    { id: "shipping-fee", label: "Shipping Fee Specification" },
    { id: "risks", label: "Risks" },
  ]

  return (
    <div id="campaign" className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
      {/* Left Sidebar - Anchor Navigation */}
      <aside className="md:col-span-1">
        {/* Campaign Image Placeholder */}
        <div className="mb-6 aspect-video w-full overflow-hidden rounded-sm border border-border bg-muted">
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <span className="text-sm">Campaign Image</span>
          </div>
        </div>

        {/* Project Info */}
        <div className="mb-6 space-y-2 text-sm">
          <button className="flex items-center gap-2 text-primary hover:underline">
            <span className="h-5 w-5 rounded-full bg-primary" />
            <span>Project We Love</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-muted-foreground" />
            <span>Delaware City, DE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-muted-foreground" />
            <span>Gadgets</span>
          </div>
        </div>

        {/* Anchor Navigation */}
        <nav className="space-y-1 border-l-4 border-primary pl-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id)
                // Scroll to the section
                setTimeout(() => {
                  const element = document.getElementById(section.id)
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                }, 0)
              }}
              className={`block text-left text-sm transition-colors ${
                activeSection === section.id
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:col-span-2">
        <div className="space-y-12">
          {/* Story Section */}
          <section id="meet-partystudio" className="space-y-6">
            <h2 className="text-4xl font-bold">Story</h2>
            <p className="text-base leading-relaxed text-foreground">
              I’ve been a concert pianist for years, performing at Carnegie Hall, Lincoln Center,
and venues around the world. But there’s something most people never saw: I was
constantly fighting against the piano.
My hands span just under 8.5 inches. That meant many traditional pieces were
difficult, sometimes impossible, for me to play comfortably. No matter how much I
practiced, I felt like the instrument wasn’t built for me.
So I asked myself:
“What if the piano could be designed to fit the pianist, instead of the other way
around?”
That’s where DreamPlay was born.
            </p>
          </section>

          {/* Features Section */}
          <section id="features" className="space-y-8">
            <h3 className="text-2xl font-bold">Key Features</h3>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: "📦", title: "Shipping Starts in February", description: "Timeline" },
                { icon: "🛡️", title: "1-Year Warranty", description: "Included" },
                { icon: "🌍", title: "Shipping Globally", description: "Worldwide" },
                { icon: "💰", title: "Taxes Included", description: "No surprises" },
              ].map((feature, idx) => (
                <div key={idx} className="rounded-sm border border-border bg-muted p-6 text-center">
                  <div className="mb-3 text-3xl">{feature.icon}</div>
                  <h4 className="mb-2 font-semibold">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Customer Service Section */}
          <section className="space-y-4 border-t border-border pt-8">
            <p className="text-base">
              <span className="font-semibold">Official Customer Service:</span>{" "}
              <a href="mailto:Support@popumusic.com" className="text-primary hover:underline">
                Support@popumusic.com
              </a>
            </p>
          </section>

          {/* First Hand Experiences */}
          <section id="first-hand" className="space-y-4 border-t border-border pt-8">
            <h3 className="text-2xl font-bold">First Hand Experiences</h3>
            <p className="text-base leading-relaxed text-foreground">
              Share customer testimonials and experiences here.
            </p>
          </section>

          {/* Meet PartyKeys */}
          <section id="meet-partykeys" className="space-y-4 border-t border-border pt-8">
            <h3 className="text-2xl font-bold">Meet PartyKeys</h3>
            <p className="text-base leading-relaxed text-foreground">
              Introduce the PartyKeys technology and innovation.
            </p>
          </section>

          {/* Technical Specifications */}
          <section id="technical" className="space-y-4 border-t border-border pt-8">
            <h3 className="text-2xl font-bold">Technical Specifications</h3>
            <div className="space-y-2 text-sm text-foreground">
              <p>• Add your technical specs here</p>
              <p>• Include dimensions, weight, materials</p>
              <p>• List compatibility and features</p>
            </div>
          </section>

          {/* Production */}
          <section id="production" className="space-y-4 border-t border-border pt-8">
            <h3 className="text-2xl font-bold">Production</h3>
            <p className="text-base leading-relaxed text-foreground">
              Describe your production process and timeline.
            </p>
          </section>

          {/* Team */}
          <section id="popumusic-team" className="space-y-4 border-t border-border pt-8">
            <h3 className="text-2xl font-bold">Popumusic Team</h3>
            <p className="text-base leading-relaxed text-foreground">
              Introduce your team and their expertise.
            </p>
          </section>

          {/* Shipping */}
          <section id="shipping-fee" className="space-y-4 border-t border-border pt-8">
            <h3 className="text-2xl font-bold">Shipping Fee Specification</h3>
            <p className="text-base leading-relaxed text-foreground">
              Detail shipping costs by region and estimated delivery times.
            </p>
          </section>

          {/* Risks */}
          <section id="risks" className="space-y-6 border-t border-border pt-8">
            <h3 className="text-2xl font-bold">Risks & Challenges</h3>
            <p className="text-base leading-relaxed text-foreground">
              Every crowdfunding campaign comes with risks, and I want to be fully transparent with you. Here are the main challenges we face and how I plan to overcome them:
            </p>

            {/* Risk 1 */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">1. Manufacturing & Production Delays</h4>
              <p className="text-base leading-relaxed text-muted-foreground">
                Bringing a new musical instrument to life requires precision. Delays in manufacturing or supply chains can sometimes happen.
              </p>
              <p className="text-base leading-relaxed text-foreground">
                <span className="font-medium">My plan:</span> I've already partnered with experienced manufacturers who specialize in digital instruments, and we've accounted for buffer time in the production schedule.
              </p>
            </div>

            {/* Risk 2 */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">2. Shipping & Logistics</h4>
              <p className="text-base leading-relaxed text-muted-foreground">
                Global shipping can face unexpected issues such as customs delays or increased costs.
              </p>
              <p className="text-base leading-relaxed text-foreground">
                <span className="font-medium">My plan:</span> I'll be working with logistics partners who have handled international campaigns before. Shipping costs will be clearly calculated before you pledge, and I'll communicate any changes immediately.
              </p>
            </div>

            {/* Risk 3 */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">3. Product Development & Quality</h4>
              <p className="text-base leading-relaxed text-muted-foreground">
                The DS5.5 and DS6.0 prototypes are tested and working, but scaling production always carries the challenge of maintaining quality.
              </p>
              <p className="text-base leading-relaxed text-foreground">
                <span className="font-medium">My plan:</span> Every unit will go through strict quality control before shipping. I'll personally oversee this process to ensure DreamPlay meets the professional standards I demand as a pianist.
              </p>
            </div>

            {/* Risk 4 */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">4. Stretch Goal Features</h4>
              <p className="text-base leading-relaxed text-muted-foreground">
                Some stretch goals (like the DS6.5 model or premium finishes) will require additional development.
              </p>
              <p className="text-base leading-relaxed text-foreground">
                <span className="font-medium">My plan:</span> These features will only be unlocked if funding allows. This ensures I can deliver the promised products without overextending resources.
              </p>
            </div>

            {/* Risk 5 */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">5. Communication</h4>
              <p className="text-base leading-relaxed text-muted-foreground">
                Crowdfunding projects sometimes fail when creators go silent. That won't happen here.
              </p>
              <p className="text-base leading-relaxed text-foreground">
                <span className="font-medium">My plan:</span> I will post regular updates and send emails throughout production, so you always know where things stand.
              </p>
            </div>

            {/* Final Note */}
            <div className="mt-8 rounded-lg border border-border bg-muted/30 p-6">
              <h4 className="text-lg font-semibold mb-3">Final Note</h4>
              <p className="text-base leading-relaxed text-foreground">
                I've poured my heart into DreamPlay because I know what it feels like to struggle against the piano. My commitment to you is simple: I'll deliver the instrument I always wished I had, and I'll keep you updated every step of the way.
              </p>
              <p className="mt-4 text-base leading-relaxed text-foreground">
                Thank you for trusting me and being part of this journey.
              </p>
            </div>

            {/* FAQ Link */}
            <p className="text-base pt-4">
              Questions about this project? Check out the{" "}
              <button
                onClick={() => {
                  const navTabs = document.querySelector('[data-tab="faq"]')
                  if (navTabs) navTabs.click()
                }}
                className="text-primary hover:underline font-medium"
              >
                FAQ
              </button>
            </p>
          </section>
        </div>
      </main>

      {/* Right Sidebar - Support & Rewards */}
      <aside className="md:col-span-1">
        {/* Creator Info */}
        <div className="mb-8 space-y-4 rounded-sm border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary" />
            <div>
              <h4 className="font-semibold">PopuMusic</h4>
              <p className="text-xs text-muted-foreground">First created • 0 backed</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-foreground">
            Founded on April 1, 2015, PopuMusic is a dynamic team revolutionizing music interaction. Our mission is to make music accessible and engaging.
          </p>
          <a href="#" className="inline-block text-sm text-primary hover:underline">
            See more
          </a>
        </div>

        {/* Support Section */}
        <div className="mb-8 space-y-4">
          <h3 className="text-lg font-semibold">Support</h3>
          <div className="rounded-sm border border-border p-4">
            <p className="mb-4 text-sm font-semibold">Make a pledge without a reward</p>
            <div className="mb-4">
              <label className="mb-2 block text-xs font-medium text-muted-foreground">Pledge amount</label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 text-muted-foreground">$</span>
                <input
                  type="number"
                  value={pledgeAmount}
                  onChange={(e) => setPledgeAmount(e.target.value)}
                  placeholder="1"
                  className="flex-1 rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>
            <Button className="w-full">Back it because you believe in it.</Button>
            <p className="mt-3 text-xs text-muted-foreground">Support the project for no reward, just because it speaks to you.</p>
          </div>
        </div>

        {/* Available Rewards */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available rewards</h3>
          <div className="space-y-4">
            {/* Reward 1 */}
            <div className="rounded-sm border border-border overflow-hidden">
              <div className="aspect-square w-full overflow-hidden bg-muted">
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  Reward Image 1
                </div>
              </div>
              <div className="space-y-2 p-3">
                <p className="text-xs font-semibold text-primary">LOWEST PRICE</p>
                <h4 className="font-semibold">Just The Cool Keyboard</h4>
                <p className="text-xl font-bold">
                  $199 <span className="text-xs text-muted-foreground line-through">$300</span>
                </p>
                <p className="text-xs text-muted-foreground">Edit reward description here</p>
              </div>
            </div>

            {/* Reward 2 */}
            <div className="rounded-sm border border-border overflow-hidden">
              <div className="aspect-square w-full overflow-hidden bg-muted">
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  Reward Image 2
                </div>
              </div>
              <div className="space-y-2 p-3">
                <h4 className="font-semibold">Premium Bundle</h4>
                <p className="text-xl font-bold">$399</p>
                <p className="text-xs text-muted-foreground">Edit reward description here</p>
              </div>
            </div>

            {/* Reward 3 */}
            <div className="rounded-sm border border-border overflow-hidden">
              <div className="aspect-square w-full overflow-hidden bg-muted">
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  Reward Image 3
                </div>
              </div>
              <div className="space-y-2 p-3">
                <h4 className="font-semibold">Deluxe Edition</h4>
                <p className="text-xl font-bold">$599</p>
                <p className="text-xs text-muted-foreground">Edit reward description here</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
