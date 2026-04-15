"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/wms/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MoreHorizontal,
  Users,
  Clock,
  TrendingUp,
  Target,
  Coffee,
  Zap,
  Activity,
  MapPin,
} from "lucide-react"

interface Worker {
  id: string
  name: string
  initials: string
  role: "picker" | "packer" | "receiver" | "forklift" | "supervisor"
  status: "active" | "break" | "idle" | "offline"
  currentTask: string
  location: string
  shift: string
  productivity: number
  tasksCompleted: number
  avgTaskTime: string
}

const workers: Worker[] = [
  { id: "1", name: "Mike Johnson", initials: "MJ", role: "picker", status: "active", currentTask: "Wave #89 - Aisle C", location: "Zone C", shift: "Morning", productivity: 124, tasksCompleted: 45, avgTaskTime: "2.3 min" },
  { id: "2", name: "Sarah Chen", initials: "SC", role: "packer", status: "active", currentTask: "ORD-7841 - Station 3", location: "Packing", shift: "Morning", productivity: 98, tasksCompleted: 32, avgTaskTime: "4.1 min" },
  { id: "3", name: "James Wilson", initials: "JW", role: "receiver", status: "active", currentTask: "PO-4521 - Dock 2", location: "Receiving", shift: "Morning", productivity: 87, tasksCompleted: 18, avgTaskTime: "8.2 min" },
  { id: "4", name: "Emily Davis", initials: "ED", role: "picker", status: "break", currentTask: "On Break (10 min)", location: "-", shift: "Morning", productivity: 115, tasksCompleted: 38, avgTaskTime: "2.5 min" },
  { id: "5", name: "Alex Thompson", initials: "AT", role: "forklift", status: "active", currentTask: "Zone B Replenishment", location: "Zone B", shift: "Morning", productivity: 45, tasksCompleted: 12, avgTaskTime: "6.7 min" },
  { id: "6", name: "Lisa Martinez", initials: "LM", role: "packer", status: "idle", currentTask: "Awaiting assignment", location: "Packing", shift: "Morning", productivity: 105, tasksCompleted: 28, avgTaskTime: "3.8 min" },
  { id: "7", name: "David Kim", initials: "DK", role: "picker", status: "active", currentTask: "Wave #90 - Aisle A", location: "Zone A", shift: "Morning", productivity: 132, tasksCompleted: 52, avgTaskTime: "2.1 min" },
  { id: "8", name: "Rachel Brown", initials: "RB", role: "supervisor", status: "active", currentTask: "Floor supervision", location: "All Zones", shift: "Morning", productivity: 0, tasksCompleted: 0, avgTaskTime: "-" },
]

const roleConfig = {
  picker: { label: "Picker", className: "bg-primary/20 text-primary" },
  packer: { label: "Packer", className: "bg-success/20 text-success" },
  receiver: { label: "Receiver", className: "bg-info/20 text-info" },
  forklift: { label: "Forklift", className: "bg-warning/20 text-warning" },
  supervisor: { label: "Supervisor", className: "bg-chart-5/20 text-chart-5" },
}

const statusConfig = {
  active: { label: "Active", className: "bg-success text-success-foreground" },
  break: { label: "Break", className: "bg-warning text-warning-foreground" },
  idle: { label: "Idle", className: "bg-muted text-muted-foreground" },
  offline: { label: "Offline", className: "bg-destructive/20 text-destructive" },
}

export default function LaborPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && worker.status === "active") ||
      (activeTab === "break" && worker.status === "break") ||
      (activeTab === "idle" && (worker.status === "idle" || worker.status === "offline"))
    return matchesSearch && matchesTab
  })

  const stats = {
    totalWorkers: workers.length,
    active: workers.filter((w) => w.status === "active").length,
    onBreak: workers.filter((w) => w.status === "break").length,
    avgProductivity: Math.round(
      workers.filter((w) => w.productivity > 0).reduce((sum, w) => sum + w.productivity, 0) /
        workers.filter((w) => w.productivity > 0).length
    ),
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Labor & Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Real-time worker activity and task management
            </p>
          </div>
          <Button className="h-11">
            Assign Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalWorkers}</p>
                <p className="text-xs text-muted-foreground">Total Workers</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Activity className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active Now</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Coffee className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.onBreak}</p>
                <p className="text-xs text-muted-foreground">On Break</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <Zap className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgProductivity}</p>
                <p className="text-xs text-muted-foreground">Avg Picks/hr</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workers Table */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between">
                <TabsList className="bg-secondary">
                  <TabsTrigger value="all">All Workers</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="break">On Break</TabsTrigger>
                  <TabsTrigger value="idle">Idle/Offline</TabsTrigger>
                </TabsList>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search workers..."
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
                  <TableHead className="text-muted-foreground">Worker</TableHead>
                  <TableHead className="text-muted-foreground">Role</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Current Task</TableHead>
                  <TableHead className="text-muted-foreground">Location</TableHead>
                  <TableHead className="text-muted-foreground text-center">Productivity</TableHead>
                  <TableHead className="text-muted-foreground text-center">Tasks Done</TableHead>
                  <TableHead className="text-muted-foreground">Avg Time</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkers.map((worker) => (
                  <TableRow key={worker.id} className="border-border hover:bg-secondary/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-border">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                            {worker.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{worker.name}</p>
                          <p className="text-xs text-muted-foreground">{worker.shift} Shift</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={roleConfig[worker.role].className + " text-xs"}>
                        {roleConfig[worker.role].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[worker.status].className + " text-xs"}>
                        {statusConfig[worker.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-48 truncate text-sm">
                      {worker.currentTask}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {worker.location}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {worker.productivity > 0 ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-medium">{worker.productivity}</span>
                          <span className="text-xs text-muted-foreground">/hr</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {worker.tasksCompleted > 0 ? worker.tasksCompleted : "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {worker.avgTaskTime}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Assign Task</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuItem>View History</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Productivity Leaderboard */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Top Performers Today
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {workers
                .filter((w) => w.productivity > 0)
                .sort((a, b) => b.productivity - a.productivity)
                .slice(0, 5)
                .map((worker, index) => (
                  <div
                    key={worker.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        index === 0
                          ? "bg-warning text-warning-foreground"
                          : index === 1
                          ? "bg-muted-foreground/20 text-muted-foreground"
                          : index === 2
                          ? "bg-warning/50 text-warning-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {worker.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{worker.name}</p>
                      <p className="text-xs text-muted-foreground">{roleConfig[worker.role].label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{worker.productivity}</p>
                      <p className="text-xs text-muted-foreground">picks/hr</p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Shift Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Total Picks", current: 847, target: 1200, color: "bg-primary" },
                { label: "Orders Packed", current: 89, target: 120, color: "bg-success" },
                { label: "Receiving Complete", current: 3, target: 5, color: "bg-info" },
                { label: "Replenishments", current: 12, target: 15, color: "bg-warning" },
              ].map((goal) => (
                <div key={goal.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{goal.label}</span>
                    <span className="font-medium">
                      {goal.current} / {goal.target}
                    </span>
                  </div>
                  <Progress
                    value={(goal.current / goal.target) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
