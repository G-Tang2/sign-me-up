"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { nanoid } from "nanoid";
import Button from "../components/ui/Button";
import FormInputField from "../components/ui/FormInputField";
import Time from "../components/ui/Time";
import Spinner from "../components/ui/Spinner";
import { User } from "@supabase/auth-js";
const SearchBoxWrapper = dynamic(
  () => import("../components/SearchBoxWrapper"),
  {
    ssr: false,
  }
);

type MaxParticipants = number | undefined;
type EventFee = number | undefined;
type EventData = {
  host_id: string;
  event_name: string;
  date: string;
  start_time: string;
  end_time: string;
  location_id: number;
  description: string;
  max_participants?: MaxParticipants;
  event_fee?: EventFee;
};

export default function CreatePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventLocation, setEventLocation] = useState({
    name: "",
    address: "",
  });
  const [eventDescription, setEventDescription] = useState("");
  const [maxParticipants, setMaxParticipants] =
    useState<MaxParticipants>(undefined);
  const [eventFee, setEventFee] = useState<EventFee>(undefined);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const createEvent = async (data: EventData) => {
    let attempts = 0;
    const maxAttempts = 5;
    while (attempts < maxAttempts) {
      const short_id = nanoid(10);
      console.log("Generated short id: ", short_id);
      const { error } = await supabase.from("events").upsert([
        {
          ...data,
          url_id: short_id,
        },
      ]);

      if (!error) {
        return { success: true };
      }
      if (error.code !== "23505") {
        // 23505 is the unique violation error code
        return { success: false, error };
      }
      attempts++;
    }
    return { success: false, error: 'Too many attempts (5) to generate unique short id' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    // trim all input values
    setEventName(eventName.trim());
    setEventDate(eventDate.trim());
    setEventStartTime(eventStartTime.trim());
    setEventEndTime(eventEndTime.trim());
    setEventDescription(eventDescription.trim());
    setEventLocation({
      name: eventLocation.name.trim(),
      address: eventLocation.address.trim(),
    });
    setMaxParticipants(
      maxParticipants === undefined || maxParticipants < 1
        ? undefined
        : maxParticipants
    );
    console.log("host id: ", user?.id);
    console.log("event name: ", eventName);
    console.log("event date: ", eventDate);
    console.log("event start time: ", eventStartTime);
    console.log("event end time: ", eventEndTime);
    console.log("event location: ", eventLocation);
    console.log("event description: ", eventDescription);
    console.log("max participants: ", maxParticipants);
    console.log("event fee: ", eventFee);

    const { data: location, error: locationError } = await supabase
      .from("locations")
      .upsert(
        [
          {
            name: eventLocation.name,
            address: eventLocation.address,
          },
        ],
        { onConflict: "address" }
      )
      .select()
      .single();
    if (locationError) {
      console.log("Error saving location: " + locationError.message);
      return;
    }

    if (user) {
      const eventData: EventData = {
        host_id: user.id,
        event_name: eventName,
        date: eventDate,
        start_time: eventStartTime,
        end_time: eventEndTime,
        location_id: location.id,
        description: eventDescription,
        max_participants: maxParticipants,
        event_fee: eventFee,
      };
      const res = createEvent(eventData);

      if (!(await res).success) {
        console.error("Event error", (await res).error);
      } else {
        console.log("Event created successfully");
        router.push("/create/success");
      }
    } else {
      console.error("User not found, cannot create event.");
      alert("You must be logged in to create an event.");
      router.push("/login");
    }

    setLoading(false);
  };

  const handleLocationChange = (d: string) => {
    setEventLocation({ name: "", address: d });
  };

  const handleRetrieve = (res: any) => {
    const feature_type = res.features[0].properties.feature_type;
    if (feature_type === "address") {
      setEventLocation({
        name: "",
        address: res.features[0].properties.full_address,
      });
    } else {
      setEventLocation({
        name: res.features[0].properties.name,
        address: res.features[0].properties.full_address,
      });
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-12">
      <h1 className="text-4xl font-bold">Create Your Event</h1>
      <p className="mt-4 text-lg">
        Fill out the details below to create your event and share it with
        friends.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-md space-y-4">
        <div>
          <FormInputField
            label="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required={true}
          />
          <FormInputField
            label="Date"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required={true}
          />
          <Time
            leftValue={eventStartTime}
            rightValue={eventEndTime}
            leftOnChange={(e) => setEventStartTime(e.target.value)}
            rightOnChange={(e) => setEventEndTime(e.target.value)}
            required={true}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <SearchBoxWrapper
              value={(eventLocation.name + " " + eventLocation.address).trim()}
              onChange={handleLocationChange}
              onRetrieve={handleRetrieve}
              required={true}
            />
          </div>
          <FormInputField
            label="Fee (AUD)"
            type="number"
            value={eventFee ?? ""}
            onChange={(e) =>
              setEventFee(
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
          />
          <FormInputField
            label="Max Participants"
            type="number"
            value={maxParticipants ?? ""}
            onChange={(e) =>
              setMaxParticipants(
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
          />

          <FormInputField
            label="Description"
            type="textarea"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            multiLine={true}
            required={true}
          />
        </div>
        <Button text="Submit" />
      </form>
    </div>
  );
}
