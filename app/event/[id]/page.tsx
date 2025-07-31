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
  url_id: string;
};

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [event, setEvent] = useState<Event | null>(null);
  const [location, setLocation] = useState<{
    name: string;
    address: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const resolvedParams = use(params);

  const id = resolvedParams.id;

  useEffect(() => {
    console.log("Fetching event with ID:", id);
    const fetchData = async () => {
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("url_id", id)
        .single();

      if (eventError) {
        console.error("Error fetching event:", eventError);
        setEvent(null);
        setLoading(false);
        return;
      } else {
        setEvent(eventData);
      }

      if (event?.location_id) {
        const { data: locationData, error: locationError } = await supabase
          .from("locations")
          .select("*")
          .eq("id", event.location_id)
          .single();

        if (locationError) {
          console.error("Error fetching location:", locationError);
        } else {
          setLocation(locationData);
        }
      }
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

  return (
    <div className="p-12">
      <h1 className="text-4xl font-bold mb-4">{event.event_name}</h1>
      <p className="text-lg mb-2">Created by: {event.created_by}</p>
      <p className="text-lg mb-2">Date: {event.date}</p>
      <p className="text-lg mb-2">
        Time: {event.start_time} - {event.end_time}
      </p>
      <p className="text-lg mb-2">Location: {event.location_id}</p>
      <p className="text-lg mb-2">Description: {event.description}</p>
      <p className="text-lg mb-2">Max Participants: {event.max_participants}</p>
      <p className="text-lg mb-2">Event Fee: ${event.event_fee || "Free"}</p>
    </div>
  );
}
