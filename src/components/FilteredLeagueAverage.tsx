
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamStats } from '@/types/goalStats';

interface FilteredLeagueAverageProps {
  homeStats?: TeamStats;
  awayStats?: TeamStats;
  selectedHomeTeam: string;
  selectedAwayTeam: string;
  allHomeStats: TeamStats[];
  allAwayStats: TeamStats[];
}

export const FilteredLeagueAverage: React.FC<FilteredLeagueAverageProps> = ({
  homeStats,
  awayStats,
  selectedHomeTeam,
  selectedAwayTeam,
  allHomeStats,
  allAwayStats,
}) => {
  const findLeagueAverage = () => {
    // First try to find league average from home stats if home team is selected
    if (selectedHomeTeam && allHomeStats.length > 0) {
      // Extract league name from team name (e.g., "Japan - J2 League" from team names)
      const homeTeam = allHomeStats.find(team => team.Team === selectedHomeTeam);
      if (homeTeam) {
        // Look for league average entry that contains similar league identifier
        const leagueAverage = allHomeStats.find(team => 
          team.Team.toLowerCase().includes('league average') && 
          team.Team !== 'League average'
        );
        if (leagueAverage) return leagueAverage;
      }
    }
    
    // Then try to find league average from away stats if away team is selected
    if (selectedAwayTeam && allAwayStats.length > 0) {
      const awayTeam = allAwayStats.find(team => team.Team === selectedAwayTeam);
      if (awayTeam) {
        const leagueAverage = allAwayStats.find(team => 
          team.Team.toLowerCase().includes('league average') && 
          team.Team !== 'League average'
        );
        if (leagueAverage) return leagueAverage;
      }
    }
    
    return null;
  };

  const leagueAverage = findLeagueAverage();
  
  if (!leagueAverage) return null;

  const getTitle = () => {
    // Extract league name from the league average entry
    const leagueName = leagueAverage.Team.replace('League average', '').trim();
    return `Média da Liga - ${leagueName}`;
  };

  return (
    <Card className="shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          🎯 {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{leagueAverage["1.5+"]}%</div>
            <div className="text-sm opacity-90">1.5+ gols</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{leagueAverage["2.5+"]}%</div>
            <div className="text-sm opacity-90">2.5+ gols</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{leagueAverage["3.5+"]}%</div>
            <div className="text-sm opacity-90">3.5+ gols</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{leagueAverage["4.5+"]}%</div>
            <div className="text-sm opacity-90">4.5+ gols</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
