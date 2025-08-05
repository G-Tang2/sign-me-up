"use client";

import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { supabase } from "../lib/supabase";
import EventCard from "../components/ui/EventCard";

export default function UserEventPage() {
  const { user, loading } = useUserContext();
  const [events, setEvents] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const getEvents = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("events")
        .select(
          `
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
        .eq("created_by", user.id);

      if (error) {
        console.error("Error fetching events:", error);
      } else {
        setEvents(data || []);
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
