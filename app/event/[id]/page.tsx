"use client";

import Spinner from "@/app/components/ui/Spinner";
import { supabase } from "@/app/lib/supabase";
import { use, useEffect, useState } from "react";
import { formatTime } from "@/app/utils/timeFormatter";
import { formatDate } from "@/app/utils/dateFormatter";
import { useUserContext } from "@/app/context/UserContext";
import { fetchParticipants } from "@/app/lib/fetchParticipants";

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const resolvedParams = use(params);

  const id = resolvedParams.id;
  const { user } = useUserContext();

  useEffect(() => {
    console.log("Fetching event with ID:", id);
    const fetchData = async () => {
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select(
          `
          id,
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
        .eq("url_id", id)
        .single();

      console.log("Event data:", eventData);

      if (eventError) {
        console.error("Error fetching event:", eventError);
        setEvent(null);
        setLoading(false);
        return;
      } else {
        setEvent(eventData);
      }

      const participantsData = await fetchParticipants(eventData.id);
      setParticipants(participantsData);

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <p className="text-xl font-medium text-gray-700 mb-4">
            Loading Event Details...
          </p>
          <Spinner />
        </div>
      </div>
    );
  }

  if (!event) {
    return <p>Event not found.</p>;
  }

  const {
    event_name,
    date,
    start_time,
    end_time,
    max_participants,
    event_fee,
    description,
    host,
    location,
  } = event;
  console.log("Event details:", event);

  const handleClick = async () => {
    console.log("Adding participant for user:", user?.id);
    console.log("Event ID:", event.id);
    const { error } = await supabase
      .from("participants")
      .insert([{ event_id: event.id, waitlist: false, user_id: user?.id }]);
    if (error) {
      console.error("Error adding participant:", error);
    }

    const participantsData = await fetchParticipants(event.id);
    setParticipants(participantsData);
  };

  return (
    <div className="p-12">
      <h1 className="text-4xl font-bold mb-4">{event_name}</h1>
      <p className="text-lg mb-2">
        <span className="font-bold">Created by: </span> {host.name}
      </p>
      <p className="text-lg mb-2">
        <span className="font-bold">Date: </span> {formatDate(date)}
      </p>
      <p className="text-lg mb-2">
        <span className="font-bold">Time: </span> {formatTime(start_time)} -{" "}
        {formatTime(end_time)}
      </p>
      <p className="text-lg mb-2">
        <span className="font-bold">Event Fee: </span>
        {event_fee ? `$${event_fee}` : "Free"}
      </p>
      {location && (
        <p className="text-lg mb-2">
          <span className="font-bold">Location: </span> <br />
          <span>{location.name}</span>
          <br />
          {location.address}
        </p>
      )}
      <p className="text-lg mb-2">
        <span className="font-bold">Description: </span> <br />
        {description}
      </p>
      <div className="text-lg mb-2">
        <span className="font-bold">Participants: {max_participants && `(${participants.length}/${max_participants})`}</span>
        <ul>
          {participants.length > 0 ? (
            participants.map((participant, index) => (
              <li key={index}>{index+1}. {participant.users.name}</li>
            ))
          ) : (
            <li>No participants yet.</li>
          )}
          </ul>
        </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleClick}
      >
        Add Participant
      </button>
    </div>
  );
}
