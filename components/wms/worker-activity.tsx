"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Worker {
  id: string
  name: string
  initials: string
  role: string
  status: "active" | "break" | "idle"
  task: string
  progress: number
  pickRate: number
}

const workers: Worker[] = [
  { id: "1", name: "Mike Johnson", initials: "MJ", role: "Picker", status: "active", task: "Wave #89 - Aisle C", progress: 78, pickRate: 124 },
  { id: "2", name: "Sarah Chen", initials: "SC", role: "Packer", status: "active", task: "Station 3 - ORD-7841", progress: 45, pickRate: 98 },
  { id: "3", name: "James Wilson", initials: "JW", role: "Receiver", status: "active", task: "Dock 2 - PO-4521", progress: 92, pickRate: 87 },
  { id: "4", name: "Emily Davis", initials: "ED", role: "Picker", status: "break", task: "On Break", progress: 0, pickRate: 115 },
  { id: "5", name: "Alex Thompson", initials: "AT", role: "Forklift", status: "active", task: "Zone B Replenishment", progress: 34, pickRate: 45 },
]

const statusConfig = {
  active: { label: "Active", className: "bg-success/20 text-success" },
  break: { label: "Break", className: "bg-warning/20 text-warning" },
  idle: { label: "Idle", className: "bg-muted text-muted-foreground" },
}

export function WorkerActivity() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Active Workers</CardTitle>
          <Badge variant="secondary" className="bg-success/20 text-success">
            {workers.filter(w => w.status === "active").length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {workers.map((worker) => (
          <div
            key={worker.id}
            className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-3"
          >
            <Avatar className="h-10 w-10 border border-border">
              <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                {worker.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{worker.name}</span>
                <Badge variant="outline" className="text-xs border-border">
                  {worker.role}
                </Badge>
                <Badge className={statusConfig[worker.status].className + " text-xs ml-auto"}>
                  {statusConfig[worker.status].label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{worker.task}</p>
              {worker.status === "active" && (
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={worker.progress} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground w-10">{worker.progress}%</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">{worker.pickRate}</p>
              <p className="text-xs text-muted-foreground">picks/hr</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
