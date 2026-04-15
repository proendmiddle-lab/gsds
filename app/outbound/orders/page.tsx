"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/wms/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MoreHorizontal,
  Eye,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Play,
  Printer,
  ShoppingCart,
  PackageCheck,
  PackageX,
} from "lucide-react"

interface Order {
  id: string
  customer: string
  channel: "web" | "amazon" | "b2b" | "retail"
  items: number
  lines: number
  status: "new" | "allocated" | "picking" | "packing" | "shipped"
  priority: "normal" | "high" | "urgent"
  carrier: string
  shipBy: string
  assignee?: string
  progress?: number
  wave?: string
}

const orders: Order[] = [
  { id: "ORD-7842", customer: "Acme Corp", channel: "b2b", items: 12, lines: 4, status: "picking", priority: "high", carrier: "FedEx", shipBy: "Today 5PM", assignee: "Mike J.", progress: 65, wave: "W-89" },
  { id: "ORD-7841", customer: "TechFlow Inc", channel: "web", items: 5, lines: 2, status: "packing", priority: "urgent", carrier: "UPS", shipBy: "Today 3PM", assignee: "Sarah C.", progress: 90 },
  { id: "ORD-7840", customer: "Global Retail", channel: "amazon", items: 28, lines: 8, status: "allocated", priority: "normal", carrier: "USPS", shipBy: "Tomorrow", wave: "W-90" },
  { id: "ORD-7839", customer: "Prime Supply", channel: "b2b", items: 8, lines: 3, status: "new", priority: "high", carrier: "FedEx", shipBy: "Today 6PM" },
  { id: "ORD-7838", customer: "FastShip LLC", channel: "retail", items: 3, lines: 1, status: "shipped", priority: "normal", carrier: "DHL", shipBy: "Yesterday" },
  { id: "ORD-7837", customer: "Quick Commerce", channel: "web", items: 15, lines: 5, status: "picking", priority: "normal", carrier: "UPS", shipBy: "Tomorrow", assignee: "James W.", progress: 40, wave: "W-89" },
  { id: "ORD-7836", customer: "Metro Goods", channel: "amazon", items: 6, lines: 2, status: "new", priority: "urgent", carrier: "FedEx", shipBy: "Today 2PM" },
  { id: "ORD-7835", customer: "Elite Supplies", channel: "b2b", items: 22, lines: 7, status: "allocated", priority: "high", carrier: "USPS", shipBy: "Today 5PM", wave: "W-90" },
  { id: "ORD-7834", customer: "Direct Sales Co", channel: "web", items: 9, lines: 3, status: "shipped", priority: "normal", carrier: "UPS", shipBy: "Yesterday" },
  { id: "ORD-7833", customer: "Bulk Buyers Inc", channel: "b2b", items: 45, lines: 12, status: "packing", priority: "normal", carrier: "FedEx Ground", shipBy: "Tomorrow", assignee: "Emily D.", progress: 75 },
]

const statusConfig = {
  new: { label: "New", icon: ShoppingCart, className: "bg-primary/20 text-primary border-primary/30" },
  allocated: { label: "Allocated", icon: Package, className: "bg-info/20 text-info border-info/30" },
  picking: { label: "Picking", icon: Play, className: "bg-warning/20 text-warning border-warning/30" },
  packing: { label: "Packing", icon: PackageCheck, className: "bg-chart-5/20 text-chart-5 border-chart-5/30" },
  shipped: { label: "Shipped", icon: Truck, className: "bg-success/20 text-success border-success/30" },
}

const priorityConfig = {
  normal: { label: "Normal", className: "bg-muted text-muted-foreground" },
  high: { label: "High", className: "bg-warning/20 text-warning" },
  urgent: { label: "Urgent", className: "bg-destructive/20 text-destructive" },
}

