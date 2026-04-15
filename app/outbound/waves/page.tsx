"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/wms/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Plus,
  MoreHorizontal,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Users,
  Package,
  Layers,
  Zap,
  Target,
} from "lucide-react"

interface Wave {
  id: string
  name: string
  status: "planning" | "released" | "in-progress" | "completed"
  orders: number
  items: number
  lines: number
  pickers: string[]
  startTime?: string
  estimatedEnd?: string
  progress: number
  zone: string
  priority: "normal" | "high"
}

const waves: Wave[] = [
  { id: "W-89", name: "Morning Wave 1", status: "in-progress", orders: 8, items: 156, lines: 42, pickers: ["MJ", "JW"], startTime: "08:30 AM", estimatedEnd: "10:15 AM", progress: 72, zone: "A, B", priority: "high" },
  { id: "W-90", name: "Morning Wave 2", status: "released", orders: 12, items: 234, lines: 67, pickers: ["SC", "ED"], startTime: "10:30 AM", estimatedEnd: "12:45 PM", progress: 0, zone: "C, D", priority: "normal" },
  { id: "W-91", name: "Afternoon Priority", status: "planning", orders: 5, items: 89, lines: 23, pickers: [], progress: 0, zone: "A", priority: "high" },
  { id: "W-88", name: "Express Orders", status: "completed", orders: 6, items: 78, lines: 18, pickers: ["AT", "MJ"], startTime: "06:00 AM", estimatedEnd: "07:45 AM", progress: 100, zone: "B", priority: "high" },
  { id: "W-87", name: "B2B Batch", status: "completed", orders: 15, items: 312, lines: 89, pickers: ["JW", "SC", "ED"], startTime: "Yesterday", estimatedEnd: "Yesterday", progress: 100, zone: "All", priority: "normal" },
]

const statusConfig = {
  planning: { label: "Planning", className: "bg-muted text-muted-foreground" },
  released: { label: "Released", className: "bg-info/20 text-info" },
  "in-progress": { label: "In Progress", className: "bg-warning/20 text-warning" },
  completed: { label: "Completed", className: "bg-success/20 text-success" },
}

interface WaveCardProps {
  wave: Wave
  isSelected: boolean
  onClick: () => void
}

function WaveCard({ wave, isSelected, onClick }: WaveCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/50"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-primary">{wave.id}</span>
              {wave.priority === "high" && (
                <Zap className="h-4 w-4 text-warning" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{wave.name}</p>
          </div>
          <Badge className={statusConfig[wave.status].className}>
            {statusConfig[wave.status].label}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-3 text-center">
          <div>
            <p className="text-lg font-bold">{wave.orders}</p>
            <p className="text-xs text-muted-foreground">Orders</p>
          </div>
          <div>
            <p className="text-lg font-bold">{wave.items}</p>
            <p className="text-xs text-muted-foreground">Items</p>
          </div>
          <div>
            <p className="text-lg font-bold">{wave.lines}</p>
            <p className="text-xs text-muted-foreground">Lines</p>
          </div>
        </div>

        {wave.status !== "planning" && wave.status !== "completed" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{wave.progress}%</span>
            </div>
            <Progress value={wave.progress} className="h-1.5" />
          </div>
        )}

        {wave.pickers.length > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <div className="flex -space-x-2">
              {wave.pickers.map((picker) => (
                <Avatar key={picker} className="h-6 w-6 border-2 border-card">
                  <AvatarFallback className="text-xs bg-primary/20 text-primary">
                    {picker}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {wave.pickers.length} picker{wave.pickers.length > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function WavePlanningPage() {
  const [selectedWave, setSelectedWave] = useState<Wave | null>(waves[0])

  const stats = {
    activeWaves: waves.filter((w) => w.status === "in-progress").length,
    totalOrders: waves.filter((w) => w.status !== "completed").reduce((sum, w) => sum + w.orders, 0),
    totalItems: waves.filter((w) => w.status !== "completed").reduce((sum, w) => sum + w.items, 0),
    activePickers: 4,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Wave Planning</h1>
            <p className="text-sm text-muted-foreground">
              Group orders into efficient picking waves
            </p>
          </div>
          <Button className="h-11">
            <Plus className="mr-2 h-4 w-4" />
            Create Wave
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeWaves}</p>
                <p className="text-xs text-muted-foreground">Active Waves</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Package className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
                <p className="text-xs text-muted-foreground">Pending Orders</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <Target className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
                <p className="text-xs text-muted-foreground">Items to Pick</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activePickers}</p>
                <p className="text-xs text-muted-foreground">Active Pickers</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Wave Cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Waves</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Sorted by priority</span>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {waves.map((wave) => (
                <WaveCard
                  key={wave.id}
                  wave={wave}
                  isSelected={selectedWave?.id === wave.id}
                  onClick={() => setSelectedWave(wave)}
                />
              ))}
            </div>
          </div>

          {/* Wave Details */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Wave Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedWave ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold font-mono text-primary">
                          {selectedWave.id}
                        </span>
                        <p className="text-sm text-muted-foreground">{selectedWave.name}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Wave</DropdownMenuItem>
                          <DropdownMenuItem>Add Orders</DropdownMenuItem>
                          <DropdownMenuItem>Assign Pickers</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete Wave</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <Badge className={statusConfig[selectedWave.status].className + " w-full justify-center py-1"}>
                      {statusConfig[selectedWave.status].label}
                    </Badge>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Zone</p>
                        <p className="font-medium">{selectedWave.zone}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Priority</p>
                        <p className="font-medium capitalize">{selectedWave.priority}</p>
                      </div>
                      {selectedWave.startTime && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Start Time</p>
                          <p className="font-medium">{selectedWave.startTime}</p>
                        </div>
                      )}
                      {selectedWave.estimatedEnd && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Est. End</p>
                          <p className="font-medium">{selectedWave.estimatedEnd}</p>
                        </div>
                      )}
                    </div>

                    {selectedWave.status === "in-progress" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{selectedWave.progress}%</span>
                        </div>
                        <Progress value={selectedWave.progress} className="h-2" />
                      </div>
                    )}

                    {selectedWave.pickers.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Assigned Pickers</p>
                        <div className="flex gap-2">
                          {selectedWave.pickers.map((picker) => (
                            <div
                              key={picker}
                              className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2"
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-primary/20 text-primary">
                                  {picker}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{picker}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {selectedWave.status === "planning" && (
                        <Button className="flex-1 h-10">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Release Wave
                        </Button>
                      )}
                      {selectedWave.status === "released" && (
                        <Button className="flex-1 h-10">
                          <Play className="mr-2 h-4 w-4" />
                          Start Wave
                        </Button>
                      )}
                      {selectedWave.status === "in-progress" && (
                        <>
                          <Button variant="outline" className="flex-1 h-10">
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </Button>
                          <Button className="flex-1 h-10">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Complete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Select a wave to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Orders in Wave */}
            {selectedWave && (
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    Orders in {selectedWave.id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {["ORD-7842", "ORD-7837", "ORD-7840"].slice(0, 3).map((orderId) => (
                      <div
                        key={orderId}
                        className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                      >
                        <span className="font-mono text-sm font-medium text-primary">
                          {orderId}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {Math.floor(Math.random() * 20) + 5} items
                        </Badge>
                      </div>
                    ))}
                    {selectedWave.orders > 3 && (
                      <Button variant="ghost" className="w-full h-9 text-primary">
                        View all {selectedWave.orders} orders
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
