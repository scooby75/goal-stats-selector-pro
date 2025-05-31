
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
  const findLeagueAverageForTeams = () => {
    console.log('Finding league average for selected teams...');
    console.log('Selected home team:', selectedHomeTeam);
    console.log('Selected away team:', selectedAwayTeam);
    console.log('Home league averages:', homeLeagueAverages.map(avg => avg.Team));
    console.log('Away league averages:', awayLeagueAverages.map(avg => avg.Team));

    // Try to find the league average from home team's data first
    if (selectedHomeTeam && homeLeagueAverages.length > 0) {
      const leagueAverage = homeLeagueAverages.find(avg => 
        avg.Team.toLowerCase().includes('league average')
      );
      if (leagueAverage) {
        console.log('Found league average from home data:', leagueAverage);
        return leagueAverage;
      }
    }
    
    // If not found in home data, try away team's data
    if (selectedAwayTeam && awayLeagueAverages.length > 0) {
      const leagueAverage = awayLeagueAverages.find(avg => 
        avg.Team.toLowerCase().includes('league average')
      );
      if (leagueAverage) {
        console.log('Found league average from away data:', leagueAverage);
        return leagueAverage;
      }
    }
    
    console.log('No league average found for selected teams');
    return null;
  };

  const leagueAverage = findLeagueAverageForTeams();
  
  if (!leagueAverage) return null;

  const getLeagueName = () => {
    let leagueName = leagueAverage.Team;
    if (leagueName.toLowerCase().includes('league average')) {
      leagueName = leagueName.replace(/league average/gi, '').trim();
      leagueName = leagueName.replace(/^-\s*/, '').replace(/\s*-$/, '').trim();
    }
    return leagueName || 'Liga';
  };

  return (
    <Card className="shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          🎯 Média do confronto das equipes filtradas - {getLeagueName()}
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
