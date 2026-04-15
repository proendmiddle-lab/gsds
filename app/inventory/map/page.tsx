"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/wms/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Package,
  Layers,
  Weight,
  Thermometer,
  Clock,
} from "lucide-react"

interface Bin {
  id: string
  aisle: string
  rack: string
  level: string
  occupancy: number
  weight: number
  maxWeight: number
  temperature?: number
  items: number
  sku?: string
  zone: "A" | "B" | "C" | "D"
}

// Generate warehouse grid
const generateWarehouseGrid = (): Bin[] => {
  const bins: Bin[] = []
  const aisles = ["A", "B", "C", "D"]
  const racks = ["1", "2", "3", "4", "5", "6", "7", "8"]
  const levels = ["01", "02", "03", "04"]

  aisles.forEach((aisle) => {
    racks.forEach((rack) => {
      levels.forEach((level) => {
        const occupancy = Math.floor(Math.random() * 100)
        const weight = Math.floor(Math.random() * 450)
        bins.push({
          id: `${aisle}${rack}-${level}`,
          aisle,
          rack,
          level,
          occupancy,
          weight,
          maxWeight: 500,
          temperature: aisle === "D" ? Math.floor(Math.random() * 10) - 5 : undefined,
          items: Math.floor(Math.random() * 50),
          sku: occupancy > 0 ? `SKU-${Math.floor(Math.random() * 9000) + 1000}` : undefined,
          zone: aisle as "A" | "B" | "C" | "D",
        })
      })
    })
  })
  return bins
}

const bins = generateWarehouseGrid()

interface BinCellProps {
  bin: Bin
  isSelected: boolean
  onClick: () => void
}

