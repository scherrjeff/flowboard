import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import KanbanBoard from "@/components/kanban/KanbanBoard";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: board }, { data: cards }] = await Promise.all([
    supabase
      .from("boards")
      .select("id, name")
      .eq("id", boardId)
      .single(),
    supabase
      .from("cards")
      .select("id, title, description, status, priority, due_date, position")
      .eq("board_id", boardId)
      .order("position"),
  ]);

  if (!board) notFound();

  const columnCount = 3;
  const userInitial = (user.email?.[0] ?? "U").toUpperCase();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar
        userInitial={userInitial}
        boardName={board.name}
        columnCount={columnCount}
      />
      <main className="px-8 pt-6 pb-16 flex-1">
        <KanbanBoard boardId={boardId} initialCards={cards ?? []} />
      </main>
    </div>
  );
}
