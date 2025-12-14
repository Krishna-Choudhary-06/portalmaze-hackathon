/*
  # Create Leaderboard System for PortalMaze

  1. New Tables
    - `leaderboard`
      - `id` (uuid, primary key)
      - `player_name` (text) - Player's display name
      - `mode` (text) - Game mode: 'NO_WALL_BREAK' or 'WALL_BREAK'
      - `level_name` (text) - Name of the level completed
      - `steps_taken` (integer) - Number of steps taken by player
      - `optimal_steps` (integer) - Optimal path length
      - `efficiency` (numeric) - Efficiency percentage
      - `time_seconds` (numeric) - Completion time in seconds
      - `walls_broken` (integer) - Number of walls broken (0 for no-break mode)
      - `created_at` (timestamptz) - When the score was recorded

  2. Indexes
    - Index on mode and efficiency for leaderboard queries
    - Index on created_at for recent scores

  3. Security
    - Enable RLS
    - Allow public read access (anyone can view leaderboard)
    - Allow public insert access (anyone can submit scores)
*/

CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  mode text NOT NULL CHECK (mode IN ('NO_WALL_BREAK', 'WALL_BREAK')),
  level_name text NOT NULL,
  steps_taken integer NOT NULL CHECK (steps_taken >= 0),
  optimal_steps integer NOT NULL CHECK (optimal_steps >= 0),
  efficiency numeric NOT NULL CHECK (efficiency >= 0 AND efficiency <= 100),
  time_seconds numeric NOT NULL CHECK (time_seconds >= 0),
  walls_broken integer NOT NULL DEFAULT 0 CHECK (walls_broken >= 0),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_mode_efficiency 
  ON leaderboard(mode, efficiency DESC, time_seconds ASC);

CREATE INDEX IF NOT EXISTS idx_leaderboard_created_at 
  ON leaderboard(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leaderboard_level_mode 
  ON leaderboard(level_name, mode, efficiency DESC);

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view leaderboard"
  ON leaderboard
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can submit scores"
  ON leaderboard
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
