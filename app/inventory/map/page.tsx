"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { DashboardLayout } from "@/components/wms/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Package,
  Layers,
  Weight,
  Clock,
  Edit3,
  Plus,
  Trash2,
  Save,
  X,
  GripVertical,
  Move,
} from "lucide-react"

type BinStatus = "empty" | "occupied" | "near_capacity" | "critical"

interface Bin {
  id: string
  x: number
  y: number
  zone: "A" | "B" | "C" | "D"
  label: string
  status: BinStatus
  occupancy: number
  weight: number
  maxWeight: number
  items: number
  sku?: string
}

interface GridCell {
  x: number
  y: number
  bin: Bin | null
}

// Grid dimensions
const GRID_COLS = 12
const GRID_ROWS = 8

// Generate initial warehouse grid with bins
const generateInitialBins = (): Bin[] => {
  const bins: Bin[] = []
  const zones: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"]
  
  // Create some sample bins
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      const zone = zones[row]
      const occupancy = Math.floor(Math.random() * 100)
      const weight = Math.floor(Math.random() * 450)
      
      let status: BinStatus = "empty"
      if (occupancy > 0 && occupancy < 70) status = "occupied"
      else if (occupancy >= 70 && occupancy < 90) status = "near_capacity"
      else if (occupancy >= 90) status = "critical"
      
      bins.push({
        id: `${zone}${col + 1}-${String(row + 1).padStart(2, "0")}`,
        x: col + 2,
        y: row + 2,
        zone,
        label: `${zone}${col + 1}-${String(row + 1).padStart(2, "0")}`,
        status,
        occupancy,
        weight,
        maxWeight: 500,
        items: Math.floor(Math.random() * 50),
        sku: occupancy > 0 ? `SKU-${Math.floor(Math.random() * 9000) + 1000}` : undefined,
      })
    }
  }
  return bins
}

const getStatusColor = (status: BinStatus) => {
  switch (status) {
    case "empty":
      return "bg-success/60 border-success/80 text-success-foreground"
    case "occupied":
      return "bg-primary/60 border-primary/80 text-primary-foreground"
    case "near_capacity":
      return "bg-warning/60 border-warning/80 text-warning-foreground"
    case "critical":
      return "bg-destructive/60 border-destructive/80 text-destructive-foreground"
  }
}

const getStatusLabel = (status: BinStatus) => {
  switch (status) {
    case "empty":
      return "Empty"
    case "occupied":
      return "Occupied"
    case "near_capacity":
      return "Near Capacity"
    case "critical":
      return "Critical"
  }
}

