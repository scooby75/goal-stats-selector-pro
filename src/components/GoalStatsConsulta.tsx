
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertCircle } from 'lucide-react';
import { useGoalStats } from '@/hooks/useGoalStats';
import { StatsDisplay } from './StatsDisplay';
import { FilteredLeagueAverage } from './FilteredLeagueAverage';

export const GoalStatsConsulta = () => {
  console.log('GoalStatsConsulta component rendering');
  
  const [selectedHomeTeam, setSelectedHomeTeam] = useState<string>('');
  const [selectedAwayTeam, setSelectedAwayTeam] = useState<string>('');
  
  const { goalStatsData, isLoading, error } = useGoalStats();

  if (error) {
    console.error('Error in GoalStatsConsulta:', error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600">Erro ao carregar dados: {error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dados das equipes...</p>
        </div>
      </div>
    );
  }

  // Enhanced team extraction with debugging
  const homeTeams = goalStatsData.homeStats
    .map(team => team.Team)
    .filter(teamName => teamName && teamName.trim() !== '')
    .sort();
    
  const awayTeams = goalStatsData.awayStats
    .map(team => team.Team)
    .filter(teamName => teamName && teamName.trim() !== '')
    .sort();

  console.log('Extracted home teams:', homeTeams);
  console.log('Extracted away teams:', awayTeams);
  console.log('Home teams count:', homeTeams.length);
  console.log('Away teams count:', awayTeams.length);

  const selectedHomeStats = goalStatsData.homeStats.find(team => team.Team === selectedHomeTeam);
  const selectedAwayStats = goalStatsData.awayStats.find(team => team.Team === selectedAwayTeam);

  return (
    <div className="space-y-6">
      {/* Team Selection */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-gray-800">
            Selecione as Equipes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time da Casa ({homeTeams.length} times disponíveis)
              </label>
              <Select value={selectedHomeTeam} onValueChange={setSelectedHomeTeam}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Selecione o time da casa" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 max-h-[300px] overflow-y-auto">
                  {homeTeams.length > 0 ? (
                    homeTeams.map((team) => (
                      <SelectItem key={team} value={team} className="bg-white hover:bg-gray-100">
                        {team}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-teams" disabled className="bg-white">
                      Nenhum time encontrado
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Visitante ({awayTeams.length} times disponíveis)
              </label>
              <Select value={selectedAwayTeam} onValueChange={setSelectedAwayTeam}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Selecione o time visitante" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 max-h-[300px] overflow-y-auto">
                  {awayTeams.length > 0 ? (
                    awayTeams.map((team) => (
                      <SelectItem key={team} value={team} className="bg-white hover:bg-gray-100">
                        {team}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-teams" disabled className="bg-white">
                      Nenhum time encontrado
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* League Average Card */}
      <Card className="shadow-lg bg-gradient-to-r from-blue-500 to-green-500 text-white">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            📊 Média da Liga
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{goalStatsData.leagueAverage["1.5+"]}%</div>
              <div className="text-sm opacity-90">Jogos 1.5+ gols</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{goalStatsData.leagueAverage["2.5+"]}%</div>
              <div className="text-sm opacity-90">Jogos 2.5+ gols</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{goalStatsData.leagueAverage["3.5+"]}%</div>
              <div className="text-sm opacity-90">Jogos 3.5+ gols</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">{goalStatsData.leagueAverage["4.5+"]}%</div>
              <div className="text-sm opacity-90">Jogos 4.5+ gols</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtered League Average */}
      {(selectedHomeTeam || selectedAwayTeam) && (
        <FilteredLeagueAverage 
          homeStats={selectedHomeStats}
          awayStats={selectedAwayStats}
          selectedHomeTeam={selectedHomeTeam}
          selectedAwayTeam={selectedAwayTeam}
        />
      )}

      {/* Stats Display */}
      {(selectedHomeTeam || selectedAwayTeam) && (
        <StatsDisplay 
          homeTeam={selectedHomeTeam}
          awayTeam={selectedAwayTeam}
          homeStats={selectedHomeStats}
          awayStats={selectedAwayStats}
        />
      )}
    </div>
  );
};
