"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const data = [
  { time: "06:00", inbound: 24, outbound: 12 },
  { time: "08:00", inbound: 45, outbound: 28 },
  { time: "10:00", inbound: 67, outbound: 89 },
  { time: "12:00", inbound: 53, outbound: 102 },
  { time: "14:00", inbound: 78, outbound: 95 },
  { time: "16:00", inbound: 92, outbound: 78 },
  { time: "18:00", inbound: 56, outbound: 45 },
  { time: "20:00", inbound: 34, outbound: 23 },
]

export function ActivityChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Inbound / Outbound Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="inboundGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.62 0.19 250)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.62 0.19 250)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outboundGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.70 0.17 163)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.70 0.17 163)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.25 0.01 285)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.65 0.01 285)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.65 0.01 285)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.16 0.01 285)",
                  border: "1px solid oklch(0.25 0.01 285)",
                  borderRadius: "8px",
                  color: "oklch(0.93 0.01 285)",
                }}
                labelStyle={{ color: "oklch(0.65 0.01 285)" }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => (
                  <span style={{ color: "oklch(0.93 0.01 285)", fontSize: "12px" }}>
                    {value === "inbound" ? "Inbound" : "Outbound"}
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="inbound"
                stroke="oklch(0.62 0.19 250)"
                strokeWidth={2}
                fill="url(#inboundGradient)"
              />
              <Area
                type="monotone"
                dataKey="outbound"
                stroke="oklch(0.70 0.17 163)"
                strokeWidth={2}
                fill="url(#outboundGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
