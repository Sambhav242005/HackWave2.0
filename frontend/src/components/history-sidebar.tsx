// components/history-sidebar.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, Loader, Plus, Trash2 } from "lucide-react"

export interface HistoryItem {
  id: string
  title: string
  timestamp: Date
  status: "completed" | "in-progress" | "pending"
}

interface HistorySidebarProps {
  history: HistoryItem[]
  onSelectIdea: (idea: HistoryItem) => void
  onNewProject: () => void
  onDeleteProject: (id: string) => void
}

export function HistorySidebar({ history, onSelectIdea, onNewProject, onDeleteProject }: HistorySidebarProps) {
  console.log("HistorySidebar rendered with history:", history)
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getStatusIcon = (status: HistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Loader className="h-4 w-4 text-blue-500 animate-spin" />
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: HistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">In Progress</Badge>
      case 'pending':
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Pending</Badge>
    }
  }

  return (
    <Card className="h-full border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Project History</CardTitle>
          <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={onNewProject}>
            <Plus className="h-4 w-4 mr-1" /> New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 overflow-y-auto max-h-[calc(100%-60px)]">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="p-3 rounded-lg border border-border/50 hover:bg-muted/50 cursor-pointer transition-colors group relative"
            onClick={() => onSelectIdea(item)}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-sm line-clamp-1 pr-6">{item.title}</h3>
              {getStatusIcon(item.status)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</span>
              {getStatusBadge(item.status)}
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteProject(item.id)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {history.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No projects yet</p>
            <p className="text-sm mt-1">Create a new project to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}