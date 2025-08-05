import { EventToDisplay } from "@/app/types/event";

export default function EventCard({ event }: { event: EventToDisplay }) {
  return (
    <div className="event-card">
      <h2>{event.event_name}</h2>
      <p>{event.date}</p>
      <p>{event.start_time} - {event.end_time}</p>
      <p>Hosted by: {event.host["name"]}</p>
      <p>Location: {event.location["name"]}, {event.location["address"]}</p>
      <p>Description: {event.description}</p>
      {event.max_participants && <p>Max Participants: {event.max_participants}</p>}
      {event.event_fee && <p>Event Fee: ${event.event_fee.toFixed(2)}</p>}
    </div>
  );
}