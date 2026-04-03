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
    <div className={`flex flex-col h-full bg-background ${className}`}>
      {/* Add New Event Button */}
      <div className="p-5 border-b bg-muted/30">
        <Button
          className="w-full h-10 font-medium"
          onClick={onNewEvent}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Date Picker */}
      <div className="p-5">
        <DatePicker
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          events={events}
        />
      </div>

      <Separator className="mx-5" />

      {/* Calendars */}
      <div className="flex-1 p-5 overflow-y-auto">
        <Calendars
          onNewCalendar={onNewCalendar}
          onCalendarToggle={(calendarId, visible) => {
            console.log(`Calendar ${calendarId} visibility: ${visible}`)
          }}
          onCalendarEdit={(calendarId) => {
            console.log(`Edit calendar: ${calendarId}`)
          }}
          onCalendarDelete={(calendarId) => {
            console.log(`Delete calendar: ${calendarId}`)
          }}
        />
      </div>
    </div>
  )
}
