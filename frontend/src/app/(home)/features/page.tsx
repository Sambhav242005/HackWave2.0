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
  Sparkles
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      title: "Seven Specialized Agents",
      description: "Each AI agent brings unique expertise to analyze your product from different perspectives",
      icon: Users,
      points: [
        "Clarifier Agent for requirements gathering",
        "Product Agent for market analysis",
        "Customer Agent for user research",
        "Risk Agent for threat assessment",
        "Engineer Agent for technical feasibility",
        "Diagram Agent for visual workflows",
        "Summary Agent for actionable plans"
      ]
    },
    {
      title: "Intelligent Collaboration",
      description: "Agents work together in a structured workflow to refine your product ideas",
      icon: MessageSquare,
      points: [
        "Sequential agent activation",
        "Context sharing between agents",
        "Iterative refinement process",
        "Real-time progress tracking",
        "Comprehensive final report"
      ]
    },
    {
      title: "Visual Workflow Generation",
      description: "Transform complex ideas into clear visual diagrams and implementation plans",
      icon: FileText,
      points: [
        "Process flow diagrams",
        "System architecture visuals",
        "User journey maps",
        "Implementation timelines",
        "Exportable in multiple formats"
      ]
    },
    {
      title: "Comprehensive Analysis",
      description: "Get 360-degree analysis of your product from technical, business, and user perspectives",
      icon: BarChart,
      points: [
        "Market opportunity assessment",
        "Technical feasibility analysis",
        "User experience evaluation",
        "Risk identification and mitigation",
        "Competitive landscape analysis"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 bg-accent text-accent-foreground border-accent">
              Powerful Features
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6 text-foreground">
              Everything You Need to Refine Your Product
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto mb-8">
              Our AI-powered workspace provides all the tools and agents you need to transform your ideas into actionable plans
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Try It Now
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:border-accent/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our simple 3-step process transforms your ideas into actionable plans
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-border/50 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent">1</span>
                  </div>
                  <CardTitle>Describe Your Idea</CardTitle>
                  <CardDescription>
                    Start by describing your product concept in simple terms
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-border/50 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent">2</span>
                  </div>
                  <CardTitle>Agent Collaboration</CardTitle>
                  <CardDescription>
                    Seven specialized agents analyze and refine your concept
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-border/50 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent">3</span>
                  </div>
                  <CardTitle>Get Actionable Plan</CardTitle>
                  <CardDescription>
                    Receive a comprehensive plan with visual diagrams
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Ideas?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Join thousands of product teams using our AI agents to refine their concepts
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