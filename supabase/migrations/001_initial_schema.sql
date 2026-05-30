CREATE TABLE boards (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE cards (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id    UUID REFERENCES boards(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT CHECK (status IN ('todo', 'in_progress', 'done')) DEFAULT 'todo' NOT NULL,
  priority    TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  due_date    DATE,
  position    INTEGER DEFAULT 0 NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own boards"
  ON boards FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage cards on their own boards"
  ON cards FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = cards.board_id
        AND boards.user_id = auth.uid()
    )
  );
