// Single source of truth for how application statuses look in the UI.
// Keys are the backend enum values (including its historical spellings,
// e.g. 'initilal_assessment' and 'travel_accomodation') and must not change.

export const STATUS_LABELS = {
  initilal_assessment: "Initial Assessment",
  document_verification: "Document Verification",
  board_meeting: "Medical Board Review",
  travel_accomodation: "Travel & Accommodation",
  insurance: "Insurance",
  approved: "Approved",
  rejected: "Not Approved",
};

export const STATUS_BADGE_CLASSES = {
  initilal_assessment: "bg-amber-100 text-amber-800",
  document_verification: "bg-blue-100 text-blue-800",
  board_meeting: "bg-purple-100 text-purple-800",
  travel_accomodation: "bg-indigo-100 text-indigo-800",
  insurance: "bg-teal-100 text-teal-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export const statusLabel = (status) =>
  STATUS_LABELS[status] || status || "Pending";

export const statusBadgeClass = (status) =>
  STATUS_BADGE_CLASSES[String(status ?? "").toLowerCase()] ||
  "bg-gray-100 text-gray-700";
