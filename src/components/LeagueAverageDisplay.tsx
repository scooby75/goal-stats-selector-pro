
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamStats, LeagueAverageData } from '@/types/goalStats';

interface LeagueAverageDisplayProps {
  homeStats?: TeamStats;
  awayStats?: TeamStats;
  leagueAverages: LeagueAverageData[];
  selectedHomeTeam: string;
  selectedAwayTeam: string;
}

export const LeagueAverageDisplay: React.FC<LeagueAverageDisplayProps> = ({
  homeStats,
  awayStats,
  leagueAverages,
  selectedHomeTeam,
  selectedAwayTeam,
}) => {
  const extractLeagueFromTeamName = (teamName: string): string | null => {
    if (!teamName) return null;
    
    // Check if team name contains league identifier with " - "
    const parts = teamName.split(' - ');
    if (parts.length >= 2) {
      return parts[0].trim();
    }
    
    return null;
  };

  const findLeagueAverage = (): LeagueAverageData | null => {
    // If we have no teams selected, return null
    if (!selectedHomeTeam && !selectedAwayTeam) return null;
    
    let targetLeague = null;
    
    // Try to extract league from selected teams
    if (selectedHomeTeam) {
      const league = extractLeagueFromTeamName(selectedHomeTeam);
      if (league) {
        const exactMatch = leagueAverages.find(la => 
          la.League_Name.toLowerCase() === league.toLowerCase()
        );
        
        if (exactMatch) {
          targetLeague = exactMatch;
        } else {
          // Try partial match
          const partialMatch = leagueAverages.find(la => 
            la.League_Name.toLowerCase().includes(league.toLowerCase()) ||
            league.toLowerCase().includes(la.League_Name.toLowerCase())
          );
          
          if (partialMatch) {
            targetLeague = partialMatch;
          }
        }
      }
    }
    
    // If not found with home team, try with away team
    if (!targetLeague && selectedAwayTeam) {
      const league = extractLeagueFromTeamName(selectedAwayTeam);
      if (league) {
        const exactMatch = leagueAverages.find(la => 
          la.League_Name.toLowerCase() === league.toLowerCase()
        );
        
        if (exactMatch) {
          targetLeague = exactMatch;
        } else {
          // Try partial match
          const partialMatch = leagueAverages.find(la => 
            la.League_Name.toLowerCase().includes(league.toLowerCase()) ||
            league.toLowerCase().includes(la.League_Name.toLowerCase())
          );
          
          if (partialMatch) {
            targetLeague = partialMatch;
          }
        }
      }
    }

    console.log('Found league average:', targetLeague);
    return targetLeague;
  };

  const leagueAverage = findLeagueAverage();
  
  // Always return null if no league average found
  if (!leagueAverage) return null;

  const getTitle = () => {
    if (selectedHomeTeam && selectedAwayTeam) {
      return `Média da Liga: ${leagueAverage.League_Name}`;
    } else if (selectedHomeTeam) {
      return `Média da Liga do ${selectedHomeTeam}`;
    } else if (selectedAwayTeam) {
      return `Média da Liga do ${selectedAwayTeam}`;
    }
    return `Média da Liga: ${leagueAverage.League_Name}`;
  };

  return (
    <Card className="shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          🏆 {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="grid grid-cols-6 gap-4 text-center font-semibold">
              <div>
                <div className="text-sm opacity-90 mb-1">0.5+</div>
                <div className="text-lg">{leagueAverage["0.5+"]}%</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">1.5+</div>
                <div className="text-lg">{leagueAverage["1.5+"]}%</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">2.5+</div>
                <div className="text-lg">{leagueAverage["2.5+"]}%</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">3.5+</div>
                <div className="text-lg">{leagueAverage["3.5+"]}%</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">4.5+</div>
                <div className="text-lg">{leagueAverage["4.5+"]}%</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">5.5+</div>
                <div className="text-lg">{leagueAverage["5.5+"]}%</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Cards */}
        <div className="block md:hidden space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xs opacity-90">0.5+</div>
              <div className="text-lg font-bold">{leagueAverage["0.5+"]}%</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xs opacity-90">1.5+</div>
              <div className="text-lg font-bold">{leagueAverage["1.5+"]}%</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xs opacity-90">2.5+</div>
              <div className="text-lg font-bold">{leagueAverage["2.5+"]}%</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xs opacity-90">3.5+</div>
              <div className="text-lg font-bold">{leagueAverage["3.5+"]}%</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xs opacity-90">4.5+</div>
              <div className="text-lg font-bold">{leagueAverage["4.5+"]}%</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-xs opacity-90">5.5+</div>
              <div className="text-lg font-bold">{leagueAverage["5.5+"]}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
