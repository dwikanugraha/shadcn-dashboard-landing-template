import { Calendar } from "./components/calendar"
import { events, eventDates } from "./data"

export default function CalendarPage() {
  return (
    <div className="h-full">
      <Calendar events={events} eventDates={eventDates} />
    </div>
  )
}
