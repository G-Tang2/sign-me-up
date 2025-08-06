export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const ampm = +hours >= 12 ? "PM" : "AM";
  const formattedHours = +hours % 12 || 12; // Convert to 12-hour format
  return `${formattedHours}:${minutes} ${ampm}`;
}
