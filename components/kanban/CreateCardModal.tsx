"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { createCard, updateCard, deleteCard } from "@/app/actions/cards";

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
  boardId: string;
  defaultStatus: string;
  editCard: Card | null;
  onClose: () => void;
  onSaved: (card: Card) => void;
  onDeleted: (cardId: string) => void;
};

export default function CreateCardModal({
  boardId,
  defaultStatus,
  editCard,
  onClose,
  onSaved,
  onDeleted,
}: Props) {
  const [title, setTitle] = useState(editCard?.title ?? "");
  const [description, setDescription] = useState(editCard?.description ?? "");
  const [priority, setPriority] = useState(editCard?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(editCard?.due_date ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);

    try {
      if (editCard) {
        const card = await updateCard({
          cardId: editCard.id,
          title,
          description,
          priority,
          dueDate,
        });
        onSaved(card);
      } else {
        // Get next position via browser client (read-only, safe)
        const supabase = createClient();
        const { data: maxRow } = await supabase
          .from("cards")
          .select("position")
          .eq("board_id", boardId)
          .eq("status", defaultStatus)
          .order("position", { ascending: false })
          .limit(1)
          .single();

        const card = await createCard({
          boardId,
          title,
          description,
          status: defaultStatus,
          priority,
          dueDate,
          position: (maxRow?.position ?? -1) + 1,
        });
        onSaved(card);
      }
    } catch {
      setError("Failed to save card. Please try again.");
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!editCard) return;
    setLoading(true);
    try {
      await deleteCard(editCard.id);
      onDeleted(editCard.id);
    } catch {
      setError("Failed to delete card. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[16px] shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)] w-full max-w-[512px] p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-[#0a0a0a] tracking-[-0.44px]">
            {editCard ? "Edit card" : "Card"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#717182] hover:text-[#0a0a0a] transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#0a0a0a]">Name</label>
            <input
              ref={titleRef}
              type="text"
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter card name..."
              className="border border-[rgba(0,0,0,0.1)] rounded-[10px] px-3 py-2.5 text-base text-[#0a0a0a] placeholder:text-[#717182] focus:outline-none focus:border-[#0369a1] transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[#717182] uppercase tracking-[0.3px]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={4}
              maxLength={2000}
              className="border border-[rgba(0,0,0,0.1)] rounded-[10px] px-3 py-2 text-base text-[#0a0a0a] placeholder:text-[#717182] focus:outline-none focus:border-[#0369a1] resize-none transition-colors"
            />
          </div>

          {/* Priority + Due Date row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-[#717182] uppercase tracking-[0.3px]">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="border border-[rgba(0,0,0,0.1)] rounded-[10px] px-3 py-2 text-base text-[#0a0a0a] focus:outline-none focus:border-[#0369a1] bg-white transition-colors h-[38px]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-[#717182] uppercase tracking-[0.3px]">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border border-[rgba(0,0,0,0.1)] rounded-[10px] px-3 py-2 text-base text-[#0a0a0a] focus:outline-none focus:border-[#0369a1] transition-colors h-[38px]"
              />
            </div>
          </div>

          {error && <p className="text-sm text-[#d4183d]">{error}</p>}

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[rgba(0,0,0,0.1)] pt-4">
            {editCard ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="text-sm font-medium text-[#d4183d] hover:opacity-75 transition-opacity"
              >
                Delete card
              </button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="text-base font-medium text-[#0a0a0a] h-[44px] px-4 hover:text-[#717182] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="bg-[#00b800] hover:bg-[#00a000] disabled:opacity-50 text-white font-medium text-base h-[44px] px-4 rounded-[10px] transition-colors"
              >
                {loading ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
