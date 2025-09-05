"use client";

import Spinner from "@/app/components/ui/Spinner";
import { supabase } from "@/app/lib/supabase";
import { use, useEffect, useState } from "react";
import { formatTime } from "@/app/utils/timeFormatter";
import { formatDate } from "@/app/utils/dateFormatter";
import { useUserContext } from "@/app/context/UserContext";
import { fetchParticipants } from "@/app/lib/fetchParticipants";
import { formatDateTime } from "@/app/utils/formatDateTime";
import { CircleMinus, UserPlus } from "lucide-react";
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
import { Input } from "@/components/ui/input";

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addParticipantOpen, setAddParticipantOpen] = useState(false);
  const [removeParticipantOpen, setRemoveParticipantOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
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

  const handleClick = async () => {
    if (user) {
      const participant: any = {
        event_id: event.id,
        waitlist: false,
        user_id: user.id,
      };

      if (name.trim() !== "") {
        participant.display_name = name.trim();
      }

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

  async function handleRemove() {
    if (selectedParticipant) {
      const { error } = await supabase
        .from("participants")
        .delete()
        .eq("id", selectedParticipant.id);
      if (error) {
        console.error("Error removing participant:", error);
      }
      const participantsData = await fetchParticipants(event.id);
      setParticipants(participantsData);
    }
    setRemoveParticipantOpen(false);
    setSelectedParticipant(null);
  }

  function handleOpen(participant: any): void {
    setSelectedParticipant(participant);
    setRemoveParticipantOpen(true);
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">{event_name}</h1>
      <p>
        <span className="font-bold">Created by: </span> {host.name}
      </p>
      <p>
        <span className="font-bold">Date: </span> {formatDate(date)}
      </p>
      <p>
        <span className="font-bold">Time: </span> {formatTime(start_time)} -{" "}
        {formatTime(end_time)}
      </p>
      <p>
        <span className="font-bold">Event Fee: </span>
        {event_fee ? `$${event_fee}` : "Free"}
      </p>
      {location && (
        <p>
          <span className="font-bold">Location: </span> <br />
          <span>{location.name}</span>
          <br />
          {location.address}
        </p>
      )}
      <p>
        <span className="font-bold">Description: </span> <br />
        {description}
      </p>
      <div>
        <span className="font-bold">
          Participants:{" "}
          {max_participants && `(${participants.length}/${max_participants})`}
        </span>
        <ul className="mt-1 w-full border border-gray-200 rounded-md divide-y divide-gray-200">
          {participants.length > 0 ? (
            participants.map((participant, index) => (
              <li
                key={index}
                className="flex justify-between items-center px-4 py-2 hover:bg-gray-50"
              >
                <div>
                  <span className="font-medium">
                    {index + 1}.{" "}
                    {participant.display_name || participant.users.name}
                  </span>
                  <span className="ml-2 text-xs text-gray-600">
                    {formatDateTime(participant.created_at)}
                  </span>
                </div>
                {participant.user_id === user?.id && (
                  <Dialog
                    open={removeParticipantOpen}
                    onOpenChange={setRemoveParticipantOpen}
                  >
                    <DialogTrigger asChild>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleOpen(participant)}
                      >
                        <CircleMinus className="cursor-pointer" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          Remove{" "}
                          {selectedParticipant?.display_name ||
                            selectedParticipant?.users.name}
                          ?
                        </DialogTitle>
                      </DialogHeader>
                      <DialogFooter className="flex flex-row justify-end gap-4 w-full">
                        <DialogClose asChild>
                          <Button
                            className="flex-1"
                            variant="outline"
                            type="button"
                            onClick={handleRemove}
                          >
                            No
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            className="flex-1"
                            variant="destructive"
                            type="button"
                            onClick={handleRemove}
                          >
                            Yes
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No participants yet.</li>
          )}
        </ul>
      </div>
      <Dialog open={addParticipantOpen} onOpenChange={setAddParticipantOpen}>
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
