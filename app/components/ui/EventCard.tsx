import { EventToDisplay } from "@/app/types/event";
import Link from "next/link";

const LabelValue = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <p className="flex">
    <span className="font-bold">{label}</span>
    <span className="ml-1">{value}</span>
  </p>
);

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  const ampm = +hours >= 12 ? "PM" : "AM";
  const formattedHours = +hours % 12 || 12; // Convert to 12-hour format
  return `${formattedHours}:${minutes} ${ampm}`;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const dateFormatted = date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return dateFormatted;
};

export default function EventCard({ event }: { event: EventToDisplay }) {
  const {
    event_name,
    date,
    start_time,
    end_time,
    event_fee,
    max_participants,
    location,
    description,
    url_id,
  } = event;

  return (
    <Link
      href={`/event/${url_id}`}
      className="block p-4 border rounded-lg hover:shadow-lg transition-shadow"
    >
      <div className="event-card">
        <h1 className="text-2xl font-bold">{event_name}</h1>

        <div className="flex w-full">
          <div className="w-1/2 text-left">
            <LabelValue label="Date:" value={formatDate(date)} />
          </div>
          <div className="w-1/2 text-left">
            <LabelValue
              label="Time:"
              value={`${formatTime(start_time)} - ${formatTime(end_time)}`}
            />
          </div>
        </div>

        <div className="flex w-full">
          <div className="w-1/2 text-left">
            <LabelValue
              label="Fee:"
              value={event_fee ? `$${event_fee.toFixed(2)}` : "Free"}
            />
          </div>
          <div className="w-1/2 text-left">
            <LabelValue
              label="Participants"
              value={max_participants ? `0/${max_participants}` : "0"}
            />
          </div>
        </div>

        <div>
          <p className="font-bold">Location:</p>
          <p className="leading-tight">
            {location.name} <br />
            {location.address}
          </p>
        </div>

        <div>
          <p className="font-bold">Description:</p>
          <p className="leading-tight">{description}</p>
        </div>
      </div>
    </Link>
  );
}
