import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface ClarifierViewProps {
  chatHistory: any[]
  onAgentMessage?: (message: string) => void
}

export function ClarifierView({ chatHistory, onAgentMessage }: ClarifierViewProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [activeQuestions, setActiveQuestions] = useState<any[]>([])

  // Reset answers when chat history changes significantly
  useEffect(() => {
    if (chatHistory.length > 0) {
        const lastMsg = chatHistory[chatHistory.length - 1]
        if (lastMsg.role === 'assistant') {
             let items: any[] = []
             if (typeof lastMsg.content === 'object') {
                if (lastMsg.content.parsed && Array.isArray(lastMsg.content.parsed.resp)) {
                    items = lastMsg.content.parsed.resp
                } else if (Array.isArray(lastMsg.content.resp)) {
                    items = lastMsg.content.resp
                }
             }
             
             // Filter for unanswered questions
             const unanswered = items.filter((item: any) => !item.answer)
             if (unanswered.length > 0) {
                 setActiveQuestions(unanswered)
                 // Initialize empty answers
                 const initialAnswers: Record<string, string> = {}
                 unanswered.forEach((q: any) => {
                     initialAnswers[q.question] = ""
                 })
                 setAnswers(initialAnswers)
             } else {
                 setActiveQuestions([])
             }
        }
    }
  }, [chatHistory])

  const handleSubmit = () => {
      if (!onAgentMessage) return

      // Format answers into a single message
      const formattedAnswers = Object.entries(answers)
        .map(([q, a]) => `Q: ${q}\nA: ${a}`)
        .join("\n\n")
      
      onAgentMessage(formattedAnswers)
      setActiveQuestions([]) // Clear active questions to hide inputs
  }

  if (!chatHistory || chatHistory.length === 0) return null

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-4 pb-4">
        {chatHistory.map((msg, i) => {
           let responseItems: any[] = [];
           let rawContent = "";

           if (typeof msg.content === 'string') {
               rawContent = msg.content;
           } else if (typeof msg.content === 'object') {
               if (msg.content.parsed && Array.isArray(msg.content.parsed.resp)) {
                   responseItems = msg.content.parsed.resp;
               } else if (Array.isArray(msg.content.resp)) {
                   responseItems = msg.content.resp;
               } else if (msg.content.response && typeof msg.content.response === 'string') {
                   rawContent = msg.content.response;
               } else {
                   rawContent = JSON.stringify(msg.content, null, 2);
               }
           }

           const isLastMessage = i === chatHistory.length - 1

           return (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-xl ${
                    msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-muted/50 border border-border/50 rounded-tl-none w-full'
                }`}>
                  {responseItems.length > 0 ? (
                       <div className="space-y-4">
                           {responseItems.map((item: any, idx: number) => (
                               <div key={idx} className="bg-background/50 p-3 rounded-lg border border-border/30">
                                   <p className="font-medium text-sm mb-2 text-primary">{item.question}</p>
                                   {item.answer ? (
                                       <p className="text-sm text-muted-foreground">{item.answer}</p>
                                   ) : (
                                       // Only show input if it's the last message and we haven't submitted yet
                                       isLastMessage && activeQuestions.length > 0 ? (
                                           <div className="mt-2">
                                               <Input 
                                                 placeholder="Type your answer..." 
                                                 value={answers[item.question] || ""}
                                                 onChange={(e) => setAnswers(prev => ({...prev, [item.question]: e.target.value}))}
                                                 className="bg-background"
                                               />
                                           </div>
                                       ) : (
                                           <p className="text-xs text-orange-500 italic">Waiting for answer...</p>
                                       )
                                   )}
                               </div>
                           ))}
                           
                           {isLastMessage && activeQuestions.length > 0 && (
                               <div className="pt-2 flex justify-end">
                                   <Button size="sm" onClick={handleSubmit}>
                                       <Send className="w-4 h-4 mr-2" />
                                       Submit Answers
                                   </Button>
                               </div>
                           )}
                       </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{rawContent}</p>
                  )}
                </div>
              </div>
           )
        })}
      </div>
    </ScrollArea>
  )
}
