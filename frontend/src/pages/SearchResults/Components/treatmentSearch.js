// Case-insensitive match of a free-text query against the searchable treatment fields.
// Every word of the query must appear in at least one field.
export const matchesTreatmentQuery = (treatment, query) => {
  const q = (query ?? "").trim().toLowerCase();
  if (!q) return true;
  const tags = Array.isArray(treatment?.tags) ? treatment.tags : [treatment?.tags];
  const haystack = [
    treatment?.treatment_name,
    treatment?.category,
    treatment?.description,
    treatment?.location,
    ...tags,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return q.split(/\s+/).every((word) => haystack.includes(word));
};
