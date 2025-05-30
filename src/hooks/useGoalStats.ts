
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TeamStats, GoalStatsData } from '@/types/goalStats';

const parseCSV = (csvText: string): TeamStats[] => {
  console.log('Parsing CSV data...');
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
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}: ${response.status}`);
    }
    const csvText = await response.text();
    console.log(`Data fetched successfully from ${url}`);
    return parseCSV(csvText);
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

export const useGoalStats = () => {
  console.log('useGoalStats hook called');

  const { data: homeStats = [], isLoading: homeLoading, error: homeError } = useQuery({
    queryKey: ['homeStats'],
    queryFn: () => fetchCSVData('https://raw.githubusercontent.com/scooby75/jogosdodia/refs/heads/main/Goals_Stats_Home.csv'),
    retry: 3,
    retryDelay: 1000,
  });

  const { data: awayStats = [], isLoading: awayLoading, error: awayError } = useQuery({
    queryKey: ['awayStats'],
    queryFn: () => fetchCSVData('https://raw.githubusercontent.com/scooby75/jogosdodia/refs/heads/main/Goals_Stats_Away.csv'),
    retry: 3,
    retryDelay: 1000,
  });

  const { data: overallStats = [], isLoading: overallLoading, error: overallError } = useQuery({
    queryKey: ['overallStats'],
    queryFn: () => fetchCSVData('https://raw.githubusercontent.com/scooby75/jogosdodia/refs/heads/main/Goals_Stats_Overall.csv'),
    retry: 3,
    retryDelay: 1000,
  });

  const isLoading = homeLoading || awayLoading || overallLoading;
  const error = homeError || awayError || overallError;

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

  console.log('Goal stats data:', { isLoading, error, dataLength: overallStats.length });

  return { goalStatsData, isLoading, error };
};
