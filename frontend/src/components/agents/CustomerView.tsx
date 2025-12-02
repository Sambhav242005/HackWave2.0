import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, AlertTriangle, CheckCircle } from "lucide-react"

interface CustomerViewProps {
  data: any
}

export function CustomerView({ data }: CustomerViewProps) {
  if (!data || !data.customer_data) return null
  
  // Handle nested structure if present (sometimes it's under market_analysis)
  const analysis = data.customer_data.market_analysis || data.customer_data

  // Helper to safely render content
  const renderSafe = (content: any) => {
      if (typeof content === 'string') return content;
      if (typeof content === 'object' && content !== null) {
          // If it's an object, try to find a meaningful string or join keys
          const keys = Object.keys(content);
          if (keys.length === 1) return keys[0]; // Handle the case where the key is the text
          return JSON.stringify(content);
      }
      return String(content);
  }

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6">
        {/* Target Audience */}
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Target Audience
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{renderSafe(analysis.target_audience) || "No target audience defined."}</p>
            </CardContent>
        </Card>

        {/* Competitors */}
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-500" />
                    Competitors
                </CardTitle>
            </CardHeader>
            <CardContent>
                {analysis.competitors && analysis.competitors.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {analysis.competitors.map((comp: any, i: number) => (
                            <div key={i} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-semibold">{renderSafe(comp.name)}</h5>
                                    {comp.pricing && <Badge variant="outline">{renderSafe(comp.pricing)}</Badge>}
                                </div>
                                <div className="space-y-1 text-xs">
                                    {comp.pros && <p><span className="text-green-500 font-medium">Pros:</span> {renderSafe(comp.pros)}</p>}
                                    {comp.cons && <p><span className="text-red-500 font-medium">Cons:</span> {renderSafe(comp.cons)}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No competitors identified.</p>
                )}
            </CardContent>
        </Card>

        {/* Market Gaps */}
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Market Gaps
                </CardTitle>
            </CardHeader>
            <CardContent>
                {analysis.market_gaps && analysis.market_gaps.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {analysis.market_gaps.map((gap: any, i: number) => (
                            <li key={i}>{renderSafe(gap)}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">No market gaps identified.</p>
                )}
            </CardContent>
        </Card>

        {/* Verdict */}
        {analysis.verdict && (
            <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Verdict
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="text-sm font-medium">Viability Score:</div>
                        <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-green-500" 
                                style={{ width: `${(analysis.verdict.viability_score || 0) * 100}%` }}
                            />
                        </div>
                        <div className="text-sm font-bold">{(analysis.verdict.viability_score || 0) * 10} / 10</div>
                    </div>
                    <p className="text-sm text-muted-foreground">{analysis.verdict.reasoning}</p>
                </CardContent>
            </Card>
        )}
      </div>
    </ScrollArea>
  )
}
