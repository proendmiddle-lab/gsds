"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/wms/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Lightbulb,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  MapPin,
  Zap,
  Play,
  RotateCcw,
} from "lucide-react"

interface SlottingRecommendation {
  id: string
  sku: string
  description: string
  currentLocation: string
  suggestedLocation: string
  reason: string
  impact: "high" | "medium" | "low"
  timeSaved: string
  velocity: number
  selected: boolean
}

const recommendations: SlottingRecommendation[] = [
  { id: "1", sku: "SKU-1024", description: "Power Supply Unit 500W", currentLocation: "D4-A2-01", suggestedLocation: "A1-B1-01", reason: "High velocity item in slow zone", impact: "high", timeSaved: "23% faster", velocity: 156, selected: false },
  { id: "2", sku: "SKU-2847", description: "Widget Assembly Kit A", currentLocation: "C3-D4-02", suggestedLocation: "A2-C1-02", reason: "Frequently co-picked with SKU-3291", impact: "high", timeSaved: "18% faster", velocity: 142, selected: false },
  { id: "3", sku: "SKU-7654", description: "USB-C Connector Cable 1m", currentLocation: "B4-A3-04", suggestedLocation: "A1-A2-01", reason: "Top 10 picked item in suboptimal location", impact: "medium", timeSaved: "15% faster", velocity: 128, selected: false },
  { id: "4", sku: "SKU-4567", description: "LED Display Panel 24in", currentLocation: "D2-B1-03", suggestedLocation: "B1-C2-01", reason: "Heavy item should be at ground level", impact: "medium", timeSaved: "Ergonomic", velocity: 98, selected: false },
  { id: "5", sku: "SKU-9876", description: "Cooling Fan 120mm RGB", currentLocation: "A1-D4-04", suggestedLocation: "C2-A1-02", reason: "Low velocity item occupying prime space", impact: "low", timeSaved: "Free prime slot", velocity: 23, selected: false },
  { id: "6", sku: "SKU-3291", description: "Circuit Board Type B", currentLocation: "D1-C3-02", suggestedLocation: "A2-C1-03", reason: "Frequently co-picked with SKU-2847", impact: "high", timeSaved: "18% faster", velocity: 134, selected: false },
]

const impactConfig = {
  high: { label: "High Impact", className: "bg-success/20 text-success" },
  medium: { label: "Medium", className: "bg-warning/20 text-warning" },
  low: { label: "Low", className: "bg-muted text-muted-foreground" },
}

export default function SlottingPage() {
  const [items, setItems] = useState(recommendations)
  const [showApplied, setShowApplied] = useState(false)

  const toggleSelect = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    )
  }

  const toggleSelectAll = () => {
    const allSelected = items.every((item) => item.selected)
    setItems((prev) => prev.map((item) => ({ ...item, selected: !allSelected })))
  }

  const selectedCount = items.filter((item) => item.selected).length
  const highImpactCount = items.filter((item) => item.impact === "high").length

  const stats = {
    totalRecommendations: recommendations.length,
    highImpact: highImpactCount,
    potentialSavings: "4.2 hrs/day",
    optimizationScore: 73,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Slotting Optimizer</h1>
            <p className="text-sm text-muted-foreground">
              AI-driven recommendations to optimize item placement
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-11">
              <RotateCcw className="mr-2 h-4 w-4" />
              Refresh Analysis
            </Button>
            <Button className="h-11" disabled={selectedCount === 0}>
              <Play className="mr-2 h-4 w-4" />
              Apply {selectedCount > 0 ? `(${selectedCount})` : ""}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalRecommendations}</p>
                <p className="text-xs text-muted-foreground">Recommendations</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Zap className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.highImpact}</p>
                <p className="text-xs text-muted-foreground">High Impact</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.potentialSavings}</p>
                <p className="text-xs text-muted-foreground">Potential Savings</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Optimization Score</span>
                <span className="text-xs font-medium">{stats.optimizationScore}%</span>
              </div>
              <Progress value={stats.optimizationScore} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">Target: 90%</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Banner */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">AI Analysis Complete</h3>
                <p className="text-sm text-muted-foreground">
                  Based on 30 days of pick data, order patterns, and velocity analysis. 
                  Implementing high-impact changes could reduce average pick time by 18%.
                </p>
              </div>
              <Button variant="outline" className="h-10">
                View Full Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations Table */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Slotting Recommendations</CardTitle>
              {selectedCount > 0 && (
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {selectedCount} selected
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-10">
                    <Checkbox
                      checked={items.every((item) => item.selected)}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-muted-foreground">SKU</TableHead>
                  <TableHead className="text-muted-foreground">Description</TableHead>
                  <TableHead className="text-muted-foreground">Current</TableHead>
                  <TableHead className="text-muted-foreground w-10"></TableHead>
                  <TableHead className="text-muted-foreground">Suggested</TableHead>
                  <TableHead className="text-muted-foreground">Reason</TableHead>
                  <TableHead className="text-muted-foreground">Impact</TableHead>
                  <TableHead className="text-muted-foreground">Velocity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.id}
                    className={`border-border ${
                      item.selected ? "bg-primary/5" : "hover:bg-secondary/50"
                    }`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={item.selected}
                        onCheckedChange={() => toggleSelect(item.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium text-primary">
                      {item.sku}
                    </TableCell>
                    <TableCell className="max-w-40 truncate">{item.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-mono text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {item.currentLocation}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-mono text-sm text-success font-medium">
                        <MapPin className="h-3 w-3" />
                        {item.suggestedLocation}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-48">
                      <p className="text-sm text-muted-foreground truncate">{item.reason}</p>
                      <p className="text-xs text-success font-medium">{item.timeSaved}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={impactConfig[item.impact].className}>
                        {impactConfig[item.impact].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className={`h-3 w-3 ${item.velocity > 100 ? "text-success" : "text-muted-foreground"}`} />
                        <span className="text-sm font-medium">{item.velocity}</span>
                        <span className="text-xs text-muted-foreground">/day</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recently Applied */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Recently Applied
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                View History
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { sku: "SKU-5432", from: "A1-B2-01", to: "D3-C1-02", date: "2 days ago", savings: "12% faster picks" },
                { sku: "SKU-8910", from: "B2-D1-03", to: "A1-A1-01", date: "5 days ago", savings: "21% faster picks" },
                { sku: "SKU-6789", from: "C4-A2-04", to: "B2-B2-02", date: "1 week ago", savings: "8% faster picks" },
              ].map((change, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-mono text-sm font-medium">{change.sku}</p>
                      <p className="text-xs text-muted-foreground">
                        {change.from} → {change.to}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-success font-medium">{change.savings}</p>
                    <p className="text-xs text-muted-foreground">{change.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
