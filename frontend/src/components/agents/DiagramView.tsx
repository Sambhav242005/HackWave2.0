import { ScrollArea } from "@/components/ui/scroll-area"

interface DiagramViewProps {
  url: string | null
}

export function DiagramView({ url }: DiagramViewProps) {
  if (!url) return null

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-4">
        <div className="bg-background p-4 rounded-lg border border-border/50">
          <div className="border rounded-md p-4 bg-white dark:bg-zinc-950 flex justify-center items-center min-h-[400px]">
            {url ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <img src={url} alt="Product Diagram" className="w-full rounded-md" />
                <div className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs break-all font-mono overflow-auto max-h-32">
                  <p className="font-bold mb-1">Debug URL:</p>
                  {url}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground flex flex-col items-center">
                <p>No diagram generated yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

