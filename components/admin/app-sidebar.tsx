"use client"

import {
    LayoutDashboard,
    FileText,
    Gift,
    User,
    HelpCircle,
    Settings,
    LogOut
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar"

// Menu items matching your requested sections
const items = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Campaign Details",
        url: "/admin/details",
        icon: FileText,
    },
    {
        title: "Rewards",
        url: "/admin/rewards",
        icon: Gift,
    },
    {
        title: "Creator Profile",
        url: "/admin/creator",
        icon: User,
    },
    {
        title: "FAQs",
        url: "/admin/faqs",
        icon: HelpCircle,
    },
    {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader className="p-4 border-b">
                <h2 className="text-xl font-bold tracking-tight">DreamPlay Admin</h2>
                <p className="text-xs text-muted-foreground">Crowdfunding Manager</p>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="text-red-500 hover:text-red-600">
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
