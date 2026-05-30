"use client";

import { useState } from "react";
import BoardCard from "@/components/boards/BoardCard";
import CreateBoardModal from "@/components/boards/CreateBoardModal";

type Board = {
  id: string;
  name: string;
  created_at: string;
};

export default function BoardsGrid({ initialBoards }: { initialBoards: Board[] }) {
  const [boards, setBoards] = useState<Board[]>(initialBoards);
  const [showModal, setShowModal] = useState(false);

  function handleBoardCreated(board: Board) {
    setBoards((prev) => [board, ...prev]);
    setShowModal(false);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium text-[#0a0a0a] tracking-[0.07px]">
          My Boards
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#00b800] hover:bg-[#00a000] text-white font-medium text-base px-4 h-[44px] rounded-[10px] flex items-center gap-2 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M9 3v12M3 9h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          New Board
        </button>
      </div>

      {boards.length === 0 ? (
        <p className="text-sm text-[#717182]">No boards yet. Create one to get started.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              id={board.id}
              name={board.name}
              createdAt={board.created_at}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CreateBoardModal
          onClose={() => setShowModal(false)}
          onCreated={handleBoardCreated}
        />
      )}
    </>
  );
}
