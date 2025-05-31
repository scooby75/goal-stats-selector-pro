
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamStats } from '@/types/goalStats';

interface FilteredLeagueAverageProps {
  homeStats?: TeamStats;
  awayStats?: TeamStats;
  selectedHomeTeam: string;
  selectedAwayTeam: string;
}

export const FilteredLeagueAverage: React.FC<FilteredLeagueAverageProps> = ({
  homeStats,
  awayStats,
  selectedHomeTeam,
  selectedAwayTeam,
}) => {
  const calculateFilteredAverage = () => {
    const teams = [];
    if (homeStats) teams.push(homeStats);
    if (awayStats) teams.push(awayStats);
    
    if (teams.length === 0) return null;
    
    const avg15 = teams.reduce((sum, team) => sum + team["1.5+"], 0) / teams.length;
    const avg25 = teams.reduce((sum, team) => sum + team["2.5+"], 0) / teams.length;
    const avg35 = teams.reduce((sum, team) => sum + team["3.5+"], 0) / teams.length;
    const avg45 = teams.reduce((sum, team) => sum + team["4.5+"], 0) / teams.length;
    
    return {
      "1.5+": Math.round(avg15 * 100) / 100,
      "2.5+": Math.round(avg25 * 100) / 100,
      "3.5+": Math.round(avg35 * 100) / 100,
      "4.5+": Math.round(avg45 * 100) / 100,
    };
  };

  const filteredAverage = calculateFilteredAverage();
  
  if (!filteredAverage) return null;

  const getTitle = () => {
    if (selectedHomeTeam && selectedAwayTeam) {
      return `Média dos Times Selecionados`;
    } else if (selectedHomeTeam) {
      return `Média do ${selectedHomeTeam}`;
    } else if (selectedAwayTeam) {
      return `Média do ${selectedAwayTeam}`;
    }
    return 'Média Filtrada';
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
            <div className="text-2xl font-bold">{filteredAverage["1.5+"]}%</div>
            <div className="text-sm opacity-90">1.5+ gols</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{filteredAverage["2.5+"]}%</div>
            <div className="text-sm opacity-90">2.5+ gols</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{filteredAverage["3.5+"]}%</div>
            <div className="text-sm opacity-90">3.5+ gols</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{filteredAverage["4.5+"]}%</div>
            <div className="text-sm opacity-90">4.5+ gols</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
