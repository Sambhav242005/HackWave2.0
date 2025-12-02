import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Lightbulb, 
  BarChart, 
  Settings, 
  Users, 
  FileText, 
  CheckCircle,
  ArrowRight,
  Bot
} from "lucide-react";

export default function AgentsPage() {
  const agents = [
    {
      id: "clarifier",
      name: "Clarifier Agent",
      icon: MessageSquare,
      description: "Asks targeted questions to understand your vision and requirements",
      capabilities: [
        "Requirement gathering",
        "Vision clarification",
        "Goal identification",
        "Constraint definition"
      ],
      color: "bg-blue-500"
    },
    {
      id: "product",
      name: "Product Agent",
      icon: Lightbulb,
      description: "Analyzes product viability, market fit, and business potential",
      capabilities: [
        "Market analysis",
        "Competitive landscape",
        "Value proposition",
        "Business model"
      ],
      color: "bg-purple-500"
    },
    {
      id: "customer",
      name: "Customer Agent",
      icon: Users,
      description: "Evaluates customer needs, pain points, and user experience",
      capabilities: [
        "User personas",
        "Customer journey",
        "Pain point analysis",
        "User stories"
      ],
      color: "bg-green-500"
    },
    {
      id: "risk",
      name: "Risk Agent",
      icon: BarChart,
      description: "Identifies potential risks, challenges, and mitigation strategies",
      capabilities: [
        "Risk assessment",
        "Threat analysis",
        "Mitigation planning",
        "Contingency planning"
      ],
      color: "bg-red-500"
    },
    {
      id: "engineer",
      name: "Engineer Agent",
      icon: Settings,
      description: "Assesses technical feasibility, architecture, and implementation",
      capabilities: [
        "Technical feasibility",
        "Architecture design",
        "Technology stack",
        "Implementation complexity"
      ],
      color: "bg-yellow-500"
    },
    {
      id: "diagram",
      name: "Diagram Agent",
      icon: FileText,
      description: "Creates visual workflows, system diagrams, and process maps",
      capabilities: [
        "Process flows",
        "System architecture",
        "User journey maps",
        "Data flow diagrams"
      ],
      color: "bg-indigo-500"
    },
    {
      id: "summary",
      name: "Summary Agent",
      icon: FileText,
      description: "Generates comprehensive implementation plans and next steps",
      capabilities: [
        "Action plans",
        "Implementation roadmap",
        "Resource planning",
        "Success metrics"
      ],
      color: "bg-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 bg-accent text-accent-foreground border-accent">
              AI Agents
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6 text-foreground">
              Meet Our Specialized AI Agents
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto mb-8">
              Seven specialized AI agents work together to transform your ideas into actionable plans
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Try All Agents Now
            </Button>
          </div>

          {/* Agent Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {agents.map((agent) => (
              <Card key={agent.id} className="border-border/50 hover:border-accent/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${agent.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <agent.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {agent.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Capabilities:</h4>
                    <ul className="space-y-2">
                      {agent.capabilities.map((capability, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How Agents Work Together */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How Agents Collaborate</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our agents work in a structured workflow to refine your product ideas
              </p>
            </div>
            
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-center">Agent Collaboration Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-4">
                  {agents.map((agent, index) => (
                    <div key={agent.id} className="flex flex-col items-center text-center max-w-[120px]">
                      <div className={`w-16 h-16 ${agent.color} rounded-full flex items-center justify-center mb-3`}>
                        <agent.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-medium text-sm mb-1">{agent.name.split(' ')[0]}</h3>
                      {index < agents.length - 1 && (
                        <div className="hidden md:block absolute right-[-30px] top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Specialized Expertise</CardTitle>
                <CardDescription>
                  Each agent brings specialized knowledge to analyze your product from different angles
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Seamless Collaboration</CardTitle>
                <CardDescription>
                  Agents share context and build upon each other's insights for comprehensive analysis
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-border/50">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Actionable Output</CardTitle>
                <CardDescription>
                  Get detailed plans, visual diagrams, and clear next steps for implementation
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Ideas?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Start using our AI agents today to refine your product concepts
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}