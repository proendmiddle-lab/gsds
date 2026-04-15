"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  LayoutDashboard,
  PackageOpen,
  Warehouse,
  ShoppingCart,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Truck,
  ClipboardList,
  FileCheck,
  Search,
  Map,
  Lightbulb,
  ListOrdered,
  Layers,
  Package,
  Box,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: { title: string; href: string; icon: React.ComponentType<{ className?: string }> }[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Inbound",
    href: "/inbound",
    icon: PackageOpen,
    children: [
      { title: "Purchase Orders", href: "/inbound/purchase-orders", icon: ClipboardList },
      { title: "Receiving Dock", href: "/inbound/receiving", icon: Truck },
      { title: "ASN Verification", href: "/inbound/asn", icon: FileCheck },
    ],
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Warehouse,
    children: [
      { title: "Stock Lookup", href: "/inventory/stock", icon: Search },
      { title: "Warehouse Map", href: "/inventory/map", icon: Map },
      { title: "Slotting Logic", href: "/inventory/slotting", icon: Lightbulb },
    ],
  },
  {
    title: "Outbound",
    href: "/outbound",
    icon: ShoppingCart,
    badge: "12",
    children: [
      { title: "Order Queue", href: "/outbound/orders", icon: ListOrdered },
      { title: "Wave Planning", href: "/outbound/waves", icon: Layers },
      { title: "Packing Station", href: "/outbound/packing", icon: Package },
    ],
  },
  {
    title: "Labor & Tasks",
    href: "/labor",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(["Inbound", "Inventory", "Outbound"])

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-sidebar-border px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Box className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold text-sidebar-foreground">WMS Pro</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <div key={item.title}>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={item.href}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-center h-11",
                            isActive(item.href)
                              ? "bg-sidebar-accent text-sidebar-primary"
                              : "text-sidebar-foreground hover:bg-sidebar-accent"
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex items-center gap-2">
                      {item.title}
                      {item.badge && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    {item.children ? (
                      <Button
                        variant="ghost"
                        onClick={() => toggleExpand(item.title)}
                        className={cn(
                          "w-full justify-between h-11 px-3",
                          isActive(item.href)
                            ? "bg-sidebar-accent text-sidebar-primary"
                            : "text-sidebar-foreground hover:bg-sidebar-accent"
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          <span className="text-sm font-medium">{item.title}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          {item.badge && (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 transition-transform",
                              expandedItems.includes(item.title) && "rotate-90"
                            )}
                          />
                        </span>
                      </Button>
                    ) : (
                      <Link href={item.href}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start h-11 px-3",
                            isActive(item.href)
                              ? "bg-sidebar-accent text-sidebar-primary"
                              : "text-sidebar-foreground hover:bg-sidebar-accent"
                          )}
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          <span className="text-sm font-medium">{item.title}</span>
                        </Button>
                      </Link>
                    )}

                    {/* Sub-items */}
                    {item.children && expandedItems.includes(item.title) && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
                        {item.children.map((child) => (
                          <Link key={child.href} href={child.href}>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start h-9 px-3",
                                isActive(child.href)
                                  ? "bg-sidebar-accent text-sidebar-primary"
                                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                              )}
                            >
                              <child.icon className="mr-3 h-4 w-4" />
                              <span className="text-sm">{child.title}</span>
                            </Button>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Collapse Toggle */}
        <div className="border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            onClick={onToggle}
            className="w-full justify-center h-10 text-muted-foreground hover:text-sidebar-foreground"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 mr-2" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
