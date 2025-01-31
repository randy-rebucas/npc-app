"use client"

import { useApplicationSettings } from "@/providers/application-settings-provider";
import { GalleryVerticalEnd } from "lucide-react";
import { SidebarMenuItem } from "../ui/sidebar";
import { SidebarMenuButton } from "../ui/sidebar";
import { SidebarMenu } from "../ui/sidebar";
import Link from "next/link";

export function AdminSidebarHeaderContent() {
    const { settings, isLoading } = useApplicationSettings();

    if (isLoading) return null;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                    <Link href="/admin/dashboard">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        <div className="flex flex-col gap-0.5 leading-none">
                            <span className="font-semibold text-foreground">{settings?.siteName || process.env.NEXT_PUBLIC_APP_NAME}</span>
                            <span className="text-muted-foreground">v{settings?.appVersion || process.env.NEXT_PUBLIC_APP_VERSION}</span>
                        </div>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}