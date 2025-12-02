import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Eye, 
  Database, 
  Lock, 
  Cookie, 
  Trash2, 
  Mail,
  Globe,
  Users,
  Calendar,
  FileText
} from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Information We Collect",
      icon: Database,
      content: "We collect several types of information for various purposes to provide and improve our service to you.",
      subsections: [
        {
          title: "Personal Data",
          content: "While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to: email address, first name and last name, phone number, and cookies and usage data."
        },
        {
          title: "Usage Data",
          content: "We may also collect information on how the Service is accessed and used. This Usage Data may include information such as your computer's Internet Protocol (IP) address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data."
        },
        {
          title: "Tracking & Cookies Data",
          content: "We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier."
        }
      ]
    },
    {
      title: "Use of Data",
      icon: Eye,
      content: "Multi-Agent AI uses the collected data for various purposes:",
      list: [
        "To provide and maintain the Service",
        "To notify you about changes to our Service",
        "To allow you to participate in interactive features of our Service when you choose to do so",
        "To provide customer care and support",
        "To provide analysis or valuable information so that we can improve the Service",
        "To monitor the usage of the Service",
        "To detect, prevent and address technical issues"
      ]
    },
    {
      title: "Transfer of Data",
      icon: Users,
      content: "Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction."
    },
    {
      title: "Data Security",
      icon: Lock,
      content: "The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security."
    },
    {
      title: "Data Retention",
      icon: Calendar,
      content: "Multi-Agent AI will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies."
    },
    {
      title: "Your Data Protection Rights",
      icon: Shield,
      content: "You have certain data protection rights. We aim to take reasonable measures to allow you to correct, amend, delete, or limit the use of your Personal Data.",
      list: [
        "Right to Access - the right to request copies of your personal data",
        "Right to Rectification - the right to request correction of inaccurate personal data",
        "Right to Erasure - the right to request that your personal data be erased",
        "Right to Restrict Processing - the right to request that we restrict the processing of your personal data",
        "Right to Object to Processing - the right to object to our processing of your personal data"
      ]
    },
    {
      title: "Cookies",
      icon: Cookie,
      content: "We use cookies to enhance your experience on our website. You can set your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service."
    },
    {
      title: "Children's Privacy",
      icon: Users,
      content: "Our Service does not address anyone under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us."
    },
    {
      title: "Links to Other Sites",
      icon: Globe,
      content: "Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit."
    },
    {
      title: "Changes to This Privacy Policy",
      icon: FileText,
      content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date at the top of this Privacy Policy."
    },
    {
      title: "Contact Us",
      icon: Mail,
      content: "If you have any questions about this Privacy Policy, please contact us by email: privacy@multiagentai.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-balance mb-4 text-foreground">
              Privacy Policy
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
              <p className="text-muted-foreground mb-4">
                At Multi-Agent AI, accessible from multiagentai.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Multi-Agent AI and how we use it.
              </p>
              <p className="text-muted-foreground">
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
              </p>
            </CardContent>
          </Card>

          {/* Privacy Sections */}
          <div className="space-y-8 mb-12">
            {sections.map((section, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <section.icon className="h-6 w-6 text-accent" />
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{section.content}</p>
                  
                  {section.subsections && (
                    <div className="space-y-4 mt-4">
                      {section.subsections.map((subsection, subIndex) => (
                        <div key={subIndex} className="border-l-2 border-border/40 pl-4">
                          <h4 className="font-medium mb-2">{subsection.title}</h4>
                          <p className="text-muted-foreground">{subsection.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {section.list && (
                    <ul className="space-y-2 mt-4">
                      {section.list.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
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
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-medium">Email:</span> privacy@multiagentai.com
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