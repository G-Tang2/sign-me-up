export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  const datePart = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });

  const timePart = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,  // 24-hour format
  });

  return `${datePart} ${timePart}`;
}