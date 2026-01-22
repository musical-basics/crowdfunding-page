"use client"

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

export default function AdminFAQPage() {
    const { campaign } = useCampaign()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Manage FAQs</h1>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
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
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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
        </div>
    )
}
