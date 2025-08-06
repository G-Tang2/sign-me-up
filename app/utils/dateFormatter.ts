export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const dateFormatted = date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return dateFormatted;
}
