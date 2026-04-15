"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Sparkles, ArrowRight, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react"

interface AIInsightCardProps {
  type: "prediction" | "optimization" | "alert"
  title: string
  description: string
  action?: string
  onAction?: () => void
  className?: string
}

export function AIInsightCard({
  type,
  title,
  description,
  action,
  onAction,
  className,
}: AIInsightCardProps) {
  const getTypeConfig = () => {
    switch (type) {
      case "prediction":
        return {
          icon: <TrendingUp className="h-4 w-4" />,
          badge: "Prediction",
          color: "bg-info/10 text-info border-info/20",
          badgeColor: "bg-info/20 text-info",
        }
      case "optimization":
        return {
          icon: <Lightbulb className="h-4 w-4" />,
          badge: "Optimization",
          color: "bg-success/10 text-success border-success/20",
          badgeColor: "bg-success/20 text-success",
        }
      case "alert":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          badge: "Alert",
          color: "bg-warning/10 text-warning border-warning/20",
          badgeColor: "bg-warning/20 text-warning",
        }
    }
  }

  const config = getTypeConfig()

  return (
    <Card className={cn("border bg-card", config.color, className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", config.badgeColor)}>
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={cn("text-xs", config.badgeColor)}>
                {config.icon}
                <span className="ml-1">{config.badge}</span>
              </Badge>
            </div>
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
            {action && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onAction}
                className="h-8 px-0 text-primary hover:text-primary hover:bg-transparent"
              >
                {action}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
