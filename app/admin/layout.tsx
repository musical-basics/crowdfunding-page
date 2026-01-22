import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { Toaster } from "@/components/ui/toaster"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-muted/20">
                <AppSidebar />
                <main className="flex-1 overflow-y-auto">
                    {/* Mobile Trigger & Header */}
                    <header className="flex h-14 items-center gap-4 border-b bg-background px-6 lg:h-[60px]">
                        <SidebarTrigger />
                        <div className="flex-1">
                            {/* Add Breadcrumbs here later if needed */}
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <div className="p-6 md:p-10 max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
                <Toaster />
            </div>
        </SidebarProvider>
    )
}
