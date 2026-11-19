// Shared helpers for the admin dashboard

export const FALLBACK_IMAGES = {
  hospital:
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1773&auto=format&fit=crop",
  hotel:
    "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop",
  treatment:
    "https://plus.unsplash.com/premium_photo-1664456804517-f6347600b764?q=80&w=1936&auto=format&fit=crop",
};

// Swap a broken image URL for the fallback (only once, to avoid loops)
export const withFallback = (fallback) => (e) => {
  if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
};

// Pull the most useful message out of an axios error from our backend
export const getErrorMessage = (err, fallback = "Something went wrong") => {
  const data = err?.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  const error = data?.error;
  if (typeof error === "string" && error.trim()) {
    const dup = error.match(/E11000.*dup key: \{ (\w+): "?([^"}]*)"? \}/);
    return dup ? `${dup[1]} "${dup[2].trim()}" already exists` : error;
  }
  // serialized Mongo/Mongoose errors (hotel controller sends the raw object)
  if (error?.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0];
    return field
      ? `${field} "${error.keyValue[field]}" already exists`
      : "A record with this ID already exists";
  }
  const firstValidation = error?.errors && Object.values(error.errors)[0];
  if (firstValidation?.message) return firstValidation.message;
  if (error?.message) return error.message;
  if (data?.message) return data.message;
  return fallback;
};

// "" -> undefined so optional numeric fields don't hit schema min/max validators
export const toOptionalNumber = (value) =>
  value === "" || value === null || value === undefined
    ? undefined
    : Number(value);

export const scrollToTop = () =>
  window.scrollTo({ top: 0, behavior: "smooth" });
