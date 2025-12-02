import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-accent/10">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-accent text-accent-foreground border-accent">
              Next-Generation AI Collaboration
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6 text-foreground">
              Multi-Agent AI
              <span className="dark:text-accent block text-gray-400">Product Refinement</span>
            </h1>
            <p className="text-xl dark:text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
              Transform your product ideas through collaborative AI agents. Seven specialized agents work together to
              clarify, analyze, and refine your concepts into actionable plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/workspace">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3">
                  Enter the Workspace
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Intelligent Agent Collaboration</h2>
            <p className="text-lg dark:text-muted-foreground text-pretty max-w-2xl mx-auto">
              Each agent brings specialized expertise to refine your product ideas through a structured workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-border/50 hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg border flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 dark:text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <CardTitle>Clarification & Discovery</CardTitle>
                <CardDescription>
                  The Clarifier Agent asks targeted questions to understand your vision and requirements
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 border rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 dark:text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <CardTitle>Multi-Perspective Analysis</CardTitle>
                <CardDescription>
                  Product, Customer, Risk, and Engineer agents analyze from different business perspectives
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 border rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 dark:text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <CardTitle>Comprehensive Output</CardTitle>
                <CardDescription>
                  Diagram and Summary agents create visual workflows and actionable implementation plans
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Agent Workflow Preview */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Structured Refinement Process</h2>
            <p className="text-lg dark:text-muted-foreground text-pretty max-w-2xl mx-auto">
              Watch as seven specialized agents collaborate to transform your initial idea into a comprehensive plan
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { name: "Clarifier", status: "active" },
                { name: "Product", status: "pending" },
                { name: "Customer", status: "pending" },
                { name: "Risk", status: "pending" },
                { name: "Engineer", status: "pending" },
                { name: "Diagram", status: "pending" },
                { name: "Summary", status: "pending" },
              ].map((agent, index) => (
                <div key={agent.name} className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-sm font-medium ${
                      agent.status === "active" ? "dark:bg-green-600 bg-green-400 dark:text-accent-foreground" : "bg-muted dark:text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium">{agent.name}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/workspace">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Start Refining Your Idea
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Multi-Agent Product Refinement</h3>
            <p className="dark:text-muted-foreground text-sm">
              Powered by collaborative AI agents for intelligent product development
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
