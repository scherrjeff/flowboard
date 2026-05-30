"use client";

type Card = {
  id: string;
  title: string;
  description: string | null;
  priority: string | null;
  due_date: string | null;
  status: string;
  position: number;
};

type Props = {
  card: Card;
  onEdit: (card: Card) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
};

export default function TaskCard({ card, onEdit, dragHandleProps, isDragging }: Props) {
  return (
    <div
      {...dragHandleProps}
      onClick={() => onEdit(card)}
      className={`bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] px-[13px] pt-[13px] pb-[13px] cursor-pointer hover:shadow-sm transition-shadow ${
        isDragging ? "opacity-50 shadow-md" : ""
      }`}
    >
      <p className="text-sm text-[#0a0a0a] leading-5 tracking-[-0.15px]">
        {card.title}
      </p>
      {(card.priority || card.due_date) && (
        <div className="flex items-center gap-2 mt-2">
          {card.priority && (
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wide ${
                card.priority === "high"
                  ? "bg-red-100 text-red-700"
                  : card.priority === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {card.priority}
            </span>
          )}
          {card.due_date && (
            <span className="text-[10px] text-[#717182]">
              {new Date(card.due_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
