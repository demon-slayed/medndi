// Shared cost estimate for the booking summary, review step and saved total_cost.

// "5-7 days" -> 7, "2-3 weeks" -> 21, "10 days" -> 10, "Varies" -> null
export const stayNights = (duration) => {
  if (!duration) return null;
  const numbers = String(duration).match(/\d+/g);
  if (!numbers) return null;
  const days = Math.max(...numbers.map(Number));
  return /week/i.test(duration) ? days * 7 : days;
};

export const formatINR = (value) =>
  value == null ? "—" : `₹${Number(value).toLocaleString("en-IN")}`;

export const getBookingEstimate = ({ treatment, hotel, plan }) => {
  const treatmentMin = treatment?.estimated_cost?.min ?? 0;
  const treatmentMax = treatment?.estimated_cost?.max ?? 0;
  const nights = stayNights(treatment?.duration);
  const nightlyRate = hotel?.price_per_night ?? null;
  // Without a known stay length, quote a single night so the total stays a floor, not a guess
  const hotelTotal = nightlyRate != null ? nightlyRate * (nights ?? 1) : 0;
  const insurance = plan?.price ?? 0;

  return {
    treatmentMin,
    treatmentMax,
    nights,
    nightlyRate,
    hotelTotal,
    insurance,
    totalMin: treatmentMin + hotelTotal + insurance,
    totalMax: treatmentMax + hotelTotal + insurance,
  };
};
