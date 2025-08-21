import { supabase } from "./supabase";

export async function fetchParticipants(eventId: string) {
  const { data: participantsData, error: participantsError } = await supabase
    .from("participants")
    .select("users(name)")
    .eq("event_id", eventId);

  if (participantsError) {
    console.error("Error fetching participants:", participantsError);
    return [];
  } else {
    console.log("Participants data:", participantsData);
    return participantsData || [];
  }
}
