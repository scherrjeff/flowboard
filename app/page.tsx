import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import BoardsGrid from "@/components/boards/BoardsGrid";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: boards } = await supabase
    .from("boards")
    .select("id, name, created_at")
    .order("created_at", { ascending: false });

  const userInitial = (user.email?.[0] ?? "U").toUpperCase();

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Navbar userInitial={userInitial} />
      <main className="px-8 pt-8 pb-16 max-w-7xl mx-auto">
        <BoardsGrid initialBoards={boards ?? []} />
      </main>
    </div>
  );
}
