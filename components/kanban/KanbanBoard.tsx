"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import StatusColumn from "@/components/kanban/StatusColumn";
import TaskCard from "@/components/kanban/TaskCard";
import CreateCardModal from "@/components/kanban/CreateCardModal";
import { createClient } from "@/lib/supabase/client";

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
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [modalState, setModalState] = useState<{
    open: boolean;
    defaultStatus: string;
    editCard: Card | null;
  }>({ open: false, defaultStatus: "todo", editCard: null });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

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

  function handleDragStart({ active }: DragStartEvent) {
    setActiveCard(cards.find((c) => c.id === active.id) ?? null);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const activeCard = cards.find((c) => c.id === activeId);
    if (!activeCard) return;

    // If dropped over a column (not a card), update status optimistically
    const overIsColumn = COLUMNS.some((col) => col.id === overId);
    if (overIsColumn && activeCard.status !== overId) {
      setCards((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, status: overId } : c))
      );
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveCard(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const draggedCard = cards.find((c) => c.id === activeId);
    if (!draggedCard) return;

    // Determine target status: if over a column use it, else use the card's current status
    const overIsColumn = COLUMNS.some((col) => col.id === overId);
    const targetStatus = overIsColumn
      ? overId
      : (cards.find((c) => c.id === overId)?.status ?? draggedCard.status);

    // Reorder within the target column
    const columnCards = cards
      .filter((c) => c.status === targetStatus)
      .sort((a, b) => a.position - b.position);

    let reordered: Card[];
    if (overIsColumn) {
      reordered = draggedCard.status !== targetStatus
        ? [...columnCards, { ...draggedCard, status: targetStatus }]
        : columnCards;
    } else {
      const oldIndex = columnCards.findIndex((c) => c.id === activeId);
      const newIndex = columnCards.findIndex((c) => c.id === overId);
      reordered =
        oldIndex !== -1 && newIndex !== -1
          ? arrayMove(columnCards, oldIndex, newIndex)
          : columnCards;
    }

    const updatedPositions = reordered.map((c, i) => ({
      ...c,
      status: targetStatus,
      position: i,
    }));

    setCards((prev) => {
      const otherCards = prev.filter(
        (c) => c.id !== activeId && c.status !== targetStatus
      );
      return [...otherCards, ...updatedPositions];
    });

    // Persist changes to Supabase
    const supabase = createClient();
    updatedPositions.forEach(({ id, status, position }) => {
      supabase
        .from("cards")
        .update({ status, position })
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Failed to update card position:", error);
        });
    });
    if (draggedCard.status !== targetStatus) {
      supabase
        .from("cards")
        .update({ status: targetStatus })
        .eq("id", activeId)
        .then(({ error }) => {
          if (error) console.error("Failed to update card status:", error);
        });
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 items-start overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <StatusColumn
              key={col.id}
              title={col.label}
              status={col.id}
              cards={cards
                .filter((c) => c.status === col.id)
                .sort((a, b) => a.position - b.position)}
              onAddCard={openAddCard}
              onEditCard={openEditCard}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? (
            <TaskCard card={activeCard} onEdit={() => {}} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>

      {modalState.open && (
        <CreateCardModal
          boardId={boardId}
          defaultStatus={modalState.defaultStatus}
          editCard={modalState.editCard}
          onClose={() =>
            setModalState({ open: false, defaultStatus: "todo", editCard: null })
          }
          onSaved={handleCardSaved}
          onDeleted={handleCardDeleted}
        />
      )}
    </>
  );
}
