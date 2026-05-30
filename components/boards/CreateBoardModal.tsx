"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Board = {
  id: string;
  name: string;
  created_at: string;
};

type Props = {
  onClose: () => void;
  onCreated: (board: Board) => void;
};

export default function CreateBoardModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("boards")
      .insert({ name: name.trim(), user_id: user!.id })
      .select("id, name, created_at")
      .single();

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      onCreated(data);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[16px] shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)] w-full max-w-[448px] p-6 flex flex-col gap-6">
        <h2 className="text-lg font-medium text-[#0a0a0a] tracking-[-0.44px]">
          Create board
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#0a0a0a]">
              Board name
            </label>
            <input
              ref={inputRef}
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Product Roadmap"
              className="border border-[rgba(0,0,0,0.1)] rounded-[10px] px-3 py-2.5 text-base text-[#0a0a0a] placeholder:text-[#717182] focus:outline-none focus:border-[#0369a1] transition-colors"
            />
            {error && <p className="text-sm text-[#d4183d]">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-base font-medium text-[#0a0a0a] h-[44px] px-4 hover:text-[#717182] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="bg-[#0369a1] hover:bg-[#0284c7] disabled:opacity-50 text-white font-medium text-base h-[44px] px-4 rounded-[10px] transition-colors"
            >
              {loading ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
