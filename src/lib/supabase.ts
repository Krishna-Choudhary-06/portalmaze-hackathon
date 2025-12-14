import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  mode: 'NO_WALL_BREAK' | 'WALL_BREAK';
  level_name: string;
  steps_taken: number;
  optimal_steps: number;
  efficiency: number;
  time_seconds: number;
  walls_broken: number;
  created_at: string;
}

export async function submitScore(entry: Omit<LeaderboardEntry, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('leaderboard')
    .insert([entry])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLeaderboard(
  mode: 'NO_WALL_BREAK' | 'WALL_BREAK',
  limit = 50
) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('mode', mode)
    .order('efficiency', { ascending: false })
    .order('time_seconds', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data as LeaderboardEntry[];
}

export async function getLeaderboardByLevel(
  levelName: string,
  mode: 'NO_WALL_BREAK' | 'WALL_BREAK',
  limit = 20
) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('level_name', levelName)
    .eq('mode', mode)
    .order('efficiency', { ascending: false })
    .order('time_seconds', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data as LeaderboardEntry[];
}
