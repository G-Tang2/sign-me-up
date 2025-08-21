"use client";

import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { supabase } from "../lib/supabase";
import EventCard from "../components/ui/EventCard";
import { fetchParticipants } from "../lib/fetchParticipants";

export default function UserEventPage() {
  const { user, loading } = useUserContext();
  const [events, setEvents] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const getEvents = async () => {
      if (!user) return;

      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select(
          `
          id,
          created_at,
          event_name,
          date,
          start_time,
          end_time,
          description,
          max_participants,
          event_fee,
          url_id,
          host:users (
            name
          ),
          location:locations (
            name,
            address
          )
        `
        )
        .eq("host_id", user.id);

      if (eventError) {
        console.error("Error fetching events:", eventError);
      } else {
        const eventsWithParticipants = []
        for (const event of eventData) {
          const participants = await fetchParticipants(event.id);
          eventsWithParticipants.push({ ...event, participants: participants });
        }
        setEvents(eventsWithParticipants);
      }

      setFetching(false);
    };

    getEvents();
  }, [user]);

  if (loading || fetching) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Events</h1>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event, index) => (
            <li key={index}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
