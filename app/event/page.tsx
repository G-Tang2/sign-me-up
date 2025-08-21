"use client";

import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { supabase } from "../lib/supabase";
import EventCard from "../components/ui/EventCard";
import { fetchParticipants } from "../lib/fetchParticipants";

export default function UserEventPage() {
  const { user, loading } = useUserContext();
  const [hostEvents, setHostEvents] = useState<any[]>([]);
  const [participatingEvents, setParticipatingEvents] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const getEvents = async () => {
      if (!user) return;

      // get events for which the user is a participant
      const { data: participatingEventIds, error: participantError } =
        await supabase
          .from("participants")
          .select("event_id")
          .eq("user_id", user.id);

      let distinctParticipatingEventIds: string[] = [];
      if (participantError)
        console.error("Error fetching participant events:", participantError);
      else {
        distinctParticipatingEventIds = [
          ...new Set(participatingEventIds.map((p) => p.event_id)),
        ];
        console.log("Participating event IDs:", distinctParticipatingEventIds);
      }

      const { data: participantEvents, error: participantEventsError } =
        await supabase
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
          .in("id", distinctParticipatingEventIds);

      console.log("Participant events:", participantEvents);

      if (participantEventsError) {
        console.error("Error fetching participant events:", participantEventsError);
      }
      else {
        const eventsWithParticipants = [];
        for (const event of participantEvents) {
          const participants = await fetchParticipants(event.id);
          eventsWithParticipants.push({ ...event, participants: participants });
        }
        setParticipatingEvents(eventsWithParticipants);
      }

      // get events hosted by the user

      const { data: hostedEvents, error: hostedEventsError } = await supabase
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

      console.log("Hosted events:", hostedEvents);

      if (hostedEventsError) {
        console.error("Error fetching events:", hostedEventsError);
      } else {
        const eventsWithParticipants = [];
        for (const event of hostedEvents) {
          const participants = await fetchParticipants(event.id);
          eventsWithParticipants.push({ ...event, participants: participants });
        }
        setHostEvents(eventsWithParticipants);
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
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <h2 className="text-xl font-semibold mb-2">My Hosted Events</h2>
      {hostEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-4">
          {hostEvents.map((event, index) => (
            <li key={index}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
      <h2 className="text-xl font-semibold mb-2">My Upcoming Events</h2>
      {participatingEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-4">
          {participatingEvents.map((event, index) => (
            <li key={index}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
