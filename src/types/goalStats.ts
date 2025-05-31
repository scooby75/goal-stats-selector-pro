
export interface TeamStats {
  Team: string;
  GP: number;
  Avg: number;
  "1.5+": number;
  "2.5+": number;
  "3.5+": number;
  "4.5+": number;
}

export interface LeagueStats {
  "1.5+": number;
  "2.5+": number;
  "3.5+": number;
  "4.5+": number;
}

export interface GoalStatsData {
  homeStats: TeamStats[];
  awayStats: TeamStats[];
  overallStats: TeamStats[];
  leagueAverage: LeagueStats;
}
