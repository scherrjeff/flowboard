-- Recreate RLS policies with explicit WITH CHECK clauses for INSERT/UPDATE safety

DROP POLICY "Users can manage their own boards" ON boards;
DROP POLICY "Users can manage cards on their own boards" ON cards;

CREATE POLICY "Users can manage their own boards"
  ON boards FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage cards on their own boards"
  ON cards FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = cards.board_id
        AND boards.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = cards.board_id
        AND boards.user_id = auth.uid()
    )
  );
