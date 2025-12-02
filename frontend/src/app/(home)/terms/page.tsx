import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Shield, FileText, Users, Globe, CreditCard } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: FileText,
      content: "By accessing and using this Service, you accept and agree to be bound by the terms and provision of this agreement."
    },
    {
      title: "Use License",
      icon: Globe,
      content: "Permission is granted to temporarily download one copy of the materials on Multi-Agent AI's website for personal, non-commercial transitory viewing only."
    },
    {
      title: "Disclaimer",
      icon: Shield,
      content: "The materials on Multi-Agent AI's website are provided on an 'as is' basis. Multi-Agent AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
    },
    {
      title: "Limitations",
      icon: Users,
      content: "In no event shall Multi-Agent AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Multi-Agent AI's website."
    },
    {
      title: "Accuracy of Materials",
      icon: FileText,
      content: "The materials appearing on Multi-Agent AI's website could include technical, typographical, or photographic errors. Multi-Agent AI does not warrant that any of the materials on its website are accurate, complete, or current."
    },
    {
      title: "Links",
      icon: Globe,
      content: "Multi-Agent AI has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site."
    },
    {
      title: "Modifications",
      icon: Calendar,
      content: "Multi-Agent AI may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service."
    },
    {
      title: "Payment Terms",
      icon: CreditCard,
      content: "Some services may require payment. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-balance mb-4 text-foreground">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <Card className="border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Introduction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Welcome to Multi-Agent AI. These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and Multi-Agent AI ("Company", "we", "us", or "our"), concerning your access to and use of the multiagentai.com website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
              </p>
              <p className="text-muted-foreground mt-4">
                You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the Site and you must discontinue use immediately.
              </p>
            </CardContent>
          </Card>

          {/* Terms Sections */}
          <div className="space-y-6 mb-12">
            {sections.map((section, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <section.icon className="h-6 w-6 text-accent" />
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Section */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium">Email:</span> legal@multiagentai.com
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Website:</span> www.multiagentai.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
    </div>
  );
}