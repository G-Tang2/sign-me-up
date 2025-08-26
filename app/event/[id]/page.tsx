"use client";

import Spinner from "@/app/components/ui/Spinner";
import { supabase } from "@/app/lib/supabase";
import { use, useEffect, useState } from "react";
import { formatTime } from "@/app/utils/timeFormatter";
import { formatDate } from "@/app/utils/dateFormatter";
import { useUserContext } from "@/app/context/UserContext";
import { fetchParticipants } from "@/app/lib/fetchParticipants";
import { formatDateTime } from "@/app/utils/formatDateTime";
import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

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
    console.log("User name input:", name);
    console.log("Event ID:", event.id);
    if (user) {
      // Build participant object
      const participant: any = {
        event_id: event.id,
        waitlist: false,
        user_id: user.id,
      };

      // Only include name if it's not empty
      if (name.trim() !== "") {
        participant.display_name = name.trim();
      }

      // Insert into Supabase
      const { error } = await supabase
        .from("participants")
        .insert([participant]);

      if (error) {
        console.error("Error adding participant:", error);
      }
    }

    const participantsData = await fetchParticipants(event.id);
    setParticipants(participantsData);
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">{event_name}</h1>
      <p className="text-lg">
        <span className="font-bold">Created by: </span> {host.name}
      </p>
      <p className="text-lg">
        <span className="font-bold">Date: </span> {formatDate(date)}
      </p>
      <p className="text-lg">
        <span className="font-bold">Time: </span> {formatTime(start_time)} -{" "}
        {formatTime(end_time)}
      </p>
      <p className="text-lg">
        <span className="font-bold">Event Fee: </span>
        {event_fee ? `$${event_fee}` : "Free"}
      </p>
      {location && (
        <p className="text-lg">
          <span className="font-bold">Location: </span> <br />
          <span>{location.name}</span>
          <br />
          {location.address}
        </p>
      )}
      <p className="text-lg">
        <span className="font-bold">Description: </span> <br />
        {description}
      </p>
      <div className="text-lg">
        <span className="font-bold">
          Participants:{" "}
          {max_participants && `(${participants.length}/${max_participants})`}
        </span>
        <ul>
          {participants.length > 0 ? (
            participants.map((participant, index) => (
              <li key={index} className="flex justify-between items-baseline">
                <span>{index + 1}. {participant.display_name || participant.users.name}</span>
                <span className="text-xs text-gray-600">{formatDateTime(participant.created_at)} by {participant.users.name}</span>
              </li>
            ))
          ) : (
            <li>No participants yet.</li>
          )}
        </ul>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-4 w-full">
            <UserPlus className="cursor-pointer" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Participant</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="name"
                placeholder="Enter a name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" onClick={handleClick}>
                Submit
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
