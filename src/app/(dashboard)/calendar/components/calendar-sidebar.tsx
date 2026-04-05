"use client"

import { Plus } from "lucide-react"

import { Calendars } from "./calendars"
import { DatePicker } from "./date-picker"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface CalendarSidebarProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  onNewCalendar?: () => void
  onNewEvent?: () => void
  events?: Array<{ date: Date; count: number }>
  className?: string
}

export function CalendarSidebar({
  selectedDate,
  onDateSelect,
  onNewCalendar,
  onNewEvent,
  events = [],
  className
}: CalendarSidebarProps) {
  return (
    <div className={`flex flex-col h-full bg-background rounded-lg ${className}`}>
      {/* Add New Task Button */}
      <div className="p-6 border-b">
        <Button
          className="w-full cursor-pointer"
          onClick={onNewEvent}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Task
        </Button>
      </div>

      {/* Date Picker */}
      <DatePicker
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        events={events}
      />

      <Separator />

      {/* Tasks */}
      <div className="flex-1 p-4">
        <Calendars
          onNewCalendar={onNewCalendar}
          onTaskToggle={(taskId, completed) => {
            console.log(`Task ${taskId} completed: ${completed}`)
          }}
          onTaskEdit={(taskId) => {
            console.log(`Edit task: ${taskId}`)
          }}
          onTaskDelete={(taskId) => {
            console.log(`Delete task: ${taskId}`)
          }}
        />
      </div>
    </div>
  )
}
