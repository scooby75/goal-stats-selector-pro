
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TeamStats, GoalStatsData } from '@/types/goalStats';

const parseCSV = (csvText: string): TeamStats[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const stats: any = {};
    
    headers.forEach((header, index) => {
      const cleanHeader = header.trim().replace(/"/g, '');
      const cleanValue = values[index]?.trim().replace(/"/g, '');
      
      if (cleanHeader === 'Team') {
        stats[cleanHeader] = cleanValue;
      } else {
        stats[cleanHeader] = parseFloat(cleanValue) || 0;
      }
    });
    
    return stats as TeamStats;
  });
};

const fetchCSVData = async (url: string): Promise<TeamStats[]> => {
  console.log(`Fetching data from: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  const csvText = await response.text();
  console.log(`Data fetched successfully from ${url}`);
  return parseCSV(csvText);
};

export const useGoalStats = () => {
  const { data: homeStats = [], isLoading: homeLoading } = useQuery({
    queryKey: ['homeStats'],
    queryFn: () => fetchCSVData('https://raw.githubusercontent.com/scooby75/jogosdodia/refs/heads/main/Goals_Stats_Home.csv'),
  });

  const { data: awayStats = [], isLoading: awayLoading } = useQuery({
    queryKey: ['awayStats'],
    queryFn: () => fetchCSVData('https://raw.githubusercontent.com/scooby75/jogosdodia/refs/heads/main/Goals_Stats_Away.csv'),
  });

  const { data: overallStats = [], isLoading: overallLoading } = useQuery({
    queryKey: ['overallStats'],
    queryFn: () => fetchCSVData('https://raw.githubusercontent.com/scooby75/jogosdodia/refs/heads/main/Goals_Stats_Overall.csv'),
  });

  const isLoading = homeLoading || awayLoading || overallLoading;

  const calculateLeagueAverage = () => {
    if (overallStats.length === 0) return { "3.5+": 0, "4.5+": 0 };
    
    const total35 = overallStats.reduce((sum, team) => sum + team["3.5+"], 0);
    const total45 = overallStats.reduce((sum, team) => sum + team["4.5+"], 0);
    
    return {
      "3.5+": Math.round((total35 / overallStats.length) * 100) / 100,
      "4.5+": Math.round((total45 / overallStats.length) * 100) / 100,
    };
  };

  const goalStatsData: GoalStatsData = {
    homeStats,
    awayStats,
    overallStats,
    leagueAverage: calculateLeagueAverage(),
  };

  return { goalStatsData, isLoading };
};
