const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatTimestamp(timestamp: number) {
  return dateFormatter.format(timestamp);
}
