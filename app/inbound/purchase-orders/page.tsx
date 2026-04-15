"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/wms/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Truck,
  FileText,
  Calendar,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface PurchaseOrder {
  id: string
  vendor: string
  expectedDate: string
  items: number
  units: number
  status: "pending" | "partial" | "completed" | "cancelled"
  dock?: string
  asnStatus: "none" | "received" | "verified"
}

const purchaseOrders: PurchaseOrder[] = [
  { id: "PO-4521", vendor: "Global Electronics Ltd", expectedDate: "2024-01-15", items: 24, units: 1250, status: "pending", dock: "Dock 2", asnStatus: "received" },
  { id: "PO-4520", vendor: "Prime Packaging Co", expectedDate: "2024-01-15", items: 8, units: 480, status: "partial", dock: "Dock 1", asnStatus: "verified" },
  { id: "PO-4519", vendor: "TechParts International", expectedDate: "2024-01-14", items: 15, units: 890, status: "completed", asnStatus: "verified" },
  { id: "PO-4518", vendor: "Industrial Supply Inc", expectedDate: "2024-01-14", items: 32, units: 2100, status: "pending", asnStatus: "none" },
  { id: "PO-4517", vendor: "FastShip Components", expectedDate: "2024-01-13", items: 12, units: 560, status: "completed", asnStatus: "verified" },
  { id: "PO-4516", vendor: "Quality Hardware LLC", expectedDate: "2024-01-13", items: 45, units: 3200, status: "partial", dock: "Dock 3", asnStatus: "received" },
  { id: "PO-4515", vendor: "Metro Distribution", expectedDate: "2024-01-12", items: 18, units: 950, status: "cancelled", asnStatus: "none" },
  { id: "PO-4514", vendor: "Allied Manufacturing", expectedDate: "2024-01-12", items: 22, units: 1400, status: "completed", asnStatus: "verified" },
]

const statusConfig = {
  pending: { label: "Pending", className: "bg-warning/20 text-warning border-warning/30" },
  partial: { label: "Partial", className: "bg-info/20 text-info border-info/30" },
  completed: { label: "Completed", className: "bg-success/20 text-success border-success/30" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground border-muted" },
}

const asnConfig = {
  none: { label: "No ASN", className: "bg-muted text-muted-foreground" },
  received: { label: "ASN Received", className: "bg-warning/20 text-warning" },
  verified: { label: "Verified", className: "bg-success/20 text-success" },
}

export default function PurchaseOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredOrders = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || po.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: purchaseOrders.length,
    pending: purchaseOrders.filter((po) => po.status === "pending").length,
    partial: purchaseOrders.filter((po) => po.status === "partial").length,
    expectedToday: purchaseOrders.filter((po) => po.expectedDate === "2024-01-15").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Purchase Orders</h1>
            <p className="text-sm text-muted-foreground">
              Manage inbound shipments and vendor deliveries
            </p>
          </div>
          <Button className="h-11 min-w-[140px]">
            <Plus className="mr-2 h-4 w-4" />
            New PO
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Package className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                  <Truck className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.partial}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <Calendar className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.expectedToday}</p>
                  <p className="text-xs text-muted-foreground">Expected Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Table */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg font-semibold">All Purchase Orders</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search PO or vendor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 h-9 bg-secondary border-border"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 h-9 bg-secondary border-border">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">PO Number</TableHead>
                  <TableHead className="text-muted-foreground">Vendor</TableHead>
                  <TableHead className="text-muted-foreground">Expected Date</TableHead>
                  <TableHead className="text-muted-foreground text-center">Items</TableHead>
                  <TableHead className="text-muted-foreground text-center">Units</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">ASN</TableHead>
                  <TableHead className="text-muted-foreground">Dock</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((po) => (
                  <TableRow key={po.id} className="border-border hover:bg-secondary/50">
                    <TableCell className="font-mono text-sm font-medium text-primary">
                      {po.id}
                    </TableCell>
                    <TableCell>{po.vendor}</TableCell>
                    <TableCell className="text-muted-foreground">{po.expectedDate}</TableCell>
                    <TableCell className="text-center">{po.items}</TableCell>
                    <TableCell className="text-center">{po.units.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[po.status].className}>
                        {statusConfig[po.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={asnConfig[po.asnStatus].className}>
                        {asnConfig[po.asnStatus].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {po.dock || "-"}
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
                            <Truck className="mr-2 h-4 w-4" />
                            Start Receiving
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            View ASN
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {filteredOrders.length} of {purchaseOrders.length} orders
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 min-w-8">
                  1
                </Button>
                <Button variant="ghost" size="sm" className="h-8 min-w-8">
                  2
                </Button>
                <Button variant="ghost" size="sm" className="h-8 min-w-8">
                  3
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
