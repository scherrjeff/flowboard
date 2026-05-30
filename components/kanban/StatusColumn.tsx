"use client";

import TaskCard from "@/components/kanban/TaskCard";

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
  title: string;
  status: string;
  cards: Card[];
  onAddCard: (status: string) => void;
  onEditCard: (card: Card) => void;
  droppableProps?: React.HTMLAttributes<HTMLDivElement>;
  innerRef?: React.Ref<HTMLDivElement>;
};

export default function StatusColumn({
  title,
  cards,
  status,
  onAddCard,
  onEditCard,
  droppableProps,
  innerRef,
}: Props) {
  return (
    <div className="bg-[#f3f4f6] rounded-[10px] p-4 flex flex-col gap-4 w-[319px] shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#0a0a0a] leading-5">{title}</span>
        <span className="bg-white text-[#717182] text-xs rounded-full px-2 py-0.5 leading-4">
          {cards.length}
        </span>
      </div>

      {/* Cards area */}
      <div
        ref={innerRef}
        {...droppableProps}
        className="flex flex-col gap-2 flex-1 min-h-[120px]"
      >
        {cards.length === 0 ? (
          <div className="border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-[10px] flex flex-col items-center justify-center gap-2 p-8 flex-1">
            {/* Upload / add icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#717182]"
              aria-hidden="true"
            >
              <path
                d="M12 16V8M12 8l-3 3M12 8l3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 20h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-sm text-[#717182] text-center leading-5">
              Drop a card here or add one below
            </p>
          </div>
        ) : (
          cards.map((card) => (
            <TaskCard key={card.id} card={card} onEdit={onEditCard} />
          ))
        )}
      </div>

      {/* Add card button */}
      <button
        onClick={() => onAddCard(status)}
        className="flex items-center gap-2 text-sm font-medium text-[#717182] hover:text-[#0a0a0a] transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 3v10M3 8h10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Add card
      </button>
    </div>
  );
}
