import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Controlled treatment search bar.
 * - value / onChange: current input text
 * - onSubmit(text): called on Enter / Search click (optional)
 * - onClear(): clears the active search
 */
const SearchCard = ({
  value = "",
  onChange,
  onSubmit,
  onClear,
  title = "Available Medical Treatments",
  subtitle = "Find the best treatment options worldwide",
  placeholder = "Search by treatment, specialty or city...",
  resultCount,
}) => {
  return (
    <div className="w-full mb-10">
      <div className="bg-gradient-to-r from-[#3252DF]/5 to-blue-50/30 rounded-2xl">
        <div className="max-w-7xl mx-auto px-6 max-sm:px-2 max-sm:mx-auto py-6">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between mb-6 w-full max-sm:items-center max-sm:justify-center max-sm:text-center"
          >
            <div className="w-full sm:w-auto">
              <h1 className="text-2xl max-sm:text-2xl font-bold text-gray-900">
                {title}
              </h1>
              <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
            </div>
            {typeof resultCount === "number" && (
              <div className="bg-blue-50 px-4 py-2 rounded-lg mt-4 sm:mt-0">
                <span className="text-[#3252DF] font-semibold">
                  {resultCount} {resultCount === 1 ? "result" : "results"}
                </span>
              </div>
            )}
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-4"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit?.(value);
            }}
          >
            <div className="flex flex-wrap items-center gap-4">
              {/* Search Input */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-9 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3252DF]/20"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  {value && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => onClear?.()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Search Button */}
              <Button type="submit" className="bg-gradient-to-r from-[#3252DF] to-[#4466ff] text-white px-6">
                Search
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