function BinCell({ bin, isSelected, onClick }: BinCellProps) {
  const getOccupancyColor = (occupancy: number) => {
    if (occupancy === 0) return "bg-muted/30 border-border"
    if (occupancy >= 90) return "bg-destructive/60 border-destructive/80"
    if (occupancy >= 70) return "bg-warning/60 border-warning/80"
    if (occupancy >= 40) return "bg-primary/60 border-primary/80"
    return "bg-success/60 border-success/80"
  }

  const isOverweight = bin.weight > bin.maxWeight * 0.9

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`
            relative h-8 w-8 rounded border transition-all text-xs font-medium
            ${getOccupancyColor(bin.occupancy)}
            ${isSelected ? "ring-2 ring-primary ring-offset-1 ring-offset-background scale-110 z-10" : "hover:scale-105"}
            ${bin.occupancy === 0 ? "text-muted-foreground/50" : "text-white"}
          `}
        >
          {bin.level}
          {isOverweight && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="w-48">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold font-mono">{bin.id}</span>
            <Badge variant={bin.occupancy === 0 ? "secondary" : "default"} className="text-xs">
              {bin.occupancy}% Full
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              <span>{bin.items} items</span>
            </div>
            <div className="flex items-center gap-1">
              <Weight className="h-3 w-3" />
              <span className={isOverweight ? "text-destructive" : ""}>
                {bin.weight}kg
              </span>
            </div>
          </div>
          {bin.sku && (
            <div className="text-xs text-muted-foreground font-mono">{bin.sku}</div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

export default function WarehouseMapPage() {
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [zoneFilter, setZoneFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"occupancy" | "weight" | "temperature">("occupancy")

  const filteredBins = bins.filter((bin) => {
    const matchesSearch =
      bin.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bin.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesZone = zoneFilter === "all" || bin.zone === zoneFilter
    return matchesSearch && matchesZone
  })

  const groupedBins = filteredBins.reduce((acc, bin) => {
    const key = `${bin.aisle}${bin.rack}`
    if (!acc[key]) acc[key] = []
    acc[key].push(bin)
    return acc
  }, {} as Record<string, Bin[]>)

  const stats = {
    totalBins: bins.length,
    occupied: bins.filter((b) => b.occupancy > 0).length,
    nearCapacity: bins.filter((b) => b.occupancy >= 90).length,
    overweight: bins.filter((b) => b.weight > b.maxWeight * 0.9).length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Warehouse Map</h1>
            <p className="text-sm text-muted-foreground">
              Interactive 2D view of all storage locations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalBins}</p>
                <p className="text-xs text-muted-foreground">Total Bins</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Package className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.occupied}</p>
                <p className="text-xs text-muted-foreground">Occupied</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Package className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.nearCapacity}</p>
                <p className="text-xs text-muted-foreground">Near Capacity</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <Weight className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.overweight}</p>
                <p className="text-xs text-muted-foreground">Overweight Alert</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Map Area */}
          <div className="lg:col-span-3">
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Floor Plan - Level View</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search bin or SKU..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-48 h-9 bg-secondary border-border"
                      />
                    </div>
                    <Select value={zoneFilter} onValueChange={setZoneFilter}>
                      <SelectTrigger className="w-28 h-9 bg-secondary border-border">
                        <SelectValue placeholder="Zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Zones</SelectItem>
                        <SelectItem value="A">Zone A</SelectItem>
                        <SelectItem value="B">Zone B</SelectItem>
                        <SelectItem value="C">Zone C</SelectItem>
                        <SelectItem value="D">Zone D (Cold)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-6 p-4">
                      {/* Zone Labels */}
                      {["A", "B", "C", "D"].map((zone) => {
                        if (zoneFilter !== "all" && zoneFilter !== zone) return null
                        const zoneRacks = Object.entries(groupedBins).filter(
                          ([key]) => key.startsWith(zone)
                        )
                        if (zoneRacks.length === 0) return null

                        return (
                          <div key={zone} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-sm">
                                {zone === "D" && <Thermometer className="mr-1 h-3 w-3 text-info" />}
                                Zone {zone}
                                {zone === "D" && " (Cold Storage)"}
                              </Badge>
                              <div className="flex-1 h-px bg-border" />
                            </div>
                            <div className="flex flex-wrap gap-4">
                              {zoneRacks.map(([rackId, rackBins]) => (
                                <div key={rackId} className="space-y-1">
                                  <div className="text-xs font-medium text-muted-foreground text-center">
                                    {rackId}
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    {rackBins
                                      .sort((a, b) => b.level.localeCompare(a.level))
                                      .map((bin) => (
                                        <BinCell
                                          key={bin.id}
                                          bin={bin}
                                          isSelected={selectedBin?.id === bin.id}
                                          onClick={() => setSelectedBin(bin)}
                                        />
                                      ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </TooltipProvider>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-6 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded bg-muted/30 border border-border" />
                    <span className="text-muted-foreground">Empty</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded bg-success/60" />
                    <span className="text-muted-foreground">{"<40%"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded bg-primary/60" />
                    <span className="text-muted-foreground">40-70%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded bg-warning/60" />
                    <span className="text-muted-foreground">70-90%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded bg-destructive/60" />
                    <span className="text-muted-foreground">{">90%"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bin Details */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Bin Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedBin ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold font-mono">{selectedBin.id}</span>
                      <Badge
                        variant={selectedBin.occupancy >= 90 ? "destructive" : selectedBin.occupancy >= 70 ? "default" : "secondary"}
                      >
                        {selectedBin.occupancy}% Full
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Zone</p>
                        <p className="font-medium">Zone {selectedBin.zone}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Items</p>
                        <p className="font-medium">{selectedBin.items}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Weight</p>
                        <p className={`font-medium ${selectedBin.weight > selectedBin.maxWeight * 0.9 ? "text-destructive" : ""}`}>
                          {selectedBin.weight} / {selectedBin.maxWeight} kg
                        </p>
                      </div>
                      {selectedBin.temperature !== undefined && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Temperature</p>
                          <p className="font-medium text-info">{selectedBin.temperature}°C</p>
                        </div>
                      )}
                    </div>

                    {selectedBin.sku && (
                      <div className="p-3 rounded-lg bg-secondary/50">
                        <p className="text-xs text-muted-foreground">Primary SKU</p>
                        <p className="font-mono font-medium text-primary">{selectedBin.sku}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 h-10">
                        <Clock className="mr-2 h-4 w-4" />
                        History
                      </Button>
                      <Button className="flex-1 h-10">
                        View Items
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Select a bin to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Zone Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {["A", "B", "C", "D"].map((zone) => {
                  const zoneBins = bins.filter((b) => b.zone === zone)
                  const avgOccupancy = Math.round(
                    zoneBins.reduce((sum, b) => sum + b.occupancy, 0) / zoneBins.length
                  )
                  return (
                    <div key={zone} className="flex items-center justify-between">
                      <span className="text-sm">Zone {zone}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              avgOccupancy >= 80
                                ? "bg-warning"
                                : avgOccupancy >= 50
                                ? "bg-primary"
                                : "bg-success"
                            }`}
                            style={{ width: `${avgOccupancy}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-10">
                          {avgOccupancy}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
