import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Code, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface EngineerViewProps {
  data: any
}

export function EngineerView({ data }: EngineerViewProps) {
  if (!data || !data.engineer_data) return null
  
  const analysis = data.engineer_data.analysis || data.engineer_data

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6">
        {/* Feasibility Score */}
        {analysis.feasibility_score !== undefined && (
             <Card className="border-blue-500/20 bg-blue-500/5">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="h-5 w-5 text-blue-500" />
                        Technical Feasibility
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="text-sm font-medium">Score:</div>
                        <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-blue-500" 
                                style={{ width: `${(analysis.feasibility_score || 0) * 100}%` }}
                            />
                        </div>
                        <div className="text-sm font-bold">{(analysis.feasibility_score || 0) * 10} / 10</div>
                    </div>
                </CardContent>
            </Card>
        )}

        {/* Tech Stack */}
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="h-5 w-5 text-purple-500" />
                    Recommended Tech Stack
                </CardTitle>
            </CardHeader>
            <CardContent>
                {analysis.tech_stack ? (
                    <div className="space-y-4">
                        {Object.entries(analysis.tech_stack).map(([category, items]: [string, any], i) => (
                            <div key={i}>
                                <h5 className="text-sm font-semibold mb-2 capitalize">{category.replace('_', ' ')}</h5>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(items) ? items.map((item: string, j: number) => (
                                        <Badge key={j} variant="secondary">{item}</Badge>
                                    )) : <span className="text-sm text-muted-foreground">{String(items)}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No tech stack recommendations.</p>
                )}
            </CardContent>
        </Card>

        {/* Technical Challenges */}
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Technical Challenges
                </CardTitle>
            </CardHeader>
            <CardContent>
                {analysis.technical_challenges && analysis.technical_challenges.length > 0 ? (
                    <div className="space-y-3">
                        {analysis.technical_challenges.map((challenge: any, i: number) => (
                            <div key={i} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                                <div className="flex justify-between items-start mb-1">
                                    <h5 className="font-semibold text-sm">{challenge.title || challenge.name || "Challenge " + (i+1)}</h5>
                                    {challenge.severity && (
                                        <Badge variant={challenge.severity === 'High' ? 'destructive' : 'outline'}>
                                            {challenge.severity}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">{challenge.description || challenge}</p>
                                {challenge.mitigation && (
                                    <p className="text-xs mt-1"><span className="font-medium text-green-600">Mitigation:</span> {challenge.mitigation}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No significant challenges identified.</p>
                )}
            </CardContent>
        </Card>
        
        {/* Implementation Plan */}
        {analysis.implementation_plan && (
             <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5 text-green-500" />
                        Implementation Estimates
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        {analysis.implementation_plan.map((step: any, i: number) => (
                             <div key={i} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded">
                                <span>{step.phase || step.step}</span>
                                <span className="font-mono text-xs text-muted-foreground">{step.duration}</span>
                             </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </ScrollArea>
  )
}
