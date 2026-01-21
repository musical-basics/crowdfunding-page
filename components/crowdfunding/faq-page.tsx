'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqItems: FAQItem[] = [
  {
    id: 'model-choice',
    category: 'About Purchase',
    question: 'Which DreamPlay model is right for me?',
    answer: 'DreamPlay comes in two sizes: DS5.5 – best if your handspan is under 7.6 inches, and DS6.0 – best if your handspan is between 7.6 and 8.5 inches. If you\'re not sure, measure from the tip of your pinky to the tip of your thumb while stretching your hand wide. See our infographic on the campaign page for guidance.'
  },
  {
    id: 'ds6-5-model',
    category: 'About Purchase',
    question: 'What about the DS6.5 model?',
    answer: 'The DS6.5 (conventional size) is part of our roadmap. If we reach our stretch goals, we\'ll start development with all the same DreamPlay innovations. You can subscribe for updates even if your handspan fits the traditional size.'
  },
  {
    id: 'delivery-timeline',
    category: 'About Purchase',
    question: 'When will I receive my keyboard?',
    answer: 'Here\'s the current timeline: Campaign ends → Orders confirmed. Months 2–5 → Production & testing. Month 6 onward → Shipping to backers begins. We\'ll keep you updated with full transparency at every step.'
  },
  {
    id: 'shipping-locations',
    category: 'About Purchase',
    question: 'Where do you ship?',
    answer: 'We plan to ship worldwide. Shipping costs will be calculated based on your location and shown before you complete your pledge.'
  },
  {
    id: 'warranty',
    category: 'About Support',
    question: 'Is there a warranty?',
    answer: 'Yes. Every DreamPlay keyboard comes with a 1-year warranty covering manufacturing defects.'
  },
  {
    id: 'returns-refunds',
    category: 'About Support',
    question: 'What about returns or refunds?',
    answer: 'Because this is a crowdfunding campaign, refunds aren\'t available once the campaign closes. However, if your keyboard arrives damaged or defective, we\'ll work with you to make it right.'
  },
  {
    id: 'accessories-later',
    category: 'About Support',
    question: 'Can I add accessories later?',
    answer: 'Yes! We\'ll offer accessories (stand, pedal, carrying case) as add-ons during the campaign and after. You can customize your order at any time.'
  },
  {
    id: 'different-keyboards',
    category: 'About The Product',
    question: 'What makes DreamPlay different from other keyboards?',
    answer: 'Unlike traditional pianos, DreamPlay is designed to fit your hands. With multiple sizes, LED learning technology, and professional sound, it\'s built to give pianists freedom, comfort, and speed.'
  },
  {
    id: 'professional-music',
    category: 'About The Product',
    question: 'Can I play professional-level music on DreamPlay?',
    answer: 'Absolutely. DreamPlay has been built with the authentic touch and sound quality professional pianists demand. Whether you\'re a beginner or advanced player, you\'ll feel the difference right away.'
  }
]

export function FAQPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const categories = Array.from(new Set(faqItems.map(item => item.category)))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main FAQ Content */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">Find answers to common questions about DreamPlay and your order.</p>
        </div>

        {/* FAQ Accordion by Category */}
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-3">{category}</h2>
            
            <div className="space-y-3">
              {faqItems
                .filter(item => item.category === category)
                .map((item) => (
                  <div key={item.id} className="border border-border rounded-lg overflow-hidden hover:border-foreground/40 transition-colors">
                    <button
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left group"
                    >
                      <span className="text-base font-medium pr-4 flex-1 group-hover:text-foreground transition-colors">{item.question}</span>
                      <ChevronRight
                        className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                          expandedId === item.id ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    
                    {expandedId === item.id && (
                      <div className="border-t border-border bg-muted/20 p-4 animate-in fade-in duration-200">
                        <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        {/* Question Form Block */}
        <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30 rounded-lg p-6">
          <p className="text-foreground font-semibold mb-3">Don't see the answer to your question?</p>
          <p className="text-muted-foreground text-sm mb-4">
            Ask the project creator directly.
          </p>
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
            Verify your email address to ask a question.
          </a>
        </div>

        {/* Sidebar Block 1 */}
        <div className="p-6 bg-muted/30 rounded-lg border border-dashed border-border">
          <h4 className="text-lg font-semibold mb-4">Need Help?</h4>
          <p className="text-muted-foreground text-sm">Editable sidebar content. Add support contact info or additional resources here.</p>
        </div>

        {/* Sidebar Block 2 */}
        <div className="p-6 bg-muted/30 rounded-lg border border-dashed border-border">
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <p className="text-muted-foreground text-sm">Editable sidebar content. Link to shipping info, warranty details, or product specs.</p>
        </div>

        {/* Sidebar Block 3 */}
        <div className="aspect-video bg-muted/50 rounded-lg border border-dashed border-border flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Image Placeholder</p>
        </div>
      </div>
    </div>
  )
}
