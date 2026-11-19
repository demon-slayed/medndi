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
  title,
  subtitle,
  placeholder = "Search by treatment, specialty or city...",
  resultCount,
}) => {
  const showHeader = title || subtitle || typeof resultCount === "number";
  return (
    <div className="w-full mb-8">
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-end justify-between gap-3 mb-4"
        >
          <div className="min-w-0">
            {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
            {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
          </div>
          {typeof resultCount === "number" && (
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-[#3252DF] font-semibold">
                {resultCount} {resultCount === 1 ? "result" : "results"}
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* Search Bar */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(value);
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder}
              aria-label={placeholder}
              className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3252DF]/20 focus:border-[#3252DF]"
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

          {onSubmit && (
            <Button type="submit" variant="brand" className="h-10 px-5 shrink-0">
              <Search className="sm:hidden" />
              <span className="max-sm:sr-only">Search</span>
            </Button>
          )}
        </div>
      </motion.form>
    </div>
  );
};

export default SearchCard;