export default function WarehouseMapPage() {
  const [bins, setBins] = useState<Bin[]>(() => generateInitialBins())
  const [originalBins, setOriginalBins] = useState<Bin[]>([])
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [zoneFilter, setZoneFilter] = useState<string>("all")
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingCell, setEditingCell] = useState<{ x: number; y: number } | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [draggedBin, setDraggedBin] = useState<Bin | null>(null)
  const [dragOverCell, setDragOverCell] = useState<{ x: number; y: number } | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<Bin>>({})
  const gridRef = useRef<HTMLDivElement>(null)

  // Create a grid with cells
  const createGrid = useCallback((): GridCell[][] => {
    const grid: GridCell[][] = []
    for (let y = 0; y < GRID_ROWS; y++) {
      const row: GridCell[] = []
      for (let x = 0; x < GRID_COLS; x++) {
        const bin = bins.find((b) => b.x === x && b.y === y)
        row.push({ x, y, bin: bin || null })
      }
      grid.push(row)
    }
    return grid
  }, [bins])

  const grid = createGrid()

  const getBinAtCell = (x: number, y: number): Bin | undefined => {
    return bins.find((b) => b.x === x && b.y === y)
  }

  const handleEnterEditMode = () => {
    setOriginalBins([...bins])
    setIsEditMode(true)
    setSelectedBin(null)
  }

  const handleCancelEdit = () => {
    setBins(originalBins)
    setIsEditMode(false)
    setSelectedBin(null)
    setEditingCell(null)
  }

  const handleSaveChanges = () => {
    setIsEditMode(false)
    setSelectedBin(null)
    setEditingCell(null)
    // In a real app, this would persist to backend/database
  }

  const handleCellClick = (x: number, y: number) => {
    const existingBin = getBinAtCell(x, y)
    
    if (isEditMode) {
      setEditingCell({ x, y })
      if (existingBin) {
        setEditFormData({ ...existingBin })
      } else {
        // Create new bin form data
        const zone = y < 2 ? "A" : y < 4 ? "B" : y < 6 ? "C" : "D"
        setEditFormData({
          x,
          y,
          zone: zone as "A" | "B" | "C" | "D",
          label: `${zone}${x + 1}-${String(y + 1).padStart(2, "0")}`,
          status: "empty",
          occupancy: 0,
          weight: 0,
          maxWeight: 500,
          items: 0,
        })
      }
      setIsDialogOpen(true)
    } else {
      setSelectedBin(existingBin || null)
    }
  }

  const handleSaveBin = () => {
    if (!editingCell) return

    const existingBinIndex = bins.findIndex(
      (b) => b.x === editingCell.x && b.y === editingCell.y
    )

    const newBin: Bin = {
      id: editFormData.id || `${editFormData.zone}${editingCell.x + 1}-${String(editingCell.y + 1).padStart(2, "0")}`,
      x: editingCell.x,
      y: editingCell.y,
      zone: editFormData.zone || "A",
      label: editFormData.label || "",
      status: editFormData.status || "empty",
      occupancy: editFormData.occupancy || 0,
      weight: editFormData.weight || 0,
      maxWeight: editFormData.maxWeight || 500,
      items: editFormData.items || 0,
      sku: editFormData.sku,
    }

    if (existingBinIndex >= 0) {
      const newBins = [...bins]
      newBins[existingBinIndex] = newBin
      setBins(newBins)
    } else {
      setBins([...bins, newBin])
    }

    setIsDialogOpen(false)
    setEditingCell(null)
    setEditFormData({})
  }

  const handleDeleteBin = () => {
    if (!editingCell) return
    setBins(bins.filter((b) => !(b.x === editingCell.x && b.y === editingCell.y)))
    setIsDialogOpen(false)
    setEditingCell(null)
    setEditFormData({})
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, bin: Bin) => {
    if (!isEditMode) return
    setDraggedBin(bin)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, x: number, y: number) => {
    if (!isEditMode || !draggedBin) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverCell({ x, y })
  }

  const handleDragLeave = () => {
    setDragOverCell(null)
  }

  const handleDrop = (e: React.DragEvent, x: number, y: number) => {
    e.preventDefault()
    if (!isEditMode || !draggedBin) return

    // Check if target cell is empty
    const existingBin = getBinAtCell(x, y)
    if (existingBin && existingBin.id !== draggedBin.id) {
      setDraggedBin(null)
      setDragOverCell(null)
      return
    }

    // Update bin position
    setBins(
      bins.map((b) =>
        b.id === draggedBin.id
          ? { ...b, x, y, label: `${b.zone}${x + 1}-${String(y + 1).padStart(2, "0")}` }
          : b
      )
    )

    setDraggedBin(null)
    setDragOverCell(null)
  }

  const handleDragEnd = () => {
    setDraggedBin(null)
    setDragOverCell(null)
  }

  const filteredBins = bins.filter((bin) => {
    const matchesSearch =
      bin.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bin.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesZone = zoneFilter === "all" || bin.zone === zoneFilter
    return matchesSearch && matchesZone
  })

  const stats = {
    totalBins: bins.length,
    empty: bins.filter((b) => b.status === "empty").length,
    occupied: bins.filter((b) => b.status === "occupied").length,
    nearCapacity: bins.filter((b) => b.status === "near_capacity").length,
    critical: bins.filter((b) => b.status === "critical").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Warehouse Map</h1>
            <p className="text-sm text-muted-foreground">
              Interactive 2D grid view of all storage locations
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditMode ? (
              <>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button onClick={handleEnterEditMode} className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  Edit Warehouse Map
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancelEdit} className="gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Edit Mode Toolbar */}
        {isEditMode && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    <Edit3 className="mr-1 h-3 w-3" />
                    Edit Mode Active
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Click on any cell to add or edit a bin. Drag bins to reposition them.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    Add Bin
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5">
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
                <p className="text-2xl font-bold">{stats.empty}</p>
                <p className="text-xs text-muted-foreground">Empty</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
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
                <p className="text-2xl font-bold">{stats.critical}</p>
                <p className="text-xs text-muted-foreground">Critical</p>
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
                  <CardTitle className="text-lg font-semibold">
                    Floor Plan - Grid View (X: 0-{GRID_COLS - 1}, Y: 0-{GRID_ROWS - 1})
                  </CardTitle>
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
                        <SelectItem value="D">Zone D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <ScrollArea className="h-[500px]">
                    <div ref={gridRef} className="p-4">
                      {/* X-axis labels */}
                      <div className="flex mb-2 ml-8">
                        {Array.from({ length: GRID_COLS }).map((_, x) => (
                          <div
                            key={`x-label-${x}`}
                            className="w-14 h-6 flex items-center justify-center text-xs font-mono text-muted-foreground"
                          >
                            X:{x}
                          </div>
                        ))}
                      </div>
                      
                      {/* Grid */}
                      <div className="flex flex-col gap-1">
                        {grid.map((row, y) => (
                          <div key={`row-${y}`} className="flex items-center gap-1">
                            {/* Y-axis label */}
                            <div className="w-8 h-14 flex items-center justify-center text-xs font-mono text-muted-foreground">
                              Y:{y}
                            </div>
                            
                            {row.map((cell, x) => {
                              const bin = cell.bin
                              const isHighlighted =
                                searchQuery &&
                                bin &&
                                (bin.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  bin.sku?.toLowerCase().includes(searchQuery.toLowerCase()))
                              const isZoneFiltered =
                                zoneFilter !== "all" && bin && bin.zone !== zoneFilter
                              const isDragOver =
                                dragOverCell?.x === x && dragOverCell?.y === y
                              const isSelected = selectedBin?.x === x && selectedBin?.y === y

                              return (
                                <Tooltip key={`cell-${x}-${y}`}>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => handleCellClick(x, y)}
                                      onDragOver={(e) => handleDragOver(e, x, y)}
                                      onDragLeave={handleDragLeave}
                                      onDrop={(e) => handleDrop(e, x, y)}
                                      className={`
                                        relative w-14 h-14 rounded-lg border-2 transition-all text-xs font-medium
                                        flex flex-col items-center justify-center gap-0.5
                                        ${bin
                                          ? `${getStatusColor(bin.status)} ${isZoneFiltered ? "opacity-30" : ""}`
                                          : "bg-muted/20 border-dashed border-border hover:border-primary/50 hover:bg-muted/30"
                                        }
                                        ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}
                                        ${isHighlighted ? "ring-2 ring-info ring-offset-1 ring-offset-background" : ""}
                                        ${isDragOver ? "ring-2 ring-success ring-offset-1 ring-offset-background bg-success/20" : ""}
                                        ${isEditMode ? "cursor-pointer" : bin ? "cursor-pointer" : "cursor-default"}
                                        ${isEditMode && !bin ? "hover:bg-primary/10 hover:border-primary/50" : ""}
                                      `}
                                      draggable={isEditMode && !!bin}
                                      onDragStart={(e) => bin && handleDragStart(e, bin)}
                                      onDragEnd={handleDragEnd}
                                    >
                                      {bin ? (
                                        <>
                                          {isEditMode && (
                                            <Move className="absolute top-0.5 right-0.5 h-3 w-3 text-white/70" />
                                          )}
                                          <span className="font-semibold text-white">{bin.zone}{x + 1}</span>
                                          <span className="text-white/80 text-[10px]">{bin.occupancy}%</span>
                                        </>
                                      ) : isEditMode ? (
                                        <Plus className="h-4 w-4 text-muted-foreground/50" />
                                      ) : null}
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="w-52">
                                    {bin ? (
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <span className="font-semibold font-mono">{bin.label}</span>
                                          <Badge
                                            variant={
                                              bin.status === "critical"
                                                ? "destructive"
                                                : bin.status === "near_capacity"
                                                ? "default"
                                                : "secondary"
                                            }
                                            className="text-xs"
                                          >
                                            {getStatusLabel(bin.status)}
                                          </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                          <div>
                                            <span className="text-muted-foreground">Position</span>
                                            <p className="font-mono">X:{x}, Y:{y}</p>
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">Zone</span>
                                            <p>Zone {bin.zone}</p>
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">Occupancy</span>
                                            <p>{bin.occupancy}%</p>
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">Items</span>
                                            <p>{bin.items}</p>
                                          </div>
                                        </div>
                                        {bin.sku && (
                                          <div className="text-xs font-mono text-muted-foreground">
                                            {bin.sku}
                                          </div>
                                        )}
                                        {isEditMode && (
                                          <p className="text-xs text-primary">Click to edit or drag to move</p>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="space-y-1">
                                        <p className="font-medium">Empty Cell</p>
                                        <p className="text-xs text-muted-foreground font-mono">
                                          Position: X:{x}, Y:{y}
                                        </p>
                                        {isEditMode && (
                                          <p className="text-xs text-primary">Click to add a bin</p>
                                        )}
                                      </div>
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </TooltipProvider>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-6 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded bg-success/60 border border-success/80" />
                    <span className="text-muted-foreground">Empty</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded bg-primary/60 border border-primary/80" />
                    <span className="text-muted-foreground">Occupied</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded bg-warning/60 border border-warning/80" />
                    <span className="text-muted-foreground">Near Capacity</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded bg-destructive/60 border border-destructive/80" />
                    <span className="text-muted-foreground">Critical</span>
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
                      <span className="text-2xl font-bold font-mono">{selectedBin.label}</span>
                      <Badge
                        variant={
                          selectedBin.status === "critical"
                            ? "destructive"
                            : selectedBin.status === "near_capacity"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {getStatusLabel(selectedBin.status)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Position</p>
                        <p className="font-mono font-medium">X:{selectedBin.x}, Y:{selectedBin.y}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Zone</p>
                        <p className="font-medium">Zone {selectedBin.zone}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Occupancy</p>
                        <p className="font-medium">{selectedBin.occupancy}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Items</p>
                        <p className="font-medium">{selectedBin.items}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Weight</p>
                        <p
                          className={`font-medium ${
                            selectedBin.weight > selectedBin.maxWeight * 0.9
                              ? "text-destructive"
                              : ""
                          }`}
                        >
                          {selectedBin.weight} / {selectedBin.maxWeight} kg
                        </p>
                      </div>
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
                      <Button className="flex-1 h-10">View Items</Button>
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

            {/* Zone Summary */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Zone Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(["A", "B", "C", "D"] as const).map((zone) => {
                  const zoneBins = bins.filter((b) => b.zone === zone)
                  const avgOccupancy =
                    zoneBins.length > 0
                      ? Math.round(
                          zoneBins.reduce((sum, b) => sum + b.occupancy, 0) / zoneBins.length
                        )
                      : 0
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

      {/* Edit Bin Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {getBinAtCell(editingCell?.x ?? -1, editingCell?.y ?? -1)
                ? "Edit Bin"
                : "Add New Bin"}
            </DialogTitle>
            <DialogDescription>
              {editingCell && (
                <span className="font-mono">
                  Position: X:{editingCell.x}, Y:{editingCell.y}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zone">Zone</Label>
                <Select
                  value={editFormData.zone || "A"}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, zone: value as "A" | "B" | "C" | "D" })
                  }
                >
                  <SelectTrigger id="zone">
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Zone A</SelectItem>
                    <SelectItem value="B">Zone B</SelectItem>
                    <SelectItem value="C">Zone C</SelectItem>
                    <SelectItem value="D">Zone D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">Bin Label</Label>
                <Input
                  id="label"
                  value={editFormData.label || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, label: e.target.value })}
                  placeholder="e.g., A1-01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editFormData.status || "empty"}
                onValueChange={(value) =>
                  setEditFormData({ ...editFormData, status: value as BinStatus })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empty">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-success/60" />
                      Empty
                    </div>
                  </SelectItem>
                  <SelectItem value="occupied">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-primary/60" />
                      Occupied
                    </div>
                  </SelectItem>
                  <SelectItem value="near_capacity">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-warning/60" />
                      Near Capacity
                    </div>
                  </SelectItem>
                  <SelectItem value="critical">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-destructive/60" />
                      Critical
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupancy">Occupancy (%)</Label>
                <Input
                  id="occupancy"
                  type="number"
                  min={0}
                  max={100}
                  value={editFormData.occupancy ?? 0}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, occupancy: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="items">Items Count</Label>
                <Input
                  id="items"
                  type="number"
                  min={0}
                  value={editFormData.items ?? 0}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, items: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min={0}
                  value={editFormData.weight ?? 0}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, weight: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxWeight">Max Weight (kg)</Label>
                <Input
                  id="maxWeight"
                  type="number"
                  min={0}
                  value={editFormData.maxWeight ?? 500}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, maxWeight: parseInt(e.target.value) || 500 })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU (optional)</Label>
              <Input
                id="sku"
                value={editFormData.sku || ""}
                onChange={(e) => setEditFormData({ ...editFormData, sku: e.target.value })}
                placeholder="e.g., SKU-1234"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {getBinAtCell(editingCell?.x ?? -1, editingCell?.y ?? -1) && (
              <Button
                variant="destructive"
                onClick={handleDeleteBin}
                className="sm:mr-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Bin
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBin}>
              <Save className="mr-2 h-4 w-4" />
              Save Bin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
