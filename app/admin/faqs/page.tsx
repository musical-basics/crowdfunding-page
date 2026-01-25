"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCampaign } from "@/context/campaign-context"
import { FAQDialog } from "@/components/admin/faq-dialog" // <--- Import the new dialog
import { deleteFAQ } from "../actions"
import { FAQItem } from "@/types/campaign"

export default function AdminFAQPage() {
    const { campaign, refreshCampaign } = useCampaign()

    // State to manage the modal
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedFaq, setSelectedFaq] = useState<FAQItem | null>(null)

    const handleEdit = (faq: FAQItem) => {
        setSelectedFaq(faq)
        setIsDialogOpen(true)
    }

    const handleCreate = () => {
        setSelectedFaq(null) // Clear selection for create mode
        setIsDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Manage FAQs</h1>
                <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Question
                </Button>
            </div>

            <div className="grid gap-4">
                {campaign?.faqs.map((faq) => (
                    <Card key={faq.id}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-semibold">
                                    {faq.question}
                                </CardTitle>
                                <CardDescription>
                                    Category: <span className="font-medium text-foreground">{faq.category}</span>
                                </CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">

                                    {/* Connect Edit Button */}
                                    <DropdownMenuItem onClick={() => handleEdit(faq)}>
                                        Edit
                                    </DropdownMenuItem>

                                    {/* Connect Delete Button */}
                                    <form action={async () => {
                                        await deleteFAQ(faq.id)
                                        if (refreshCampaign) await refreshCampaign()
                                    }}>
                                        <button type="submit" className="w-full text-left">
                                            <DropdownMenuItem className="text-red-600 cursor-pointer">
                                                Delete
                                            </DropdownMenuItem>
                                        </button>
                                    </form>

                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {faq.answer}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* The Dialog Component */}
            <FAQDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                faqToEdit={selectedFaq}
            />
        </div>
    )
}
