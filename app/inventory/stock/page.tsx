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
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Package,
  AlertTriangle,
  History,
  MapPin,
  Calendar,
  Barcode,
} from "lucide-react"

interface InventoryItem {
  id: string
  sku: string
  description: string
  category: string
  location: string
  quantity: number
  reserved: number
  available: number
  lotNumber: string
  expiryDate: string | null
  status: "in-stock" | "low-stock" | "out-of-stock" | "expired"
  lastMovement: string
}

const inventory: InventoryItem[] = [
  { id: "1", sku: "SKU-2847", description: "Widget Assembly Kit A", category: "Electronics", location: "A1-B2-03", quantity: 450, reserved: 120, available: 330, lotNumber: "LOT-2024-001", expiryDate: null, status: "in-stock", lastMovement: "2 hours ago" },
  { id: "2", sku: "SKU-3291", description: "Circuit Board Type B", category: "Electronics", location: "A2-C4-01", quantity: 85, reserved: 30, available: 55, lotNumber: "LOT-2024-012", expiryDate: null, status: "low-stock", lastMovement: "5 hours ago" },
  { id: "3", sku: "SKU-1024", description: "Power Supply Unit 500W", category: "Hardware", location: "B1-A1-02", quantity: 0, reserved: 0, available: 0, lotNumber: "LOT-2023-089", expiryDate: null, status: "out-of-stock", lastMovement: "1 day ago" },
  { id: "4", sku: "SKU-4567", description: "LED Display Panel 24in", category: "Displays", location: "C2-D3-05", quantity: 234, reserved: 50, available: 184, lotNumber: "LOT-2024-034", expiryDate: null, status: "in-stock", lastMovement: "30 min ago" },
  { id: "5", sku: "SKU-8910", description: "Thermal Paste TG-7", category: "Consumables", location: "D4-A2-01", quantity: 1200, reserved: 200, available: 1000, lotNumber: "LOT-2024-056", expiryDate: "2025-06-15", status: "in-stock", lastMovement: "4 hours ago" },
  { id: "6", sku: "SKU-5432", description: "Lithium Battery Pack 5000mAh", category: "Batteries", location: "A3-B1-04", quantity: 45, reserved: 45, available: 0, lotNumber: "LOT-2023-078", expiryDate: "2024-02-01", status: "expired", lastMovement: "3 days ago" },
  { id: "7", sku: "SKU-7654", description: "USB-C Connector Cable 1m", category: "Cables", location: "C1-C2-02", quantity: 890, reserved: 150, available: 740, lotNumber: "LOT-2024-023", expiryDate: null, status: "in-stock", lastMovement: "1 hour ago" },
  { id: "8", sku: "SKU-9876", description: "Cooling Fan 120mm RGB", category: "Hardware", location: "B2-D4-03", quantity: 67, reserved: 20, available: 47, lotNumber: "LOT-2024-045", expiryDate: null, status: "low-stock", lastMovement: "6 hours ago" },
]

const statusConfig = {
  "in-stock": { label: "In Stock", className: "bg-success/20 text-success" },
  "low-stock": { label: "Low Stock", className: "bg-warning/20 text-warning" },
  "out-of-stock": { label: "Out of Stock", className: "bg-destructive/20 text-destructive" },
  "expired": { label: "Expired", className: "bg-muted text-muted-foreground line-through" },
}

export default function StockLookupPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const categories = [...new Set(inventory.map((item) => item.category))]

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lotNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats = {
    totalSKUs: inventory.length,
    totalUnits: inventory.reduce((sum, item) => sum + item.quantity, 0),
    lowStock: inventory.filter((item) => item.status === "low-stock").length,
    outOfStock: inventory.filter((item) => item.status === "out-of-stock").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Stock Lookup</h1>
            <p className="text-sm text-muted-foreground">
              Search and manage inventory across all locations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-11">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Barcode className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalSKUs}</p>
                  <p className="text-xs text-muted-foreground">Total SKUs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <Package className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalUnits.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Units</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.lowStock}</p>
                  <p className="text-xs text-muted-foreground">Low Stock Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <Package className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.outOfStock}</p>
                  <p className="text-xs text-muted-foreground">Out of Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Table */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg font-semibold">Inventory Items</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search SKU, location, lot..."
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
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-36 h-9 bg-secondary border-border">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">SKU</TableHead>
                  <TableHead className="text-muted-foreground">Description</TableHead>
                  <TableHead className="text-muted-foreground">Location</TableHead>
                  <TableHead className="text-muted-foreground text-center">Qty</TableHead>
                  <TableHead className="text-muted-foreground text-center">Reserved</TableHead>
                  <TableHead className="text-muted-foreground text-center">Available</TableHead>
                  <TableHead className="text-muted-foreground">Lot #</TableHead>
                  <TableHead className="text-muted-foreground">Expiry</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id} className="border-border hover:bg-secondary/50">
                    <TableCell className="font-mono text-sm font-medium text-primary">
                      {item.sku}
                    </TableCell>
                    <TableCell className="max-w-48 truncate">{item.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono text-sm">{item.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                    <TableCell className="text-center text-muted-foreground">{item.reserved}</TableCell>
                    <TableCell className="text-center font-medium text-success">{item.available}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{item.lotNumber}</TableCell>
                    <TableCell>
                      {item.expiryDate ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{item.expiryDate}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[item.status].className}>
                        {statusConfig[item.status].label}
                      </Badge>
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
                            <Edit className="mr-2 h-4 w-4" />
                            Adjust Quantity
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <History className="mr-2 h-4 w-4" />
                            Movement History
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
