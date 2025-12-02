import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  CheckCircle, 
  Lightbulb, 
  Bot, 
  MessageSquare, 
  Box, 
  Users, 
  ShieldAlert, 
  Cpu, 
  FileCode, 
  FileText,
  Send,
  ArrowRight,
  RefreshCw
} from "lucide-react"

import { ProductView } from "@/components/agents/ProductView"
import { CustomerView } from "@/components/agents/CustomerView"
import { RiskView } from "@/components/agents/RiskView"
import { EngineerView } from "@/components/agents/EngineerView"
import { DiagramView } from "@/components/agents/DiagramView"
import { SummaryView } from "@/components/agents/SummaryView"
import { ClarifierView } from "@/components/agents/ClarifierView"

interface LiveWorkingAreaProps {
  activeAgent: string | null
  currentIdea: string
  onIdeaSubmit: (idea: string) => void
  onAgentMessage?: (msg: string) => void
  isGenerating: boolean
  productData: any
  customerData: any
  riskData: any
  engineerData: any
  diagramUrl: string | null
  summaryData: any
  chatHistory: any[]
  classification: any
  workflowStep: string
  onContinue?: () => void
  onRegenerate?: () => void
}

const agentDetails: Record<string, any> = {
  clarifier: { name: "Clarifier", icon: MessageSquare, color: "bg-blue-500", description: "Refines your idea through conversation." },
  product: { name: "Product Manager", icon: Box, color: "bg-purple-500", description: "Defines features and requirements." },
  customer: { name: "Customer Researcher", icon: Users, color: "bg-green-500", description: "Analyzes target audience and needs." },
  risk: { name: "Risk Analyst", icon: ShieldAlert, color: "bg-red-500", description: "Identifies potential risks and mitigations." },
  engineer: { name: "Systems Architect", icon: Cpu, color: "bg-orange-500", description: "Designs technical architecture." },
  diagram: { name: "Diagram Generator", icon: FileCode, color: "bg-indigo-500", description: "Visualizes the system." },
  summary: { name: "Executive Summary", icon: FileText, color: "bg-gray-500", description: "Compiles the final report." },
}

