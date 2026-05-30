"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
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
};

export default function StatusColumn({
  title,
  cards,
  status,
  onAddCard,
  onEditCard,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="bg-[#f3f4f6] rounded-[10px] p-4 flex flex-col gap-4 w-[319px] shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#0a0a0a] leading-5">{title}</span>
        <span className="bg-white text-[#717182] text-xs rounded-full px-2 py-0.5 leading-4">
          {cards.length}
        </span>
      </div>

      {/* Cards drop zone */}
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex flex-col gap-2 flex-1 min-h-[120px] rounded-[10px] transition-colors ${
            isOver ? "bg-[#e0e7ff]/50" : ""
          }`}
        >
          {cards.length === 0 ? (
            <div className="border-2 border-dashed border-[rgba(0,0,0,0.1)] rounded-[10px] flex flex-col items-center justify-center gap-2 p-8 flex-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
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
      </SortableContext>

      {/* Add card button */}
      <button
        onClick={() => onAddCard(status)}
        className="flex items-center gap-2 text-sm font-medium text-[#717182] hover:text-[#0a0a0a] transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Add card
      </button>
    </div>
  );
}
