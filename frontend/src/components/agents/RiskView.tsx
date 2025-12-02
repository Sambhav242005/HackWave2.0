import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ShieldAlert, Scale, CheckCircle } from "lucide-react"

interface RiskViewProps {
  data: any
}

export function RiskView({ data }: RiskViewProps) {
  if (!data || !data.risk_data) return null
  
  const assessment = data.risk_data.assessment || data.risk_data

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6">
        {/* Risk Score */}
        {assessment.risk_score !== undefined && (
             <Card className="border-red-500/20 bg-red-500/5">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Overall Risk Level
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="text-sm font-medium">Risk Score:</div>
                        <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-red-500" 
                                style={{ width: `${(assessment.risk_score || 0) * 100}%` }}
                            />
                        </div>
                        <div className="text-sm font-bold">{(assessment.risk_score || 0) * 10} / 10</div>
                    </div>
                    <p className="text-sm text-muted-foreground">{assessment.risk_summary}</p>
                </CardContent>
            </Card>
        )}

        {/* Feature Analysis */}
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-orange-500" />
                    Feature Analysis
                </CardTitle>
            </CardHeader>
            <CardContent>
                {assessment.features && assessment.features.length > 0 ? (
                    <div className="space-y-4">
                        {assessment.features.map((feature: any, i: number) => (
                            <div key={i} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-semibold text-base">{feature.feature}</h5>
                                    <div className="flex gap-2">
                                        {feature.law_interaction && feature.law_interaction !== "None" && (
                                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                                                {feature.law_interaction}
                                            </Badge>
                                        )}
                                        {feature.risk_level && (
                                            <Badge variant={
                                                feature.risk_level.toLowerCase() === 'high' ? 'destructive' : 
                                                feature.risk_level.toLowerCase() === 'medium' ? 'default' : 'outline'
                                            }>
                                                {feature.risk_level} Risk
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="grid gap-2 text-sm mt-2">
                                    {feature.potential_risk && (
                                        <div className="bg-red-500/5 p-2 rounded border border-red-500/10">
                                            <span className="font-medium text-red-600 block mb-1">Potential Risk:</span>
                                            <span className="text-muted-foreground">{feature.potential_risk}</span>
                                        </div>
                                    )}
                                    
                                    {feature.mitigation && (
                                        <div className="bg-green-500/5 p-2 rounded border border-green-500/10">
                                            <span className="font-medium text-green-600 block mb-1">Mitigation:</span>
                                            <span className="text-muted-foreground">{feature.mitigation}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No detailed feature analysis available.</p>
                )}
            </CardContent>
        </Card>

        {/* Legal & Compliance */}
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Scale className="h-5 w-5 text-blue-500" />
                    Legal & Compliance
                </CardTitle>
            </CardHeader>
            <CardContent>
                {assessment.legal_compliance && assessment.legal_compliance.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {assessment.legal_compliance.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">No specific legal issues noted.</p>
                )}
            </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
