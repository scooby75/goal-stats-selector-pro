
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
  const findRelevantLeagueAverage = () => {
    console.log('Finding relevant league average...');
    console.log('Selected home team:', selectedHomeTeam);
    console.log('Selected away team:', selectedAwayTeam);
    console.log('Home league averages available:', homeLeagueAverages.map(avg => avg.Team));
    console.log('Away league averages available:', awayLeagueAverages.map(avg => avg.Team));

    // Find league average that corresponds to selected teams
    // Priority: home team league, then away team league
    if (selectedHomeTeam && homeLeagueAverages.length > 0) {
      // Look for a league average that might correspond to the home team's league
      const relevantLeagueAvg = homeLeagueAverages.find(avg => 
        avg.Team.toLowerCase().includes('league average')
      ) || homeLeagueAverages[0];
      
      console.log('Found relevant home league average:', relevantLeagueAvg);
      return relevantLeagueAvg;
    }
    
    if (selectedAwayTeam && awayLeagueAverages.length > 0) {
      const relevantLeagueAvg = awayLeagueAverages.find(avg => 
        avg.Team.toLowerCase().includes('league average')
      ) || awayLeagueAverages[0];
      
      console.log('Found relevant away league average:', relevantLeagueAvg);
      return relevantLeagueAvg;
    }
    
    console.log('No relevant league average found');
    return null;
  };

  const leagueAverage = findRelevantLeagueAverage();
  
  if (!leagueAverage) return null;

  const getLeagueName = () => {
    // Extract league name from the league average entry
    let leagueName = leagueAverage.Team;
    if (leagueName.toLowerCase().includes('league average')) {
      leagueName = leagueName.replace(/league average/gi, '').trim();
      // Remove any trailing dashes or extra spaces
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
