-- Tabuľka pre prieskum
CREATE TABLE IF NOT EXISTS prieskum_odpovede (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  payload jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Index pre rýchle vyhľadávanie
CREATE INDEX IF NOT EXISTS idx_prieskum_odpovede_payload ON prieskum_odpovede USING GIN (payload);
CREATE INDEX IF NOT EXISTS idx_prieskum_odpovede_created_at ON prieskum_odpovede (created_at DESC);
