"use client"

import { DashboardLayout } from "@/components/wms/dashboard-layout"
import { KPICard } from "@/components/wms/kpi-card"
import { AIInsightCard } from "@/components/wms/ai-insight-card"
import { WarehouseHeatmap } from "@/components/wms/warehouse-heatmap"
import { ActivityChart } from "@/components/wms/activity-chart"
import { RecentOrders } from "@/components/wms/recent-orders"
import { WorkerActivity } from "@/components/wms/worker-activity"
import {
  Warehouse,
  PackageCheck,
  Users,
  TrendingUp,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Real-time warehouse operations overview
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last updated</p>
            <p className="text-sm font-medium">Just now</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Warehouse Capacity"
            value="78.4%"
            change={2.3}
            changeLabel="vs last week"
            trend="up"
            icon={<Warehouse className="h-5 w-5" />}
          />
          <KPICard
            title="Order Fulfillment Rate"
            value="96.8%"
            change={1.2}
            changeLabel="vs last week"
            trend="up"
            icon={<PackageCheck className="h-5 w-5" />}
          />
          <KPICard
            title="Active Workers"
            value="42"
            subtitle="8 on break"
            icon={<Users className="h-5 w-5" />}
          />
          <KPICard
            title="Today&apos;s Throughput"
            value="1,847"
            change={12.5}
            changeLabel="units processed"
            trend="up"
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>

        {/* AI Insights */}
        <div className="grid gap-4 md:grid-cols-3">
          <AIInsightCard
            type="prediction"
            title="Stock Depletion Warning"
            description="SKU-2847 (Widget Assembly Kit) projected to run out in 3 days based on current order velocity."
            action="View Stock Details"
          />
          <AIInsightCard
            type="optimization"
            title="Slotting Recommendation"
            description="Move SKU-1024 from Zone D to Zone A1 to reduce average pick time by 23%."
            action="Apply Suggestion"
          />
          <AIInsightCard
            type="alert"
            title="Dock Congestion Alert"
            description="Dock 3 has 4 overlapping appointments scheduled for tomorrow between 9-11 AM."
            action="Review Schedule"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <ActivityChart />
            <RecentOrders />
          </div>

          {/* Right Column - Heatmap & Workers */}
          <div className="space-y-6">
            <WarehouseHeatmap />
            <WorkerActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
