"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface Zone {
  id: string
  name: string
  row: number
  col: number
  occupancy: number
  velocity: "high" | "medium" | "low"
  items: number
}

const zones: Zone[] = [
  { id: "A1", name: "Zone A1", row: 0, col: 0, occupancy: 95, velocity: "high", items: 1240 },
  { id: "A2", name: "Zone A2", row: 0, col: 1, occupancy: 82, velocity: "high", items: 980 },
  { id: "A3", name: "Zone A3", row: 0, col: 2, occupancy: 67, velocity: "medium", items: 756 },
  { id: "A4", name: "Zone A4", row: 0, col: 3, occupancy: 45, velocity: "low", items: 432 },
  { id: "B1", name: "Zone B1", row: 1, col: 0, occupancy: 88, velocity: "high", items: 1100 },
  { id: "B2", name: "Zone B2", row: 1, col: 1, occupancy: 72, velocity: "medium", items: 820 },
  { id: "B3", name: "Zone B3", row: 1, col: 2, occupancy: 58, velocity: "medium", items: 645 },
  { id: "B4", name: "Zone B4", row: 1, col: 3, occupancy: 34, velocity: "low", items: 298 },
  { id: "C1", name: "Zone C1", row: 2, col: 0, occupancy: 76, velocity: "medium", items: 892 },
  { id: "C2", name: "Zone C2", row: 2, col: 1, occupancy: 91, velocity: "high", items: 1180 },
  { id: "C3", name: "Zone C3", row: 2, col: 2, occupancy: 23, velocity: "low", items: 187 },
  { id: "C4", name: "Zone C4", row: 2, col: 3, occupancy: 56, velocity: "medium", items: 534 },
  { id: "D1", name: "Zone D1", row: 3, col: 0, occupancy: 41, velocity: "low", items: 367 },
  { id: "D2", name: "Zone D2", row: 3, col: 1, occupancy: 63, velocity: "medium", items: 712 },
  { id: "D3", name: "Zone D3", row: 3, col: 2, occupancy: 85, velocity: "high", items: 1045 },
  { id: "D4", name: "Zone D4", row: 3, col: 3, occupancy: 29, velocity: "low", items: 234 },
]

export function WarehouseHeatmap() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 85) return "bg-destructive/80 hover:bg-destructive"
    if (occupancy >= 70) return "bg-warning/80 hover:bg-warning"
    if (occupancy >= 50) return "bg-primary/80 hover:bg-primary"
    return "bg-success/80 hover:bg-success"
  }

  const getVelocityBadge = (velocity: string) => {
    switch (velocity) {
      case "high":
        return <Badge className="bg-success/20 text-success border-0">High Velocity</Badge>
      case "medium":
        return <Badge className="bg-warning/20 text-warning border-0">Medium</Badge>
      case "low":
        return <Badge className="bg-muted text-muted-foreground border-0">Low</Badge>
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Warehouse Heatmap</CardTitle>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-success/80" />
              <span className="text-muted-foreground">{"<50%"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-primary/80" />
              <span className="text-muted-foreground">50-70%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-warning/80" />
              <span className="text-muted-foreground">70-85%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-destructive/80" />
              <span className="text-muted-foreground">{">85%"}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-4 gap-2">
            {zones.map((zone) => (
              <Tooltip key={zone.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setSelectedZone(zone)}
                    className={cn(
                      "flex h-20 flex-col items-center justify-center rounded-lg border border-border/50 transition-all",
                      getOccupancyColor(zone.occupancy),
                      selectedZone?.id === zone.id && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    )}
                  >
                    <span className="text-sm font-bold text-white">{zone.id}</span>
                    <span className="text-xs text-white/80">{zone.occupancy}%</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="w-48">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{zone.name}</span>
                      {getVelocityBadge(zone.velocity)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Occupancy</span>
                        <p className="font-medium">{zone.occupancy}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Items</span>
                        <p className="font-medium">{zone.items.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {/* Selected Zone Details */}
        {selectedZone && (
          <div className="mt-4 rounded-lg border border-border bg-secondary/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{selectedZone.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedZone.items.toLocaleString()} items stored
                </p>
              </div>
              {getVelocityBadge(selectedZone.velocity)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
