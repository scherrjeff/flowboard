"use client";

import { useState } from "react";
import StatusColumn from "@/components/kanban/StatusColumn";
import CreateCardModal from "@/components/kanban/CreateCardModal";

type Card = {
  id: string;
  title: string;
  description: string | null;
  priority: string | null;
  due_date: string | null;
  status: string;
  position: number;
};

const COLUMNS = [
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "done", label: "Done" },
];

export default function KanbanBoard({
  boardId,
  initialCards,
}: {
  boardId: string;
  initialCards: Card[];
}) {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [modalState, setModalState] = useState<{
    open: boolean;
    defaultStatus: string;
    editCard: Card | null;
  }>({ open: false, defaultStatus: "todo", editCard: null });

  function openAddCard(status: string) {
    setModalState({ open: true, defaultStatus: status, editCard: null });
  }

  function openEditCard(card: Card) {
    setModalState({ open: true, defaultStatus: card.status, editCard: card });
  }

  function handleCardSaved(card: Card) {
    setCards((prev) => {
      const exists = prev.find((c) => c.id === card.id);
      if (exists) return prev.map((c) => (c.id === card.id ? card : c));
      return [...prev, card];
    });
    setModalState({ open: false, defaultStatus: "todo", editCard: null });
  }

  function handleCardDeleted(cardId: string) {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    setModalState({ open: false, defaultStatus: "todo", editCard: null });
  }

  return (
    <>
      <div className="flex gap-4 items-start overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <StatusColumn
            key={col.id}
            title={col.label}
            status={col.id}
            cards={cards.filter((c) => c.status === col.id).sort((a, b) => a.position - b.position)}
            onAddCard={openAddCard}
            onEditCard={openEditCard}
          />
        ))}
      </div>

      {modalState.open && (
        <CreateCardModal
          boardId={boardId}
          defaultStatus={modalState.defaultStatus}
          editCard={modalState.editCard}
          onClose={() => setModalState({ open: false, defaultStatus: "todo", editCard: null })}
          onSaved={handleCardSaved}
          onDeleted={handleCardDeleted}
        />
      )}
    </>
  );
}
