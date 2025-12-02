import React from 'react'
import ReactMarkdown from 'react-markdown'

interface SummaryViewProps {
  data: any
}

export function SummaryView({ data }: SummaryViewProps) {
  if (!data) return null

  const summaryContent = data.summary || data.raw_response || JSON.stringify(data, null, 2)

  return (
    <div className="space-y-6">
      <div className="bg-background p-6 rounded-lg border border-border/50 shadow-sm">
        <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
                components={{
                    h1: ({node, ...props}) => <h1 className="text-xl font-bold text-primary mb-4 mt-6 first:mt-0" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-lg font-semibold text-foreground mb-3 mt-5" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-base font-medium text-foreground mb-2 mt-4" {...props} />,
                    p: ({node, ...props}) => <p className="text-muted-foreground leading-relaxed mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="text-muted-foreground" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4" {...props} />,
                }}
            >
                {summaryContent}
            </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
