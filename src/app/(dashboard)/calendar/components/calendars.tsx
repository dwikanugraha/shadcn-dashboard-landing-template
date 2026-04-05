"use client"

import { useState } from "react"
import { Check, Plus, MoreHorizontal, Clock } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface TaskItem {
  id: string
  title: string
  color: string
  completed: boolean
  time?: string
}

interface CalendarsProps {
  onTaskToggle?: (taskId: string, completed: boolean) => void
  onTaskEdit?: (taskId: string) => void
  onTaskDelete?: (taskId: string) => void
  onNewTask?: () => void
}

// Task data
const tasks: TaskItem[] = [
  { id: "task-1", title: "Review project proposal", color: "bg-blue-500", completed: false, time: "10:00 AM" },
  { id: "task-2", title: "Team standup meeting", color: "bg-green-500", completed: false, time: "11:00 AM" },
  { id: "task-3", title: "Update documentation", color: "bg-pink-500", completed: false, time: "2:00 PM" },
  { id: "task-4", title: "Design review", color: "bg-red-500", completed: false, time: "3:00 PM" },
  { id: "task-5", title: "Code review", color: "bg-purple-500", completed: false, time: "4:00 PM" },
  { id: "task-6", title: "Client presentation", color: "bg-orange-500", completed: true, time: "Yesterday" },
  { id: "task-7", title: "Sprint planning", color: "bg-yellow-500", completed: true, time: "Monday" },
  { id: "task-8", title: "Bug fixes", color: "bg-red-600", completed: true, time: "Monday" }
]

export function Calendars({
  onTaskToggle,
  onTaskEdit,
  onTaskDelete,
  onNewTask
}: CalendarsProps) {
  const [taskData, setTaskData] = useState(tasks)

  const handleToggleComplete = (taskId: string) => {
    setTaskData(prev => prev.map(item =>
      item.id === taskId
        ? { ...item, completed: !item.completed }
        : item
    ))

    const task = taskData.find(t => t.id === taskId)
    if (task) {
      onTaskToggle?.(taskId, !task.completed)
    }
  }

  return (
    <div className="space-y-2">
      {taskData.map((item) => (
        <div key={item.id} className="group/task-item">
          <div className={cn(
            "flex items-center justify-between p-2.5 hover:bg-accent/50 rounded-md cursor-pointer transition-colors",
            item.completed && "opacity-60"
          )}>
            <div className="flex items-center gap-3 flex-1">
              {/* Task Checkbox */}
              <button
                onClick={() => handleToggleComplete(item.id)}
                className={cn(
                  "flex aspect-square size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all cursor-pointer",
                  item.completed
                    ? cn("border-transparent text-white", item.color)
                    : "border-muted-foreground/30 bg-transparent"
                )}
              >
                {item.completed && <Check className="size-3" />}
              </button>

              {/* Task Title */}
              <div className="flex-1">
                <span
                  className={cn(
                    "text-sm",
                    item.completed && "line-through text-muted-foreground"
                  )}
                >
                  {item.title}
                </span>
                {item.time && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </div>
                )}
              </div>
            </div>

            {/* More Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className="h-5 w-5 flex items-center justify-center p-0 opacity-0 group-hover/task-item:opacity-100 cursor-pointer hover:bg-accent rounded-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="right">
                <DropdownMenuItem
                  onClick={() => onTaskEdit?.(item.id)}
                  className="cursor-pointer"
                >
                  Edit task
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleToggleComplete(item.id)}
                  className="cursor-pointer"
                >
                  {item.completed ? "Mark incomplete" : "Mark complete"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onTaskDelete?.(item.id)}
                  className="cursor-pointer text-destructive"
                >
                  Delete task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}
