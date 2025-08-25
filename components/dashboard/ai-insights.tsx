"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Target,
  DollarSign,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Brain,
} from "lucide-react"

interface Insight {
  id: string
  type: "suggestion" | "alert" | "opportunity" | "achievement"
  title: string
  description: string
  impact: string
  action?: string
  priority: "high" | "medium" | "low"
  category: string
}

const insights: Insight[] = [
  {
    id: "1",
    type: "suggestion",
    title: "Cut dining expenses by 15%",
    description:
      "You've spent ₹12,600 on dining this month, which is 23% above your budget. Consider meal planning to reduce costs.",
    impact: "Save ₹1,890/month",
    action: "Set dining budget",
    priority: "high",
    category: "Spending",
  },
  {
    id: "2",
    type: "opportunity",
    title: "Increase SIP investment",
    description:
      "Based on your current savings rate, you could increase your SIP by ₹15,000/month without affecting your lifestyle.",
    impact: "Extra ₹18,00,000 in 10 years",
    action: "Increase SIP",
    priority: "medium",
    category: "Investment",
  },
  {
    id: "3",
    type: "alert",
    title: "Emergency fund goal achieved",
    description:
      "Congratulations! You've reached 85% of your emergency fund target. Consider allocating surplus to investments.",
    impact: "Financial security improved",
    action: "Reallocate funds",
    priority: "low",
    category: "Savings",
  },
  {
    id: "4",
    type: "suggestion",
    title: "Switch to a high-yield savings account",
    description: "Your current savings account offers 3% APY. You could earn 7% APY with a high-yield account.",
    impact: "Extra ₹33,750/year",
    action: "Compare accounts",
    priority: "medium",
    category: "Banking",
  },
]

function InsightCard({ insight }: { insight: Insight }) {
  const getIcon = () => {
    switch (insight.type) {
      case "suggestion":
        return <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
      case "opportunity":
        return <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
      case "achievement":
        return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
      default:
        return <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
    }
  }

  const getIconColor = () => {
    switch (insight.type) {
      case "suggestion":
        return "text-primary bg-primary/10 border border-primary/20"
      case "opportunity":
        return "text-chart-4 bg-chart-4/10 border border-chart-4/20"
      case "alert":
        return "text-secondary bg-secondary/10 border border-secondary/20"
      case "achievement":
        return "text-chart-3 bg-chart-3/10 border border-chart-3/20"
      default:
        return "text-muted-foreground bg-muted border border-border"
    }
  }

  const getPriorityColor = () => {
    switch (insight.priority) {
      case "high":
        return "bg-chart-5/10 text-chart-5 border border-chart-5/20"
      case "medium":
        return "bg-secondary/10 text-secondary border border-secondary/20"
      case "low":
        return "bg-chart-4/10 text-chart-4 border border-chart-4/20"
      default:
        return "bg-muted text-muted-foreground border border-border"
    }
  }

  return (
    <div className="border border-border/50 rounded-xl p-3 sm:p-4 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 bg-card/50 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className={`p-2 sm:p-2.5 rounded-xl flex-shrink-0 ${getIconColor()}`}>{getIcon()}</div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-foreground text-sm sm:text-base font-sans mb-2">{insight.title}</h4>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground border border-border/50">
                {insight.category}
              </Badge>
              <Badge className={`text-xs ${getPriorityColor()}`}>{insight.priority}</Badge>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">{insight.description}</p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-chart-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-chart-4">{insight.impact}</span>
        </div>
        {insight.action && (
          <Button
            size="sm"
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-colors w-full sm:w-auto bg-transparent text-xs"
          >
            {insight.action}
            <ArrowRight className="h-3 w-3 ml-1 sm:ml-2 flex-shrink-0" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default function AIInsights() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/10">
              <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg sm:text-xl font-bold text-foreground font-sans">
                AI Financial Insights
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Personalized recommendations to improve your financial health
              </p>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border border-primary/20 self-start sm:self-center">
            <Target className="h-3 w-3 mr-1" />4 insights
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>

        <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-br from-primary/5 via-primary/3 to-secondary/5 rounded-xl border border-primary/10">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/20">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground text-sm sm:text-base font-sans mb-1">
                Weekly Financial Health Score
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Your financial health has improved by 12% this month!
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-2xl sm:text-3xl font-bold text-primary">85</div>
              <div className="text-xs text-muted-foreground">out of 100</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
