"use client";

import { useRef, useState } from "react";
import Button from "../components/ui/Button";
import FormInputField from "../components/ui/FormInputField";
import FormInputSwitch from "../components/ui/FormInputSwitch";
import Autocomplete from "react-google-autocomplete";

type MaxParticipants = number | undefined;

type EventFee = {
  hasFee: boolean;
  fee: number | undefined;
  fixed: boolean;
};

export default function CreatePage() {
  const [hostName, setHostName] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventDuration, setEventDuration] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [maxParticipants, setMaxParticipants] =
    useState<MaxParticipants>(undefined);
  const [eventFee, setEventFee] = useState<EventFee>({
    hasFee: false,
    fee: undefined,
    fixed: false,
  });

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const locationInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      hostName,
      eventName,
      eventDate,
      eventTime,
      eventLocation,
      eventDescription,
      eventFee,
      maxParticipants,
    });
  };

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    console.log("Selected Location:", selectedLocation);
    setEventLocation(selectedLocation);
    // if (locationInputRef.current) {
    //   locationInputRef.current.value = selectedLocation;
    // }
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
          <FormInputField
            label="Time"
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required={true}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (hrs)
            </label>
            <input
              type="number"
              min={0.5}
              max={6}
              step={0.5}
              value={eventDuration}
              onChange={(e) => setEventDuration(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required={true}
            />
          </div>
          <Autocomplete
            apiKey={apiKey}
            style={{ width: "90%" }}
            ref={locationInputRef}
            onChange={handleLocationChange}
            onPlaceSelected={(place) => {
                  if (locationInputRef.current) {
              console.log(locationInputRef.current.value);
              console.log("Selected Place:", place.formatted_address);
            }
          }}
            options={{
              types: ["geocode", "establishment"],
              componentRestrictions: { country: "au" },
            }}
          />;
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
          <FormInputSwitch
            label="Is there a fee?"
            checked={eventFee.hasFee}
            onChange={() =>
              setEventFee({
                ...eventFee,
                fee: undefined,
                hasFee: !eventFee.hasFee,
                fixed: false,
              })
            }
          />
          {eventFee.hasFee && (
            <>
              <FormInputSwitch
                label="Is it a fixed fee?"
                checked={eventFee.fixed}
                onChange={() =>
                  setEventFee({ ...eventFee, fixed: !eventFee.fixed })
                }
              />
              {eventFee.fixed && (
                <div className="mt-4">
                  <FormInputField
                    label="Fee (AUD)"
                    type="number"
                    value={eventFee.fee ?? ""}
                    onChange={(e) =>
                      setEventFee({
                        ...eventFee,
                        fee:
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                      })
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>
        <Button text="Submit" />
      </form>
    </div>
  );
}
