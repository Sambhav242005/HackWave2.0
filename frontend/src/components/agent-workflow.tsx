// components/agent-workflow.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MessageSquare, 
  Lightbulb, 
  BarChart, 
  Settings, 
  Users, 
  FileText, 
  ArrowRight,
  CheckCircle
} from "lucide-react"

interface AgentWorkflowProps {
  currentIdea: string
  onAgentActivate: (agent: string) => void
  activeAgent: string | null
}

const agents = [
  { id: "clarifier", name: "Clarifier", icon: MessageSquare, description: "Understand your vision" },
  { id: "product", name: "Product", icon: Lightbulb, description: "Analyze market fit" },
  { id: "customer", name: "Customer", icon: Users, description: "Evaluate user needs" },
  { id: "risk", name: "Risk", icon: BarChart, description: "Identify challenges" },
  { id: "engineer", name: "Engineer", icon: Settings, description: "Assess feasibility" },
  { id: "diagram", name: "Diagram", icon: FileText, description: "Create visuals" },
  { id: "summary", name: "Summary", icon: FileText, description: "Generate plan" },
]

export function AgentWorkflow({ currentIdea, onAgentActivate, activeAgent }: AgentWorkflowProps) {
  const handleAgentClick = (agentId: string) => {
    onAgentActivate(agentId)
  }

  return (
    <div className="h-full flex flex-col">
      {!currentIdea ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-accent" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Start a New Project</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Enter your product idea in the panel to the right to begin the refinement process with our AI agents.
          </p>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Enter Your Idea
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Current Idea</h3>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p>{currentIdea}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Agent Workflow</h3>
            <div className="space-y-4">
              {agents.map((agent, index) => (
                <div key={agent.id} className="flex items-center">
                  <div 
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 mr-4 cursor-pointer transition-colors ${
                      activeAgent === agent.id 
                        ? 'border-accent bg-accent/10' 
                        : 'border-border/50 hover:border-accent/50'
                    }`}
                    onClick={() => handleAgentClick(agent.id)}
                  >
                    <agent.icon className={`h-5 w-5 ${
                      activeAgent === agent.id ? 'text-accent' : 'text-muted-foreground'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium">{agent.name}</h4>
                      {activeAgent === agent.id && (
                        <Badge variant="outline" className="ml-2 bg-accent/10 text-accent">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{agent.description}</p>
                  </div>
                  
                  {index < agents.length - 1 && (
                    <div className="mx-2 text-muted-foreground">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-border/50">
            <h3 className="text-lg font-medium mb-3">Workflow Progress</h3>
            <div className="w-full bg-muted/30 rounded-full h-2.5">
              <div 
                className="bg-accent h-2.5 rounded-full" 
                style={{ width: `${(agents.findIndex(a => a.id === activeAgent) + 1) / agents.length * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Start</span>
              <span>Complete</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}