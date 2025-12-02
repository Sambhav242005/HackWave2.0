import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, DollarSign, Target, Box } from "lucide-react"

interface ProductViewProps {
  data: any
}

export function ProductView({ data }: ProductViewProps) {
  if (!data) return null

  const features = data.product_data?.features || []

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-card p-6 rounded-lg border border-border/50 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Box className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{data.product_data?.name || "Product Concept"}</h3>
              <p className="text-muted-foreground">{data.product_data?.description}</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div>
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Key Features
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature: any, index: number) => (
              <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex justify-between items-start gap-2">
                    {feature.name || feature}
                  </CardTitle>
                  {feature.reason && (
                    <CardDescription className="text-xs mt-1">
                      {feature.reason}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Metrics */}
                    <div className="flex flex-wrap gap-2">
                      {feature.development_time && (
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                          <Clock className="w-3 h-3" />
                          {feature.development_time}
                        </Badge>
                      )}
                      {feature.cost_estimate && (
                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                          <DollarSign className="w-3 h-3" />
                          ${feature.cost_estimate}
                        </Badge>
                      )}
                    </div>

                    {/* Goal Score */}
                    {feature.goal_oriented !== undefined && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Goal Alignment</span>
                          <span>{Math.round(feature.goal_oriented * 100)}%</span>
                        </div>
                        <Progress value={feature.goal_oriented * 100} className="h-1.5" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Diagram Section */}
        {data.diagram_url && (
          <div className="bg-card p-4 rounded-lg border border-border/50 shadow-sm">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Box className="w-5 h-5" />
              System Architecture
            </h4>
            <div className="rounded-lg overflow-hidden border border-border/50">
              <img src={data.diagram_url} alt="Product Diagram" className="w-full h-auto bg-muted/50" />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
