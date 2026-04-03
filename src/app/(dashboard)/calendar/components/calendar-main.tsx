"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  MoreHorizontal,
  Search,
  Grid3X3,
  List,
  ChevronDown,
  Menu,
  Plus
} from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { type CalendarEvent } from "../types"
import eventsData from "../data/events.json"

interface CalendarMainProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  onMenuClick?: () => void
  events?: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
}

const eventColors = {
  meeting: "bg-indigo-500/90 hover:bg-indigo-500",
  event: "bg-emerald-500/90 hover:bg-emerald-500",
  personal: "bg-amber-500/90 hover:bg-amber-500",
  task: "bg-sky-500/90 hover:bg-sky-500",
  reminder: "bg-rose-500/90 hover:bg-rose-500"
}

const eventBorderColors = {
  meeting: "border-l-indigo-500",
  event: "border-l-emerald-500",
  personal: "border-l-amber-500",
  task: "border-l-sky-500",
  reminder: "border-l-rose-500"
}

export function CalendarMain({ selectedDate, onDateSelect, onMenuClick, events, onEventClick }: CalendarMainProps) {
  const sampleEvents: CalendarEvent[] = events || eventsData.map(event => ({
    ...event,
    date: new Date(event.date),
    type: event.type as "meeting" | "event" | "personal" | "task" | "reminder"
  }))

  const [currentDate, setCurrentDate] = useState(selectedDate || new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "list">("month")
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  const calendarStart = new Date(monthStart)
  calendarStart.setDate(calendarStart.getDate() - monthStart.getDay())

  const calendarEnd = new Date(monthEnd)
  calendarEnd.setDate(calendarEnd.getDate() + (6 - monthEnd.getDay()))

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getEventsForDay = (date: Date) => {
    return sampleEvents.filter(event => isSameDay(event.date, date))
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleEventClick = (event: CalendarEvent) => {
    if (onEventClick) {
      onEventClick(event)
    } else {
      setSelectedEvent(event)
      setShowEventDialog(true)
    }
  }

  const renderCalendarGrid = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
      <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden">
        {/* Calendar Header - Week Days */}
        <div className="grid grid-cols-7 border-b bg-muted/30">
          {weekDays.map(day => (
            <div key={day} className="py-3 px-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
          {calendarDays.map(day => {
            const dayEvents = getEventsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isDayToday = isToday(day)
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-[140px] border-r border-b last:border-r-0 p-1.5 cursor-pointer transition-all duration-200",
                  isCurrentMonth ? "bg-background hover:bg-accent/30" : "bg-muted/20 text-muted-foreground",
                  isSelected && "ring-2 ring-primary ring-inset bg-accent/20",
                  isDayToday && !isSelected && "bg-accent/10"
                )}
                onClick={() => onDateSelect?.(day)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={cn(
                    "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                    isDayToday && "bg-primary text-primary-foreground",
                    isSelected && !isDayToday && "bg-primary/20 text-primary"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className={cn(
                        "group relative overflow-hidden rounded-md px-2 py-1.5 text-xs text-white cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md",
                        eventColors[event.type]
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEventClick(event)
                      }}
                    >
                      <div className="flex items-center gap-1.5 truncate font-medium">
                        <Clock className="w-3 h-3 flex-shrink-0 opacity-80" />
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs font-medium text-muted-foreground text-center py-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderListView = () => {
    const upcomingEvents = sampleEvents
      .filter(event => event.date >= new Date())
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    return (
      <div className="flex-1 p-6">
        <div className="space-y-4">
          {upcomingEvents.map(event => (
            <Card key={event.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleEventClick(event)}>
              <CardContent className="px-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn("w-3 h-3 rounded-full mt-1.5", event.color)} />
                    <div className="flex-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center flex-wrap gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {format(event.date, 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center flex-wrap gap-1">
                          <Clock className="w-4 h-4" />
                          {event.time}
                        </div>
                        <div className="flex items-center flex-wrap gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {event.attendees.slice(0, 3).map((attendee, index) => (
                        <Avatar key={index} className="border-2 border-background">
                          <AvatarFallback className="text-xs">{attendee}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="cursor-pointer">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 p-6 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              onClick={onMenuClick}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={goToToday} className="h-9">
                Today
              </Button>
            </div>

            <h1 className="text-2xl font-bold">
              {format(currentDate, 'MMMM yyyy')}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search events..." className="pl-10 w-64 h-9" />
            </div>

            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Event</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 px-3">
                {viewMode === "month" && <Grid3X3 className="w-4 h-4 mr-2" />}
                {viewMode === "list" && <List className="w-4 h-4 mr-2" />}
                {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewMode("month")}>
                <Grid3X3 className="w-4 h-4 mr-2" />
                Month
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("list")}>
                <List className="w-4 h-4 mr-2" />
                List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "month" ? renderCalendarGrid() : renderListView()}
      </div>

      {/* Event Detail Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              View and manage this calendar event
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-5 pt-2">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center text-white",
                  eventColors[selectedEvent.type].split(' ')[0]
                )}>
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">{format(selectedEvent.date, 'EEEE, MMMM d, yyyy')}</div>
                  <div className="text-sm text-muted-foreground">{selectedEvent.time} ({selectedEvent.duration})</div>
                </div>
              </div>

              {selectedEvent.location && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="font-medium">{selectedEvent.location}</div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedEvent.attendees.length} Attendees:</span>
                  <div className="flex -space-x-2">
                    {selectedEvent.attendees.map((attendee: string, index: number) => (
                      <Avatar key={index} className="w-7 h-7 border-2 border-background">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {attendee}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" className="flex-1 mr-2" onClick={() => setShowEventDialog(false)}>
                  Edit Event
                </Button>
                <Button variant="destructive" className="flex-1 ml-2" onClick={() => setShowEventDialog(false)}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