const channelConfig = {
  web: { label: "Web", className: "bg-primary/20 text-primary" },
  amazon: { label: "Amazon", className: "bg-warning/20 text-warning" },
  b2b: { label: "B2B", className: "bg-success/20 text-success" },
  retail: { label: "Retail", className: "bg-info/20 text-info" },
}

export default function OrderQueuePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const getFilteredOrders = (status?: string) => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = !status || status === "all" || order.status === status
      return matchesSearch && matchesStatus
    })
  }

  const filteredOrders = getFilteredOrders(activeTab)

  const stats = {
    new: orders.filter((o) => o.status === "new").length,
    allocated: orders.filter((o) => o.status === "allocated").length,
    picking: orders.filter((o) => o.status === "picking").length,
    packing: orders.filter((o) => o.status === "packing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    urgent: orders.filter((o) => o.priority === "urgent").length,
  }

  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.id))
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Order Queue</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track outbound order fulfillment
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedOrders.length > 0 && (
              <>
                <Badge variant="secondary" className="h-8 px-3">
                  {selectedOrders.length} selected
                </Badge>
                <Button variant="outline" className="h-10">
                  <Layers className="mr-2 h-4 w-4" />
                  Add to Wave
                </Button>
                <Button variant="outline" className="h-10">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Picks
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-6">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <ShoppingCart className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.new}</p>
                <p className="text-xs text-muted-foreground">New</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info/10">
                <Package className="h-4 w-4 text-info" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.allocated}</p>
                <p className="text-xs text-muted-foreground">Allocated</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
                <Play className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.picking}</p>
                <p className="text-xs text-muted-foreground">Picking</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-5/10">
                <PackageCheck className="h-4 w-4 text-chart-5" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.packing}</p>
                <p className="text-xs text-muted-foreground">Packing</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
                <Truck className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.shipped}</p>
                <p className="text-xs text-muted-foreground">Shipped</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border border-destructive/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-xl font-bold text-destructive">{stats.urgent}</p>
                <p className="text-xs text-muted-foreground">Urgent</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table with Tabs */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between">
                <TabsList className="bg-secondary">
                  <TabsTrigger value="all">All Orders</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                  <TabsTrigger value="allocated">Allocated</TabsTrigger>
                  <TabsTrigger value="picking">Picking</TabsTrigger>
                  <TabsTrigger value="packing">Packing</TabsTrigger>
                  <TabsTrigger value="shipped">Shipped</TabsTrigger>
                </TabsList>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 h-9 bg-secondary border-border"
                  />
                </div>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-muted-foreground">Order ID</TableHead>
                  <TableHead className="text-muted-foreground">Customer</TableHead>
                  <TableHead className="text-muted-foreground">Channel</TableHead>
                  <TableHead className="text-muted-foreground text-center">Items</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Progress</TableHead>
                  <TableHead className="text-muted-foreground">Priority</TableHead>
                  <TableHead className="text-muted-foreground">Ship By</TableHead>
                  <TableHead className="text-muted-foreground">Wave</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-border hover:bg-secondary/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => toggleSelectOrder(order.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium text-primary">
                      {order.id}
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      <Badge className={channelConfig[order.channel].className + " text-xs"}>
                        {channelConfig[order.channel].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{order.items}</span>
                      <span className="text-muted-foreground text-xs ml-1">({order.lines})</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[order.status].className}>
                        {statusConfig[order.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.progress !== undefined ? (
                        <div className="flex items-center gap-2 min-w-24">
                          <Progress value={order.progress} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground w-8">{order.progress}%</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityConfig[order.priority].className + " text-xs"}>
                        {priorityConfig[order.priority].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className={`text-sm ${order.shipBy.includes("Today") ? "text-warning font-medium" : ""}`}>
                          {order.shipBy}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.wave ? (
                        <Badge variant="outline" className="text-xs font-mono">
                          {order.wave}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Play className="mr-2 h-4 w-4" />
                            Start Picking
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="mr-2 h-4 w-4" />
                            Print Pick List
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <PackageX className="mr-2 h-4 w-4" />
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
