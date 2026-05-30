import Link from "next/link";

type BoardCardProps = {
  id: string;
  name: string;
  createdAt: string;
};

export default function BoardCard({ id, name, createdAt }: BoardCardProps) {
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/boards/${id}`}
      className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] px-6 pt-6 pb-[calc(1.5rem+1px)] flex flex-col gap-2 hover:shadow-md transition-shadow w-[308px] shrink-0"
    >
      <p className="text-lg font-medium text-[#0a0a0a] leading-[27px] tracking-[-0.44px] truncate">
        {name}
      </p>
      <p className="text-sm font-medium text-[#717182] leading-5">{date}</p>
    </Link>
  );
}
