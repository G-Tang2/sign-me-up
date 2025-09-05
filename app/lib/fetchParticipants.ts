import { supabase } from "./supabase";

export async function fetchParticipants(eventId: string) {
  const { data: participantsData, error: participantsError } = await supabase
    .from("participants")
    .select("id, created_at, user_id, users(name), events(host_id), waitlist, display_name")
    .eq("event_id", eventId);

  if (participantsError) {
    console.error("Error fetching participants:", participantsError);
    return [];
  } else {
    console.log("Participants data:", participantsData);
    return participantsData || [];
  }
}
