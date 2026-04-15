"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/wms/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ScanLine,
  Package,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Scale,
  Ruler,
  Truck,
  Camera,
  Box,
  PackageCheck,
} from "lucide-react"

interface PackingItem {
  id: string
  sku: string
  description: string
  quantity: number
  scanned: number
  location: string
  verified: boolean
}

interface PackingOrder {
  id: string
  customer: string
  items: PackingItem[]
  carrier: string
  service: string
  weight?: number
  dimensions?: { l: number; w: number; h: number }
}

const currentOrder: PackingOrder = {
  id: "ORD-7841",
  customer: "TechFlow Inc",
  carrier: "UPS",
  service: "Ground",
  items: [
    { id: "1", sku: "SKU-2847", description: "Widget Assembly Kit A", quantity: 2, scanned: 2, location: "A1-B2-03", verified: true },
    { id: "2", sku: "SKU-4567", description: "LED Display Panel 24in", quantity: 1, scanned: 1, location: "C2-D3-05", verified: true },
    { id: "3", sku: "SKU-7654", description: "USB-C Connector Cable 1m", quantity: 2, scanned: 0, location: "C1-C2-02", verified: false },
  ],
}

const packingQueue = [
  { id: "ORD-7841", customer: "TechFlow Inc", items: 5, status: "packing" },
  { id: "ORD-7833", customer: "Bulk Buyers Inc", items: 45, status: "ready" },
  { id: "ORD-7842", customer: "Acme Corp", items: 12, status: "ready" },
  { id: "ORD-7840", customer: "Global Retail", items: 28, status: "ready" },
]

const boxSizes = [
  { id: "sm", name: "Small Box", dimensions: "12 x 9 x 4 in" },
  { id: "md", name: "Medium Box", dimensions: "16 x 12 x 8 in" },
  { id: "lg", name: "Large Box", dimensions: "24 x 18 x 12 in" },
  { id: "env", name: "Envelope", dimensions: "12 x 9 x 0.5 in" },
]

export default function PackingStationPage() {
  const [scanInput, setScanInput] = useState("")
  const [selectedBox, setSelectedBox] = useState("")
  const [weight, setWeight] = useState("")
  const [dimensions, setDimensions] = useState({ l: "", w: "", h: "" })

  const totalItems = currentOrder.items.reduce((sum, item) => sum + item.quantity, 0)
  const scannedItems = currentOrder.items.reduce((sum, item) => sum + item.scanned, 0)
  const allVerified = currentOrder.items.every((item) => item.verified)
  const progressPercent = Math.round((scannedItems / totalItems) * 100)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Packing Station</h1>
            <p className="text-sm text-muted-foreground">
              Verify and pack orders for shipment
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-8 px-3 text-sm">
              Station 3
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Left: Queue */}
          <div className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Packing Queue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {packingQueue.map((order) => (
                  <div
                    key={order.id}
                    className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-all ${
                      order.id === currentOrder.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-secondary/30 hover:border-primary/50"
                    }`}
                  >
                    <div>
                      <p className="font-mono text-sm font-medium text-primary">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={order.status === "packing" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {order.status === "packing" ? "Active" : "Ready"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{order.items} items</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Center: Current Order */}
          <div className="lg:col-span-2 space-y-4">
            {/* Order Header */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold font-mono text-primary">
                        {currentOrder.id}
                      </span>
                      <Badge className="bg-warning/20 text-warning">In Progress</Badge>
                    </div>
                    <p className="text-muted-foreground">{currentOrder.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {currentOrder.carrier} - {currentOrder.service}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={progressPercent} className="h-2 w-32" />
                      <span className="text-sm font-medium">{progressPercent}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scan Input */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <ScanLine className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Scan item barcode to verify..."
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      className="h-12 text-lg font-mono bg-secondary border-border"
                      autoFocus
                    />
                  </div>
                  <Button size="lg" className="h-12 px-6">
                    Verify
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Items Table */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Order Items ({scannedItems}/{totalItems} verified)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="w-10"></TableHead>
                      <TableHead className="text-muted-foreground">SKU</TableHead>
                      <TableHead className="text-muted-foreground">Description</TableHead>
                      <TableHead className="text-muted-foreground">Location</TableHead>
                      <TableHead className="text-muted-foreground text-center">Qty</TableHead>
                      <TableHead className="text-muted-foreground text-center">Scanned</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentOrder.items.map((item) => (
                      <TableRow
                        key={item.id}
                        className={`border-border ${
                          item.verified ? "bg-success/5" : item.scanned > 0 ? "bg-warning/5" : ""
                        }`}
                      >
                        <TableCell>
                          {item.verified ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : item.scanned > 0 ? (
                            <AlertTriangle className="h-5 w-5 text-warning" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted" />
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm font-medium">{item.sku}</TableCell>
                        <TableCell className="max-w-48 truncate">{item.description}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {item.location}
                        </TableCell>
                        <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`font-medium ${
                              item.scanned === item.quantity
                                ? "text-success"
                                : item.scanned > 0
                                ? "text-warning"
                                : "text-muted-foreground"
                            }`}
                          >
                            {item.scanned}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right: Packing Details */}
          <div className="space-y-4">
            {/* Box Selection */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Box className="h-5 w-5 text-primary" />
                  Box Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={selectedBox} onValueChange={setSelectedBox}>
                  <SelectTrigger className="h-10 bg-secondary border-border">
                    <SelectValue placeholder="Select box size" />
                  </SelectTrigger>
                  <SelectContent>
                    {boxSizes.map((box) => (
                      <SelectItem key={box.id} value={box.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{box.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {box.dimensions}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Weight & Dimensions */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Weight & Dimensions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Weight (lbs)</Label>
                  <Input
                    placeholder="0.00"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-10 bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Dimensions (L x W x H in)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="L"
                      value={dimensions.l}
                      onChange={(e) => setDimensions({ ...dimensions, l: e.target.value })}
                      className="h-10 bg-secondary border-border text-center"
                    />
                    <Input
                      placeholder="W"
                      value={dimensions.w}
                      onChange={(e) => setDimensions({ ...dimensions, w: e.target.value })}
                      className="h-10 bg-secondary border-border text-center"
                    />
                    <Input
                      placeholder="H"
                      value={dimensions.h}
                      onChange={(e) => setDimensions({ ...dimensions, h: e.target.value })}
                      className="h-10 bg-secondary border-border text-center"
                    />
                  </div>
                </div>
                <Button variant="outline" className="w-full h-10">
                  <Scale className="mr-2 h-4 w-4" />
                  Read from Scale
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full h-11 justify-start">
                  <Camera className="mr-3 h-4 w-4" />
                  Capture Photo
                </Button>
                <Button variant="outline" className="w-full h-11 justify-start">
                  <Printer className="mr-3 h-4 w-4" />
                  Print Packing Slip
                </Button>
                <Button variant="outline" className="w-full h-11 justify-start">
                  <AlertTriangle className="mr-3 h-4 w-4 text-warning" />
                  Report Issue
                </Button>
              </CardContent>
            </Card>

            {/* Complete Packing */}
            <Button
              className="w-full h-14 text-base"
              size="lg"
              disabled={!allVerified || !selectedBox || !weight}
            >
              <PackageCheck className="mr-2 h-5 w-5" />
              Complete & Print Label
            </Button>

            {!allVerified && (
              <p className="text-xs text-center text-muted-foreground">
                Verify all items before completing
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
