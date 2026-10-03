import { cn } from "@/lib/utils";

export default function Logo({
  size = 36,
  showText = true,
  className,
}: {
  size?: number;
  showText?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 font-semibold tracking-tight",
        className,
      )}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="40" height="40" rx="12" fill="#0d9488" />
        <path
          d="M10 10v7a7 7 0 0 0 14 0v-7M10 10h3m8 0h3M17 24v3a6 6 0 0 0 12 0v-5"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="29" cy="19" r="3" stroke="white" strokeWidth="2.4" />
      </svg>
      {showText && <span>Doctor Tracker</span>}
    </span>
  );
}
