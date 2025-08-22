import { EventToDisplay } from "@/app/types/event";
import { formatTime } from "@/app/utils/timeFormatter";
import { formatDate } from "@/app/utils/dateFormatter";
import Link from "next/link";
import { LabelValue } from "./LabelValue";
import {
  CalendarDays,
  CircleDollarSign,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";

export default function EventCard({ event }: { event: EventToDisplay }) {
  const {
    event_name,
    date,
    start_time,
    end_time,
    event_fee,
    max_participants,
    participants,
    location,
    url_id,
  } = event;

  return (
    <Link
      href={`/event/${url_id}`}
      className="block px-5 py-3 border rounded-xl hover:shadow-lg transition-shadow bg-white"
    >
      <div className="space-y-1 mb-1">
        <h1 className="text-xl font-bold leading-tight">{event_name}</h1>
        <div className="grid grid-cols-3">
          <div className="col-span-2">
            <LabelValue icon={CalendarDays} value={formatDate(date)} />
          </div>
          <div className="col-span-1">
            <LabelValue
              icon={CircleDollarSign}
              value={event_fee ? `$${event_fee.toFixed(2)}` : "Free"}
            />
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div className="col-span-2">
            <LabelValue
              icon={Clock3}
              value={`${formatTime(start_time)} - ${formatTime(end_time)}`}
            />
          </div>
          <div className="col-span-1">
            <LabelValue
              icon={Users}
              value={
                max_participants
                  ? `${participants.length}/${max_participants}`
                  : participants.length
              }
            />
          </div>
        </div>
        <div>
          <LabelValue icon={MapPin} value={location.name} />
        </div>
      </div>
    </Link>
  );
}
