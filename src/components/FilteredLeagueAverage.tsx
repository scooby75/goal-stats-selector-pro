
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamStats } from '@/types/goalStats';

interface FilteredLeagueAverageProps {
  homeStats?: TeamStats;
  awayStats?: TeamStats;
  selectedHomeTeam: string;
  selectedAwayTeam: string;
  homeLeagueAverages: TeamStats[];
  awayLeagueAverages: TeamStats[];
}

export const FilteredLeagueAverage: React.FC<FilteredLeagueAverageProps> = ({
  homeStats,
  awayStats,
  selectedHomeTeam,
  selectedAwayTeam,
  homeLeagueAverages,
  awayLeagueAverages,
}) => {
  const findLeagueAverage = () => {
    console.log('Finding league average...');
    console.log('Selected home team:', selectedHomeTeam);
    console.log('Selected away team:', selectedAwayTeam);
    console.log('Home league averages available:', homeLeagueAverages.map(avg => avg.Team));
    console.log('Away league averages available:', awayLeagueAverages.map(avg => avg.Team));

    // Try to find the specific league average based on selected teams
    if (selectedHomeTeam && homeLeagueAverages.length > 0) {
      // For now, return the first league average from home data
      // In the future, we could match by league name
      const leagueAverage = homeLeagueAverages[0];
      console.log('Found home league average:', leagueAverage);
      return leagueAverage;
    }
    
    if (selectedAwayTeam && awayLeagueAverages.length > 0) {
      const leagueAverage = awayLeagueAverages[0];
      console.log('Found away league average:', leagueAverage);
      return leagueAverage;
    }
    
    console.log('No league average found');
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
