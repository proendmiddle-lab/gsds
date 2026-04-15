"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/wms/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Truck,
  Package,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react"

interface ReceivingItem {
  id: string
  sku: string
  description: string
  expectedQty: number
  receivedQty: number
  uom: "unit" | "case" | "pallet"
  status: "pending" | "partial" | "complete" | "discrepancy"
}

interface Dock {
  id: string
  name: string
  status: "available" | "receiving" | "qc-hold"
  po?: string
  vendor?: string
  progress?: number
}

const docks: Dock[] = [
  { id: "1", name: "Dock 1", status: "receiving", po: "PO-4520", vendor: "Prime Packaging Co", progress: 65 },
  { id: "2", name: "Dock 2", status: "receiving", po: "PO-4521", vendor: "Global Electronics Ltd", progress: 23 },
  { id: "3", name: "Dock 3", status: "qc-hold", po: "PO-4516", vendor: "Quality Hardware LLC", progress: 100 },
  { id: "4", name: "Dock 4", status: "available" },
  { id: "5", name: "Dock 5", status: "available" },
]

const receivingItems: ReceivingItem[] = [
  { id: "1", sku: "SKU-2847", description: "Widget Assembly Kit A", expectedQty: 120, receivedQty: 120, uom: "unit", status: "complete" },
  { id: "2", sku: "SKU-3291", description: "Circuit Board Type B", expectedQty: 48, receivedQty: 36, uom: "case", status: "partial" },
  { id: "3", sku: "SKU-1024", description: "Power Supply Unit 500W", expectedQty: 8, receivedQty: 0, uom: "pallet", status: "pending" },
  { id: "4", sku: "SKU-4567", description: "LED Display Panel 24in", expectedQty: 200, receivedQty: 210, uom: "unit", status: "discrepancy" },
  { id: "5", sku: "SKU-8910", description: "Connector Cable USB-C", expectedQty: 500, receivedQty: 0, uom: "unit", status: "pending" },
]

const statusConfig = {
  pending: { label: "Pending", className: "bg-muted text-muted-foreground" },
  partial: { label: "Partial", className: "bg-warning/20 text-warning" },
  complete: { label: "Complete", className: "bg-success/20 text-success" },
  discrepancy: { label: "Discrepancy", className: "bg-destructive/20 text-destructive" },
}

const dockStatusConfig = {
  available: { label: "Available", className: "bg-success/20 text-success border-success/30" },
  receiving: { label: "Receiving", className: "bg-primary/20 text-primary border-primary/30" },
  "qc-hold": { label: "QC Hold", className: "bg-warning/20 text-warning border-warning/30" },
}

export default function ReceivingDockPage() {
  const [selectedDock, setSelectedDock] = useState(docks[0])
  const [blindMode, setBlindMode] = useState(false)
  const [scanInput, setScanInput] = useState("")
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const updateQuantity = (itemId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta),
    }))
  }

  const totalExpected = receivingItems.reduce((sum, item) => sum + item.expectedQty, 0)
  const totalReceived = receivingItems.reduce((sum, item) => sum + item.receivedQty, 0)
  const progressPercent = Math.round((totalReceived / totalExpected) * 100)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Receiving Dock</h1>
            <p className="text-sm text-muted-foreground">
              Process inbound shipments and verify inventory
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={blindMode ? "default" : "outline"}
              onClick={() => setBlindMode(!blindMode)}
              className="h-11"
            >
              <ScanLine className="mr-2 h-4 w-4" />
              {blindMode ? "Blind Mode ON" : "Blind Mode OFF"}
            </Button>
          </div>
        </div>

        {/* Dock Status Overview */}
        <div className="grid gap-4 md:grid-cols-5">
          {docks.map((dock) => (
            <Card
              key={dock.id}
              className={`cursor-pointer transition-all border-2 ${
                selectedDock.id === dock.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              }`}
              onClick={() => setSelectedDock(dock)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{dock.name}</span>
                  <Badge
                    variant="outline"
                    className={dockStatusConfig[dock.status].className}
                  >
                    {dockStatusConfig[dock.status].label}
                  </Badge>
                </div>
                {dock.status !== "available" ? (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground truncate">{dock.vendor}</p>
                    <p className="text-xs font-mono text-primary">{dock.po}</p>
                    <Progress value={dock.progress} className="h-1.5" />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Ready for assignment</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Receiving Interface */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Item List */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {selectedDock.po || "No Active PO"} - Items
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedDock.vendor}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{progressPercent}%</p>
                    <p className="text-xs text-muted-foreground">
                      {totalReceived.toLocaleString()} / {totalExpected.toLocaleString()} units
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">SKU</TableHead>
                      <TableHead className="text-muted-foreground">Description</TableHead>
                      <TableHead className="text-muted-foreground text-center">UOM</TableHead>
                      {!blindMode && (
                        <TableHead className="text-muted-foreground text-center">Expected</TableHead>
                      )}
                      <TableHead className="text-muted-foreground text-center">Received</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receivingItems.map((item) => (
                      <TableRow key={item.id} className="border-border hover:bg-secondary/50">
                        <TableCell className="font-mono text-sm font-medium">{item.sku}</TableCell>
                        <TableCell className="max-w-48 truncate">{item.description}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-xs capitalize">
                            {item.uom}
                          </Badge>
                        </TableCell>
                        {!blindMode && (
                          <TableCell className="text-center font-medium">{item.expectedQty}</TableCell>
                        )}
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              value={quantities[item.id] ?? item.receivedQty}
                              onChange={(e) =>
                                setQuantities((prev) => ({
                                  ...prev,
                                  [item.id]: parseInt(e.target.value) || 0,
                                }))
                              }
                              className="w-16 h-7 text-center bg-secondary border-border"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig[item.status].className}>
                            {statusConfig[item.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right: Scanner & Actions */}
          <div className="space-y-6">
            {/* Scan Input */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <ScanLine className="h-5 w-5 text-primary" />
                  Scan Barcode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Scan or enter barcode..."
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  className="h-12 text-lg font-mono bg-secondary border-border"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button className="flex-1 h-11">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Confirm Scan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full h-11 justify-start">
                  <Printer className="mr-3 h-4 w-4" />
                  Print All Labels
                </Button>
                <Button variant="outline" className="w-full h-11 justify-start">
                  <AlertTriangle className="mr-3 h-4 w-4 text-warning" />
                  Report Discrepancy
                </Button>
                <Button variant="outline" className="w-full h-11 justify-start">
                  <Package className="mr-3 h-4 w-4" />
                  Send to QC
                </Button>
              </CardContent>
            </Card>

            {/* UOM Conversion */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">UOM Conversion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">From</Label>
                    <Select defaultValue="case">
                      <SelectTrigger className="h-9 bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unit">Unit</SelectItem>
                        <SelectItem value="case">Case</SelectItem>
                        <SelectItem value="pallet">Pallet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">To</Label>
                    <Select defaultValue="unit">
                      <SelectTrigger className="h-9 bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unit">Unit</SelectItem>
                        <SelectItem value="case">Case</SelectItem>
                        <SelectItem value="pallet">Pallet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 text-center">
                  <p className="text-xs text-muted-foreground">Conversion</p>
                  <p className="text-lg font-semibold">1 Case = 24 Units</p>
                </div>
              </CardContent>
            </Card>

            {/* Complete Receiving */}
            <Button className="w-full h-12 text-base" size="lg">
              <Truck className="mr-2 h-5 w-5" />
              Complete Receiving
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
