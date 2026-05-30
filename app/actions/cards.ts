"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Card = {
  id: string;
  title: string;
  description: string | null;
  priority: string | null;
  due_date: string | null;
  status: string;
  position: number;
};

const VALID_STATUSES = ["todo", "in_progress", "done"] as const;
const VALID_PRIORITIES = ["low", "medium", "high"] as const;

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function createCard(params: {
  boardId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  position: number;
}): Promise<Card> {
  const { supabase, user } = await getAuthenticatedClient();

  // Verify board belongs to this user (defense in depth beyond RLS)
  const { data: board } = await supabase
    .from("boards")
    .select("id")
    .eq("id", params.boardId)
    .eq("user_id", user.id)
    .single();

  if (!board) throw new Error("Board not found or access denied");

  const status = VALID_STATUSES.includes(params.status as typeof VALID_STATUSES[number])
    ? params.status
    : "todo";
  const priority = VALID_PRIORITIES.includes(params.priority as typeof VALID_PRIORITIES[number])
    ? params.priority
    : "medium";

  const { data, error } = await supabase
    .from("cards")
    .insert({
      board_id: params.boardId,
      title: params.title.trim().slice(0, 200),
      description: params.description?.trim().slice(0, 2000) || null,
      status,
      priority,
      due_date: params.dueDate || null,
      position: params.position,
    })
    .select("id, title, description, status, priority, due_date, position")
    .single();

  if (error) throw new Error("Failed to create card");
  return data;
}

export async function updateCard(params: {
  cardId: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
}): Promise<Card> {
  const { supabase } = await getAuthenticatedClient();

  const priority = VALID_PRIORITIES.includes(params.priority as typeof VALID_PRIORITIES[number])
    ? params.priority
    : "medium";

  const { data, error } = await supabase
    .from("cards")
    .update({
      title: params.title.trim().slice(0, 200),
      description: params.description?.trim().slice(0, 2000) || null,
      priority,
      due_date: params.dueDate || null,
    })
    .eq("id", params.cardId)
    .select("id, title, description, status, priority, due_date, position")
    .single();

  if (error) throw new Error("Failed to update card");
  return data;
}

export async function deleteCard(cardId: string): Promise<void> {
  const { supabase } = await getAuthenticatedClient();

  const { error } = await supabase
    .from("cards")
    .delete()
    .eq("id", cardId);

  if (error) throw new Error("Failed to delete card");
}