export function LiveWorkingArea({
  activeAgent,
  currentIdea,
  onIdeaSubmit,
  onAgentMessage,
  isGenerating,
  productData,
  customerData,
  riskData,
  engineerData,
  diagramUrl,
  summaryData,
  chatHistory,
  classification,
  workflowStep,
  onContinue,
  onRegenerate
}: LiveWorkingAreaProps) {
  const [inputValue, setInputValue] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatHistory])

  // Initial Input State
  if (workflowStep === "input") {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-in fade-in duration-500">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">What are you building?</h2>
            <p className="text-muted-foreground text-lg">Describe your product idea and let our AI agents help you refine it.</p>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
                <Textarea 
                  placeholder="e.g. A mobile app for tracking daily water intake with gamification..."
                  className="min-h-[140px] p-4 text-base resize-none shadow-sm border-muted-foreground/20 focus-visible:ring-primary"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Button 
                  className="absolute bottom-3 right-3 h-8 w-8 p-0 rounded-full" 
                  size="icon"
                  onClick={() => onIdeaSubmit(inputValue)}
                  disabled={!inputValue.trim()}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 text-left">
             <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
                <h3 className="font-semibold mb-3 flex items-center">
                    <Bot className="w-4 h-4 mr-2 text-primary" />
                    How it works
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Describe your idea in plain English</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Our agents analyze it from different perspectives</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Get a comprehensive refinement plan</span>
                  </li>
                </ul>
             </div>
          </div>
        </div>
      </div>
    )
  }

  // Loading States
  if (workflowStep === "classifying" || isGenerating) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-in fade-in zoom-in duration-300">
            <div className="relative">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    {workflowStep === "classifying" ? (
                        <Lightbulb className="h-10 w-10 text-primary animate-bounce" />
                    ) : (
                        <Bot className="h-10 w-10 text-primary animate-bounce" />
                    )}
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            </div>
            <h3 className="text-2xl font-semibold mb-2">
                {workflowStep === "classifying" ? "Classifying Idea" : "Generating Analysis"}
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
                {workflowStep === "classifying" 
                    ? "Identifying the domain and context of your idea..." 
                    : "Our agents are analyzing your requirements and generating a detailed report..."}
            </p>
        </div>
      )
  }

  // Split View Layout
  return (
    <div className="flex h-full gap-6 p-2">
      {/* Left Column: Interaction & Context (35%) */}
      <Card className="w-[35%] flex flex-col border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardContent className="flex-1 flex flex-col p-0 h-full overflow-hidden">
            {/* Agent Header */}
            {activeAgent && agentDetails[activeAgent] && (
                <div className="p-4 border-b border-border/50 bg-muted/20">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 ${agentDetails[activeAgent].color} rounded-xl flex items-center justify-center shadow-sm`}>
                            {(() => {
                                const Icon = agentDetails[activeAgent].icon
                                return <Icon className="h-5 w-5 text-white" />
                            })()}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-none">{agentDetails[activeAgent].name}</h3>
                            <Badge variant="outline" className="mt-1 text-[10px] h-5 px-1.5 bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {agentDetails[activeAgent].description}
                    </p>
                </div>
            )}

            {/* Classification Info */}
            {classification && (
                <div className="px-4 py-2 bg-orange-500/5 border-b border-orange-500/10 flex items-center gap-2">
                    <Lightbulb className="h-3.5 w-3.5 text-orange-500" />
                    <span className="text-xs font-medium text-orange-600 truncate">
                        {typeof classification.classification?.domain === 'string' ? classification.classification.domain :
                         typeof classification.classification?.name === 'string' ? classification.classification.name :
                         typeof classification.domain === 'string' ? classification.domain :
                         typeof classification.name === 'string' ? classification.name :
                         typeof classification.category === 'string' ? classification.category : "Unknown"}
                    </span>
                </div>
            )}

            {/* Chat Area (Only for Clarifier) */}
            <div className="flex-1 overflow-hidden relative bg-background/50">
                {activeAgent === "clarifier" ? (
                    <ClarifierView chatHistory={chatHistory} onAgentMessage={onAgentMessage} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-50">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Bot className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Agent is working...<br/>
                            Review the output on the right.
                        </p>
                    </div>
                )}
            </div>

            {/* Input / Action Area */}
            <div className="p-4 border-t border-border/50 bg-background">
                {onContinue && activeAgent !== "clarifier" ? (
                    <div className="space-y-3">
                        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                            <h4 className="font-semibold text-green-700 text-sm mb-1">Review Analysis</h4>
                            <p className="text-xs text-green-600/80 mb-3">
                                Review the output on the right.
                            </p>
                            <div className="flex gap-2">
                                {onRegenerate && (
                                    <Button variant="outline" size="sm" onClick={onRegenerate} className="flex-1 h-8 text-xs border-green-500/30 hover:bg-green-500/10 hover:text-green-700">
                                        <RefreshCw className="w-3 h-3 mr-1.5" />
                                        Regenerate
                                    </Button>
                                )}
                                {activeAgent !== "summary" && (
                                    <Button size="sm" onClick={onContinue} className="flex-[2] h-8 text-xs bg-green-600 hover:bg-green-700 text-white shadow-sm">
                                        Looks Good, Continue
                                        <ArrowRight className="w-3 h-3 ml-1.5" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : activeAgent === "clarifier" ? (
                     <div className="space-y-3">
                         {onContinue && (
                             <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 mb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-blue-700 text-sm">Finished Clarifying?</h4>
                                </div>
                                <Button size="sm" onClick={onContinue} className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                                    Generate Product Plan
                                    <ArrowRight className="w-3 h-3 ml-1.5" />
                                </Button>
                            </div>
                         )}
                         
                        <div className="relative mt-2">
                            <Textarea
                                placeholder="Answer the questions..."
                                className="min-h-[80px] pr-10 resize-none text-sm bg-muted/30 focus-visible:ring-primary"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (onAgentMessage && inputValue.trim()) {
                                            onAgentMessage(inputValue);
                                            setInputValue("");
                                        }
                                    }
                                }}
                            />
                            <Button 
                                size="icon"
                                className="absolute bottom-2 right-2 h-7 w-7"
                                disabled={!inputValue.trim()}
                                onClick={() => {
                                    if (onAgentMessage && inputValue.trim()) {
                                        onAgentMessage(inputValue)
                                        setInputValue("")
                                    }
                                }}
                            >
                                <Send className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                ) : null}
            </div>
        </CardContent>
      </Card>

      {/* Right Column: Workspace / Artifacts (65%) */}
      <Card className="w-[65%] flex flex-col border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardContent className="flex-1 p-0 h-full overflow-hidden flex flex-col">
            <div className="p-3 border-b border-border/50 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Workspace Artifacts</span>
                </div>
                {activeAgent && (
                    <Badge variant="secondary" className="text-xs font-normal">
                        {activeAgent === 'clarifier' ? 'Live Context' : `${agentDetails[activeAgent]?.name || 'Agent'} Output`}
                    </Badge>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-background/50">
              {activeAgent === "product" && productData ? (
                <ProductView data={productData} />
              ) : activeAgent === "customer" && customerData ? (
                <CustomerView data={customerData} />
              ) : activeAgent === "risk" && riskData ? (
                <RiskView data={riskData} />
              ) : activeAgent === "engineer" && engineerData ? (
                <EngineerView data={engineerData} />
              ) : activeAgent === "diagram" && diagramUrl ? (
                <DiagramView url={diagramUrl} />
              ) : activeAgent === "summary" && summaryData ? (
                <SummaryView data={summaryData} />
              ) : activeAgent === "clarifier" ? (
                 <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Clarification in Progress</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        The agent is gathering information to build your product plan. Please answer the questions in the chat panel.
                    </p>
                 </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <Bot className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Waiting for agent output...</p>
                </div>
              )}
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
