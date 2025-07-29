"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
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

type Duration = number | undefined;
type MaxParticipants = number | undefined;
type EventFee = number | undefined;

export default function CreatePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const [hostName, setHostName] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventDuration, setEventDuration] = useState<Duration>(undefined);
  const [eventLocation, setEventLocation] = useState({
    name: "",
    full_address: "",
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
      }
      else {
        setUser(user);
      }
      setLoading(false);
      console.log("User: ", user);
    };
    checkUser();
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // trim all input values
    setHostName(hostName.trim());
    setEventName(eventName.trim());
    setEventDate(eventDate.trim());
    setEventStartTime(eventStartTime.trim());
    setEventEndTime(eventEndTime.trim());
    setEventDuration(eventDuration);
    setEventDescription(eventDescription.trim());
    setEventLocation({
      name: eventLocation.name.trim(),
      full_address: eventLocation.full_address.trim(),
    });
    setMaxParticipants(
      maxParticipants === undefined || maxParticipants < 1
        ? undefined
        : maxParticipants
    );
    console.log("host name: ", hostName);
    console.log("event name: ", eventName);
    console.log("event date: ", eventDate);
    console.log("event start time: ", eventStartTime);
    console.log("event end time: ", eventEndTime);
    console.log("event duration: ", eventDuration);
    console.log("event location: ", eventLocation);
    console.log("event description: ", eventDescription);
    console.log("max participants: ", maxParticipants);
    console.log("event fee: ", eventFee);
  };

  const handleLocationChange = (d: string) => {
    setEventLocation({ name: "", full_address: d });
  };

  const handleRetrieve = (res: any) => {
    const feature_type = res.features[0].properties.feature_type;
    console.log(res);
    if (feature_type === "address") {
      setEventLocation({
        name: "",
        full_address: res.features[0].properties.full_address,
      });
    } else {
      setEventLocation({
        name: res.features[0].properties.name,
        full_address: res.features[0].properties.full_address,
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
            label="Host Name"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            required={true}
          />
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
              value={(
                eventLocation.name +
                " " +
                eventLocation.full_address
              ).trim()}
              onChange={handleLocationChange}
              onRetrieve={handleRetrieve}
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
          />
        </div>
        <Button text="Submit" />
      </form>
    </div>
  );
}
