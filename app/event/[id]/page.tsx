"use client";

import Spinner from "@/app/components/ui/Spinner";
import { supabase } from "@/app/lib/supabase";
import { use, useEffect, useState } from "react";

type Event = {
    id: string;
    created_by: string;
    event_name: string;
    date: string;
    start_time: string;
    end_time: string;
    location_id: string;
    description: string;
    max_participants?: number;
    event_fee?: number;
    };
export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

    const resolvedParams = use(params);

    const id = resolvedParams.id;

  useEffect(() => {
    console.log("Fetching event with ID:", id);
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching event:", error);
      } else {
        setEvent(data);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (!event) {
    return <p>Event not found.</p>;
  }

  return (
    <div className="p-12">
      <h1 className="text-4xl font-bold mb-4">{event.event_name}</h1>
        <p className="text-lg mb-2">Created by: {event.created_by}</p>
      <p className="text-lg mb-2">Date: {event.date}</p>
      <p className="text-lg mb-2">Time: {event.start_time} - {event.end_time}</p>
      <p className="text-lg mb-2">Location: {event.location_id}</p>
      <p className="text-lg mb-2">Description: {event.description}</p>
      <p className="text-lg mb-2">Max Participants: {event.max_participants}</p>
      <p className="text-lg mb-2">Event Fee: ${event.event_fee || "Free"}</p>
    </div>
  );
}