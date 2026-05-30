export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-[#0369a1] flex items-center justify-center rounded-[10px] ${className}`}
    >
      {/* Kanban grid icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="2" y="3" width="4" height="10" rx="1" fill="white" />
        <rect x="8" y="3" width="4" height="7" rx="1" fill="white" />
        <rect x="14" y="3" width="4" height="13" rx="1" fill="white" />
      </svg>
    </div>
  );
}
