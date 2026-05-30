export default function Logo({
  className = "",
  color = "#0369a1",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-[10px] ${className}`}
      style={{ backgroundColor: color }}
    >
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
