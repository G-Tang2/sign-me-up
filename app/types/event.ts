type EventBase = {
  created_at: string;
  event_name: string;
  date: string;
  start_time: string;
  end_time: string;
  description: string;
  max_participants?: number;
  event_fee?: number;
};

export type EventFromDB = EventBase & {
    id: string;
    created_by: string;
    location_id: string;
    url_id: string;
}

export type EventToDisplay = EventBase & {
    host_name: string;
    location_name: string;
    location_address: string;
}