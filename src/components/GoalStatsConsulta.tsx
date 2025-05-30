
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useGoalStats } from '@/hooks/useGoalStats';
import { StatsDisplay } from './StatsDisplay';

export const GoalStatsConsulta = () => {
  const [selectedHomeTeam, setSelectedHomeTeam] = useState<string>('');
  const [selectedAwayTeam, setSelectedAwayTeam] = useState<string>('');
  
  const { goalStatsData, isLoading } = useGoalStats();

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

  const homeTeams = goalStatsData.homeStats.map(team => team.Team).sort();
  const awayTeams = goalStatsData.awayStats.map(team => team.Team).sort();

  const selectedHomeStats = goalStatsData.homeStats.find(team => team.Team === selectedHomeTeam);
  const selectedAwayStats = goalStatsData.awayStats.find(team => team.Team === selectedAwayTeam);

  return (
    <div className="space-y-6">
      {/* Team Selection */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-gray-800">
            🏠 Seleção de Equipes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time da Casa
              </label>
              <Select value={selectedHomeTeam} onValueChange={setSelectedHomeTeam}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o time da casa" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {homeTeams.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Visitante
              </label>
              <Select value={selectedAwayTeam} onValueChange={setSelectedAwayTeam}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o time visitante" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {awayTeams.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
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
          <div className="grid grid-cols-2 gap-4 text-center">
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
