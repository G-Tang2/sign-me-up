type EventBase = {
  created_at: string;
  event_name: string;
  date: string;
  start_time: string;
  end_time: string;
  description: string;
  max_participants?: number;
  event_fee?: number;
  url_id: string;
};

export type EventToDisplay = EventBase & {
  host: { name: string };
  location: { name: string; address: string };
};

