"use client"

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
import { MoreHorizontal, ArrowRight } from "lucide-react"

interface Order {
  id: string
  customer: string
  items: number
  status: "new" | "allocated" | "picking" | "packing" | "shipped"
  priority: "normal" | "high" | "urgent"
  time: string
}

const orders: Order[] = [
  { id: "ORD-7842", customer: "Acme Corp", items: 12, status: "picking", priority: "high", time: "10 min ago" },
  { id: "ORD-7841", customer: "TechFlow Inc", items: 5, status: "packing", priority: "urgent", time: "15 min ago" },
  { id: "ORD-7840", customer: "Global Retail", items: 28, status: "allocated", priority: "normal", time: "22 min ago" },
  { id: "ORD-7839", customer: "Prime Supply", items: 8, status: "new", priority: "high", time: "35 min ago" },
  { id: "ORD-7838", customer: "FastShip LLC", items: 3, status: "shipped", priority: "normal", time: "42 min ago" },
]

const statusConfig = {
  new: { label: "New", className: "bg-primary/20 text-primary border-primary/30" },
  allocated: { label: "Allocated", className: "bg-info/20 text-info border-info/30" },
  picking: { label: "Picking", className: "bg-warning/20 text-warning border-warning/30" },
  packing: { label: "Packing", className: "bg-chart-5/20 text-chart-5 border-chart-5/30" },
  shipped: { label: "Shipped", className: "bg-success/20 text-success border-success/30" },
}

const priorityConfig = {
  normal: { label: "Normal", className: "bg-muted text-muted-foreground" },
  high: { label: "High", className: "bg-warning/20 text-warning" },
  urgent: { label: "Urgent", className: "bg-destructive/20 text-destructive" },
}

export function RecentOrders() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
          View All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Order ID</TableHead>
              <TableHead className="text-muted-foreground">Customer</TableHead>
              <TableHead className="text-muted-foreground text-center">Items</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Priority</TableHead>
              <TableHead className="text-muted-foreground text-right">Time</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="border-border hover:bg-secondary/50">
                <TableCell className="font-mono text-sm font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell className="text-center">{order.items}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={statusConfig[order.status].className}
                  >
                    {statusConfig[order.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={priorityConfig[order.priority].className}
                  >
                    {priorityConfig[order.priority].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground text-sm">
                  {order.time}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
