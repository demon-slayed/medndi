// Formats an appointment date/time for display.
// New bookings store an ISO string; older bookings stored an already formatted
// en-IN string, which is shown as-is when the browser cannot parse it.
export const formatDateTime = (value, fallback = "Not specified") => {
  if (!value || (Array.isArray(value) && value.length === 0)) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : fallback;
  }
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
};

export default formatDateTime;
