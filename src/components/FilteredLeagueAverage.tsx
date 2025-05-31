import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamStats } from '@/types/goalStats';

interface LeagueAverage {
  League: string;
  '1.5+': number;
  '2.5+': number;
  '3.5+': number;
  '4.5+': number;
}

interface FilteredLeagueAverageProps {
  homeStats?: TeamStats;
  awayStats?: TeamStats;
  selectedHomeTeam: string;
  selectedAwayTeam: string;
  homeLeague?: string;
  awayLeague?: string;
}

export const FilteredLeagueAverage: React.FC<FilteredLeagueAverageProps> = ({
  homeStats,
  awayStats,
  selectedHomeTeam,
  selectedAwayTeam,
  homeLeague,
  awayLeague,
}) => {
  const [leagueAverages, setLeagueAverages] = useState<LeagueAverage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeagueAverages = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/scooby75/goal-stats-selector-pro/refs/heads/main/League_Averages.csv'
        );
        const csvData = await response.text();
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        
        const averages = lines.slice(1).map(line => {
          const values = line.split(',');
          return {
            League: values[0],
            '1.5+': parseFloat(values[1]),
            '2.5+': parseFloat(values[2]),
            '3.5+': parseFloat(values[3]),
            '4.5+': parseFloat(values[4]),
          };
        });
        
        setLeagueAverages(averages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching league averages:', error);
        setLoading(false);
      }
    };

    fetchLeagueAverages();
  }, []);

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

  const calculateLeagueAverage = () => {
    const leagues = [];
    if (homeLeague) leagues.push(homeLeague);
    if (awayLeague) leagues.push(awayLeague);
    
    if (leagues.length === 0 || leagueAverages.length === 0) return null;
    
    const filteredLeagues = leagueAverages.filter(avg => leagues.includes(avg.League));
    if (filteredLeagues.length === 0) return null;
    
    const avg15 = filteredLeagues.reduce((sum, league) => sum + league["1.5+"], 0) / filteredLeagues.length;
    const avg25 = filteredLeagues.reduce((sum, league) => sum + league["2.5+"], 0) / filteredLeagues.length;
    const avg35 = filteredLeagues.reduce((sum, league) => sum + league["3.5+"], 0) / filteredLeagues.length;
    const avg45 = filteredLeagues.reduce((sum, league) => sum + league["4.5+"], 0) / filteredLeagues.length;
    
    return {
      "1.5+": Math.round(avg15 * 100) / 100,
      "2.5+": Math.round(avg25 * 100) / 100,
      "3.5+": Math.round(avg35 * 100) / 100,
      "4.5+": Math.round(avg45 * 100) / 100,
    };
  };

  const filteredAverage = calculateFilteredAverage();
  const leagueAverage = calculateLeagueAverage();
  
  if (!filteredAverage || loading) return null;

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

  const getLeagueTitle = () => {
    const leagues = [];
    if (homeLeague) leagues.push(homeLeague);
    if (awayLeague && awayLeague !== homeLeague) leagues.push(awayLeague);
    
    if (leagues.length === 0) return 'Média das Ligas';
    if (leagues.length === 1) return `Média da Liga: ${leagues[0]}`;
    return `Média das Ligas: ${leagues.join(' e ')}`;
  };

  return (
    <div className="space-y-4">
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

      {leagueAverage && (
        <Card className="shadow-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              🌍 {getLeagueTitle()}
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
      )}
    </div>
  );
};
