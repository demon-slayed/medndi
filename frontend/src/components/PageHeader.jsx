import { cn } from "@/lib/utils";

// Shared page title block: accent bar + title, optional eyebrow, subtitle and actions.
const PageHeader = ({ eyebrow, title, subtitle, actions, className, as: Heading = "h1" }) => (
  <div
    className={cn(
      "mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
      className
    )}
  >
    <div className="min-w-0 space-y-3">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wider text-[#3252DF]">
          {eyebrow}
        </p>
      )}
      <div className="flex items-center gap-3">
        <div className="h-9 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-[#3252DF] to-[#4466ff]" />
        <Heading className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</Heading>
      </div>
      {subtitle && <p className="max-w-2xl text-gray-600">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
  </div>
);

export default PageHeader;
