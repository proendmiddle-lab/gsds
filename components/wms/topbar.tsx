"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Bell,
  ChevronDown,
  Warehouse,
  AlertTriangle,
  Package,
  CheckCircle2,
  Settings,
  LogOut,
  User,
} from "lucide-react"

const warehouses = [
  { id: "wh-001", name: "Main Distribution Center", location: "Chicago, IL" },
  { id: "wh-002", name: "East Coast Hub", location: "Newark, NJ" },
  { id: "wh-003", name: "West Coast Facility", location: "Los Angeles, CA" },
]

const alerts = [
  { id: 1, type: "warning", title: "Low Stock Alert", message: "SKU-2847 below minimum threshold", time: "2 min ago" },
  { id: 2, type: "error", title: "QC Hold", message: "Batch #4521 failed inspection", time: "15 min ago" },
  { id: 3, type: "success", title: "Wave Complete", message: "Wave #89 picking completed", time: "32 min ago" },
  { id: 4, type: "warning", title: "Dock Schedule", message: "Dock 3 overbooked for tomorrow", time: "1 hr ago" },
]

export function Topbar() {
  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0])
  const [searchQuery, setSearchQuery] = useState("")

  const unreadAlerts = alerts.length

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case "error":
        return <Package className="h-4 w-4 text-destructive" />
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-success" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card px-4">
      {/* Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search SKU, Order, Location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 bg-secondary border-border focus:ring-primary"
          />
        </div>
        <kbd className="hidden md:inline-flex h-6 items-center gap-1 rounded border border-border bg-muted px-2 text-xs text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
        {/* Warehouse Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 gap-2 border-border bg-secondary">
              <Warehouse className="h-4 w-4 text-primary" />
              <span className="hidden md:inline-block max-w-32 truncate text-sm">
                {selectedWarehouse.name}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Select Warehouse</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {warehouses.map((wh) => (
              <DropdownMenuItem
                key={wh.id}
                onClick={() => setSelectedWarehouse(wh)}
                className="flex flex-col items-start gap-0.5"
              >
                <span className="font-medium">{wh.name}</span>
                <span className="text-xs text-muted-foreground">{wh.location}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Alerts */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-5 w-5" />
              {unreadAlerts > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full bg-destructive px-1 text-xs">
                  {unreadAlerts}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary hover:text-primary">
                Mark all read
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {alerts.map((alert) => (
              <DropdownMenuItem key={alert.id} className="flex items-start gap-3 p-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{alert.title}</p>
                  <p className="text-xs text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                JD
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>John Doe</span>
                <span className="text-xs font-normal text-muted-foreground">Warehouse Manager</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
