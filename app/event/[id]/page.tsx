"use client";

import Spinner from "@/app/components/ui/Spinner";
import { supabase } from "@/app/lib/supabase";
import { use, useEffect, useState } from "react";
import { formatTime } from "@/app/utils/timeFormatter";
import { formatDate } from "@/app/utils/dateFormatter";


export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const resolvedParams = use(params);

  const id = resolvedParams.id;

  useEffect(() => {
    console.log("Fetching event with ID:", id);
    const fetchData = async () => {
      const { data: eventData, error: eventError } = await supabase
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

      console.log("Event data fetched:", eventData);
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
    location
  } = event;
  console.log("Event details:", event);


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
        <span className="font-bold">Time: </span> {formatTime(start_time)} - {formatTime(end_time)}
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
    </div>
  );
}
