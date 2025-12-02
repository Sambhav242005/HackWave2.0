// app/about/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  Lightbulb, 
  Shield, 
  Globe, 
  MessageSquare, 
  ArrowRight,
  Zap,
  Award,
  Star
} from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      bio: "Former product lead at TechCorp with 10+ years in AI and product development.",
      image: "/placeholder-avatar.jpg"
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      bio: "AI researcher and engineer with expertise in multi-agent systems and machine learning.",
      image: "/placeholder-avatar.jpg"
    },
    {
      name: "Michael Torres",
      role: "Head of Product",
      bio: "Product strategist who has launched 15+ products from concept to market.",
      image: "/placeholder-avatar.jpg"
    },
    {
      name: "Emma Williams",
      role: "Lead Designer",
      bio: "UX/UI specialist focused on creating intuitive interfaces for complex systems.",
      image: "/placeholder-avatar.jpg"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "User-Centric",
      description: "We build tools that solve real problems for product teams and innovators."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Pushing the boundaries of what's possible with AI and collaborative systems."
    },
    {
      icon: Shield,
      title: "Trust",
      description: "Committed to transparency, security, and ethical AI development."
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Making advanced AI tools accessible to everyone, regardless of technical expertise."
    }
  ];

  const milestones = [
    { year: "2022", title: "Founded", description: "Multi-Agent AI was founded with a vision to democratize product refinement." },
    { year: "2023", title: "Beta Launch", description: "Launched our beta platform with 1,000+ early adopters." },
    { year: "2024", title: "Public Release", description: "Officially launched to the public with enhanced features and capabilities." },
    { year: "2025", title: "Global Reach", description: "Now serving users in 50+ countries worldwide." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 bg-accent text-accent-foreground border-accent">
              About Us
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6 text-foreground">
              Transforming Ideas Into Reality
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto mb-8">
              We're building the future of product development through collaborative AI agents that help teams refine their ideas into actionable plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Get Started
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                Contact Us
              </Button>
            </div>
          </div>

          {/* Mission Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-4">
                At Multi-Agent AI, we believe that great products start with great ideas. But turning those ideas into reality requires expertise from multiple domains - business, technical, user experience, and more.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our mission is to democratize access to this multidisciplinary expertise through AI. We've created a platform where seven specialized agents work together to analyze, refine, and transform product ideas into comprehensive plans.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-sm font-medium">
                      {i}
                    </div>
                  ))}
                </div>
                <span className="text-muted-foreground">7 specialized AI agents</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">10,000+</h3>
                <p className="text-muted-foreground">Ideas refined</p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="border-border/50 hover:border-accent/50 transition-colors">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The passionate people building Multi-Agent AI
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="border-border/50 hover:border-accent/50 transition-colors">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-accent" />
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <Badge variant="outline" className="bg-accent/10 text-accent">
                      {member.role}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {member.bio}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Milestones Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Key milestones in our story
              </p>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border/50 transform translate-x-1/2 hidden md:block"></div>
              
              <div className="space-y-8 md:space-y-0">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex flex-col md:flex-row items-start md:items-center">
                    <div className="flex items-center mb-4 md:mb-0 md:w-1/4">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-medium text-sm z-10">
                        {milestone.year}
                      </div>
                      <h3 className="ml-4 font-medium">{milestone.title}</h3>
                    </div>
                    <div className="md:w-3/4 md:pl-8">
                      <Card className="border-border/50">
                        <CardContent className="p-4">
                          <p className="text-muted-foreground">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-8 text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Be part of the future of product development. Join thousands of innovators using Multi-Agent AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                Read Our Blog
              </Button>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hear from product teams who've transformed their ideas with our platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "Multi-Agent AI helped us refine our SaaS product idea into a detailed implementation plan. The agents caught potential issues we hadn't considered."
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Jamie Rodriguez</p>
                      <p className="text-xs text-muted-foreground">Product Manager</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "As a solo founder, having access to multiple expert perspectives is invaluable. This platform gave me the confidence to move forward with my app idea."
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Taylor Kim</p>
                      <p className="text-xs text-muted-foreground">Startup Founder</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "The visual diagrams and implementation plans generated by the agents saved us weeks of planning. We went from idea to development in record time."
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Jordan Patel</p>
                      <p className="text-xs text-muted-foreground">Tech Lead</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}